"use client";

import { cva } from "class-variance-authority";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const waveLoaderVariants = cva("flex gap-2 items-center justify-center", {
    variants: {
        messagePlacement: {
            bottom: "flex-col",
            right: "flex-row",
            left: "flex-row-reverse",
        },
    },
    defaultVariants: {
        messagePlacement: "bottom",
    },
});

export interface WaveLoaderProps {
    /** Кількість смужок. @default 5 */
    bars?: number;
    /** Повідомлення поруч із лоадером. */
    message?: string;
    /** Позиція повідомлення. @default bottom */
    messagePlacement?: "bottom" | "left" | "right";
}

export function WaveLoader({
    bars = 5,
    message,
    messagePlacement,
    className,
    ...props
}: HTMLMotionProps<"div"> & WaveLoaderProps) {
    return (
        <div className={cn(waveLoaderVariants({ messagePlacement }))}>
            {/* 
               ФІКС: items-end та h-10 для стабільної бази анімації 
               gap-1.5 для кращої візуальної відстані
            */}
            <div className={cn("flex gap-1.5 items-end justify-center h-10")}>
                {Array(bars)
                    .fill(undefined)
                    .map((_, index) => (
                        <motion.div
                            key={index}
                            className={cn(
                                // ФІКС: will-change-transform прибирає артефакти на краях
                                "w-1.5 h-5 bg-primary origin-bottom rounded-full will-change-transform",
                                className,
                            )}
                            animate={{
                                // Трохи збільшили амплітуду для плавності
                                scaleY: [1, 2.2, 1],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: index * 0.1,
                                ease: "easeInOut",
                            }}
                            {...props}
                        />
                    ))}
            </div>
            {message && (
                <div className="text-sm font-medium text-muted-foreground mt-2">
                    {message}
                </div>
            )}
        </div>
    );
}
