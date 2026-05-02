"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RefreshCw, Clock, ShieldCheck } from "lucide-react";
import { WaveLoader } from "@/components/ui/wave-loader";

export default function LightStatus() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const checkStatus = () => {
        setLoading(true);
        fetch("/api/light-status")
            .then((res) => res.json())
            .then((res) => setData(res))
            .catch((err) => console.error("Помилка:", err))
            .finally(() => {
                // Невелика затримка для красивої анімації
                setTimeout(() => setLoading(false), 800);
            });
    };

    useEffect(() => {
        checkStatus();
    }, []);

    // Блокуємо скрол на рівні body, поки крутиться лоадер
    useEffect(() => {
        if (loading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [loading]);

    const isSafe = data?.isSafe;

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                /* СТАН ЗАВАНТАЖЕННЯ */
                <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-[70vh] flex items-center justify-center overflow-hidden"
                >
                    <WaveLoader
                        bars={6}
                        message="Аналізуємо енергомережі..."
                        className="bg-white"
                    />
                </motion.div>
            ) : (
                /* СТАН ГОТОВНОСТІ */
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center w-full mt-10"
                >
                    {/* Основна картка */}
                    <div className="w-full bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-10 md:p-14 flex flex-col items-center text-center">
                            {/* Велика іконка статусу */}
                            <div
                                className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl transition-colors duration-1000 ${
                                    isSafe
                                        ? "bg-green-500 shadow-green-500/40"
                                        : "bg-orange-500 shadow-orange-500/40"
                                }`}
                            >
                                <Zap
                                    className={`w-12 h-12 text-white ${isSafe ? "animate-pulse" : ""}`}
                                />
                            </div>

                            {/* Статус текст */}
                            <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
                                {isSafe ? "Світло є" : "Обмеження"}
                            </h2>

                            <p className="text-white/60 text-lg md:text-xl max-w-sm font-light leading-relaxed">
                                {data?.statusText}
                            </p>

                            {/* Внутрішній футер картки */}
                            <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-2 text-white/20">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-semibold">
                                        Офіційне джерело: poe.pl.ua
                                    </span>
                                </div>

                                <button
                                    onClick={checkStatus}
                                    className="flex items-center gap-2 group cursor-pointer"
                                >
                                    <RefreshCw className="w-4 h-4 text-white/20 group-hover:rotate-180 transition-transform duration-700" />
                                    <span className="text-white/20 text-[10px] uppercase tracking-widest group-hover:text-white/50">
                                        Оновлено: {data?.lastUpdate}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Системні підписи ПІД карткою */}
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <p className="text-gray-500 text-center text-[10px] tracking-[0.3em] uppercase opacity-30 pointer-events-none">
                            Дані моніторяться в реальному часі з сайту
                            Полтаваобленерго
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
