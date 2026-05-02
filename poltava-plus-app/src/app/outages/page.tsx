"use client";

import LightStatus from "@/components/LightStatus/light-status";

export default function LightStatusPage() {
    return (
        <main className="min-h-screen w-full flex flex-col items-center bg-white dark:bg-neutral-950 pt-10 pb-10">
            <div className="w-full max-w-4xl px-4">
                <LightStatus />
            </div>
        </main>
    );
}
