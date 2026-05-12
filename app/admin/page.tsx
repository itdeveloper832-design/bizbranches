'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Edit2, Trash2, Eye, Users, Building2, Mail, Phone, Shield, LogOut, CheckCircle, XCircle, AlertCircle, Star, Settings } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AdminLogin from '@/components/admin-login'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { MAIN_PAGES } from '@/lib/pages-config'

interface Business {
  id: string
  businessName: string
  contactPerson?: string
  email?: string
  phone: string
  whatsapp?: string
  city: string
  address: string
  category: string
  description: string
  websiteUrl?: string
  facebookPage?: string
  googleBusiness?: string
  youtubeChannel?: string
  logoUrl?: string
  slug?: string
  createdAt: any
  status: string
  isFeatured?: boolean
}

interface ContactForm {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: any
}

export default function AdminPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [contacts, setContacts] = useState<ContactForm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Business>>({})
  const [activeTab, setActiveTab] = useState<'businesses' | 'contacts' | 'pages'>('businesses')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Check localStorage authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true'
    const adminEmail = localStorage.getItem('admin_email')
    
    if (isAuthenticated && adminEmail) {
      setIsAuthenticated(true)
      setCurrentUser({ email: adminEmail })
      fetchData()
    } else {
      setIsAuthenticated(false)
      setCurrentUser(null)
    }
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch businesses
      const businessesQuery = query(
        collection(db, 'businesses'),
        orderBy('createdAt', 'desc')
      )
      const businessesSnapshot = await getDocs(businessesQuery)
      const businessesData = businessesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Business))
      setBusinesses(businessesData)

      // Fetch contact forms (you'll need to create this collection)
      try {
        const contactsQuery = query(
          collection(db, 'contactForms'),
          orderBy('timestamp', 'desc')
        )
        const contactsSnapshot = await getDocs(contactsQuery)
        const contactsData = contactsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ContactForm))
        setContacts(contactsData)
      } catch (error) {
        console.log('Contact forms collection not found yet')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    fetchData()
  }

  async function handleLogout() {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_email')
    setIsAuthenticated(false)
    setCurrentUser(null)
    router.push('/')
  }

  async function handleDeleteBusiness(businessId: string) {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return
    }

    try {
      const business = businesses.find(b => b.id === businessId)
      await deleteDoc(doc(db, 'businesses', businessId))
      
      if (business?.slug) {
        fetch('/api/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [`${window.location.origin}/business/${business.slug}/`] })
        }).catch(() => {})
      }

      setBusinesses(prev => prev.filter(b => b.id !== businessId))
      setDeleteConfirm(null)
      alert('Business deleted successfully')
    } catch (error) {
      console.error('Error deleting business:', error)
      alert('Failed to delete business')
    }
  }

  function handleEditBusiness(business: Business) {
    setSelectedBusiness(business)
    setEditForm(business)
    setIsEditing(true)
  }

  async function handleUpdateBusiness(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedBusiness) return

    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id)
      await updateDoc(businessRef, editForm)
      
      if (selectedBusiness.slug) {
        fetch('/api/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [`${window.location.origin}/business/${selectedBusiness.slug}/`] })
        }).catch(() => {})
      }

      setBusinesses(prev => prev.map(b => 
        b.id === selectedBusiness.id ? { ...b, ...editForm } : b
      ))
      
      setIsEditing(false)
      setSelectedBusiness(null)
      setEditForm({})
      alert('Business updated successfully')
    } catch (error) {
      console.error('Error updating business:', error)
      alert('Failed to update business')
    }
  }

  async function handleSetActive(businessId: string) {
    try {
      const business = businesses.find(b => b.id === businessId)
      const businessRef = doc(db, 'businesses', businessId)
      await updateDoc(businessRef, { status: 'approved' })
      
      if (business?.slug) {
        fetch('/api/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [
            `${window.location.origin}/business/${business.slug}/`,
            `${window.location.origin}/sitemaps/businesses.xml`,
          ] })
        }).catch(() => {})
      }

      setBusinesses(prev => prev.map(b =>
        b.id === businessId ? { ...b, status: 'approved' } : b
      ))
    } catch (error) {
      console.error('Error activating business:', error)
      alert('Failed to activate business')
    }
  }

  async function handleToggleFeatured(businessId: string, currentStatus: boolean) {
    try {
      const businessRef = doc(db, 'businesses', businessId)
      await updateDoc(businessRef, {
        isFeatured: !currentStatus
      })
      
      setBusinesses(prev => prev.map(b => 
        b.id === businessId ? { ...b, isFeatured: !currentStatus } : b
      ))
      
      alert(`Business ${!currentStatus ? 'marked as featured' : 'removed from featured'}`)
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert('Failed to toggle featured status')
    }
  }

  const filteredBusinesses = businesses.filter(business =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/seed"
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                >
                  Seed Sample Data
                </Link>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  View Website
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Contact Forms</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                </div>
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {businesses.filter(b => b.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cities Covered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {[...new Set(businesses.map(b => b.city))].length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'businesses'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Businesses ({businesses.length})
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'contacts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Contact Forms ({contacts.length})
                </button>
                <button
                  onClick={() => setActiveTab('pages')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'pages'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Page Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Businesses Tab */}
          {activeTab === 'businesses' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search businesses..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Businesses Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading businesses...</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBusinesses.map((business) => (
                        <tr key={business.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{business.businessName}</div>
                              <div className="text-sm text-gray-500">{business.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{business.phone}</div>
                            <div className="text-sm text-gray-500">{business.email || 'No email'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{business.city}</td>
                          <td className="px-6 py-4">
                            {business.status === 'approved' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {business.status || 'unknown'}
                                </span>
                                <button
                                  onClick={() => handleSetActive(business.id)}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                  title="Make this business active"
                                >
                                  Set Active
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleFeatured(business.id, business.isFeatured || false)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                business.isFeatured
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              title={business.isFeatured ? 'Click to remove from featured' : 'Click to mark as featured'}
                            >
                              <Star className="w-3.5 h-3.5" />
                              {business.isFeatured ? 'Featured' : 'Not Featured'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditBusiness(business)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(business.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <Link
                                href={`/business/${business.slug || business.id}/`}
                                target="_blank"
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                {contacts.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No contact forms submitted yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{contact.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{contact.subject}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {contact.timestamp?.toDate()?.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Management</h3>
                <p className="text-sm text-gray-600">Configure and manage main website pages</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {MAIN_PAGES.map((page) => (
                  <div key={page.slug} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{page.title}</h4>
                          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {page.slug || '/'}
                          </span>
                          {page.requiresAuth && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Protected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>Priority: <strong>#{page.priority}</strong></span>
                          <span>Status: <strong className={page.enabled ? 'text-green-600' : 'text-red-600'}>
                            {page.enabled ? 'Enabled' : 'Disabled'}
                          </strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-blue-50 border-t border-gray-200">
                <h4 className="font-semibold text-blue-900 mb-2">About Page Settings</h4>
                <p className="text-sm text-blue-800 mb-3">
                  This system maintains 10 core pages to optimize performance. Extra pages are controlled in <code className="bg-white px-2 py-1 rounded font-mono">/lib/pages-config.ts</code>
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Each page can be enabled or disabled</li>
                  <li>Protected pages require authentication</li>
                  <li>Modify pages-config.ts to change settings</li>
                  <li>robots.txt ensures crawlers only index active pages</li>
                </ul>
              </div>
            </div>
          )}
        </main>

        {/* Edit Modal */}
        {isEditing && selectedBusiness && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Edit Business</h2>
              </div>
              
              <form onSubmit={handleUpdateBusiness} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={editForm.businessName || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={editForm.contactPerson || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editForm.city || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedBusiness(null)
                      setEditForm({})
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Business
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this business? This action cannot be undone and will remove the business from both the frontend and Firebase database.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBusiness(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Business
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}
