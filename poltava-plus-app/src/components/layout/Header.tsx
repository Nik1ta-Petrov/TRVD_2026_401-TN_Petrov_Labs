"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

function getWeatherIcon(code: number | null, isDay: number | null) {
    if (code === null) return "bi-cloud"; 

    if (code === 0) return isDay ? "bi-brightness-high-fill" : "bi bi-moon-fill";
    // 1, 2: Переважно ясно, мінлива хмарність
    if (code === 1 || code === 2) return isDay ? "bi-cloud-sun-fill" : "bi-cloud-moon-fill";
    // 3: Суцільна хмарність
    if (code === 3) return "bi-clouds-fill";
    // 45, 48: Туман
    if (code === 45 || code === 48) return "bi-cloud-haze-fill";
    // 51-67: Мряка, Дощ
    if (code >= 51 && code <= 67) return "bi-cloud-rain-fill";
    // 71-86: Сніг, хуртовина
    if (code >= 71 && code <= 86) return "bi-cloud-snow-fill";
    // 95-99: Гроза, град
    if (code >= 95) return "bi-cloud-lightning-rain-fill";

    return "bi-cloud-fill"; 
}

export default function Header() {
    const pathname = usePathname();

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
                        if ("alertnow" in stateData) {
                            setIsAlert(stateData.alertnow);
                        } else if ("enabled" in stateData) {
                            setIsAlert(stateData.enabled);
                        } else {
                            setIsAlert(true);
                        }
                    } else if (typeof stateData === "boolean") {
                        setIsAlert(stateData);
                    } else {
                        setIsAlert(true);
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
        { name: "Тривога", path: "/alert" },
        { name: "Погода", path: "/weather" },
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
              PoltavaPlus  {/*  <i className="bi bi-geo-alt-fill"></i> */}
            </Link>

            <nav className={styles.nav}>
                {navLinks.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
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
                        <span>Оновлення...</span>
                    ) : isAlert ? (
                        <>
                            <span
                                className={styles.alertDot}
                                style={{
                                    backgroundColor: "#ef4444",
                                    boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)",
                                }}
                            ></span>
                            <span style={{ color: "#ef4444" }}>Тривога!</span>
                        </>
                    ) : (
                        <>
                            <span className={styles.alertDot}></span>
                            <span>Немає тривоги</span>
                        </>
                    )}
                </div>

                <button className={styles.subscribeBtn}>
                    <i className="bi bi-telegram"></i>
                    <span>Підписатися</span>
                </button>
            </div>
        </header>
    );
}