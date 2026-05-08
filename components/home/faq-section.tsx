import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is it really free to list my business on PakBizBranches?",
    answer: "Yes, 100% free. We do not charge for standard business listings. Our goal is to provide a comprehensive and accessible directory for all businesses across Pakistan."
  },
  {
    question: "How long does it take for my business to appear in the directory?",
    answer: "Once submitted, our team reviews your listing for accuracy and quality. Most listings are approved and live within 24 hours. You will receive an email confirmation once it's live."
  },
  {
    question: "Can I update my business information later?",
    answer: "Absolutely. You can contact our support team to request updates to your business details, phone numbers, or addresses at any time."
  },
  {
    question: "What categories of businesses can be listed?",
    answer: "We welcome all legal businesses operating in Pakistan, including restaurants, real estate agencies, healthcare providers, retail stores, tech companies, and local services like mechanics or salons."
  },
  {
    question: "How do I get my business featured at the top?",
    answer: "We offer premium featured listings for businesses looking for extra visibility. Featured businesses appear at the top of their categories and cities. Contact us via WhatsApp for details."
  },
  {
    question: "Is PakBizBranches a government-affiliated site?",
    answer: "No, PakBizBranches is an independent, privately-owned local business directory dedicated to helping Pakistani businesses grow their digital presence."
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
