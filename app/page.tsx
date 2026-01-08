"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { SimpleTaxForm } from "@/components/basic-calculator/simple-form";
import { TaxRulesGrid } from "@/components/tax-rules/rules-grid";
import { FAQSection } from "@/components/tax-rules/faq-section";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { FloatingShapes } from "@/components/ui/floating-shapes/floating-shapes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

export default function Home() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <main className="min-h-screen bg-[#0B0C10] relative overflow-x-hidden selection:bg-primary/30 scroll-smooth">

      {/* Dynamic Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Gradient Blotches */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-100px] right-[-100px] w-[800px] h-[800px] bg-purple-900/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-100px] left-[-100px] w-[800px] h-[800px] bg-blue-900/20 blur-[120px] rounded-full"
        />

        {/* Moving Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        {/* Floating 3D Shapes */}
        <FloatingShapes />

        {/* Shooting Stars Layer */}
        <ShootingStars />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 pointer-events-none">
        <span className="text-white font-bold text-xl pointer-events-auto font-space-grotesk tracking-wider">DeFi Tax</span>
        <Link href="/dashboard" className="pointer-events-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-medium shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            Launch App
          </Button>
        </Link>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 space-y-32">

        {/* Section 1: Hero / Calculator */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col items-center justify-center min-h-[85vh] perspective-1000"
        >
          <SimpleTaxForm />

          <motion.div
            style={{ opacity }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 animate-bounce text-gray-500"
          >
            <span className="text-xs tracking-widest uppercase">Scroll Down</span>
          </motion.div>
        </motion.section>

        {/* Section 2: Content Header */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-5xl md:text-6xl font-space-grotesk font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-tight">
            Crypto Tax Rules India <span className="text-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">2026</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            As digital assets grow, clarity is key. Understand the <span className="text-white font-medium">30% tax</span>, <span className="text-white font-medium">1% TDS</span>, and <span className="text-white font-medium">zero-offset</span> policies that defined the 2026 fiscal landscape.
          </p>
        </motion.section>

        {/* Section 3: Rules Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="perspective-1000"
        >
          <TaxRulesGrid />
        </motion.section>

        {/* Section 4: FAQ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="pb-32"
        >
          <FAQSection />
        </motion.section>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-xs pb-16 max-w-2xl mx-auto leading-relaxed space-y-6">
          <div className="flex justify-center gap-6 font-mono">
            <Link href="/manifesto" className="hover:text-primary transition-colors hover:underline underline-offset-4">
              Why This Exists
            </Link>
            <span className="text-gray-800">|</span>
            <Link href="/learn/defi-flows" className="hover:text-primary transition-colors hover:underline underline-offset-4">
              Visualizing Tax Traps
            </Link>
          </div>
          <p>
            Built for the decentralized future. <br />
            <span className="opacity-70">
              This tool provides educational and computational assistance only and does not constitute legal or tax advice.
            </span>
          </p>
        </footer>

      </div>
    </main>
  );
}
