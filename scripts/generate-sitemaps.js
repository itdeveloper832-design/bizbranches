const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
};

const BASE_URL = 'https://www.pakbizbranhces.online';

async function generateSitemaps() {
  console.log('Initializing Firebase App...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('Fetching businesses from Firestore...');
  const merged = new Map();

  try {
    const q = query(
      collection(db, 'businesses'),
      where('status', '==', 'approved')
    );
    const snap = await getDocs(q);
    console.log(`Fetched ${snap.size} approved businesses from Firestore.`);
    snap.docs.forEach(doc => {
      const data = doc.data();
      const slug = data.slug || doc.id;
      merged.set(slug, {
        slug,
        logoUrl: data.logoUrl || ''
      });
    });
  } catch (err) {
    console.error('Error fetching businesses from Firestore:', err);
  }

  // Read static businesses
  console.log('Reading static businesses JSON...');
  const staticPath = path.join(__dirname, '..', 'lib', 'static-businesses.json');
  if (fs.existsSync(staticPath)) {
    const staticData = JSON.parse(fs.readFileSync(staticPath, 'utf8'));
    console.log(`Loaded ${staticData.length} static businesses.`);
    staticData.forEach(b => {
      if (b.slug) {
        merged.set(b.slug, { slug: b.slug, logoUrl: b.logoUrl });
      }
    });
  } else {
    console.warn('static-businesses.json not found at:', staticPath);
  }

  const businesses = Array.from(merged.values());
  const lastmod = new Date().toISOString().split('T')[0];

  // 1. Generate sitemap-businesses.xml
  console.log('Generating sitemap-businesses.xml...');
  const sitemapBusinessesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${businesses.map(biz => {
  const imageXml = biz.logoUrl ? `\n    <image:image>
      <image:loc>${biz.logoUrl}</image:loc>
      <image:title>${escapeXml(biz.slug.replace(/-/g, ' '))}</image:title>
    </image:image>` : '';
  return `  <url>
    <loc>${BASE_URL}/${biz.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>${imageXml}
  </url>`;
}).join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '..', 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap-businesses.xml'), sitemapBusinessesXml, 'utf8');
  console.log('Saved sitemap-businesses.xml to public folder.');

  // 2. Generate sitemap.xml
  console.log('Generating sitemap.xml...');
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/categories/', priority: '0.9', changefreq: 'weekly' },
    { url: '/cities/', priority: '0.9', changefreq: 'weekly' },
    { url: '/add-business/', priority: '0.9', changefreq: 'monthly' },
    { url: '/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: '/about/', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.7', changefreq: 'monthly' },
    { url: '/featured-businesses/', priority: '0.8', changefreq: 'daily' },
    { url: '/html-sitemap/', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy/', priority: '0.4', changefreq: 'yearly' },
    { url: '/terms/', priority: '0.4', changefreq: 'yearly' },
  ];

  // We need categories, cities, and blog data
  // Since we don't want to import TS data files, we can extract them or parse them.
  // Let's load the categories and cities from lib/data.ts
  const dataPath = path.join(__dirname, '..', 'lib', 'data.ts');
  let categories = [];
  let cities = [];
  if (fs.existsSync(dataPath)) {
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    // Extract CATEGORIES array using simple regex
    const catRegex = /export\s+const\s+CATEGORIES\s*:\s*Category\[\]\s*=\s*(\[[^]*?\])/;
    const catMatch = dataContent.match(catRegex);
    if (catMatch) {
      try {
        // Clean comments and format as JSON
        const cleanJson = catMatch[1]
          .replace(/\/\/.*$/gm, '')
          .replace(/id:\s*['"]([^'"]+)['"]/g, '"id": "$1"')
          .replace(/name:\s*['"]([^'"]+)['"]/g, '"name": "$1"')
          .replace(/icon:\s*\w+,?/g, '')
          .replace(/,\s*\]/g, ']')
          .replace(/,\s*\}/g, '}')
          .replace(/trailingComma:\s*['"]\w+['"]/g, '');
        // Evaluate it safely
        categories = eval(catMatch[1]);
      } catch (err) {
        console.error('Failed to parse categories:', err);
      }
    }
    
    // Extract CITIES array
    const cityRegex = /export\s+const\s+CITIES\s*=\s*(\[[^]*?\])/;
    const cityMatch = dataContent.match(cityRegex);
    if (cityMatch) {
      try {
        cities = eval(cityMatch[1]);
      } catch (err) {
        console.error('Failed to parse cities:', err);
      }
    }
  }

  // Load blog posts from lib/blog-data.ts
  const blogDataPath = path.join(__dirname, '..', 'lib', 'blog-data.ts');
  let blogPosts = [];
  if (fs.existsSync(blogDataPath)) {
    const blogContent = fs.readFileSync(blogDataPath, 'utf8');
    const blogRegex = /export\s+const\s+BLOG_POSTS\s*:\s*BlogPost\[\]\s*=\s*(\[[^]*?\])/;
    const blogMatch = blogContent.match(blogRegex);
    if (blogMatch) {
      try {
        blogPosts = eval(blogMatch[1]);
      } catch (err) {
        console.error('Failed to parse blog posts:', err);
      }
    }
  }

  const urls = [];

  // Add static pages
  staticPages.forEach(p => {
    urls.push({
      loc: `${BASE_URL}${p.url}`,
      lastmod,
      changefreq: p.changefreq,
      priority: p.priority
    });
  });

  // Add categories
  categories.forEach(cat => {
    urls.push({
      loc: `${BASE_URL}/${cat.id}/`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // Add cities
  cities.forEach(city => {
    const slug = city.toLowerCase().replace(/\s+/g, '-');
    urls.push({
      loc: `${BASE_URL}/cities/${slug}/`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // Add blog posts
  blogPosts.forEach(post => {
    if (!post.hidden) {
      urls.push({
        loc: `${BASE_URL}/blog/${post.slug}/`,
        lastmod: post.date,
        changefreq: 'monthly',
        priority: '0.6'
      });
    }
  });

  // Add dynamic locations (cities + categories combinations)
  const topCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Abbottabad', 'Sargodha', 'Bahawalpur', 'Sahiwal',
    'Mardan', 'Sukkur', 'Larkana', 'Gwadar', 'Muzaffarabad'
  ];
  
  topCities.forEach(city => {
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    categories.forEach(cat => {
      urls.push({
        loc: `${BASE_URL}/locations/${citySlug}/${cat.id}/`,
        lastmod,
        changefreq: 'weekly',
        priority: '0.7'
      });
    });
  });

  // Add all businesses to main sitemap as well, or keep it in sitemap-businesses.xml
  // The original sitemap.xml includes a reference to sitemap-businesses.xml OR includes the index.
  // Let's check how the original sitemap.xml was configured.
  // The original sitemap.xml had all of these, plus it merged all approved businesses as well!
  // Let's merge businesses into sitemap.xml just like original route did.
  businesses.forEach(biz => {
    const item = {
      loc: `${BASE_URL}/${biz.slug}/`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.75'
    };
    if (biz.logoUrl) {
      item.image = {
        loc: biz.logoUrl,
        title: biz.slug.replace(/-/g, ' ')
      };
    }
    urls.push(item);
  });

  console.log(`Generating sitemap.xml with ${urls.length} URLs...`);
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => {
  const imageXml = u.image ? `\n    <image:image>
      <image:loc>${u.image.loc}</image:loc>
      <image:title>${escapeXml(u.image.title)}</image:title>
    </image:image>` : '';
  return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${imageXml}
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log('Saved sitemap.xml to public folder.');
  console.log('Sitemap generation complete!');
  process.exit(0);
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

generateSitemaps();
