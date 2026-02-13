"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Monitor, Apple, Download, ExternalLink, Copy, Check } from "lucide-react";

interface InstallStep {
    title: string;
    appName: string;
    appLink: string;
    steps: string[];
    directDownload?: boolean;
}

interface InstallationTabsProps {
    data?: Record<string, InstallStep>;
}

export default function InstallationTabs({ data: externalData }: InstallationTabsProps) {
    const [activeTab, setActiveTab] = useState<"ios" | "android" | "windows" | "mac">("ios");
    const [copied, setCopied] = useState(false);

    const defaultData: Record<string, InstallStep> = {
        ios: {
            title: "iOS",
            appName: "V2Box",
            appLink: "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690",
            steps: [
                "Скачайте V2Box из App Store",
                "Скопируйте ключ из личного кабинета",
                "Откройте V2Box, он автоматически предложит добавить ключ из буфера (или нажмите ➕ -> Import from clipboard)",
                "Нажмите переключатель для соединения"
            ]
        },
        android: {
            title: "Android",
            appName: "v2rayNG",
            appLink: "https://play.google.com/store/apps/details?id=com.v2ray.ang",
            steps: [
                "Скачайте v2rayNG из Google Play",
                "Скопируйте ключ из личного кабинета",
                "Откройте приложение и нажмите ➕ сверху",
                "Выберите 'Import config from Clipboard'",
                "Нажмите кнопку подключения (V) внизу"
            ]
        },
        windows: {
            title: "Windows",
            appName: "v2rayN",
            appLink: "/downloads/v2rayN.zip",
            directDownload: true,
            steps: [
                "Скачайте архив с клиентом",
                "Распакуйте архив в удобную папку",
                "Запустите v2rayN.exe",
                "Скопируйте ключ, и в программе нажмите Ctrl+V (или Сервер -> Добавить из буфера)",
                "Внизу окна поставьте System Proxy: Set System Proxy"
            ]
        },
        mac: {
            title: "macOS",
            appName: "V2Box",
            appLink: "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690",
            steps: [
                "Скачайте V2Box из Mac App Store",
                "Скопируйте ключ из личного кабинета",
                "Откройте приложение и импортируйте ключ из буфера",
                "Нажмите кнопку подключения"
            ]
        }
    };

    const data = externalData || defaultData;
    const activeData = data[activeTab] || defaultData[activeTab]; // Fallback safely

    return (
        <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center mb-12 gap-4">
                <button
                    onClick={() => setActiveTab("ios")}
                    className={`flex items-center gap-3 px-6 py-4 font-bold rounded-2xl transition-all duration-300 ${activeTab === "ios"
                        ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(58,142,246,0.4)] scale-105"
                        : "glass text-brand-text-dim hover:text-white border-white/5 hover:scale-105"
                        }`}
                >
                    <Apple size={24} />
                    <span>iOS</span>
                </button>
                <button
                    onClick={() => setActiveTab("android")}
                    className={`flex items-center gap-3 px-6 py-4 font-bold rounded-2xl transition-all duration-300 ${activeTab === "android"
                        ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(58,142,246,0.4)] scale-105"
                        : "glass text-brand-text-dim hover:text-white border-white/5 hover:scale-105"
                        }`}
                >
                    <Smartphone size={24} />
                    <span>Android</span>
                </button>
                <button
                    onClick={() => setActiveTab("windows")}
                    className={`flex items-center gap-3 px-6 py-4 font-bold rounded-2xl transition-all duration-300 ${activeTab === "windows"
                        ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(58,142,246,0.4)] scale-105"
                        : "glass text-brand-text-dim hover:text-white border-white/5 hover:scale-105"
                        }`}
                >
                    <Monitor size={24} />
                    <span>Windows</span>
                </button>
                <button
                    onClick={() => setActiveTab("mac")}
                    className={`flex items-center gap-3 px-6 py-4 font-bold rounded-2xl transition-all duration-300 ${activeTab === "mac"
                        ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(58,142,246,0.4)] scale-105"
                        : "glass text-brand-text-dim hover:text-white border-white/5 hover:scale-105"
                        }`}
                >
                    <Apple size={24} />
                    <span>macOS</span>
                </button>
            </div>

            {/* Content Card */}
            <div className="glass rounded-[40px] p-8 md:p-12 min-h-[400px] relative overflow-hidden transition-all duration-500">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                    >
                        {/* Left: Info & Download */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                                    {activeTab === 'ios' || activeTab === 'mac' ? <Apple size={32} /> :
                                        activeTab === 'android' ? <Smartphone size={32} /> : <Monitor size={32} />}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{activeData.title}</h3>
                                    <p className="text-brand-text-dim">Приложение: <span className="text-brand-teal font-semibold">{activeData.appName}</span></p>
                                </div>
                            </div>

                            <p className="text-brand-text-dim mb-8 leading-relaxed">
                                Для подключения к нашей сети на {activeData.title} мы рекомендуем использовать приложение {activeData.appName}. Оно надежное, быстрое и простое в настройке.
                            </p>

                            <a
                                href={activeData.appLink}
                                target={activeData.directDownload ? "_self" : "_blank"}
                                rel={activeData.directDownload ? "" : "noopener noreferrer"}
                                className="inline-flex items-center gap-3 bg-brand-accent text-white font-bold py-4 px-8 rounded-xl hover:shadow-[0_0_30px_rgba(58,142,246,0.5)] transition-all transform hover:-translate-y-1 mb-6"
                            >
                                {activeData.directDownload ? <Download size={20} /> : <ExternalLink size={20} />}
                                <span>Скачать {activeData.appName}</span>
                            </a>

                            {!activeData.directDownload && (
                                <p className="text-xs text-brand-text-dim">
                                    Ссылка откроется в {activeTab === 'ios' || activeTab === 'mac' ? 'App Store' : 'Google Play'}
                                </p>
                            )}
                        </div>

                        {/* Right: Instructions */}
                        <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                            <h4 className="text-xl font-bold text-white mb-6">Инструкция по установке</h4>
                            <ul className="space-y-6">
                                {activeData.steps.map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold text-sm border border-brand-teal/20">
                                            {i + 1}
                                        </div>
                                        <p className="text-brand-muted text-sm pt-1.5 leading-relaxed">
                                            {step}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Background Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
            </div>
        </div>
    );
}
