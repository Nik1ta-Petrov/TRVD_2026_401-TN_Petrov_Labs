"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { useAuth } from "@/context/AuthContext";

// ТЕПЕР ІМПОРТУЄМО ПРАВИЛЬНО (з тієї ж папки layout)
import { Button } from "./button";

function getWeatherIcon(code: number | null, isDay: number | null) {
    if (code === null) return "bi-cloud";
    if (code === 0)
        return isDay ? "bi-brightness-high-fill" : "bi bi-moon-fill";
    if (code === 1 || code === 2)
        return isDay ? "bi-cloud-sun-fill" : "bi-cloud-moon-fill";
    if (code === 3) return "bi-clouds-fill";
    if (code === 45 || code === 48) return "bi-cloud-haze-fill";
    if (code >= 51 && code <= 67) return "bi-cloud-rain-fill";
    if (code >= 71 && code <= 86) return "bi-cloud-snow-fill";
    if (code >= 95) return "bi-cloud-lightning-rain-fill";
    return "bi-cloud-fill";
}

export default function Header() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const [temperature, setTemperature] = useState<number | null>(null);
    const [weatherCode, setWeatherCode] = useState<number | null>(null);
    const [isDay, setIsDay] = useState<number | null>(null);
    const [isAlert, setIsAlert] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=49.5896&longitude=34.551&current_weather=true",
                    { cache: "no-store" },
                );
                const data = await response.json();
                setTemperature(Math.round(data.current_weather.temperature));
                setWeatherCode(data.current_weather.weathercode);
                setIsDay(data.current_weather.is_day);
            } catch (error) {
                console.error("Помилка завантаження погоди:", error);
            }
        };

        const fetchAlert = async () => {
            try {
                const response = await fetch("/api/alert", {
                    cache: "no-store",
                });
                const data = await response.json();
                if (data.error) return;

                const targetObj = data.states ? data.states : data;
                const poltavaKey = Object.keys(targetObj).find((key) =>
                    key.toLowerCase().includes("полтав"),
                );

                if (poltavaKey) {
                    const stateData = targetObj[poltavaKey];
                    if (typeof stateData === "object" && stateData !== null) {
                        setIsAlert(
                            stateData.alertnow === true ||
                                stateData.enabled === true,
                        );
                    } else {
                        setIsAlert(!!stateData);
                    }
                } else {
                    setIsAlert(false);
                }
            } catch (error) {
                console.error("Помилка завантаження тривоги:", error);
            }
        };

        fetchWeather();
        fetchAlert();
        const alertInterval = setInterval(fetchAlert, 60000);
        const weatherInterval = setInterval(fetchWeather, 900000);
        return () => {
            clearInterval(alertInterval);
            clearInterval(weatherInterval);
        };
    }, []);

    const navLinks = [
        { name: "Головна", path: "/" },
        { name: "Новини", path: "/news" },
        { name: "Відключення", path: "/outages" },
        { name: "Погода", path: "/weather" },
        ...(user ? [{ name: "Мій кабінет", path: "/subscriptions" }] : []),
    ];

    const displayTemp =
        temperature !== null
            ? temperature > 0
                ? `+${temperature}°C`
                : `${temperature}°C`
            : "...";
    const weatherIconClass = getWeatherIcon(weatherCode, isDay);

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                PoltavaPlus
            </Link>

            <nav className={styles.nav}>
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        href={link.path}
                        className={`${styles.navLink} ${pathname === link.path ? styles.activeLink : ""}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            <div className={styles.rightSection}>
                <div className={styles.infoPill}>
                    <i
                        className={`bi ${weatherIconClass}`}
                        style={{ color: "#e5e5e5", fontSize: "19px" }}
                    ></i>
                    <span>{displayTemp}</span>
                </div>

                <div className={styles.infoPill}>
                    {isAlert === null ? (
                        <span>...</span>
                    ) : isAlert ? (
                        <span style={{ color: "#ef4444" }}>
                            <span
                                className={styles.alertDot}
                                style={{
                                    backgroundColor: "#ef4444",
                                    display: "inline-block",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    marginRight: "6px",
                                    boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)",
                                }}
                            ></span>
                            Тривога!
                        </span>
                    ) : (
                        <span>
                            <span
                                className={styles.alertDot}
                                style={{
                                    backgroundColor: "#10b981",
                                    display: "inline-block",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    marginRight: "6px",
                                }}
                            ></span>
                            Немає тривоги
                        </span>
                    )}
                </div>

                <div className={styles.authBlock}>
                    {user ? (
                        <div className={styles.userSection}>
                            <span className={styles.userEmail}>
                                {user.email}
                            </span>
                            <Button
                                onClick={logout}
                                variant="logout" // ТЕПЕР ВОНА БУДЕ ПОВНІСТЮ ЧЕРВОНОЮ
                                size="sm"
                                className="rounded-xl" // Можна додати кастомний радіус прямо тут
                            >
                                Вихід
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button
                                asChild
                                variant="default"
                                size="sm"
                                className="rounded-full bg-white text-black hover:bg-neutral-200"
                            >
                                <Link href="/login">Увійти</Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
                            >
                                <Link href="/register">Реєстрація</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
