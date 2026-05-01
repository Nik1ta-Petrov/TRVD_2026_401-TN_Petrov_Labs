"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowUpRight, Newspaper } from "lucide-react";
import { ProgressiveBlur } from "./progressive-blur";

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    imageUrl: string;
}

export function NewsSection({ limit = 6 }: { limit?: number }) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Додаємо параметр limit у запит до твого API
                const response = await fetch(`/api/news?limit=${limit}`);
                const data = await response.json();
                if (!data.error) setNews(data);
            } catch (error) {
                console.error("Помилка:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [limit]); // Додаємо limit у масив залежностей

    if (loading) {
        return (
            <div className="w-full flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white"></div>
            </div>
        );
    }

    return (
        <section className="relative w-full max-w-7xl mx-auto px-6 py-20">
            <div className="flex items-center gap-3 mb-10">
                <Newspaper className="w-8 h-8 text-neutral-800 dark:text-neutral-200" />
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Останні новини
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                    <motion.a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{
                            once: true,
                            margin: "-50px",
                        }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="group relative h-[400px] w-full overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 will-change-transform"
                    >
                        <img
                            src={item.imageUrl}
                            alt="News background"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <ProgressiveBlur
                            className="pointer-events-none absolute bottom-0 left-0 h-[60%] w-full"
                            blurIntensity={8}
                            blurLayers={3}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end">
                            <div className="flex items-center gap-2 text-xs font-medium text-white/80 mb-3">
                                <Calendar className="w-4 h-4" />
                                <span>{item.pubDate}</span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-4 line-clamp-3 group-hover:text-gray-200 transition-colors">
                                {item.title
                                    .replace(
                                        " - Інтернет-видання «Полтавщина",
                                        "",
                                    )
                                    .replace(" - Суспільне | Новини", "")}
                            </h3>

                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                                    {item.source}
                                </span>
                                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-orange-600 transition-colors">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <motion.a
                    href="/news"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 font-semibold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                    Переглянути всі новини
                </motion.a>
            </div>
        </section>
    );
}
