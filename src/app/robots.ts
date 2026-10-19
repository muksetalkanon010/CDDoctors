import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/doctor/dashboard/',
        '/hospital/dashboard/',
        '/patient/dashboard/',
      ],
    },
    sitemap: 'https://cddoctors.online/sitemap.xml',
  };
}
