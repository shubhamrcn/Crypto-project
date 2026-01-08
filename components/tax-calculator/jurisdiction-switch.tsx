"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export function JurisdictionSwitch() {
    return (
        <Card className="p-4 bg-muted/20 border-border backdrop-blur-md">
            <Tabs defaultValue="india" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
                    <TabsTrigger value="india">India</TabsTrigger>
                    <TabsTrigger value="usa">USA</TabsTrigger>
                    <TabsTrigger value="uk">UK</TabsTrigger>
                </TabsList>
            </Tabs>
        </Card>
    );
}
