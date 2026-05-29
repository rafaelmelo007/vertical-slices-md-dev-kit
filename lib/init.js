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
  const commandsDest = path.join(clauDir, 'commands', 'vskit');
  const settingsPath = path.join(clauDir, 'settings.json');
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');

  console.log('\nvskit ' + require('../package.json').version + ' — setting up vertical-slices framework\n');

  if (fs.existsSync(commandsDest)) {
    const answer = await prompt('   .claude/commands/vskit/ already exists. Re-initialize? [y/N] ');
    if (!answer.match(/^y(es)?$/i)) {
      console.log('   Aborted.');
      process.exit(0);
    }
  }

  fs.mkdirSync(commandsDest, { recursive: true });

  // 1. Copy individual command files → .claude/commands/vskit/
  step('Installing commands → .claude/commands/vskit/');
  const commandsSrc = path.join(kitRoot, 'commands', 'vskit');
  const commandFiles = fs.readdirSync(commandsSrc).filter(f => f.endsWith('.md'));
  for (const file of commandFiles) {
    fs.copyFileSync(path.join(commandsSrc, file), path.join(commandsDest, file));
  }
  ok(`${commandFiles.length} commands installed`);

  // 2. Patch CLAUDE.md with stack override stub
  step('Wiring commands into CLAUDE.md');
  const stub = `
## vskit — Repo-Specific Overrides

| Command | Shell invocation |
|---------|-----------------|
| \`/vskit:run-tests\` | \`<your test command>\` |
| \`/vskit:run-e2e\` | \`<your e2e command>\` |
| \`/vskit:health-check\` | \`<your health check command>\` |
| \`/vskit:deploy\` | \`<your deploy command>\` |

<!-- Optional settings:
  Traceability: aspirational   (skip Closes-AC: trailer requirement)
  Weekly token budget: 100000  (override worklog overhead budget)
-->
`.trim();

  if (fs.existsSync(claudeMdPath)) {
    const existing = fs.readFileSync(claudeMdPath, 'utf8');
    if (existing.includes('vskit — Repo-Specific Overrides')) {
      ok('CLAUDE.md already has vskit overrides — skipped');
    } else {
      fs.appendFileSync(claudeMdPath, '\n\n' + stub + '\n');
      ok('Stack overrides appended to CLAUDE.md');
    }
  } else {
    fs.writeFileSync(claudeMdPath, stub + '\n');
    ok('CLAUDE.md created with stack overrides');
  }

  // 3. Install Stop hook
  step('Installing Stop hook → .claude/settings.json');
  const hookDest = path.join(clauDir, 'worklog-stop-hook.sh');
  fs.copyFileSync(path.join(kitRoot, 'scripts', 'worklog-stop-hook.sh'), hookDest);
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

  // 4. Scaffold doc tree
  step('Scaffolding docs/ tree');
  for (const dir of DOC_TREE) {
    const full = path.join(cwd, dir);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
      fs.writeFileSync(path.join(full, '.gitkeep'), '');
    }
  }
  ok('docs/ tree ready');

  // 5. Done
  console.log(`
Done. Open Claude Code in this repo — type / to see all /vskit:* commands.

  /vskit:enhance prd     Round-table: 11 agents score your PRD until all ≥ 9
  /vskit:critique spec   Interrogate a feature spec, propagate decisions
  /vskit:score           Score a feature across 8 quality dimensions
  /vskit:ship            Orchestrate spec → tasks → code → test → score → deploy
  /vskit:project-status  Overview of all features and their state

Next: fill in the shell commands in CLAUDE.md (run-tests, deploy, etc.)

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
