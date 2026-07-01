import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import LoginClient from './login-client'

export const metadata: Metadata = {
  title: 'Sign In: Access Your PakBizBranches Business Account',
  description: 'Log in to your free PakBizBranches directory account to update, edit, and optimize your business contact listings and maps across Pakistan easily.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to manage your business on PakBizBranches</p>
          </div>

          {/* Login Form */}
          <LoginClient />

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
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

export const runtime = 'edge';
