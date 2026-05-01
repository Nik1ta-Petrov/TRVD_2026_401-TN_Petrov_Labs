"use client";
import { useEffect, useState } from "react";
import styles from "./WeatherCard.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { WaveLoader } from "@/components/ui/wave-loader";

// func get icon
function getWeatherIcon(id: number | null, iconStr: string = "d") {
    if (id === null) return "bi-cloud";
    const isDay = iconStr.includes("d");

    if (id === 800)
        return isDay ? "bi-brightness-high-fill" : "bi-moon-stars-fill";
    if (id === 801 || id === 802)
        return isDay ? "bi-cloud-sun-fill" : "bi-cloud-moon-fill";
    if (id === 803 || id === 804) return "bi-clouds-fill";
    if (id >= 700 && id < 800) return "bi-cloud-haze-fill";
    if (id >= 500 && id < 600) return "bi-cloud-rain-heavy-fill";
    if (id >= 300 && id < 400) return "bi-cloud-drizzle-fill";
    if (id >= 600 && id < 700) return "bi-cloud-snow-fill";
    if (id >= 200 && id < 300) return "bi-cloud-lightning-rain-fill";

    return "bi-cloud-fill";
}

// formating date
const formatDay = (dt: number) => {
    const date = new Date(dt * 1000);
    return {
        weekday: date.toLocaleDateString("uk-UA", { weekday: "short" }),
        day: date.getDate(),
        month: date.toLocaleDateString("uk-UA", { month: "short" }),
    };
};

export default function WeatherCard() {
    const [forecast, setForecast] = useState<any>(null);
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    // block scroll when loading
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

    // 4. Запит даних
    useEffect(() => {
        fetch("/api/weather")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error && data.list) {
                    const groupedByDay = data.list.reduce(
                        (acc: any, item: any) => {
                            const date = new Date(item.dt * 1000)
                                .toISOString()
                                .split("T")[0];
                            if (!acc[date]) acc[date] = [];
                            acc[date].push(item);
                            return acc;
                        },
                        {},
                    );
                    const finalForecast = Object.values(groupedByDay);
                    setForecast(finalForecast);
                }
            })
            .catch((err) => console.error("Помилка завантаження погоди:", err))
            .finally(() => {
                // leatency
                setTimeout(() => setLoading(false), 500);
            });
    }, []);

    // WaveLoader
    if (loading || !forecast) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-neutral-950 gap-6">
                <WaveLoader
                    bars={6}
                    message="Метеостанція PoltavaPlus оновлює дані..."
                    className="bg-white"
                />
            </div>
        );
    }

    const currentDay = forecast[selectedDayIdx];

    return (
        <div className={styles.wrapper}>
            <div className={styles.daySelector}>
                {forecast.map((day: any, idx: number) => {
                    const { weekday, day: d, month } = formatDay(day[0].dt);
                    const maxTemp = Math.round(
                        Math.max(...day.map((h: any) => h.main.temp_max)),
                    );
                    const minTemp = Math.round(
                        Math.min(...day.map((h: any) => h.main.temp_min)),
                    );
                    const iconCode = day[0].weather[0].id;
                    const iconType = day[0].weather[0].icon;

                    return (
                        <div
                            key={idx}
                            className={`${styles.dayCard} ${selectedDayIdx === idx ? styles.activeDay : ""}`}
                            onClick={() => setSelectedDayIdx(idx)}
                        >
                            <span className={styles.dayWeek}>{weekday}</span>
                            <span className={styles.dayDate}>
                                {d} {month}
                            </span>
                            <div className={styles.iconBox}>
                                <i
                                    className={`bi ${getWeatherIcon(iconCode, iconType)} ${styles.weatherIcon}`}
                                ></i>
                            </div>
                            <div className={styles.dayTemps}>
                                <span className={styles.max}>{maxTemp}°</span>
                                <span className={styles.min}>{minTemp}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* weaher table date */}
            <div className={styles.detailContainer}>
                <table className={styles.weatherTable}>
                    <thead>
                        <tr>
                            <th>Час</th>
                            <th>Погода</th>
                            <th>Темп.</th>
                            <th>Відчувається</th>
                            <th>Вітер</th>
                            <th>Вологість</th>
                            <th>Тиск</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDay.map((hour: any, i: number) => (
                            <tr key={i}>
                                <td className={styles.timeCell}>
                                    {new Date(hour.dt * 1000).getHours()}:00
                                </td>
                                <td>
                                    <div className={styles.tableIcon}>
                                        <i
                                            className={`bi ${getWeatherIcon(hour.weather[0].id, hour.weather[0].icon)} ${styles.weatherIconTable}`}
                                        ></i>
                                    </div>
                                </td>
                                <td className={styles.tempCell}>
                                    {Math.round(hour.main.temp)}°
                                </td>
                                <td className={styles.feelsCell}>
                                    {Math.round(hour.main.feels_like)}°
                                </td>
                                <td>{Math.round(hour.wind.speed)} м/с</td>
                                <td>
                                    <span className={styles.iconLabel}>
                                        <i className="bi bi-droplet-fill"></i>
                                    </span>
                                    {hour.main.humidity}%
                                </td>
                                <td>
                                    {Math.round(hour.main.pressure * 0.75)} мм
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
