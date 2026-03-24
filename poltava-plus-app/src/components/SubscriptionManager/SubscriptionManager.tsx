'use client';

import { useEffect, useState } from 'react';
import { SubscriptionService, SubscriptionDTO } from '@/services/SubscriptionService';
import styles from './SubscriptionManager.module.css';

export default function SubscriptionManager() {
    const [subs, setSubs] = useState<SubscriptionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        telegramId: '',
        groupNumber: 1,
        subscribeOutage: true,
        subscribeAlert: false,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await SubscriptionService.getAll();
            setSubs(data);
        } catch (err) {
            console.error("Помилка завантаження:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валідація перед відправкою
        const tid = formData.telegramId.trim();
        const gNum = Number(formData.groupNumber);

        if (!tid || isNaN(gNum)) {
            alert("Будь ласка, заповніть всі поля коректно!");
            return;
        }

        setIsSubmitting(true);
        try {
            // Формуємо чистий об'єкт для API
            const payload = {
                telegramId: tid,
                groupNumber: gNum,
                subscribeOutage: formData.subscribeOutage,
                subscribeAlert: formData.subscribeAlert,
            };

            await SubscriptionService.save(payload as any);
            
            // Очищення форми
            setFormData({
                telegramId: '',
                groupNumber: 1,
                subscribeOutage: true,
                subscribeAlert: false,
            });

            await loadData(); 
        } catch (err: any) {
            console.error("Деталі помилки:", err);
            const msg = err.response?.data?.error || "Помилка з'єднання з сервером";
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Ви впевнені, що хочете видалити цю підписку?")) {
            try {
                await SubscriptionService.delete(id);
                await loadData();
            } catch (err) {
            }
        }
    };

    if (loading) return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Завантаження бази даних...</p>
        </div>
    );

    return (
        <section className={styles.container}>
            <div className={styles.grid}>
                {/* Форма створення (Create/Update) */}
                <div className={styles.formCard}>
                    <h2 className={styles.title}>Керування підпискою</h2>
                    <form onSubmit={handleCreate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Telegram ID</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.telegramId}
                                onChange={(e) => setFormData({...formData, telegramId: e.target.value})}
                                placeholder="Введіть ваш ID"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Група відключень (1-6)</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="6" 
                                required 
                                // Захист від NaN: показуємо порожній рядок, якщо не число
                                value={isNaN(formData.groupNumber) ? '' : formData.groupNumber}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setFormData({...formData, groupNumber: isNaN(val) ? NaN : val});
                                }}
                            />
                        </div>
                        <div className={styles.checkboxes}>
                            <label className={styles.checkLabel}>
                                <input 
                                    type="checkbox" 
                                    checked={formData.subscribeOutage} 
                                    onChange={(e) => setFormData({...formData, subscribeOutage: e.target.checked})} 
                                /> Світло
                            </label>
                            <label className={styles.checkLabel}>
                                <input 
                                    type="checkbox" 
                                    checked={formData.subscribeAlert} 
                                    onChange={(e) => setFormData({...formData, subscribeAlert: e.target.checked})} 
                                /> Тривога
                            </label>
                        </div>
                        <button disabled={isSubmitting} className={styles.submitBtn}>
                            {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
                        </button>
                    </form>
                </div>

                {/* Список підписок (Read/Delete) */}
                <div className={styles.listSection}>
                    <h2 className={styles.title}>Ваші підписки ({subs.length})</h2>
                    {subs.length === 0 ? (
                        <div className={styles.emptyState}>Список порожній. Додайте перший запис зліва!</div>
                    ) : (
                        <div className={styles.list}>
                            {subs.map((sub) => (
                                <div key={sub.id} className={styles.subCard}>
                                    <div className={styles.subInfo}>
                                        <span className={styles.subId}>ID: {sub.telegramId}</span>
                                        <span className={styles.subDetails}>
                                            Група: {sub.groupNumber} | {sub.subscribeOutage ? '💡 Світло ' : ''}{sub.subscribeAlert ? '📢 Тривога' : ''}
                                        </span>
                                    </div>
                                    <button onClick={() => handleDelete(sub.id!)} className={styles.deleteBtn}>
                                        <i className="bi bi-trash"></i> Видалити
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