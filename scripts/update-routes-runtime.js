const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'app');
const projectRootDir = path.join(__dirname, '..');

// Blacklist of routes that should be completely static and NOT run on the Edge runtime
const STATIC_ROUTES = [
  'app/about/page.tsx',
  'app/contact/page.tsx',
  'app/developer/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'app/html-sitemap/page.tsx',
  'app/categories/page.tsx',
  'app/cities/page.tsx',
  'app/featured-businesses/page.tsx',
  'app/auth/login/page.tsx',
  'app/auth/signup/page.tsx',
  'app/blog/page.tsx',
  'app/blog/how-to-add-business/page.tsx',
  'app/categories/real-estate/page.tsx',
  'app/categories/restaurants/page.tsx',
  'app/category/real-estate/page.tsx',
  'app/category/restaurants/page.tsx',
  'app/priority/page.tsx',
  'app/add-business/page.tsx'
].map(p => path.join(projectRootDir, p).toLowerCase());

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
  
  // Check if this route is in the static blacklist
  const isBlacklistedStatic = STATIC_ROUTES.includes(file.toLowerCase());
  
  // A route is truly static if it defines generateStaticParams and returns something other than an empty array
  const hasStaticParams = content.includes('generateStaticParams');
  const hasEmptyStaticParams = content.includes('generateStaticParams') && (content.includes('return []') || content.includes('return  []'));
  const isReexport = hasStaticParams && !content.includes('return');
  const isTrulyStatic = (hasStaticParams && !hasEmptyStaticParams && !isReexport) || isBlacklistedStatic;

  const runtimeRegex = /export\s+const\s+runtime\s*=\s*['"]([^'"]+)['"];?\s*/g;
  const hasRuntimeExport = runtimeRegex.test(content);
  runtimeRegex.lastIndex = 0; // reset regex index

  if (isTrulyStatic) {
    if (hasRuntimeExport) {
      // Remove runtime export because it conflicts with static generateStaticParams or it's a blacklisted static route
      content = content.replace(runtimeRegex, '');
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Removed runtime export in: ${path.relative(targetDir, file)} (should be static)`);
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
console.log(`- Removed: ${removedCount} files (should be static)`);
console.log(`- Untouched: ${untouchedCount} files`);
TotalChecked = files.length;
console.log(`Total checked: ${TotalChecked} files`);
