"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ManifestoPage() {
    return (
        <div className="min-h-screen bg-[#0B0C10] text-gray-100 p-8 font-serif">
            <div className="max-w-3xl mx-auto space-y-16 py-12">
                <Link href="/" className="flex items-center text-gray-500 hover:text-white transition-colors font-sans text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                </Link>

                {/* Essay 1 */}
                <article className="space-y-6">
                    <div className="space-y-2">
                        <Badge variant="outline" className="text-gray-500 border-gray-700 font-sans tracking-widest text-[10px]">ESSAY 001</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            The Asymmetry of Loss
                        </h1>
                        <p className="text-xl text-gray-400 italic font-light">
                            Why India's refusal to recognize crypto losses breaks basic accounting principles.
                        </p>
                    </div>

                    <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                        <p>
                            In every standard financial market—stocks, real estate, precious metals—tax is a levy on <em>net income</em>. If you make ₹100 profit and ₹40 loss, you are taxed on ₹60. This is the bedrock of fair taxation: the capacity to pay.
                        </p>
                        <p>
                            Section 115BBH destroys this symmetry. By disallowing the set-off of losses, the government has categorized crypto trading not as an investment activity, but effectively as 'gambling' similar to lotteries, where wins are taxed and losses are personal failures.
                        </p>
                        <div className="pl-6 border-l-2 border-indigo-500/50 my-8 italic text-gray-400">
                            "A trade that looks profitable on a dashboard might be a net loss after tax. The math of 115BBH is non-Euclidean: positive sums can equal zero."
                        </div>
                        <p>
                            This platform was built to visualize that harsh reality. When you see your "Taxable Income" higher than your "Real Profit", that is not a bug. That is the architecture of the law.
                        </p>
                    </div>
                </article>

                <hr className="border-gray-800" />

                {/* Essay 2 */}
                <article className="space-y-6">
                    <div className="space-y-2">
                        <Badge variant="outline" className="text-gray-500 border-gray-700 font-sans tracking-widest text-[10px]">ESSAY 002</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Privacy as a Compliance Feature
                        </h1>
                    </div>

                    <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                        <p>
                            Most tax tools demand your API keys. They pull your data to cloud servers, parse it, and often resell aggregated insights. In an era of data breaches and surveillance, "compliance" should not mean "exposure".
                        </p>
                        <p>
                            We architecture this platform on a simple premise: <strong>Mathematical truth does not require server access.</strong>
                        </p>
                        <p>
                            By using IndexedDB and Client-Side Logic, we prove that powerful, audit-grade tax computation can happen entirely within your browser sandbox. You don't need to trust us with your data because we never see it.
                        </p>
                    </div>
                </article>

                <div className="pt-12 text-center">
                    <p className="text-gray-600 font-sans text-sm">
                        Built with rigor. Designed for privacy. <br />
                        &copy; 2026 DeFi Tax Platform.
                    </p>
                </div>
            </div>
        </div>
    );
}
