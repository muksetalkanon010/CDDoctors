import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { FALLBACK_DOCTORS } from '@/lib/staticHospitalData';
import DoctorDetailClientView from './DoctorDetailClientView';

export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  let doctor: any = null;

  try {
    doctor = await db.doctor.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        hospital: true,
        department: true,
      },
    }).catch(() => null);
  } catch (err) {
    console.error('Error generating metadata for doctor:', err);
  }

  if (!doctor) {
    doctor = FALLBACK_DOCTORS.find((d) => d.id === id || d.slug === id) || null;
  }

  if (!doctor) {
    return {
      title: 'ডাক্তার পাওয়া যায়নি | CD Doctors',
      description: 'অনুরোধকৃত ডাক্তারের তথ্য খুঁজে পাওয়া যায়নি।',
    };
  }

  const deptName = doctor.department?.nameBn || doctor.specialization;
  const hospitalName = doctor.hospital?.name ? ` - ${doctor.hospital.name}` : '';

  return {
    title: `${doctor.name} - ${deptName}${hospitalName} | চেম্বার, ভিজিট ফি ও সিরিয়াল - CD Doctors বাংলাদেশ`,
    description: `${doctor.name} (${doctor.degrees}) - ${deptName}${hospitalName}। ডাক্তারের চেম্বারের সময়সূচি, ভিজিট ফি এবং সরাসরি সিরিয়ালের ফোন নম্বর জানুন CD Doctors-এ।`,
    keywords: [
      doctor.name,
      `ডাঃ ${doctor.name.replace(/^(Dr\.|Doctor|ডাঃ|ডাঃ\s*)/i, '').trim()}`,
      deptName,
      doctor.specialization,
      doctor.hospital?.name || '',
      'বাংলাদেশের ডাক্তার',
      'ডাক্তার সিরিয়াল',
      'চেম্বার সময়সূচি',
      'ভিজিট ফি',
      'Doctor Appointment Bangladesh',
    ].filter(Boolean),
    alternates: {
      canonical: `https://www.cddoctors.online/doctors/${doctor.slug || doctor.id}`,
    },
    openGraph: {
      title: `${doctor.name} (${deptName}) | CD Doctors বাংলাদেশ`,
      description: `${doctor.degrees} - চেম্বার শিডিউল, ভিজিট ফি ও সিরিয়াল বুকিং।`,
      images: doctor.photoUrl ? [{ url: doctor.photoUrl }] : ['https://www.cddoctors.online/logo.png'],
    },
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { id } = params;
  let doctor: any = null;

  try {
    const dbDoctor = await db.doctor.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        hospital: { include: { district: true } },
        department: true,
        schedules: {
          where: { approvalStatus: 'APPROVED' },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    }).catch(() => null);

    doctor = dbDoctor;
  } catch (err) {
    console.error('Error fetching doctor details from DB:', err);
  }

  // Check fallback doctors if DB did not return doctor
  if (!doctor) {
    doctor = FALLBACK_DOCTORS.find((d) => d.id === id || d.slug === id) || null;
  }

  if (!doctor) {
    notFound();
  }

  const deptName = doctor.department?.nameBn || doctor.specialization;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    description: `${doctor.name} (${doctor.degrees}) - ${deptName}`,
    image: doctor.photoUrl || 'https://www.cddoctors.online/logo.png',
    medicalSpecialty: deptName,
    telephone: doctor.phone || doctor.hospital?.phone || undefined,
    priceRange: doctor.consultationFee ? `৳${doctor.consultationFee}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: doctor.chamberAddress || doctor.hospital?.address || 'বাংলাদেশ',
      addressLocality: doctor.hospital?.district?.nameEn || 'Bangladesh',
      addressCountry: 'BD',
    },
    ...(doctor.hospital
      ? {
          hospitalAffiliation: {
            '@type': 'Hospital',
            name: doctor.hospital.name,
            address: doctor.hospital.address,
          },
        }
      : {}),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${doctor.name}-এর চেম্বার কোথায় এবং রোগী দেখার সময় কখন?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${doctor.name} (${deptName})-এর চেম্বার ${doctor.chamberAddress || doctor.hospital?.address || 'হাসপাতালে অবস্থিত'}। বিস্তারিত সময়সূচি ও সরাসরি সিরিয়ালের জন্য CD Doctors প্ল্যাটফর্মে ভিজিট করুন।`,
        },
      },
      {
        '@type': 'Question',
        name: `${doctor.name}-এর ভিজিট ফি (Consultation Fee) কত?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: doctor.consultationFee
            ? `পরামর্শ ফি ${doctor.consultationFee} টাকা।`
            : 'পরামর্শ ফি জানতে সরাসরি যোগাযোগ করুন।',
        },
      },
      {
        '@type': 'Question',
        name: `কিভাবে ${doctor.name}-এর সিরিয়াল বুকিং করব?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CD Doctors প্ল্যাটফর্মে অনলাইনে ঘরে বসেই সরাসরি সিরিয়াল বুকিং করা যায় অথবা হাসপাতালের নাম্বারে সরাসরি কল দিয়ে কনফার্ম করা যায়।',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DoctorDetailClientView doctor={doctor} />
    </>
  );
}

