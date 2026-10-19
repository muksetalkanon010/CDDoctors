const fs = require('fs');
const path = require('path');

const baseUrl = 'https://cddoctors.online';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/doctors', priority: '0.95', changefreq: 'daily' },
  { path: '/hospitals', priority: '0.9', changefreq: 'weekly' },
  { path: '/telemedicine', priority: '0.85', changefreq: 'daily' },
  { path: '/blood', priority: '0.85', changefreq: 'daily' },
  { path: '/emergency', priority: '0.8', changefreq: 'weekly' },
  { path: '/districts', priority: '0.75', changefreq: 'weekly' },
  { path: '/health-tips', priority: '0.75', changefreq: 'daily' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.4', changefreq: 'monthly' }
];

let urls = staticPages.map(p => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

try {
  const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/staticHospitalData.ts'), 'utf8');
  const slugRegex = /slug:\s*'([^']+)'/g;
  let match;
  const added = new Set();
  while ((match = slugRegex.exec(content)) !== null) {
    const slug = match[1];
    if (!added.has(slug)) {
      added.add(slug);
      const isHospital = slug.includes('hospital') || slug.includes('clinic') || slug.includes('diagnostic');
      const prefix = isHospital ? '/hospitals/' : '/doctors/';
      urls += `\n  <url>
    <loc>${baseUrl}${prefix}${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${isHospital ? '0.8' : '0.85'}</priority>
  </url>`;
    }
  }
} catch (e) {
  console.error('Error reading staticHospitalData:', e);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), xml, 'utf8');

const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /doctor/dashboard/
Disallow: /hospital/dashboard/
Disallow: /patient/dashboard/

Sitemap: https://cddoctors.online/sitemap.xml
Sitemap: https://www.cddoctors.online/sitemap.xml
`;

fs.writeFileSync(path.join(process.cwd(), 'public/robots.txt'), robotsTxt, 'utf8');
console.log('Successfully wrote public/sitemap.xml and public/robots.txt');
