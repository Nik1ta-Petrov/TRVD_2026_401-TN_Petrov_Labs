"use client";

import { useEffect, useState } from "react";
import { SubscriptionDTO } from "@/services/SubscriptionService";
import { useAuth } from "@/context/AuthContext";
import styles from "./SubscriptionManager.module.css";

export default function SubscriptionManager() {
    const { user } = useAuth();
    const [subs, setSubs] = useState<SubscriptionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        telegramId: "",
        groupNumber: 1,
        subscribeOutage: true,
        subscribeAlert: false,
    });

    const getAuthHeader = () => {
        const token = localStorage.getItem("auth_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        if (user?.email) {
            loadData();
        }
    }, [user?.email]);

    // 1. Завантаження підписок (Без логів)
    const loadData = async () => {
        if (!user?.email) return;

        const token = localStorage.getItem("auth_token");
        setLoading(true);
        
        try {
            const res = await fetch(`/api/subscriptions?email=${user.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setSubs(Array.isArray(data) ? data : []);
            } else {
                setSubs([]);
            }
        } catch (err) {
            setSubs([]);
        } finally {
            setLoading(false);
        }
    };

    // 2. Створення підписки
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email) {
            alert("Ви повинні бути авторизовані!");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = { ...formData, userEmail: user.email };

            const res = await fetch("/api/subscriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setFormData({
                    telegramId: "",
                    groupNumber: 1,
                    subscribeOutage: true,
                    subscribeAlert: false,
                });
                await loadData();
            } else {
                const errorData = await res.json();
                alert(`Помилка: ${errorData.error || "Не вдалося зберегти"}`);
            }
        } catch (err) {
            alert("Помилка з'єднання");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Видалення підписки
    const handleDelete = async (id: string) => {
        if (!window.confirm("Видалити цю підписку?")) return;

        const oldSubs = [...subs];
        setSubs(subs.filter((s) => s.id !== id));

        try {
            const res = await fetch(`/api/subscriptions?id=${id}`, {
                method: "DELETE",
                headers: {
                    ...getAuthHeader(),
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Не вдалося видалити");
            }
        } catch (err: any) {
            setSubs(oldSubs);
            alert(`Помилка: ${err.message}`);
        }
    };

    if (loading)
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
            </div>
        );

    return (
        <section className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.formCard}>
                    <h2 className={styles.title}>Керування сповіщеннями</h2>
                    <form onSubmit={handleCreate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Telegram ID</label>
                            <input
                                type="text"
                                required
                                value={formData.telegramId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        telegramId: e.target.value,
                                    })
                                }
                                placeholder="Напр: 12345678"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Група (1-6)</label>
                            <input
                                type="number"
                                min="1"
                                max="6"
                                required
                                value={formData.groupNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        groupNumber:
                                            parseInt(e.target.value) || 1,
                                    })
                                }
                            />
                        </div>
                        <div className={styles.checkboxes}>
                            <label className={styles.checkLabel}>
                                <input
                                    type="checkbox"
                                    checked={formData.subscribeOutage}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subscribeOutage: e.target.checked,
                                        })
                                    }
                                />{" "}
                                Сповіщення про світло
                            </label>
                            <label className={styles.checkLabel}>
                                <input
                                    type="checkbox"
                                    checked={formData.subscribeAlert}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subscribeAlert: e.target.checked,
                                        })
                                    }
                                />{" "}
                                Повітряна тривога
                            </label>
                        </div>
                        <button
                            disabled={isSubmitting}
                            className={styles.submitBtn}
                        >
                            {isSubmitting ? "Збереження..." : "Додати підписку"}
                        </button>
                    </form>
                </div>

                <div className={styles.listSection}>
                    <h2 className={styles.title}>
                        Ваші підписки ({subs.length})
                    </h2>
                    {subs.length === 0 ? (
                        <div className={styles.emptyState}>
                            У вас поки немає підписок. Створіть першу зліва!
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {subs.map((sub) => (
                                <div key={sub.id} className={styles.subCard}>
                                    <div className={styles.subInfo}>
                                        <span className={styles.subId}>
                                            Telegram: {sub.telegramId}
                                        </span>
                                        <span className={styles.subDetails}>
                                            Група: {sub.groupNumber} |{" "}
                                            {sub.subscribeOutage ? "💡 Світло" : ""}
                                            {sub.subscribeAlert ? " 📢 Тривога" : ""}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(sub.id!)}
                                        className={styles.deleteBtn}
                                    >
                                        Видалити
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}