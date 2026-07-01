import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import UserProfileClient from './user-profile-client'

export const metadata: Metadata = {
  title: 'User Profile Dashboard: Manage Your Registered Listings',
  description: 'Access your PakBizBranches user dashboard to view, modify, and optimize your submitted company details, contact information, and business profiles.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function UserProfilePage() {
  // In production, verify auth here - for now, render the client component
  // The client component will handle redirect if not authenticated
  return (
    <>
      <Navbar />
      <UserProfileClient />
      <Footer />
    </>
  )
}

export const runtime = 'edge';
