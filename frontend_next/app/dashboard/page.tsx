"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Wallet, Award, LogOut, Copy, Check, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getProfile, logout, isLoggedIn, UserProfile, getKeys, VPNKey } from "@/lib/api";

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
                        <div className="w-16 h-16 rounded-full bg-brand-teal/20 flex items-center justify-center overflow-hidden">
                            {profile?.avatar_url ? (
                                <Image src={profile.avatar_url} alt="Avatar" width={64} height={64} className="object-cover" />
                            ) : (
                                <User size={32} className="text-brand-teal" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-brand-cream">
                                Привет, {profile?.username}!
                            </h1>
                            <p className="text-brand-muted">
                                Личный кабинет
                            </p>
                        </div>
                        {profile?.is_admin && (
                            <Link
                                href="/admin"
                                className="bg-brand-red/20 hover:bg-brand-red/30 text-brand-red border border-brand-red/30 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                                АДМИН-ПАНЕЛЬ
                            </Link>
                        )}
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
                            {profile?.status === 'Active' ? 'Активен' : 'Неактивен'}
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

                {/* Referrals Section (Stub to match bot) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-brand-cream">Реферальная программа</h3>
                            <p className="text-brand-muted text-sm">Приглашай друзей и получай бонусы</p>
                        </div>
                    </div>

                    <div className="bg-brand-navy/30 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-brand-muted">Ваша ссылка:</span>
                        </div>
                        <div className="flex gap-2">
                            <code className="flex-1 bg-black/30 p-2 rounded text-brand-teal font-mono text-sm truncate">
                                https://t.me/tssvpnn_bot?start=ref_{profile?.id}
                            </code>
                            <button
                                onClick={() => navigator.clipboard.writeText(`https://t.me/tssvpnn_bot?start=ref_${profile?.id}`)}
                                className="bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal px-3 py-1 rounded transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 text-sm text-brand-muted">
                        <div>
                            <div className="font-bold text-white">20%</div>
                            <div>с первой оплаты</div>
                        </div>
                        <div>
                            <div className="font-bold text-white">3%</div>
                            <div>с последующих</div>
                        </div>
                    </div>
                </motion.div>

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

                    <KeysList />
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
                        href="https://t.me/tssvpn_support_bot"
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

function KeysList() {
    const [keys, setKeys] = useState<VPNKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch keys from API
        getKeys()
            .then(setKeys)
            .catch((err) => console.error("Failed to fetch keys", err))
            .finally(() => setLoading(false));
    }, []);

    const copyKey = (keyContent: string, id: string) => {
        navigator.clipboard.writeText(keyContent);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) return <div className="text-brand-muted text-center py-4">Загрузка ключей...</div>;

    if (keys.length === 0) {
        return (
            <div className="text-center py-12 text-brand-muted">
                <Key size={48} className="mx-auto mb-4 opacity-30" />
                <p>У вас пока нет ключей</p>
                <p className="text-sm">Приобретите подписку для получения доступа</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {keys.map((key) => (
                <div key={key.id} className="bg-brand-navy/50 border border-white/10 rounded-xl p-4 flex justify-between items-center group hover:border-brand-teal/30 transition-all">
                    <div className="overflow-hidden mr-4">
                        <div className="text-brand-cream font-medium flex items-center gap-2">
                            <span className={key.status === 'Active' ? 'text-green-400' : 'text-red-400'}>
                                ●
                            </span>
                            {key.name || 'VPN Ключ'}
                        </div>
                        <div className="text-brand-muted text-xs mt-1">
                            Истекает: {key.expires_at}
                        </div>
                        {/* Hidden key content for now, in real app we might show a button to reveal or copy directly */}
                    </div>
                    <button
                        onClick={() => copyKey(`vless://${key.id}@tssvpn.com:443?security=tls&encryption=none&type=ws&host=tssvpn.com&path=%2Fws%2F&sni=tssvpn.com#${encodeURIComponent(key.name)}`, key.id)}
                        className="flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-lg hover:bg-brand-teal hover:text-brand-navy transition-all shrink-0"
                    >
                        {copiedId === key.id ? <Check size={18} /> : <Copy size={18} />}
                        {copiedId === key.id ? 'Скопировано' : 'Копировать'}
                    </button>
                </div>
            ))}
        </div>
    );
}
