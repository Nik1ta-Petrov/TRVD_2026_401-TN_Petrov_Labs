import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    // 1. ЗМІНЮЙ ТУТ (Зараз стоїть rounded-lg для помітного закруглення)
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-neutral-900 text-white hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
                destructive: "bg-red-500 text-white hover:bg-red-500/90",
                outline:
                    "border border-white/20 bg-transparent text-white hover:bg-white/10",
                secondary:
                    "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
                ghost: "hover:bg-neutral-100 hover:text-neutral-900",
                link: "text-neutral-900 underline-offset-4 hover:underline",
                glass: "bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 text-white hover:bg-white/20 transition-all",
                logout: "bg-red-600 text-white hover:bg-red-700 shadow-md transition-all active:scale-95",
            },
            size: {
                // ПРИБРАВ ВІДСІЛЯ rounded-md, щоб воно не заважало
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";
