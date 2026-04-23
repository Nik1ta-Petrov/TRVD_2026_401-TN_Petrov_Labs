"use client";

import WeatherCard from "@/components/WeatherCard/WeatherCard";
import { WeatherBackground } from "@/components//WeatherCard/weather-background";

export default function WeatherPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden">
      <WeatherBackground />

      <div className="relative z-10 w-full max-w-[900px] px-4 py-10">
        <h1 className="text-white text-3xl md:text-5xl font-black text-center uppercase tracking-[0.2em] mb-12 drop-shadow-2xl">
          Погода у <span className="text-[#7877c6]">Полтаві</span>
        </h1>
        

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <WeatherCard />
        </div>
        
        <p className="text-gray-500 mt-10 text-center text-xs tracking-widest uppercase opacity-50">
          Дані оновлюються автоматично кожну годину
        </p>
      </div>
    </main>
  );
}