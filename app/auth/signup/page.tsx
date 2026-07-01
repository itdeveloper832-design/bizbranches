import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import SignupClient from './signup-client'

export const metadata: Metadata = {
  title: 'Register Free Account: PakBizBranches Business Portal',
  description: 'Create a free user account on the PakBizBranches portal. Sign up today to submit, verify, and manage your local business listings across Pakistan.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600">Sign up to list your business on PakBizBranches</p>
          </div>

          {/* Signup Form */}
          <SignupClient />

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </Link>
            </p>
            <p className="mt-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                Back to Homepage
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

