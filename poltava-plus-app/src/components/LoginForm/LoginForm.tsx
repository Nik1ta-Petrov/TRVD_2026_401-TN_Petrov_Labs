"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; 

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuth(); 

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await authService.login({ email, password });

            if (res.token) {

                login(res.token, { email: email });

            } else {
                setError(res.error || "Невірний логін або пароль");
            }
        } catch (err) {
            setError("Сталася помилка при з’єднанні з сервером");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Вхід</h1>
                <p className={styles.subtitle}>З поверненням у PoltavaPlus!</p>
                
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="example@mail.com"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Завантаження..." : "Увійти"}
                    </button>

                    {error && <p className={styles.error}>{error}</p>}
                </form>

                <div className={styles.footer}>
                    <span>Немає акаунта? </span>
                    <Link href="/register" className={styles.link}>
                        Зареєструватися
                    </Link>
                </div>
            </div>
        </div>
    );
}