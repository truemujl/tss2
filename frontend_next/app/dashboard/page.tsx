"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Wallet, Award, LogOut, Copy, Check, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getProfile, logout, isLoggedIn, UserProfile } from "@/lib/api";

export default function DashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isLoggedIn()) {
            router.push("/login");
            return;
        }

        getProfile()
            .then(setProfile)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [router]);

    const copyKey = () => {
        navigator.clipboard.writeText("vless://demo-key-placeholder");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center gradient-hero">
                <div className="text-brand-teal font-bold text-xl animate-pulse">
                    Загрузка...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center gradient-hero">
                <div className="text-brand-red font-bold text-xl">
                    Ошибка: {error}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen gradient-hero">
            {/* Header */}
            <header className="border-b border-white/10 bg-brand-navy/50 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative h-10 w-10">
                            <Image
                                src="/logo-icon.png"
                                alt="TssVPN"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span
                            className="text-xl font-bold"
                            style={{
                                background: 'linear-gradient(180deg, #5DADE2 0%, #4ECDC4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            tssvpn
                        </span>
                    </Link>
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-2 text-brand-muted hover:text-brand-red transition-colors font-medium"
                    >
                        <LogOut size={18} />
                        Выйти
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-brand-teal/20 flex items-center justify-center">
                            <User size={32} className="text-brand-teal" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-cream">
                                Привет, {profile?.username}!
                            </h1>
                            <p className="text-brand-muted">
                                Личный кабинет
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Award className="text-brand-teal" size={24} />
                            <span className="text-brand-muted font-medium">Статус</span>
                        </div>
                        <div className="text-2xl font-bold text-brand-cream">
                            {profile?.status === 'active' ? 'Активен' : 'Неактивен'}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Wallet className="text-brand-teal" size={24} />
                            <span className="text-brand-muted font-medium">Баланс</span>
                        </div>
                        <div className="text-2xl font-bold text-brand-cream">
                            {profile?.balance || 0} ₽
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Key className="text-brand-teal" size={24} />
                            <span className="text-brand-muted font-medium">Ключи</span>
                        </div>
                        <div className="text-2xl font-bold text-brand-cream">
                            {profile?.keys_count || 0}
                        </div>
                    </motion.div>
                </div>

                {/* Keys Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-brand-cream">Мои ключи</h2>
                        <Link
                            href="/#pricing"
                            className="flex items-center gap-2 bg-brand-teal text-brand-navy px-4 py-2 rounded-lg font-medium hover:bg-brand-blue transition-all"
                        >
                            <Plus size={18} />
                            Купить ключ
                        </Link>
                    </div>

                    {(profile?.keys_count || 0) > 0 ? (
                        <div className="space-y-3">
                            {/* Demo key */}
                            <div className="bg-brand-navy/50 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <div className="text-brand-cream font-medium flex items-center gap-2">
                                        <span>🇫🇮</span>
                                        Ключ #1 (Финляндия)
                                    </div>
                                    <div className="text-brand-muted text-sm font-mono">vless://demo...placeholder</div>
                                </div>
                                <button
                                    onClick={copyKey}
                                    className="flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-lg hover:bg-brand-teal hover:text-brand-navy transition-all"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'Скопировано' : 'Копировать'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-brand-muted">
                            <Key size={48} className="mx-auto mb-4 opacity-30" />
                            <p>У вас пока нет ключей</p>
                            <p className="text-sm">Приобретите подписку для получения доступа</p>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/#install"
                        className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-brand-teal/50 transition-all group"
                    >
                        <h3 className="text-lg font-bold text-brand-cream mb-2 group-hover:text-brand-teal transition-colors">
                            Инструкции
                        </h3>
                        <p className="text-brand-muted text-sm">
                            Как подключиться к VPN на любом устройстве
                        </p>
                    </Link>

                    <a
                        href="https://t.me/tssvpn_support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-brand-teal/50 transition-all group"
                    >
                        <h3 className="text-lg font-bold text-brand-cream mb-2 group-hover:text-brand-teal transition-colors">
                            Поддержка
                        </h3>
                        <p className="text-brand-muted text-sm">
                            Написать в Telegram для получения помощи
                        </p>
                    </a>
                </div>
            </div>
        </main>
    );
}
