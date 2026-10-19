import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'জরুরি রক্তদাতা খুঁজুন ও রক্তদান করুন | ৬৪ জেলা ব্লাড ডিরেক্টরি - CD Doctors',
  description: 'বাংলাদেশের যেকোনো জেলায় A+, B+, AB+, O+ সহ সকল গ্রুপের জরুরি রক্তের প্রয়োজনে তাৎক্ষণিক রক্তদাতা খুঁজুন এবং স্বেচ্ছায় রক্তদান করতে ফ্রিতে রেজিস্ট্রেশন করুন।',
  keywords: [
    'রক্তদাতা বাংলাদেশ',
    'জরুরি রক্ত চুয়াডাঙ্গা ঢাকা খুলনা রাজশাহী',
    'ব্লাড ডোনার ডিরেক্টরি',
    'Blood Donor Bangladesh',
    'Emergency Blood BD',
  ],
  alternates: {
    canonical: 'https://www.cddoctors.online/blood',
  },
};

export default function BloodLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
