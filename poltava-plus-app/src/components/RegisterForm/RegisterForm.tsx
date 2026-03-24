"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await authService.register({
                email,
                username,
                password,
            });

            if (res.token) {
                login(res.token, {
                    email: email,
                    username: username,
                });

                router.push("/subscriptions");
            } else {
                setError(res.error || "Помилка реєстрації");
            }
        } catch (err) {
            setError("Сервер не відповідає");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Реєстрація</h1>
            <p className={styles.subtitle}>Створіть профіль у PoltavaPlus</p>

            <form onSubmit={handleRegister} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Нікнейм</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="yuki_044"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        className={styles.input}
                        placeholder="mail@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Пароль</label>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "Зачекайте..." : "Створити акаунт"}
                </button>

                {error && <p className={styles.error}>{error}</p>}
            </form>

            <div className={styles.footer}>
                Вже є акаунт?{" "}
                <Link href="/login" className={styles.link}>
                    Увійти
                </Link>
            </div>
        </div>
    );
}
