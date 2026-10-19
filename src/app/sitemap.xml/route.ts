import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FALLBACK_DOCTORS, FALLBACK_HOSPITALS } from '@/lib/staticHospitalData';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache on edge for 1 hour, auto refreshes on new requests

export async function GET() {
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
    { path: '/privacy', priority: '0.4', changefreq: 'monthly' },
  ];

  let urls = staticPages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');

  // 1. Live Doctors from PostgreSQL / Supabase Database
  const addedSlugs = new Set<string>();

  try {
    const liveDoctors = await db.doctor.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        slug: true,
        createdAt: true,
      },
    });

    if (liveDoctors && liveDoctors.length > 0) {
      for (const doc of liveDoctors) {
        const slug = doc.slug || doc.id;
        if (!addedSlugs.has(slug)) {
          addedSlugs.add(slug);
          const lastMod = doc.createdAt ? doc.createdAt.toISOString().split('T')[0] : today;
          urls += `\n  <url>
    <loc>${baseUrl}/doctors/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
        }
      }
    }
  } catch (err) {
    console.error('Error querying live doctors for sitemap:', err);
  }

  // 2. Fallback Doctors (ensuring all doctor pages are always covered)
  for (const doc of FALLBACK_DOCTORS) {
    const slug = doc.slug || doc.id;
    if (!addedSlugs.has(slug)) {
      addedSlugs.add(slug);
      urls += `\n  <url>
    <loc>${baseUrl}/doctors/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    }
  }

  // 3. Live Hospitals from PostgreSQL Database
  const addedHospSlugs = new Set<string>();

  try {
    const liveHospitals = await db.hospital.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
    });

    if (liveHospitals && liveHospitals.length > 0) {
      for (const hosp of liveHospitals) {
        const slug = hosp.slug || hosp.id;
        if (!addedHospSlugs.has(slug)) {
          addedHospSlugs.add(slug);
          const lastMod = hosp.updatedAt ? hosp.updatedAt.toISOString().split('T')[0] : today;
          urls += `\n  <url>
    <loc>${baseUrl}/hospitals/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
        }
      }
    }
  } catch (err) {
    console.error('Error querying live hospitals for sitemap:', err);
  }

  // 4. Fallback Hospitals
  for (const hosp of FALLBACK_HOSPITALS) {
    const slug = hosp.slug || hosp.id;
    if (!addedHospSlugs.has(slug)) {
      addedHospSlugs.add(slug);
      urls += `\n  <url>
    <loc>${baseUrl}/hospitals/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
