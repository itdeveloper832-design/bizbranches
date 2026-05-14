import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | PakBizBranches Pakistan Business Directory',
  description: 'Read the privacy policy for PakBizBranches. Learn how we collect, use, and protect your data on Pakistan\'s free business directory.',
  alternates: {
    canonical: 'https://pakbizbranhces.online/privacy/',
  },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-[#0f2b3d] mb-8">Privacy Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-4">Last Updated: May 9, 2026</p>
          <p className="mb-6 leading-relaxed">
            At <strong>PakBizBranches</strong>, we are committed to protecting the privacy of our users and business owners. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://pakbizbranhces.online" className="text-blue-600 hover:underline">pakbizbranhces.online</a>. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
          
          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
            <li><strong>Business Data:</strong> When you list a business, we collect business names, addresses, phone numbers, WhatsApp contacts, descriptions, and category information. This information is intended to be public.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">2. Use of Your Information</h2>
          <p className="mb-4">
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Create and manage your business listings.</li>
            <li>Enable search functionality for other users to find your services.</li>
            <li>Increase the efficiency and operation of the Site.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Notify you of updates to the Site or your listings.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">3. Disclosure of Your Information</h2>
          <p className="mb-4">
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
            <li><strong>Public Business Listings:</strong> Business information you provide for the purpose of a directory listing is public by design and will be accessible to all users of the Site and search engines.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, such as data analysis, email delivery, hosting services, and customer service.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">4. Security of Your Information</h2>
          <p className="mb-4">
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">5. Policy for Children</h2>
          <p className="mb-4">
            We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <p className="font-medium text-gray-900">
            PakBizBranches Support<br />
            Email: support@pakbizbranhces.online<br />
            Address: Gulghast Colony, Urdu Bazar, Multan, Pakistan
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
