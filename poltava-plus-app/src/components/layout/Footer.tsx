"use client";

import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Facebook, Instagram, Send, MapPin, Building } from 'lucide-react';

interface FooterLink {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
    label: string;
    links: FooterLink[];
}

const footerLinks: FooterSection[] = [
    {
        label: 'Навігація',
        links: [
            { title: 'Головна', href: '/' },
            { title: 'Новини', href: '/news' },
            { title: 'Відключення', href: '/outages' },
            { title: 'Погода', href: '/weather' },
        ],
    },
    {
        label: 'Інформація',
        links: [
            { title: 'Про проєкт', href: '/about' },
            { title: 'Мапа укриттів', href: '/shelters' },
            { title: 'Контакти', href: '/contact' },
            { title: 'Політика конфіденційності', href: '/privacy' },
        ],
    },
    {
        label: 'Соцмережі',
        links: [
            { title: 'Telegram', href: '#', icon: Send },
            { title: 'Instagram', href: '#', icon: Instagram },
            { title: 'Facebook', href: '#', icon: Facebook },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="relative w-full flex flex-col items-center justify-center border-t border-neutral-200 dark:border-neutral-800 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.black/5%),transparent)] dark:bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)] px-6 py-12 lg:py-16 mt-20">
            <div className="bg-neutral-900/20 dark:bg-white/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm" />

            <div className="grid w-full max-w-7xl gap-8 xl:grid-cols-3 xl:gap-8 mx-auto">
                <AnimatedContainer className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Building className="size-8 text-neutral-900 dark:text-white" />
                        <span className="text-xl font-bold">Poltava Plus</span>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-4 text-sm max-w-xs">
                        Муніципальний агрегатор даних для зручного життя в місті. Усі міські сервіси в одному місці.
                    </p>
                    <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-8">
                        © {new Date().getFullYear()} Poltava Plus. Всі права захищені.
                    </p>
                </AnimatedContainer>
                
                <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
                    {footerLinks.map((section, index) => (
                        <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                            <div className="mb-10 md:mb-0">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wider uppercase">
                                    {section.label}
                                </h3>
                                <ul className="text-neutral-500 dark:text-neutral-400 mt-4 space-y-3 text-sm">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <a
                                                href={link.href}
                                                className="hover:text-neutral-900 dark:hover:text-white inline-flex items-center transition-all duration-300"
                                            >
                                                {link.icon && <link.icon className="mr-2 size-4" />}
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedContainer>
                    ))}
                </div>
            </div>
        </footer>
    );
}

type ViewAnimationProps = {
    delay?: number;
    className?: ComponentProps<typeof motion.div>['className'];
    children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: 10, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}