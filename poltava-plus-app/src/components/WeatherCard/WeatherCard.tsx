"use client";
import { useEffect, useState } from "react";
import styles from "./WeatherCard.module.css";
// ВАЖЛИВО: Імпортуйте CSS шрифту Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// 1. Функція для вибору іконок Bootstrap за кодами OpenWeather
function getWeatherIcon(id: number | null, iconStr: string = "d") {
    if (id === null) return "bi-cloud";
    const isDay = iconStr.includes('d');

    // Мапінг кодів OpenWeather до іконок Bootstrap
    if (id === 800) return isDay ? "bi-brightness-high-fill" : "bi-moon-stars-fill"; // Чисто
    if (id === 801 || id === 802) return isDay ? "bi-cloud-sun-fill" : "bi-cloud-moon-fill"; // Малохмарно
    if (id === 803 || id === 804) return "bi-clouds-fill"; // Хмарно
    if (id >= 700 && id < 800) return "bi-cloud-haze-fill"; // Туман/Смог
    if (id >= 500 && id < 600) return "bi-cloud-rain-heavy-fill"; // Дощ
    if (id >= 300 && id < 400) return "bi-cloud-drizzle-fill"; // Мряка
    if (id >= 600 && id < 700) return "bi-cloud-snow-fill"; // Сніг
    if (id >= 200 && id < 300) return "bi-cloud-lightning-rain-fill"; // Гроза
    
    return "bi-cloud-fill";
}

// Допоміжна функція для форматування дати
const formatDay = (dt: number) => {
    const date = new Date(dt * 1000);
    return {
        weekday: date.toLocaleDateString('uk-UA', { weekday: 'short' }),
        day: date.getDate(),
        month: date.toLocaleDateString('uk-UA', { month: 'short' })
    };
};

export default function WeatherCard() {
    const [forecast, setForecast] = useState<any>(null);
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);

    useEffect(() => {
        fetch('/api/weather')
            .then(res => res.json())
            .then(data => {
                if (!data.error && data.list) {
                    // ГРУПУВАННЯ ЗА КАЛЕНДАРНИМИ ДНЯМИ
                    const groupedByDay = data.list.reduce((acc: any, item: any) => {
                        // Отримуємо дату у форматі YYYY-MM-DD
                        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
                        if (!acc[date]) acc[date] = [];
                        acc[date].push(item);
                        return acc;
                    }, {});
                    const finalForecast = Object.values(groupedByDay);
                    setForecast(finalForecast);
                }
            })
            .catch(err => console.error("Помилка завантаження погоди:", err));
    }, []);

    if (!forecast) return <div className={styles.loading}>Метеостанція готує дані...</div>;

    const currentDay = forecast[selectedDayIdx];

    return (
        <div className={styles.wrapper}>
            {/* ПАНЕЛЬ ВИБОРУ ДНЯ */}
            <div className={styles.daySelector}>
                {forecast.map((day: any, idx: number) => {
                    const { weekday, day: d, month } = formatDay(day[0].dt);
                    const maxTemp = Math.round(Math.max(...day.map((h: any) => h.main.temp_max)));
                    const minTemp = Math.round(Math.min(...day.map((h: any) => h.main.temp_min)));
                    const iconCode = day[0].weather[0].id;
                    const iconType = day[0].weather[0].icon;

                    return (
                        <div key={idx} className={`${styles.dayCard} ${selectedDayIdx === idx ? styles.activeDay : ''}`} onClick={() => setSelectedDayIdx(idx)}>
                            <span className={styles.dayWeek}>{weekday}</span>
                            <span className={styles.dayDate}>{d} {month}</span>
                            <div className={styles.iconBox}>
                                {/* Використовуємо Bootstrap іконку (i className=...) */}
                                <i className={`bi ${getWeatherIcon(iconCode, iconType)} ${styles.weatherIcon}`}></i>
                            </div>
                            <div className={styles.dayTemps}>
                                <span className={styles.max}>{maxTemp}°</span>
                                <span className={styles.min}>{minTemp}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ТАБЛИЦЯ ПОГОДИ (ПО ГОДИНАХ) */}
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
                                <td className={styles.timeCell}>{new Date(hour.dt * 1000).getHours()}:00</td>
                                <td>
                                    <div className={styles.tableIcon}>
                                        <i className={`bi ${getWeatherIcon(hour.weather[0].id, hour.weather[0].icon)} ${styles.weatherIconTable}`}></i>
                                    </div>
                                </td>
                                <td className={styles.tempCell}>{Math.round(hour.main.temp)}°</td>
                                <td className={styles.feelsCell}>{Math.round(hour.main.feels_like)}°</td>
                                <td><span className={styles.iconLabel}></span> {Math.round(hour.wind.speed)} м/с</td>
                                <td><span className={styles.iconLabel}><i className="bi bi-droplet-fill"></i></span> {hour.main.humidity}%</td>
                                <td><span className={styles.iconLabel}></span> {Math.round(hour.main.pressure * 0.75)} мм</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}