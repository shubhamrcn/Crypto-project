import { SimpleTaxForm } from "@/components/basic-calculator/simple-form";

export default function BasicCalculatorPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Stars/Space Background Effect - simplified version */}
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black opacity-80 pointer-events-none" />

            <div className="relative z-10 w-full px-4">
                <SimpleTaxForm />
            </div>
        </main>
    );
}
