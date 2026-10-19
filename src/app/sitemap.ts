import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { FALLBACK_DOCTORS } from '@/lib/staticHospitalData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cddoctors.online';

  // 1. Static high-priority pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/doctors`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/hospitals`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/telemedicine`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blood`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/emergency`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/districts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/health-tips`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 2. Dynamic Doctor profile pages
  let doctorRoutes: MetadataRoute.Sitemap = [];
  try {
    const doctors = await db.doctor.findMany({
      select: {
        id: true,
        slug: true,
        createdAt: true,
      },
    }).catch(() => []);

    if (doctors && doctors.length > 0) {
      doctorRoutes = doctors.map((doc) => ({
        url: `${baseUrl}/doctors/${doc.slug || doc.id}`,
        lastModified: doc.createdAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    } else {
      doctorRoutes = FALLBACK_DOCTORS.map((doc) => ({
        url: `${baseUrl}/doctors/${doc.slug || doc.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    }
  } catch (e) {
    console.error('Error generating doctor sitemap:', e);
    doctorRoutes = FALLBACK_DOCTORS.map((doc) => ({
      url: `${baseUrl}/doctors/${doc.slug || doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  }

  // 3. Dynamic Hospital pages
  let hospitalRoutes: MetadataRoute.Sitemap = [];
  try {
    const hospitals = await db.hospital.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
    }).catch(() => []);

    if (hospitals && hospitals.length > 0) {
      hospitalRoutes = hospitals.map((hosp) => ({
        url: `${baseUrl}/hospitals/${hosp.slug || hosp.id}`,
        lastModified: hosp.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));
    }
  } catch (e) {
    console.error('Error generating hospital sitemap:', e);
  }

  return [...staticRoutes, ...doctorRoutes, ...hospitalRoutes];
}
