"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "What is the tax rate on crypto in 2025?",
        answer: "Crypto profits are taxed at a flat 30% rate in India, with absolutely no exemptions for income levels or long-term holdings."
    },
    {
        question: "Does TDS apply to every transaction?",
        answer: "Yes, a 1% TDS (Tax Deducted at Source) is mandatory on all Sell and Transfer transactions exceeding specific thresholds (usually ₹10k/₹50k per FY)."
    },
    {
        question: "Can I set off my crypto losses?",
        answer: "No. Losses from one crypto asset cannot be offset against gains from another, nor can they be adjusted against other income sources like stocks or salary."
    },
    {
        question: "Are NFTs also taxed?",
        answer: "Yes. NFTs are classified as Virtual Digital Assets (VDAs). Trading profits and creator royalties are fully taxable at 30%."
    },
    {
        question: "Do foreign exchange transactions need reporting?",
        answer: "Yes. All holdings and gains from overseas exchanges (like Binance, Kraken) must be declared in your ITR. Non-reporting can attract penalties under the Black Money Act."
    }
];

export function FAQSection() {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-space-grotesk font-bold text-center text-white mb-8">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-800">
                        <AccordionTrigger className="text-gray-200 hover:text-primary text-left text-lg">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
