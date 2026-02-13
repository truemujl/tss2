"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Settings, Activity, ShieldCheck, ArrowLeft, ExternalLink, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminStats, getSiteConfig, updateSiteConfig, AdminStats, SiteConfig, isLoggedIn, getProfile } from "@/lib/api";

export default function AdminPage() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isLoggedIn()) {
            router.push("/login");
            return;
        }

        // Verify admin status
        getProfile().then(p => {
            if (!p.is_admin) {
                router.push("/dashboard");
            }
        });

        Promise.all([getAdminStats(), getSiteConfig()])
            .then(([s, c]) => {
                setStats(s);
                setConfig(c);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [router]);

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;
        setSaving(true);
        try {
            await updateSiteConfig(config);
            setMessage("Настройки сохранены!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("Ошибка при сохранении");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-navy text-brand-teal animate-pulse">Загрузка управления...</div>;

    return (
        <main className="min-h-screen bg-brand-navy p-4 md:p-8">
            <div className="container mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/dashboard" className="text-brand-muted hover:text-brand-teal flex items-center gap-2 mb-2 transition-colors">
                            <ArrowLeft size={16} /> Вернуться в кабинет
                        </Link>
                        <h1 className="text-3xl font-black text-brand-cream uppercase tracking-tighter flex items-center gap-3">
                            <ShieldCheck className="text-brand-red" size={32} />
                            ШТАБ УПРАВЛЕНИЯ
                        </h1>
                    </div>
                    <a
                        href="/marzban-admin/"
                        target="_blank"
                        className="bg-brand-teal text-brand-navy px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue transition-all"
                    >
                        <ExternalLink size={20} /> MARZBAN PANEL
                    </a>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats */}
                    <div className="lg:col-span-1 space-y-4">
                        <section className="bg-brand-dark/40 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-brand-muted font-bold text-sm uppercase mb-4 flex items-center gap-2">
                                <Activity size={16} /> Статистика системы
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <div className="text-4xl font-black text-brand-teal">{stats?.total_users}</div>
                                    <div className="text-sm text-brand-muted">Всего курсантов</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-brand-blue">{stats?.active_subscriptions}</div>
                                    <div className="text-sm text-brand-muted">Активных допусков</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-green-400">{stats?.total_revenue} ₽</div>
                                    <div className="text-sm text-brand-muted">Общее довольствие</div>
                                </div>
                            </div>
                        </section>

                        <Link href="/admin/users" className="block bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/30 rounded-2xl p-6 transition-all group">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-brand-teal group-hover:text-brand-blue transition-colors">Личный состав</h3>
                                    <p className="text-sm text-brand-muted">Управление пользователями и балансом</p>
                                </div>
                                <Users size={32} className="text-brand-teal" />
                            </div>
                        </Link>
                    </div>

                    {/* Settings Form */}
                    <div className="lg:col-span-2">
                        <section className="bg-brand-dark/40 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-brand-muted font-bold text-sm uppercase mb-6 flex items-center gap-2">
                                <Settings size={16} /> Глобальные директивы
                            </h2>
                            <form onSubmit={handleSaveConfig} className="space-y-6">
                                <div>
                                    <label className="block text-brand-cream text-sm font-bold mb-2">Заголовок штаба (Сайта)</label>
                                    <input
                                        type="text"
                                        value={config?.site_title}
                                        onChange={e => setConfig(prev => prev ? { ...prev, site_title: e.target.value } : null)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-teal outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-brand-cream text-sm font-bold mb-2">Приветствие Бота</label>
                                    <textarea
                                        rows={4}
                                        value={config?.bot_welcome_message}
                                        onChange={e => setConfig(prev => prev ? { ...prev, bot_welcome_message: e.target.value } : null)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-teal outline-none transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-brand-cream text-sm font-bold mb-2">Объявление на главной (Site Announcement)</label>
                                    <input
                                        type="text"
                                        value={config?.site_announcement || ""}
                                        onChange={e => setConfig(prev => prev ? { ...prev, site_announcement: e.target.value } : null)}
                                        placeholder="Оставьте пустым для скрытия"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-teal outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-brand-cream text-sm font-bold mb-2">Канал связи (Поддержка)</label>
                                    <input
                                        type="text"
                                        value={config?.support_link}
                                        onChange={e => setConfig(prev => prev ? { ...prev, support_link: e.target.value } : null)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:border-brand-teal outline-none transition-all"
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-brand-teal text-brand-navy font-bold py-4 rounded-xl hover:bg-brand-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={20} />
                                        {saving ? "СОХРАНЕНИЕ..." : "ПРИМЕНИТЬ ДИРЕКТИВЫ"}
                                    </button>
                                </div>
                                {message && (
                                    <div className={`text-center font-bold text-sm ${message.includes("Ошибка") ? "text-brand-red" : "text-brand-teal"}`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
