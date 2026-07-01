'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, Upload, X, CheckCircle2, Eye, MessageCircle, Zap, Copy, Check, Sparkles, Smartphone, Landmark } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CitySearchDropdown from '@/components/ui/city-search-dropdown'
import { CATEGORIES } from '@/lib/data'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, serverTimestamp, limit, doc, updateDoc } from 'firebase/firestore'
import { sendBusinessSubmissionEmail } from '@/lib/email-service'
import { normalizeCategoryForStorage } from '@/lib/category-mappings'

type Status = 'idle' | 'loading' | 'success' | 'error'

const MAX_LOGO_MB = 2.5
const MIN_DESCRIPTION_CHARS = 500
const MAX_DESCRIPTION_CHARS = 1000

// Sub-categories for each main category
const SUB_CATEGORIES: Record<string, string[]> = {
  'restaurants': ['Fast Food', 'Fine Dining', 'Cafe', 'Bakery', 'Catering', 'Food Truck'],
  'real-estate': ['Residential', 'Commercial', 'Industrial', 'Land', 'Rental', 'Property Management'],
  'technology': ['Software Development', 'Web Design', 'IT Support', 'Digital Marketing', 'Mobile Apps', 'Cloud Services'],
  'healthcare': ['Hospitals', 'Clinics', 'Pharmacies', 'Dental', 'Laboratories', 'Medical Equipment'],
  'education': ['Schools', 'Colleges', 'Universities', 'Tuition Centers', 'Training Institutes', 'Online Learning'],
  'retail': ['Supermarkets', 'Clothing', 'Electronics', 'Jewelry', 'Books', 'Department Stores'],
  'construction': ['Building Contractors', 'Architecture', 'Interior Design', 'Building Materials', 'Civil Engineering', 'Renovation'],
  'automotive': ['Car Dealers', 'Mechanics', 'Parts', 'Accessories', 'Service Centers', 'Car Rental'],
  'finance': ['Banks', 'Insurance', 'Investment', 'Accounting', 'Loans', 'Financial Advisors'],
  'travel': ['Airlines', 'Hotels', 'Tour Operators', 'Transport', 'Travel Agencies', 'Car Rental'],
  'beauty': ['Salons', 'Spas', 'Gyms', 'Cosmetics', 'Beauty Products', 'Wellness Centers'],
  'logistics': ['Courier', 'Cargo', 'Warehousing', 'Transport', 'Supply Chain', 'Freight Forwarding'],
}

export default function AddBussinessClient() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    subcategory: '',
    branchCode: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    address: '',
    city: '',
    logoUrl: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [descriptionCharCount, setDescriptionCharCount] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [existingBusinesses, setExistingBusinesses] = useState<string[]>([])
  const [submittedSlug, setSubmittedSlug] = useState<string | null>(null)

  // Payment portal & sound notification states
  const [submittedBusinessId, setSubmittedBusinessId] = useState<string | null>(null)
  const [submittedDocId, setSubmittedDocId] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<'details' | 'upload' | 'complete'>('details')
  const [selectedMethod, setSelectedMethod] = useState<'easypaisa' | 'jazzcash'>('easypaisa')
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [screenshotUploading, setScreenshotUploading] = useState(false)
  const [businessIdInput, setBusinessIdInput] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'express'>('standard')
  const screenshotInputRef = useRef<HTMLInputElement>(null)

  // Web Audio chime synthesis
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.15); // C6
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();
      
      osc1.stop(audioCtx.currentTime + 0.6);
      osc2.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.error('Failed to play audio chime:', e);
    }
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => {
      setCopiedField(null)
    }, 2000)
  }

  const generateUniqueBusinessId = async () => {
    let isUnique = false
    let resultId = ''
    let attempts = 0
    
    while (!isUnique && attempts < 15) {
      const randomNum = Math.floor(100000 + Math.random() * 99899999)
      resultId = randomNum.toString()
      
      const q = query(
        collection(db, 'businesses'),
        where('businessId', '==', resultId),
        limit(1)
      )
      const snap = await getDocs(q)
      if (snap.empty) {
        isUnique = true
      }
      attempts++
    }
    return resultId
  }

  // Check for existing businesses when phone or email changes
  useEffect(() => {
    async function checkExistingBusinesses() {
      if (!formData.phone && !formData.email) return

      try {
        const q = query(
          collection(db, 'businesses'),
          where('status', '==', 'approved')
        )
        const querySnapshot = await getDocs(q)
        const businesses = querySnapshot.docs.map(doc => doc.data())
        
        const duplicates = businesses
          .filter(business => 
            (formData.phone && business.phone === formData.phone) ||
            (formData.email && business.email === formData.email)
          )
          .map(business => business.businessName as string)

        setExistingBusinesses(duplicates)
      } catch (error) {
        console.error('Error checking existing businesses:', error)
      }
    }

    const timeoutId = setTimeout(checkExistingBusinesses, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.phone, formData.email])

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({ ...prev, subcategory: '' }))
    }
  }, [formData.category])

  // Load advertisement script
  useEffect(() => {
    const loadAds = () => {
      // Set atOptions FIRST before loading script
      (window as any).atOptions = {
        'key': '07e5beba21527d8979cd7e4953709385',
        'format': 'iframe',
        'height': 600,
        'width': 160,
        'params': {}
      }

      const adContainer = document.getElementById('ad-container')
      if (adContainer) {
        // Clear placeholder
        adContainer.innerHTML = ''
        
        // Create and append script
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://www.highperformanceformat.com/07e5beba21527d8979cd7e4953709385/invoke.js'
        adContainer.appendChild(script)
      }
    }

    // Add small delay to ensure DOM is ready
    const timeoutId = setTimeout(loadAds, 100)
    return () => clearTimeout(timeoutId)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < MIN_DESCRIPTION_CHARS) {
      newErrors.description = `Description must be at least ${MIN_DESCRIPTION_CHARS} characters`
    } else if (formData.description.length > MAX_DESCRIPTION_CHARS) {
      newErrors.description = `Description must not exceed ${MAX_DESCRIPTION_CHARS} characters`
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^(\+92|0)?[0-9]{2,4}[ -]?[0-9]{3,4}[ -]?[0-9]{3,4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Pakistani phone number (e.g., 021 111 331 331)'
    }

    if (formData.whatsapp && !/^(\+92|0)?[0-9]{2,4}[ -]?[0-9]{3,4}[ -]?[0-9]{3,4}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = 'Please enter a valid Pakistani WhatsApp number (e.g., 021 111 331 331)'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (existingBusinesses.length > 0) {
      newErrors.duplicate = 'A business with this phone or email already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isSlugUnique = async (slug: string) => {
    try {
      const q = query(
        collection(db, 'businesses'),
        where('slug', '==', slug),
        limit(1)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.empty
    } catch (error) {
      console.error('Error checking slug uniqueness:', error)
      return true // Assume unique on error to avoid blocking submission
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Update character count for description
    if (name === 'description') {
      setDescriptionCharCount(value.length)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: `Logo must be smaller than ${MAX_LOGO_MB}MB` }))
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, logo: 'Please upload an image file' }))
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setLogoPreview(result)
      setFormData(prev => ({ ...prev, logoUrl: result }))
      setErrors(prev => ({ ...prev, logo: '' }))
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogoPreview(null)
    setFormData(prev => ({ ...prev, logoUrl: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateSlug = (businessName: string, city: string) => {
    const cleanName = businessName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_]+/g, '-')   // Replace spaces/underscores with hyphens
      .replace(/-+/g, '-')       // Remove duplicate hyphens
      .replace(/^-+|-+$/g, '');  // Trim hyphens from ends
    
    const cleanCity = city
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    return cleanCity ? `${cleanName}-${cleanCity}` : cleanName;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus('loading')
    try {
      const baseSlug = generateSlug(formData.businessName, formData.city)
      let finalSlug = baseSlug
      let isUnique = await isSlugUnique(finalSlug)
      let counter = 1
      
      while (!isUnique) {
        finalSlug = `${baseSlug}-${counter}`
        isUnique = await isSlugUnique(finalSlug)
        counter++
        if (counter > 10) break // Safety break
      }

      // Generate a unique 6 to 8 digit business ID
      const uniqueBizId = await generateUniqueBusinessId()

      const businessData = {
        ...formData,
        businessId: uniqueBizId,
        businessName: formData.businessName.trim(),
        description: formData.description.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim().toLowerCase(),
        websiteUrl: formData.website.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        branchCode: formData.branchCode?.trim() || '',
        category: normalizeCategoryForStorage(formData.category),
        categoryId: normalizeCategoryForStorage(formData.category),
        categorySlug: normalizeCategoryForStorage(formData.category),
        subCategory: formData.subcategory.trim(),
        slug: finalSlug,
        status: 'pending', // Save as pending for admin approval
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'businesses'), businessData)

      // Send notification email (fire-and-forget, don't block UX on email failures)
      const categoryLabel =
        CATEGORIES.find(c => c.id === normalizeCategoryForStorage(formData.category))?.name
        || formData.category

      if (formData.email) {
        sendBusinessSubmissionEmail({
          to: formData.email,
          businessName: formData.businessName.trim(),
          businessId: docRef.id,
          email: formData.email,
          phone: formData.phone.trim(),
          category: categoryLabel,
          city: formData.city.trim(),
          address: formData.address.trim(),
          description: formData.description.trim(),
          slug: businessData.slug,
        }).catch(err => console.error('[v0] Email dispatch failed:', err))
      }

      // IndexNow Automatic Submission - omitted for pending listings to prevent indexing unapproved pages
      /*
      const pageUrl = `${window.location.origin}/business/${businessData.slug}/`;
      fetch('/api/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [pageUrl] })
      }).catch(err => console.error('IndexNow submission failed:', err));
      */

      // Play synthesized audio alert
      playChime()

      // Set submission states
      setSubmittedBusinessId(uniqueBizId)
      setSubmittedDocId(docRef.id)
      setBusinessIdInput(uniqueBizId)
      setSubmittedSlug(businessData.slug)
      setPaymentStep('details')
      setStatus('success')
      
      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error) {
      console.error('Error submitting business:', error)
      setStatus('error')
    }
  }

  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Screenshot file size must be less than 5MB')
      return
    }

    setScreenshotFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setScreenshotPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      const timeout = setTimeout(() => {
        console.warn('Image compression timed out. Using original image.')
        resolve(base64Str)
      }, 2000)

      img.src = base64Str
      img.onload = () => {
        clearTimeout(timeout)
        try {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.6)) // 60% quality is plenty for verification
        } catch (e) {
          resolve(base64Str)
        }
      }
      img.onerror = () => {
        clearTimeout(timeout)
        resolve(base64Str)
      }
    })
  }

  const handleScreenshotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!screenshotPreview) {
      alert('Please upload a screenshot first')
      return
    }
    if (!businessIdInput.trim()) {
      alert('Please enter your Business ID')
      return
    }

    setScreenshotUploading(true)
    try {
      let businessDocId = ''

      // If we are in the same session and the pre-filled ID matches, bypass the Firestore query
      if (submittedDocId && businessIdInput.trim() === submittedBusinessId) {
        businessDocId = submittedDocId
      } else {
        // Fallback: Find the business in Firestore using the custom business ID
        const q = query(
          collection(db, 'businesses'),
          where('businessId', '==', businessIdInput.trim()),
          limit(1)
        )
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) {
          alert('Invalid Business ID. Please verify the ID from Step 1.')
          setScreenshotUploading(false)
          return
        }
        businessDocId = querySnapshot.docs[0].id
      }

      // Compress screenshot to keep Firestore document size small (with timeout safety)
      const compressedBase64 = await compressImage(screenshotPreview)

      // Update Firestore document with screenshot URL (as compressed base64)
      await updateDoc(doc(db, 'businesses', businessDocId), {
        paymentScreenshotUrl: compressedBase64,
        paymentSubmittedAt: serverTimestamp(),
        paymentPlan: selectedPlan,
        paymentPlanPrice: selectedPlan === 'standard' ? 10 : 20,
        status: 'pending' // ensure status is pending for admin authorization
      })

      // Play synthesized audio alert
      playChime()

      setPaymentStep('complete')
    } catch (error) {
      console.error('Error submitting payment screenshot:', error)
      alert('Failed to upload screenshot. Please try again.')
    } finally {
      setScreenshotUploading(false)
    }
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Add Your Business to PakBizBranches
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              List your business for free and reach thousands of customers across Pakistan. Join 12,000+ local services discovered every day.
            </p>
          </div>

          {/* SEO Benefits Section */}
          <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Boost Local SEO</h3>
                <p className="text-xs text-slate-500">Get a high-quality local citation to rank better in Google Search.</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Direct Contact</h3>
                <p className="text-xs text-slate-500">Enable WhatsApp and phone calls directly from potential customers.</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">100% Free</h3>
                <p className="text-xs text-slate-500">No registration or credit card required for standard listings.</p>
              </div>
            </div>
          </section>

          {/* Two Column Layout: Form + Ads */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Form (2/3 width) */}
            <div className="lg:col-span-2">
              {/* Existing Businesses Warning */}
              {existingBusinesses.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-1">Existing Business Found</h3>
                      <p className="text-amber-700 text-sm">
                        We found existing businesses with your phone number or email:
                      </p>
                  <ul className="mt-2 text-sm text-amber-700">
                    {existingBusinesses.map((name, index) => (
                      <li key={index}>• {name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {status === 'success' ? (
            <div className="mb-12 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-900/5 max-w-3xl mx-auto overflow-hidden">
              {/* Step Progress Bar */}
              <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex justify-between items-center text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paymentStep === 'details' ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-700'}`}>
                    {paymentStep !== 'details' ? <Check className="w-3 h-3" /> : '1'}
                  </div>
                  <span>Payment Details</span>
                </div>
                <div className="h-0.5 w-12 bg-slate-200 flex-1 mx-4"></div>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paymentStep === 'upload' ? 'bg-blue-600 text-white' : paymentStep === 'complete' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {paymentStep === 'complete' ? <Check className="w-3 h-3" /> : '2'}
                  </div>
                  <span>Upload Receipt</span>
                </div>
                <div className="h-0.5 w-12 bg-slate-200 flex-1 mx-4"></div>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paymentStep === 'complete' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    3
                  </div>
                  <span>Verification</span>
                </div>
              </div>

              <div className="p-8 md:p-12">
                {paymentStep === 'details' && (
                  <div className="text-center animate-fadeIn">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Business Registered!</h2>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                      Your listing info is saved. To publish and make your business page live on PakBizBranches, please complete the activation payment below.
                    </p>

                    {/* Business ID Box */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-8 max-w-md mx-auto flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Your Unique Business ID</span>
                        <div className="text-2xl font-black text-slate-800 tracking-wide mt-0.5">{submittedBusinessId}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(submittedBusinessId || '', 'bizId')}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                      >
                        {copiedField === 'bizId' ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-400" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Plan Selector */}
                    <div className="mb-8 text-left max-w-md mx-auto">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">Select Setup & Indexing Plan</h3>
                      <div className="space-y-4">
                        <label 
                          className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedPlan === 'standard'
                              ? 'border-blue-600 bg-blue-50/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="paymentPlan" 
                            checked={selectedPlan === 'standard'}
                            onChange={() => setSelectedPlan('standard')}
                            className="mt-1 accent-blue-600 cursor-pointer"
                          />
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800 text-sm">Standard Setup</span>
                              <span className="font-black text-blue-600 text-sm">RS: 10</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              Your business page will be created within **24 hours** after payment verification and indexed on Google within **15 days** of page creation.
                            </p>
                          </div>
                        </label>

                        <label 
                          className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedPlan === 'express'
                              ? 'border-blue-600 bg-blue-50/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="paymentPlan" 
                            checked={selectedPlan === 'express'}
                            onChange={() => setSelectedPlan('express')}
                            className="mt-1 accent-blue-600 cursor-pointer"
                          />
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                Express Setup & Indexing 
                                <span className="px-1.5 py-0.5 text-[9px] bg-amber-100 text-amber-800 border border-amber-200 rounded font-bold uppercase tracking-wider">Fast</span>
                              </span>
                              <span className="font-black text-blue-600 text-sm">RS: 20</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              Your business page will be created and indexed on search engines within **72 to 96 hours** after payment verification.
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Important Warning Note */}
                      <div className="mt-6 p-4 bg-amber-50/60 border border-amber-100/80 rounded-2xl text-left">
                        <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                          ⚠️ **Note:** This payment is only for the setup of your business page. This is a small amount, not a huge amount.
                        </p>
                        <p className="text-[11px] text-red-700 font-bold leading-relaxed mt-1.5">
                          ⚠️ If you do not send the payment, your page will NOT be created and your business will remain invisible to Google search.
                        </p>
                      </div>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="mb-8">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Select Payment Method</h3>
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('easypaisa')}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:scale-102 cursor-pointer ${
                            selectedMethod === 'easypaisa'
                              ? 'border-emerald-500 bg-emerald-50/30 text-emerald-800'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <Landmark className="w-8 h-8 mb-2" />
                          <span className="font-bold text-sm">Easypaisa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedMethod('jazzcash')}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:scale-102 cursor-pointer ${
                            selectedMethod === 'jazzcash'
                              ? 'border-red-500 bg-red-50/30 text-red-800'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <Smartphone className="w-8 h-8 mb-2" />
                          <span className="font-bold text-sm">JazzCash</span>
                        </button>
                      </div>
                    </div>

                    {/* Payment Account Details */}
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-8 max-w-md mx-auto text-left space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <div>
                          <span className="text-xs text-slate-400 block font-medium">Send Payment To</span>
                          <span className="font-bold text-slate-800 text-base">
                            {selectedMethod === 'easypaisa' ? 'Easypaisa Account' : 'JazzCash Account'}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedMethod === 'easypaisa' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedMethod}
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <div>
                          <span className="text-xs text-slate-400 block font-medium">Amount to Pay</span>
                          <span className="font-bold text-blue-600 text-lg">
                            RS: {selectedPlan === 'standard' ? '10' : '20'}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                          {selectedPlan === 'standard' ? 'Standard Plan' : 'Express Plan'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-slate-400 block font-medium">Account Number</span>
                          <span className="font-mono font-bold text-slate-900 text-lg">
                            {selectedMethod === 'easypaisa' ? '03402885226' : '03019316123'}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(selectedMethod === 'easypaisa' ? '03402885226' : '03019316123', 'payNum')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {copiedField === 'payNum' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-slate-400 block font-medium">Account Owner</span>
                          <span className="font-semibold text-slate-800 text-sm">
                            {selectedMethod === 'easypaisa' ? 'Muhammad Habib Ullah' : 'Muhammad Imran'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                      <button
                        onClick={() => setPaymentStep('upload')}
                        className="w-full max-w-md inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-102 shadow-lg shadow-blue-600/20 cursor-pointer"
                      >
                        Payment Done - Upload Screenshot
                      </button>
                    </div>
                  </div>
                )}

                {paymentStep === 'upload' && (
                  <form onSubmit={handleScreenshotSubmit} className="animate-fadeIn max-w-md mx-auto text-left">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">Verify Payment</h3>
                    <p className="text-xs text-slate-500 mb-6 text-center">
                      Please verify your Business ID and upload the payment receipt/screenshot below.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Business ID *
                        </label>
                        <input
                          type="text"
                          required
                          value={businessIdInput}
                          onChange={(e) => setBusinessIdInput(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold transition-all text-slate-800"
                          placeholder="e.g. 123456"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Payment Screenshot *
                        </label>
                        <input
                          ref={screenshotInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotSelect}
                          className="hidden"
                        />
                        
                        {!screenshotPreview ? (
                          <button
                            type="button"
                            onClick={() => screenshotInputRef.current?.click()}
                            className="w-full flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
                          >
                            <Upload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mb-3 transition-colors animate-bounce" />
                            <span className="font-bold text-slate-700 text-sm">Select Screenshot Image</span>
                            <span className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</span>
                          </button>
                        ) : (
                          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 relative">
                            <img
                              src={screenshotPreview}
                              alt="Screenshot preview"
                              className="max-h-60 w-full object-contain rounded-xl border border-slate-200 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setScreenshotFile(null)
                                setScreenshotPreview(null)
                              }}
                              className="absolute top-6 right-6 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
                              <span className="truncate max-w-[250px] font-medium">{screenshotFile?.name}</span>
                              <span>{(screenshotFile!.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setPaymentStep('details')}
                          className="flex-1 py-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors text-center cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={screenshotUploading || !screenshotFile}
                          className="flex-[2] inline-flex items-center justify-center gap-2 py-4 bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                        >
                          {screenshotUploading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>Submit Verification</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {paymentStep === 'complete' && (
                  <div className="text-center animate-fadeIn">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Verification Submitted!</h2>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
                      Thank you for submitting the transaction screenshot. Our admin team will verify your payment details and activate your business listing shortly.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 max-w-sm mx-auto text-left">
                      <div className="flex justify-between items-center text-sm border-b border-slate-200/60 pb-2 mb-2">
                        <span className="text-slate-500 font-medium">Business ID</span>
                        <span className="font-mono font-bold text-slate-800">{submittedBusinessId}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Listing Status</span>
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase">
                          Pending Approval
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => window.location.reload()}
                      className="w-full max-w-xs py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
                    >
                      List Another Business
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>

          {/* Error Message */}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Submission Failed</h3>
                  <p className="text-red-700 text-sm">
                    There was an error submitting your business. Please try again or contact support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Premium Promotion */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Want More Visibility?
                </h3>
                <p className="text-slate-700 mb-4">
                  Mark your business as featured to appear at the top of search results and get significantly more visibility from potential customers!
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/923345636230?text=Hi%2C%20I%20want%20to%20promote%20my%20business%20on%20your%20listing%20website.%20Please%20share%20details."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact via WhatsApp
                  </a>
                  <Link
                    href="/featured-businesses"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-green-500 text-green-700 rounded-lg font-semibold text-sm hover:bg-green-50 transition-colors"
                  >
                    See Featured Businesses
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                🏢 Business Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.businessName ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Enter your business name"
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.category ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {formData.category && SUB_CATEGORIES[formData.category] && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sub-category
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select a sub-category (optional)</option>
                      {SUB_CATEGORIES[formData.category].map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Branch Code field - only shown for Banks subcategory */}
                {formData.category === 'finance' && formData.subcategory === 'Banks' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Branch Code
                    </label>
                    <input
                      type="text"
                      name="branchCode"
                      value={formData.branchCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 0052"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Enter the bank branch code (e.g., 0052 for HBL branches)
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Description *
                    <span className="text-slate-500 font-normal ml-2">
                      ({descriptionCharCount}/{MAX_DESCRIPTION_CHARS} characters)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Describe your business, services, and what makes you unique..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    Minimum {MIN_DESCRIPTION_CHARS} characters required for better visibility
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                📞 Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="021 111 331 331"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.whatsapp ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="021 111 331 331 (optional)"
                  />
                  {errors.whatsapp && (
                    <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="business@example.com (optional)"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://www.example.com (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                📍 Location Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.address ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Enter your complete business address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <CitySearchDropdown
                    value={formData.city}
                    onChange={(value) => handleInputChange({ 
                      target: { name: 'city', value } 
                    } as React.ChangeEvent<HTMLInputElement>)}
                    placeholder="Select or type your city"
                    className={`w-full ${
                      errors.city ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                🖼️ Business Logo
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">Upload Logo (Optional)</span>
                  </button>
                  <p className="mt-2 text-sm text-slate-500">
                    Maximum file size: {MAX_LOGO_MB}MB. Recommended: Square image, at least 200x200px
                  </p>
                  {errors.logo && (
                    <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                  )}
                </div>

                {logoPreview && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Logo uploaded successfully</p>
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={togglePreview}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">📋 Business Listing Preview</h2>
                <div className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Business logo"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200">
                        <span className="text-2xl text-slate-400">🏢</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800">
                        {formData.businessName || 'Business Name'}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        📍 {formData.city || 'City'}
                      </p>
                      <p className="text-sm text-slate-600">
                        📞 {formData.phone || 'Phone Number'}
                      </p>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                        {formData.description || 'Business description will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={status === 'loading' || existingBusinesses.length > 0}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-lg shadow-lg hover:shadow-xl cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    🚀 Submit Business
                  </>
                )}
              </button>
            </div>

            {errors.duplicate && (
              <p className="mt-2 text-sm text-red-600 text-center">{errors.duplicate}</p>
            )}
            </form>
          </>
        )}

          {/* Help Section */}
          <div className="mt-12 bg-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Need Help?</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <p>• All fields marked with * are required</p>
              <p>• Your business will be reviewed within 24 hours</p>
              <p>• Make sure your description is detailed for better visibility</p>
              <p>• Include your WhatsApp number for direct customer contact</p>
              <p>• For support, email us at support@pakbizbranhces.online</p>
            </div>
          </div>
            </div>

            {/* Right Column: Advertisement Space (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-4">Sponsored</p>
                  <div id="ad-container">
                    {/* Ads will load here */}
                    <div className="bg-slate-100 rounded-lg h-[600px] flex items-center justify-center">
                      <p className="text-slate-500 text-sm">Loading advertisements...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
