import { Metadata } from 'next';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { FALLBACK_DOCTORS } from '@/lib/staticHospitalData';
import DoctorsClientView from './DoctorsClientView';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'সকল বিশেষজ্ঞ ডাক্তার তালিকা ও সিরিয়াল | বাংলাদেশের চেম্বার সময়সূচি',
  description: 'মেডিসিন, হৃদরোগ, শিশু, গাইনী, অর্থোপেডিক, চর্ম ও সার্জারিসহ বাংলাদেশের ৬৪ জেলার সেরা বিশেষজ্ঞ চিকিৎসকদের চেম্বার তালিকা, ভিজিট ফি ও সরাসরি সিরিয়াল বুকিং।',
  keywords: [
    'বাংলাদেশের ডাক্তার তালিকা',
    'বিশেষজ্ঞ ডাক্তার সিরিয়াল',
    'ডাক্তার চেম্বার ও সময়সূচি',
    'মেডিসিন বিশেষজ্ঞ ডাক্তার',
    'কার্ডিওলজিস্ট বাংলাদেশ',
    'গাইনী বিশেষজ্ঞ ডাক্তার',
    'শিশু বিশেষজ্ঞ ডাক্তার',
    'Doctor Appointment Bangladesh',
    'Best Doctors in Bangladesh',
  ],
  alternates: {
    canonical: 'https://www.cddoctors.online/doctors',
  },
};


interface PageProps {
  searchParams: {
    q?: string;
    specialty?: string;
    district?: string;
  };
}

export default async function DoctorsPage({ searchParams }: PageProps) {
  const query = searchParams?.q || '';
  const specialtyFilter = searchParams?.specialty || 'all';
  const paramDistrict = searchParams?.district;

  const session = await getSession().catch(() => null);
  const userDistrict = paramDistrict || session?.district || null;

  let doctors: any[] = [];

  try {
    const dbDoctors = await db.doctor.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        hospital: { include: { district: { include: { division: true } } } },
        department: true,
        schedules: true,
      },
      orderBy: { experienceYears: 'desc' },
    }).catch(() => []);

    doctors = dbDoctors || [];
  } catch (err) {
    console.error('Error fetching doctors:', err);
  }

  // Use fallback doctors if database has none
  if (doctors.length === 0) {
    doctors = FALLBACK_DOCTORS;
  }

  return (
    <DoctorsClientView
      initialDoctors={doctors}
      initialQuery={query}
      initialSpecialty={specialtyFilter}
      initialUserDistrict={userDistrict}
    />
  );
}
