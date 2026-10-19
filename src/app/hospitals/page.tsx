import { Metadata } from 'next';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import HospitalsClientView from './HospitalsClientView';
import { FALLBACK_HOSPITALS } from '@/lib/staticHospitalData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'বাংলাদেশের সেরা হাসপাতাল ও ডায়াগনস্টিক সেন্টারের তালিকা | CD Doctors',
  description: 'বাংলাদেশের শীর্ষ প্রাইভেট ও সরকারি হাসপাতাল, ক্লিনিক এবং ডায়াগনস্টিক সেন্টারের আইসিইউ, বেড প্রাপ্যতা, বিশেষজ্ঞ ডাক্তার ও জরুরি যোগাযোগ নম্বর।',
  keywords: [
    'বাংলাদেশের হাসপাতাল তালিকা',
    'প্রাইভেট ক্লিনিক ও ডায়াগনস্টিক সেন্টার',
    'হাসপাতাল জরুরি নম্বর',
    'আইসিইউ বেড বাংলাদেশ',
    'Hospitals in Bangladesh',
    'Diagnostic Centers in Bangladesh',
  ],
  alternates: {
    canonical: 'https://cddoctors.online/hospitals',
  },
};


interface PageProps {
  searchParams?: {
    q?: string;
    type?: string;
    district?: string;
  };
}

export default async function HospitalsPage({ searchParams }: PageProps) {
  const query = searchParams?.q || '';
  const typeFilter = searchParams?.type || 'all';
  const paramDistrict = searchParams?.district;

  const session = await getSession().catch(() => null);
  const userDistrict = paramDistrict || session?.district || null;

  let hospitals: any[] = FALLBACK_HOSPITALS;

  try {
    const dbHospitals = await db.hospital.findMany({
      where: {
        status: { in: ['ACTIVE', 'APPROVED'] },
      },
      include: {
        district: { include: { division: true } },
        facilities: true,
        _count: { select: { doctors: true, departments: true, reviews: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    }).catch(() => []);

    if (dbHospitals && dbHospitals.length > 0) {
      hospitals = dbHospitals;
    }
  } catch (err) {
    console.error('Error fetching hospitals on Vercel, using fallback:', err);
  }

  return (
    <HospitalsClientView
      initialHospitals={hospitals}
      initialQuery={query}
      initialType={typeFilter}
      initialUserDistrict={userDistrict}
    />
  );
}

