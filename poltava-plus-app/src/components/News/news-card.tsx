"use client";
import { motion } from "framer-motion";
import { Calendar, ArrowUpRight } from "lucide-react";
import { ProgressiveBlur } from "../NewsSection/progressive-blur";

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    imageUrl: string;
}

export function NewsCard({ item }: { item: NewsItem }) {
    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-[400px] w-full overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 block"
        >
            <img
                src={item.imageUrl}
                alt="News"
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
                        .replace(" - Інтернет-видання «Полтавщина", "")
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
        </a>
    );
}
