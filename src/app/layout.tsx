import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali, Hind_Siliguri } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import InitialLoadingScreen from '@/components/InitialLoadingScreen';
import AiAssistantChat from '@/components/AiAssistantChat';

const shurjo = localFont({
  src: [
    {
      path: '../../public/fonts/ShurjoWeb_400_v5_1.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ShurjoWeb_700_v5_1.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-shurjo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['bengali'],
  variable: '--font-noto-sans-bengali',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cddoctors.online'),
  title: {
    default: 'CD Doctors | বাংলাদেশের বিশেষজ্ঞ ডাক্তার, হাসপাতাল ও চেম্বার ডিরেক্টরি',
    template: '%s | CD Doctors',
  },
  description: 'বাংলাদেশের শীর্ষ বিশেষজ্ঞ ডাক্তার, প্রাইভেট হাসপাতাল ও ডায়াগনস্টিক সেন্টারের চেম্বার সময়সূচি, ভিজিট ফি ও সিরিয়ালের সরাসরি ফোন নম্বর। অনলাইনে সহজে সিরিয়াল বুকিং ও টেলিমেডিসিন সেবা।',
  keywords: [
    'CD Doctors',
    'ডাক্তার বাংলাদেশ',
    'বাংলাদেশের ডাক্তার',
    'Doctor Appointment Bangladesh',
    'বাংলাদেশের বিশেষজ্ঞ ডাক্তার তালিকা',
    'ডাক্তার চেম্বার ও সময়সূচি',
    'অনলাইন ডাক্তার সিরিয়াল',
    'চুয়াডাঙ্গা ডাক্তার',
    'চুয়াডাঙ্গা হাসপাতাল',
    'Popular Diagnostic Doctor List',
    'Chuadanga Sadar Hospital Doctors',
    'Telemedicine Bangladesh',
  ],
  alternates: {
    canonical: 'https://cddoctors.online',
  },
  openGraph: {
    title: 'CD Doctors | বাংলাদেশের বিশেষজ্ঞ ডাক্তার ও হাসপাতাল ডিরেক্টরি',
    description: 'বাংলাদেশের শীর্ষ বিশেষজ্ঞ ডাক্তারদের চেম্বার সময়সূচি, ভিজিট ফি ও সরাসরি সিরিয়াল বুকিং প্ল্যাটফর্ম।',
    url: 'https://cddoctors.online',
    siteName: 'CD Doctors',
    locale: 'bn_BD',
    type: 'website',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSansBengali.variable} ${hindSiliguri.variable} ${shurjo.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900 antialiased font-bengali overflow-x-hidden`}>
        <InitialLoadingScreen />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <MobileBottomNav />
        <AiAssistantChat />
      </body>
    </html>
  );
}
