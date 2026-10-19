import { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { STATIC_AMBULANCES } from '@/lib/staticAmbulanceData';
import AmbulanceDirectoryClientView from '@/components/AmbulanceDirectoryClientView';

export const revalidate = 0;

export const metadata: Metadata = {
  title: '২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা ও হেল্পলাইন নম্বর | বাংলাদেশ - CD Doctors',
  description: 'সারাদেশে জরুরি মুহূর্তে দ্রুততম সময়ে আইসিইউ ও সাধারণ অ্যাম্বুলেন্স সার্ভিস, জরুরি রক্ত এবং সরকারি স্বাস্থ্য হেল্পলাইন নম্বরসমূহ সহজে পান।',
  keywords: [
    'জরুরি অ্যাম্বুলেন্স সার্ভিস বাংলাদেশ',
    'আইসিইউ অ্যাম্বুলেন্স নম্বর',
    'Ambulance Service Bangladesh',
    'Emergency Healthcare Bangladesh',
  ],
  alternates: {
    canonical: 'https://www.cddoctors.online/emergency',
  },
};


export default async function EmergencyAmbulancePage() {
  const session = await getSession().catch(() => null);
  const userDistrict = session?.district || 'চুয়াডাঙ্গা';

  return (
    <AmbulanceDirectoryClientView 
      initialAmbulances={STATIC_AMBULANCES} 
      userDistrict={userDistrict}
    />
  );
}

