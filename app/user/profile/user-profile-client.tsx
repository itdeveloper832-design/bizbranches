'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase-auth'
import { LogOut, User, Mail, Edit2, Loader2 } from 'lucide-react'

interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
}

export default function UserProfileClient() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        })
        setDisplayName(currentUser.displayName || '')
      } else {
        router.push('/auth/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your PakBizBranches account and business listings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24 sm:h-32"></div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 py-8 -mt-12 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white flex-shrink-0">
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-slate-600 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-6">
          <a
            href="/add-business"
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">List Business</h3>
            <p className="text-sm text-slate-600">Add a new business to your profile</p>
          </a>

          <a
            href="/categories"
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Browse Businesses</h3>
            <p className="text-sm text-slate-600">Discover other businesses on PakBizBranches</p>
          </a>

          <a
            href="/contact"
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Contact Support</h3>
            <p className="text-sm text-slate-600">Get help from our support team</p>
          </a>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-4">Coming Soon</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Manage your business listings and analytics</li>
            <li>• View customer reviews and ratings</li>
            <li>• Upgrade to featured business status</li>
            <li>• Access business insights and performance metrics</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
