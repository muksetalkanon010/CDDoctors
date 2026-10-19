import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { MapPin, Building2 } from 'lucide-react';

export const revalidate = 0;

export const metadata: Metadata = {
  title: '৬৪ জেলা ও ৮ বিভাগ হাসপাতাল ডিরেক্টরি | বাংলাদেশ - CD Doctors',
  description: 'বাংলাদেশের ৮টি বিভাগ ও ৬৪টি জেলার সকল সরকারি ও বেসরকারি হাসপাতাল, ক্লিনিক এবং ডাক্তার চেম্বার ডিরেক্টরি। আপনার জেলা নির্বাচন করে চিকিৎসাসেবা খুঁজুন।',
  keywords: [
    '৬৪ জেলা হাসপাতাল বাংলাদেশ',
    'বিভাগ ভিত্তিক ডাক্তার তালিকা',
    'ঢাকা চট্টগ্রাম খুলনা রাজশাহী সিলেট বরিশাল রংপুর ময়মনসিংহ হাসপাতাল',
    'Bangladesh Hospital District Directory',
  ],
  alternates: {
    canonical: 'https://cddoctors.online/districts',
  },
};


export default async function DistrictsPage() {
  let divisions: any[] = [];

  try {
    const dbDivisions = await db.division.findMany({
      include: {
        districts: {
          include: {
            _count: { select: { hospitals: true } },
          },
          orderBy: { nameEn: 'asc' },
        },
      },
      orderBy: { nameEn: 'asc' },
    }).catch(() => []);

    divisions = dbDivisions || [];
  } catch (err) {
    console.error('Error fetching divisions on Vercel:', err);
  }

  if (divisions.length === 0) {
    divisions = [
      {
        id: 'div-khulna',
        nameEn: 'Khulna',
        nameBn: 'খুলনা',
        districts: [
          { id: 'dist-1', nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', slug: 'chuadanga', _count: { hospitals: 5 } },
          { id: 'dist-2', nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', slug: 'kushtia', _count: { hospitals: 0 } },
          { id: 'dist-3', nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', slug: 'jhenaidah', _count: { hospitals: 0 } },
          { id: 'dist-4', nameEn: 'Meherpur', nameBn: 'মেহেরপুর', slug: 'meherpur', _count: { hospitals: 0 } },
        ],
      },
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bangladesh Hospital District Directory</h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore hospitals and doctor appointment chambers across all 8 Divisions and 64 Districts of Bangladesh.
        </p>
      </div>

      <div className="space-y-10">
        {divisions.map((division: any) => (
          <div key={division.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-medical-600" />
              <h2 className="text-xl font-bold text-slate-900">
                {division.nameEn} Division ({division.nameBn})
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {division.districts?.map((dist: any) => (
                <Link
                  key={dist.id}
                  href={`/hospitals?district=${dist.slug}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-medical-50 border border-slate-200/80 hover:border-medical-200 transition-all group"
                >
                  <div>
                    <h3 className="font-semibold text-xs text-slate-800 group-hover:text-medical-700">
                      {dist.nameEn} ({dist.nameBn})
                    </h3>
                    <p className="text-[10px] text-slate-500">{dist._count?.hospitals || 0} Hospitals</p>
                  </div>
                  <Building2 className="w-4 h-4 text-slate-400 group-hover:text-medical-600" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
