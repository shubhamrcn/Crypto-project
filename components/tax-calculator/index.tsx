"use client";

import { JurisdictionSwitch } from "./jurisdiction-switch";
import { InputSection } from "./input-section";
import { SummaryCard } from "./summary-card";

export function TaxCalculator() {
    return (
        <div className="max-w-md mx-auto space-y-8 p-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-space-grotesk font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    DeFi Tax Engine
                </h1>
                <p className="text-gray-400 text-sm">Real-time tax liability estimator</p>
            </div>

            <JurisdictionSwitch />

            <div className="grid gap-8">
                <InputSection />
                <SummaryCard />
            </div>
        </div>
    );
}
