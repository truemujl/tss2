"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/api";
import NewTelegramAuth from "@/components/NewTelegramAuth";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Listen for messages from the auth popup window
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'TELEGRAM_AUTH_SUCCESS') {
                setToken(event.data.token);
                router.push('/dashboard');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(username, password);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка авторизации");
        } finally {
            setLoading(false);
        }
    };

    // We'll implement Telegram login with the widget script that loads dynamically

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20 gradient-hero">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <div className="relative h-12 w-12">
                                <Image
                                    src="/logo-icon.png"
                                    alt="TssVPN"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span
                                className="text-2xl font-bold"
                                style={{
                                    background: 'linear-gradient(180deg, #5DADE2 0%, #4ECDC4 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                tssvpn
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-brand-cream">
                            Вход в аккаунт
                        </h1>
                    </div>

                    {/* Telegram Login Button */}
                    <div id="telegram-login-container">
                        {typeof window !== 'undefined' && (
                            <NewTelegramAuth />
                        )}
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-brand-dark text-brand-muted">или</span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-brand-red/20 border border-brand-red/50 text-brand-red p-4 rounded-xl mb-6 flex items-center gap-3"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-brand-muted font-medium mb-2 text-sm">
                                Логин
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full bg-brand-navy/50 border border-white/10 text-brand-cream p-4 rounded-xl focus:border-brand-teal focus:outline-none transition-colors"
                                placeholder="Введите логин"
                            />
                        </div>

                        <div>
                            <label className="block text-brand-muted font-medium mb-2 text-sm">
                                Пароль
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-brand-navy/50 border border-white/10 text-brand-cream p-4 rounded-xl focus:border-brand-teal focus:outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-teal text-brand-navy font-bold py-4 rounded-xl hover:bg-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                "Проверка..."
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Войти
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-brand-muted">
                        Нет аккаунта?{" "}
                        <Link href="/register" className="text-brand-teal hover:underline font-medium">
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
