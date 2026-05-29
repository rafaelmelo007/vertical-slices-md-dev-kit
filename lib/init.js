'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BUNDLE_DEST = 'docs/bundle';
const DOC_TREE = [
  'docs/prds/draft',
  'docs/features',
  'docs/worklog',
  'docs/prototypes',
  'docs/incidents',
  'docs/process',
  'docs/technical',
];

const FRAMEWORK_FILES = [
  'vertical-slices-ai-framework.md',
  'ADOPTION.md',
  'CHANGELOG.md',
];

const SCRIPT_FILES = [
  'scripts/worklog-stop-hook.sh',
];

const TEMPLATE_FILES = [
  'templates/SPEC.md',
  'templates/TASKS.md',
  'templates/SCORE.md',
  'templates/DECISIONS.md',
  'templates/CLAUSES.md',
  'templates/PRD.md',
  'templates/CLAUDE.md-snippet.md',
];

async function init(args) {
  const cwd = process.cwd();
  const bundleDir = path.join(cwd, BUNDLE_DEST);
  const kitRoot = path.join(__dirname, '..');

  console.log('\n🚀 vskit init — vertical-slices-md-dev-kit v' + require('../package.json').version);
  console.log(`   Target: ${cwd}\n`);

  // 1. Check for existing bundle
  if (fs.existsSync(bundleDir)) {
    const answer = await prompt(`   ${BUNDLE_DEST}/ already exists. Overwrite? [y/N] `);
    if (!answer.match(/^y(es)?$/i)) {
      console.log('   Aborted.');
      process.exit(0);
    }
  }

  // 2. Copy bundle files
  step('Copying bundle files → ' + BUNDLE_DEST + '/');
  fs.mkdirSync(path.join(bundleDir, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(bundleDir, 'templates'), { recursive: true });

  for (const file of FRAMEWORK_FILES) {
    copyFile(path.join(kitRoot, file), path.join(bundleDir, file));
  }
  for (const file of SCRIPT_FILES) {
    copyFile(path.join(kitRoot, file), path.join(bundleDir, file));
    fs.chmodSync(path.join(bundleDir, file), 0o755);
  }
  for (const file of TEMPLATE_FILES) {
    copyFile(path.join(kitRoot, file), path.join(bundleDir, file));
  }
  ok(`${FRAMEWORK_FILES.length + SCRIPT_FILES.length + TEMPLATE_FILES.length} files copied`);

  // 3. Scaffold the canonical doc tree
  step('Scaffolding doc tree');
  for (const dir of DOC_TREE) {
    const full = path.join(cwd, dir);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
      fs.writeFileSync(path.join(full, '.gitkeep'), '');
    }
  }
  ok('docs/ tree ready');

  // 4. Install Stop hook into .claude/settings.json
  step('Installing Stop hook → .claude/settings.json');
  const clauDir = path.join(cwd, '.claude');
  const settingsPath = path.join(clauDir, 'settings.json');
  fs.mkdirSync(clauDir, { recursive: true });

  const hookEntry = {
    type: 'command',
    command: `bash ${BUNDLE_DEST}/scripts/worklog-stop-hook.sh`,
  };

  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch {
      settings = {};
    }
  }

  settings.hooks = settings.hooks || {};
  settings.hooks.Stop = settings.hooks.Stop || [];

  const alreadyInstalled = settings.hooks.Stop.some(
    g => (g.hooks || []).some(h => h.command && h.command.includes('worklog-stop-hook.sh'))
  );

  if (!alreadyInstalled) {
    settings.hooks.Stop.push({ matcher: '', hooks: [hookEntry] });
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    ok('Stop hook installed');
  } else {
    ok('Stop hook already present — skipped');
  }

  // 5. Inject CLAUDE.md snippet
  step('Checking CLAUDE.md');
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');
  const snippetPath = path.join(bundleDir, 'templates/CLAUDE.md-snippet.md');
  const snippet = fs.readFileSync(snippetPath, 'utf8')
    .replace(/<!--[\s\S]*?-->\n?/g, '')  // strip HTML comments
    .trim();

  if (fs.existsSync(claudeMdPath)) {
    const existing = fs.readFileSync(claudeMdPath, 'utf8');
    if (existing.includes('vertical-slices-ai-framework.md')) {
      ok('CLAUDE.md already references the framework — skipped');
    } else {
      fs.appendFileSync(claudeMdPath, '\n\n' + snippet + '\n');
      ok('Framework snippet appended to CLAUDE.md');
    }
  } else {
    fs.writeFileSync(claudeMdPath, snippet + '\n');
    ok('CLAUDE.md created with framework snippet');
  }

  // 6. Summary
  console.log(`
✅ Done! Your repo is now on vertical-slices-md-dev-kit.

Next steps:
  1. Fill in the Repo-Specific Overrides table in CLAUDE.md
     (your test, e2e, health-check, and deploy commands)
  2. Edit docs/PRD.md with your product vision
  3. Run /vskit:init-feature <slug> in your AI assistant to create your first feature

Full guide → ${BUNDLE_DEST}/ADOPTION.md
`);
}

function step(msg) {
  process.stdout.write(`   ⟳  ${msg}...\n`);
}

function ok(msg) {
  console.log(`   ✓  ${msg}`);
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`   ⚠  Missing: ${src} — skipped`);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function prompt(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => { rl.close(); resolve(answer); });
  });
}

module.exports = { init };
