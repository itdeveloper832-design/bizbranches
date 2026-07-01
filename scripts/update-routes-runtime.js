const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'app');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (
        file === 'page.tsx' ||
        file === 'route.ts' ||
        file === 'page.ts' ||
        file === 'page.js' ||
        file === 'page.jsx' ||
        file === 'route.js'
      ) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(targetDir);
console.log(`Found ${files.length} page/route files to check.`);

let updatedCount = 0;
let injectedCount = 0;
let untouchedCount = 0;
let removedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const hasStaticParams = content.includes('generateStaticParams');
  const runtimeRegex = /export\s+const\s+runtime\s*=\s*['"]([^'"]+)['"];?\s*/g;
  const hasRuntimeExport = runtimeRegex.test(content);
  runtimeRegex.lastIndex = 0; // reset regex index

  if (hasStaticParams) {
    if (hasRuntimeExport) {
      // Remove runtime export because it conflicts with generateStaticParams
      content = content.replace(runtimeRegex, '');
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Removed runtime export in: ${path.relative(targetDir, file)} (conflicts with generateStaticParams)`);
      removedCount++;
    } else {
      untouchedCount++;
    }
  } else {
    if (hasRuntimeExport) {
      const match = runtimeRegex.exec(content);
      const currentRuntime = match[1];
      if (currentRuntime !== 'edge') {
        content = content.replace(runtimeRegex, "export const runtime = 'edge';\n");
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated runtime to 'edge' in: ${path.relative(targetDir, file)} (was '${currentRuntime}')`);
        updatedCount++;
      } else {
        untouchedCount++;
      }
    } else {
      // Append export const runtime = 'edge' to the end of the file
      content += "\nexport const runtime = 'edge';\n";
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Injected 'edge' runtime in: ${path.relative(targetDir, file)}`);
      injectedCount++;
    }
  }
});

console.log(`\nRuntime update summary:`);
console.log(`- Updated: ${updatedCount} files`);
console.log(`- Injected: ${injectedCount} files`);
console.log(`- Removed: ${removedCount} files (conflicts with generateStaticParams)`);
console.log(`- Untouched: ${untouchedCount} files`);
console.log(`Total checked: ${files.length} files`);
