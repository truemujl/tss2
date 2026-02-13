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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "glass py-3"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl glass flex items-center justify-center">
                            <Image
                                src="/logo-icon.png"
                                alt="TssVPN"
                                width={24}
                                height={24}
                                className="group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            tssvpn
                        </span>
                    </Link>

                    {/* Desktop Nav - Clean Style */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-brand-text-dim text-sm font-medium hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons - Minimalist */}
                    <div className="hidden md:flex items-center gap-4">
                        {loggedIn ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 text-brand-text-dim text-sm font-medium hover:text-white transition-colors"
                                >
                                    <User size={16} />
                                    Аккаунт
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="p-2 text-brand-text-dim hover:text-white transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-brand-text-dim text-sm font-medium hover:text-white transition-colors"
                                >
                                    Войти
                                </Link>
                                <Link
                                    href="/#pricing"
                                    className="bg-brand-accent text-white px-5 py-2.5 text-sm font-semibold rounded-full hover:shadow-[0_0_20px_var(--color-brand-accent-glow)] transition-all flex items-center gap-1 group"
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
