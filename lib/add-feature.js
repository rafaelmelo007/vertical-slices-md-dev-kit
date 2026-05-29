'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function addFeature(args) {
  const cwd = process.cwd();
  let slug = args[0];

  if (!slug) {
    slug = await prompt('   Feature slug (kebab-case, e.g. user-auth): ');
  }
  slug = slug.trim().toLowerCase().replace(/\s+/g, '-');
  if (!slug) {
    console.error('Feature slug is required.');
    process.exit(1);
  }

  const featureDir = path.join(cwd, 'docs/features', slug);
  const bundleTemplates = path.join(cwd, 'docs/bundle/templates');
  const kitTemplates = path.join(__dirname, '..', 'templates');
  const templateSrc = fs.existsSync(bundleTemplates) ? bundleTemplates : kitTemplates;

  if (fs.existsSync(featureDir)) {
    console.error(`   Feature '${slug}' already exists at docs/features/${slug}/`);
    process.exit(1);
  }

  fs.mkdirSync(featureDir, { recursive: true });

  const files = ['SPEC.md', 'TASKS.md', 'SCORE.md', 'DECISIONS.md'];
  for (const f of files) {
    const src = path.join(templateSrc, f);
    if (fs.existsSync(src)) {
      let content = fs.readFileSync(src, 'utf8');
      content = content.replace(/<Feature Name>/g, toTitle(slug));
      content = content.replace(/<feature-slug>/g, slug);
      fs.writeFileSync(path.join(featureDir, f), content);
    } else {
      fs.writeFileSync(path.join(featureDir, f), `# ${toTitle(slug)}\n`);
    }
  }

  console.log(`\n✅ Feature scaffolded at docs/features/${slug}/\n`);
  console.log(`   Files created: ${files.join(', ')}`);
  console.log(`\n   Next: open docs/features/${slug}/SPEC.md and fill §3 Acceptance Criteria\n`);
}

function toTitle(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function prompt(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => { rl.close(); resolve(answer); });
  });
}

module.exports = { addFeature };
