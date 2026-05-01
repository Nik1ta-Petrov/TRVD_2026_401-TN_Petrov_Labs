"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NewsCard } from "./news-card";
import { WaveLoader } from "@/components/ui/wave-loader";

export default function NewsFullList() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Запитуємо саме 20 новин через параметр
                const response = await fetch("/api/news?limit=21");
                const data = await response.json();
                if (!data.error) setNews(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Контейнер для каскадної анімації
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, // Кожна наступна новина через 0.08 сек
            },
        },
    };

    const itemAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
    };

    useEffect(() => {
        if (loading) {
            // Забороняємо скрол, коли вантажимо дані
            document.body.style.overflow = "hidden";
        } else {
            // Повертаємо скрол, коли завантаження завершено
            document.body.style.overflow = "unset";
        }

        // Це важливо: якщо користувач піде зі сторінки раніше, ніж воно довантажиться,
        // треба обов'язково повернути скрол назад
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [loading]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 gap-6">
                <WaveLoader
                    bars={6}
                    message="Отримуємо свіжі новини Полтави..."
                    className="bg-white"
                />
            </div>
        );
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-10">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {news.map((item, index) => (
                    <motion.div key={index} variants={itemAnim}>
                        <NewsCard item={item} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
