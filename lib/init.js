'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DOC_TREE = [
  'docs/prds/draft',
  'docs/features',
  'docs/worklog',
  'docs/prototypes',
  'docs/incidents',
  'docs/process',
  'docs/technical',
];

async function init(args) {
  const cwd = process.cwd();
  const kitRoot = path.join(__dirname, '..');
  const clauDir = path.join(cwd, '.claude');
  const frameworkDest = path.join(clauDir, 'vskit.md');
  const settingsPath = path.join(clauDir, 'settings.json');
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');

  console.log('\nvskit ' + require('../package.json').version + ' — setting up vertical-slices framework\n');

  // 1. Guard: already initialized?
  if (fs.existsSync(frameworkDest)) {
    const answer = await prompt('   .claude/vskit.md already exists. Re-initialize? [y/N] ');
    if (!answer.match(/^y(es)?$/i)) {
      console.log('   Aborted.');
      process.exit(0);
    }
  }

  fs.mkdirSync(clauDir, { recursive: true });

  // 2. Copy framework → .claude/vskit.md
  step('Installing framework commands → .claude/vskit.md');
  const frameworkSrc = path.join(kitRoot, 'vertical-slices-ai-framework.md');
  fs.copyFileSync(frameworkSrc, frameworkDest);
  ok('All /vskit:* commands installed');

  // 3. Patch CLAUDE.md with @.claude/vskit.md reference
  step('Wiring commands into CLAUDE.md');
  const refLine = '@.claude/vskit.md';
  if (fs.existsSync(claudeMdPath)) {
    const existing = fs.readFileSync(claudeMdPath, 'utf8');
    if (existing.includes(refLine)) {
      ok('CLAUDE.md already references vskit — skipped');
    } else {
      fs.appendFileSync(claudeMdPath, '\n' + refLine + '\n');
      ok('Reference appended to CLAUDE.md');
    }
  } else {
    fs.writeFileSync(claudeMdPath, refLine + '\n');
    ok('CLAUDE.md created');
  }

  // 4. Install Stop hook (worklog auto-writer)
  step('Installing Stop hook → .claude/settings.json');
  const hookScript = path.join(kitRoot, 'scripts/worklog-stop-hook.sh');
  const hookDest = path.join(clauDir, 'worklog-stop-hook.sh');
  fs.copyFileSync(hookScript, hookDest);
  fs.chmodSync(hookDest, 0o755);

  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}
  }
  settings.hooks = settings.hooks || {};
  settings.hooks.Stop = settings.hooks.Stop || [];

  const alreadyInstalled = settings.hooks.Stop.some(
    g => (g.hooks || []).some(h => h.command && h.command.includes('worklog-stop-hook.sh'))
  );
  if (!alreadyInstalled) {
    settings.hooks.Stop.push({
      matcher: '',
      hooks: [{ type: 'command', command: 'bash .claude/worklog-stop-hook.sh' }],
    });
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    ok('Stop hook installed (auto-writes docs/worklog/ after each turn)');
  } else {
    ok('Stop hook already present — skipped');
  }

  // 5. Scaffold doc tree
  step('Scaffolding docs/ tree');
  for (const dir of DOC_TREE) {
    const full = path.join(cwd, dir);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
      fs.writeFileSync(path.join(full, '.gitkeep'), '');
    }
  }
  ok('docs/ tree ready');

  // 6. Done
  console.log(`
Done. Open Claude Code in this repo — all /vskit:* commands are ready.

  /vskit:critique prd        Grade your PRD and get open questions
  /vskit:critique spec       Grade a feature spec
  /vskit:score <slug>        Score a feature (8 dimensions)
  /vskit:audit-traceability  Check every commit has a Closes-AC: trailer
  /vskit:project-status      Overview of all features and their state

Add your stack commands to CLAUDE.md:
  /vskit:run-tests  →  npm test / pytest / dotnet test / ...
  /vskit:deploy     →  docker compose up -d --build / ...

Full reference: https://github.com/rafaelmelo007/vertical-slices-md-dev-kit
`);
}

function step(msg) { process.stdout.write(`   ...  ${msg}\n`); }
function ok(msg)   { console.log(`   ok   ${msg}`); }

function prompt(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => { rl.close(); resolve(answer); });
  });
}

module.exports = { init };
