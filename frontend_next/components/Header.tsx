"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn, logout } from "@/lib/api";

const navLinks = [
    { name: "Цены", href: "/#pricing" },
    { name: "Инструкции", href: "/#install" },
    { name: "Проверка", href: "/#calc" },
    { name: "Контакты", href: "/#footer" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setLoggedIn(isLoggedIn());

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-brand-navy/80 backdrop-blur-xl border-b border-white/10 py-2"
                : "bg-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className={`flex justify-between items-center ${scrolled ? "" : "bg-brand-dark/60 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10"
                    }`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-12 w-12">
                            <Image
                                src="/logo-icon.png"
                                alt="TssVPN"
                                fill
                                className="object-contain group-hover:brightness-110 transition-all"
                                priority
                            />
                        </div>
                        <span
                            className="text-2xl font-bold tracking-wide"
                            style={{
                                background: 'linear-gradient(180deg, #5DADE2 0%, #4ECDC4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 2px 10px rgba(78, 205, 196, 0.3)',
                            }}
                        >
                            tssvpn
                        </span>
                    </Link>
                    {/* Desktop Nav - Pill Style */}
                    <nav className="hidden md:flex items-center gap-1 bg-brand-navy/50 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-brand-cream/70 font-mono text-sm px-4 py-2 rounded-full hover:bg-brand-teal/20 hover:text-brand-teal transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {loggedIn ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 text-brand-cream font-mono text-sm hover:text-brand-teal transition-colors px-4 py-2"
                                >
                                    <User size={16} />
                                    Кабинет
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="p-2 text-brand-muted hover:text-brand-red transition-colors rounded-full hover:bg-brand-red/10"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-brand-cream/70 font-mono text-sm hover:text-brand-teal transition-colors px-4 py-2"
                                >
                                    Войти
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-brand-teal text-brand-navy px-5 py-2 font-heading text-sm rounded-full hover:bg-brand-blue transition-all flex items-center gap-1 group"
                                >
                                    Начать
                                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-brand-teal rounded-lg hover:bg-brand-teal/10 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-brand-dark/95 backdrop-blur-xl border-b border-white/10"
                    >
                        <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-brand-cream font-mono text-lg py-3 px-4 rounded-xl hover:bg-brand-teal/10 hover:text-brand-teal transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="border-t border-white/10 mt-4 pt-4 flex flex-col gap-2">
                                {loggedIn ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="text-brand-teal font-mono text-lg py-3 px-4 rounded-xl bg-brand-teal/10"
                                        >
                                            Личный кабинет
                                        </Link>
                                        <button
                                            onClick={() => logout()}
                                            className="text-brand-muted font-mono text-lg py-3 px-4 rounded-xl text-left hover:text-brand-red"
                                        >
                                            Выйти
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="text-brand-cream font-mono text-lg py-3 px-4 rounded-xl hover:bg-white/5"
                                        >
                                            Войти
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="bg-brand-teal text-brand-navy font-heading text-lg py-4 px-6 rounded-xl text-center"
                                        >
                                            Начать бесплатно
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
