import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | PakBizBranches',
  description: 'Terms of service for PakBizBranches Business Directory.',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-[#0f2b3d] mb-8">Terms of Service</h1>
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-4">Last Updated: April 2026</p>
          
          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using PakBizBranches, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">2. Business Listings</h2>
          <p className="mb-4">
            Users who add business listings represent that the information provided is accurate and that they have the right to publish it.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">3. Prohibited Content</h2>
          <p className="mb-4">
            We reserve the right to remove any listing that contains illegal, offensive, or inaccurate content.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">4. Disclaimer</h2>
          <p className="mb-4">
            PakBizBranches is a directory service. We do not guarantee the quality of services provided by the businesses listed on our platform.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">5. Modifications</h2>
          <p className="mb-4">
            We may update these terms from time to time. Continued use of the site implies acceptance of the updated terms.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have questions about these Terms of Service, please contact us at support@pakbizbranches.online.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
