import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SummaryCard() {
    return (
        <Card className={cn(
            "border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]",
            "bg-gradient-to-br from-card to-card/50 backdrop-blur-xl"
        )}>
            <CardHeader>
                <CardTitle className="text-gray-400 font-medium text-sm uppercase tracking-wider">
                    Estimated Tax Liability
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-space-grotesk font-bold text-white mb-2">
                    $0.00
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Post-Tax Profit</span>
                    <span className="text-green-400 font-medium">+$0.00</span>
                </div>
            </CardContent>
        </Card>
    );
}
