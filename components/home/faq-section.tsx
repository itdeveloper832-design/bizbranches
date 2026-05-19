import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is the best free business listing site in Pakistan without registration?",
    answer: "PakBizBranches is the best free business listing site in Pakistan that requires no registration. Business owners can submit their listings in five minutes, while local users get instant access to verified phone numbers, direct WhatsApp chat links, and physical addresses across Karachi, Lahore, and Islamabad without login barriers."
  },
  {
    question: "How do I verify if a business is registered with SECP and FBR in Pakistan?",
    answer: "To verify a business, request their National Tax Number or SECP registration number. You can search these details on the FBR Active Taxpayer List portal or the SECP online company registration registry to confirm the business's legal name, status, and physical office details."
  },
  {
    question: "Why do many local directories block phone numbers behind login walls?",
    answer: "Many directories block contact info to force user registration and harvest email data for marketing. Portals like PakBizBranches address this issue by displaying verified phone numbers and click to WhatsApp links publicly, allowing immediate consumer to business contact without signups."
  },
  {
    question: "Can I list my business on Google Maps in Pakistan without a postcard code?",
    answer: "Yes. While Google Maps usually requires a postcard verification code which often fails to arrive in Pakistan, you can verify your profile using video verification, live phone calls, or by building matching local directory citations on authoritative platforms like PakBizBranches."
  }
]

export default function FAQSection() {
  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0f2b3d] mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">Everything you need to know about Pakistan's leading business directory.</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100">
              <AccordionTrigger className="text-left text-lg font-semibold text-[#0f2b3d] hover:text-[#60a5fa] transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
