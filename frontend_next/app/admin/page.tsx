"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Save, LogOut, FileText, Settings, DollarSign,
    HelpCircle, Lock, Layout, Info, Smartphone,
    Zap, ChevronDown, ChevronUp, Trash2, Plus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Feature {
    title: string;
    desc: string;
    icon?: string;
}

interface PricingPlan {
    id: string;
    name: string;
    label: string;
    price: number;
    features: string[];
    popular: boolean;
}

interface InstallStep {
    title: string;
    steps: string[];
}

interface CMSContent {
    hero: {
        title: string;
        subtitle: string;
        ctaText: string;
    };
    ticker: {
        message: string;
    };
    features: Feature[];
    calculator: {
        title: string;
    };
    pricing: PricingPlan[];
    install: {
        ios: InstallStep;
        android: InstallStep;
        windows: InstallStep;
        mac: InstallStep;
    };
    footer: {
        about: string;
        telegram: string;
        email: string;
        supportTelegram: string;
    };
    titles: {
        features: string;
        featuresSub: string;
        pricing: string;
        pricingSub: string;
        install: string;
        installSub: string;
    };
}

const defaultContent: CMSContent = {
    hero: {
        title: "Безопасный VPN для свободного интернета",
        subtitle: "Протокол VLESS/Reality. Обход блокировок. Настройка за 2 минуты.",
        ctaText: "Начать бесплатно",
    },
    ticker: {
        message: "⚡ АКЦИЯ: Подписка на год со скидкой 25%! ⚡ Быстрые серверы в Европе и США ⚡ Reality протокол ⚡",
    },
    features: [
        { title: "Обход блокировок", desc: "Протокол VLESS/Reality невидим для систем блокировки. Доступ к любым сайтам." },
        { title: "Высокая скорость", desc: "Серверы до 1 Гбит/с. Подходит для видео 4K и онлайн-игр." },
        { title: "Все устройства", desc: "Один ключ работает на iOS, Android, Windows и Mac." },
        { title: "Конфиденциальность", desc: "Мы не храним логи подключений. Ваши данные остаются вашими." },
    ],
    calculator: {
        title: "Проверка скорости соединения",
    },
    pricing: [
        {
            id: "basic",
            name: "1 месяц",
            label: "Пробный",
            price: 100,
            features: ["1 устройство", "Скорость до 100 Мбит/с", "Поддержка в Telegram"],
            popular: false,
        },
        {
            id: "standard",
            name: "3 месяца",
            label: "Оптимальный",
            price: 250,
            features: ["3 устройства", "Скорость до 1 Гбит/с", "Приоритетная поддержка", "Экономия 17%"],
            popular: true,
        },
        {
            id: "premium",
            name: "12 месяцев",
            label: "Максимум",
            price: 900,
            features: ["5 устройств", "VIP-серверы", "Экономия 25%"],
            popular: false,
        },
    ],
    install: {
        ios: {
            title: "iOS",
            steps: ["Скачайте 'V2Box' из App Store", "Скопируйте ключ из ЛК", "Нажмите '+' и выберите 'Import VLESS'", "Нажмите на кнопку подключения"]
        },
        android: {
            title: "Android",
            steps: ["Скачайте 'v2rayNG' из Play Store", "Скопируйте ключ из ЛК", "Нажмите '+' и 'Import config from Clipboard'", "Выберите сервер и нажмите на иконку 'V'"]
        },
        windows: {
            title: "Windows",
            steps: ["Скачайте 'v2rayN' с нашего сайта", "Распакуйте и запустите v2rayN.exe", "Нажмите 'Servers' -> 'Import from clipboard'", "Нажмите Enter и включите системный прокси"]
        },
        mac: {
            title: "macOS",
            steps: ["Скачайте 'FoXray' из App Store", "Скопируйте ключ из ЛК", "Добавьте новый сервер через '+ Clipboard'", "Нажмите 'Connect'"]
        }
    },
    footer: {
        about: "Быстрый и надёжный VPN для свободного интернета",
        telegram: "https://t.me/tssvpn",
        email: "support@tssvpn.com",
        supportTelegram: "https://t.me/tssvpn_support",
    },
    titles: {
        features: "Почему выбирают TssVPN",
        featuresSub: "Современные технологии для вашей безопасности в интернете",
        pricing: "Тарифы",
        pricingSub: "Выберите подходящий план. Оплата картой или криптовалютой.",
        install: "Инструкции по подключению",
        installSub: "Настройка занимает всего 2 минуты",
    },
};

type TabType = "hero" | "features" | "pricing" | "install" | "footer" | "titles";

export default function AdminPage() {
    const [isAuth, setIsAuth] = useState(false);
    const [password, setPassword] = useState("");
    const [content, setContent] = useState<CMSContent>(defaultContent);
    const [activeTab, setActiveTab] = useState<TabType>("hero");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const adminAuth = localStorage.getItem("admin_auth");
        if (adminAuth === "true") setIsAuth(true);

        const savedContent = localStorage.getItem("cms_content");
        if (savedContent) {
            try {
                const parsed = JSON.parse(savedContent);
                // Merge with default to ensure no missing fields
                setContent({ ...defaultContent, ...parsed });
            } catch (e) {
                setContent(defaultContent);
            }
        }
    }, []);

    const handleLogin = () => {
        if (password === "admin123") {
            setIsAuth(true);
            localStorage.setItem("admin_auth", "true");
        } else {
            alert("Неверный пароль");
        }
    };

    const handleSave = () => {
        localStorage.setItem("cms_content", JSON.stringify(content));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        setIsAuth(false);
    };

    const updateArrayField = (tab: keyof CMSContent, index: number, field: string, value: any) => {
        const updated = { ...content };
        (updated[tab] as any)[index][field] = value;
        setContent(updated);
    };

    if (!isAuth) {
        return (
            <main className="min-h-screen gradient-hero flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <Lock size={48} className="mx-auto mb-4 text-brand-teal" />
                        <h1 className="text-2xl font-bold text-brand-cream">Админ-панель</h1>
                        <p className="text-brand-muted">Введите пароль для доступа</p>
                    </div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full bg-brand-navy/50 border border-white/10 text-brand-cream p-4 rounded-xl mb-4 focus:border-brand-teal focus:outline-none" placeholder="Пароль" />
                    <button onClick={handleLogin} className="w-full bg-brand-teal text-brand-navy font-bold py-4 rounded-xl hover:bg-brand-blue transition-all">Войти</button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen gradient-hero text-brand-cream">
            <header className="border-b border-white/10 bg-brand-navy/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative h-10 w-10"><Image src="/logo-icon.png" alt="TssVPN" fill className="object-contain" /></div>
                        <span className="font-bold">CMS Управление</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${saved ? "bg-green-500 text-white" : "bg-brand-teal text-brand-navy hover:bg-brand-blue"}`}>
                            <Save size={18} /> {saved ? "Готово!" : "Сохранить всё"}
                        </button>
                        <button onClick={handleLogout} className="text-brand-muted hover:text-brand-red transition-colors font-medium">Выйти</button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Nav */}
                    <div className="md:w-64 shrink-0">
                        <div className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 sticky top-24">
                            <nav className="space-y-1">
                                {[
                                    { id: "hero", label: "Главная", icon: Layout },
                                    { id: "features", label: "Особенности", icon: Zap },
                                    { id: "pricing", label: "Тарифы", icon: DollarSign },
                                    { id: "install", label: "Инструкции", icon: Smartphone },
                                    { id: "footer", label: "Футер", icon: Info },
                                    { id: "titles", label: "Заголовки", icon: FileText },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as TabType)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-brand-teal text-brand-navy font-bold shadow-lg" : "hover:bg-white/5"}`}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="flex-1 max-w-4xl">
                        <div className="bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">

                            {/* SECTION: HERO */}
                            {activeTab === "hero" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                        <Layout className="text-brand-teal" />
                                        <h2 className="text-2xl font-bold">Главный экран</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-brand-muted mb-2 text-sm uppercase tracking-wider">Основной заголовок</label>
                                            <input type="text" value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-4 rounded-xl focus:border-brand-teal focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-brand-muted mb-2 text-sm uppercase tracking-wider">Подзаголовок</label>
                                            <textarea value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-4 rounded-xl focus:border-brand-teal focus:outline-none min-h-[120px]" />
                                        </div>
                                        <div>
                                            <label className="block text-brand-muted mb-2 text-sm uppercase tracking-wider">Текст кнопки действия</label>
                                            <input type="text" value={content.hero.ctaText} onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaText: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-4 rounded-xl focus:border-brand-teal focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-brand-muted mb-2 text-sm uppercase tracking-wider">Бегущая строка</label>
                                            <input type="text" value={content.ticker.message} onChange={(e) => setContent({ ...content, ticker: { ...content.ticker, message: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-4 font-mono text-sm rounded-xl focus:border-brand-teal focus:outline-none" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION: FEATURES */}
                            {activeTab === "features" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                        <Zap className="text-brand-teal" />
                                        <h2 className="text-2xl font-bold">Почему выбирают нас</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {content.features.map((f, i) => (
                                            <div key={i} className="bg-brand-navy/30 border border-white/5 p-6 rounded-2xl relative group">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-brand-teal font-bold uppercase text-xs tracking-widest">Блок #{i + 1}</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <input type="text" value={f.title} onChange={(e) => updateArrayField('features', i, 'title', e.target.value)} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg focus:border-brand-teal focus:outline-none font-bold" placeholder="Заголовок" />
                                                    <textarea value={f.desc} onChange={(e) => updateArrayField('features', i, 'desc', e.target.value)} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg focus:border-brand-teal focus:outline-none text-sm min-h-[80px]" placeholder="Описание" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SECTION: PRICING */}
                            {activeTab === "pricing" && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                        <DollarSign className="text-brand-teal" />
                                        <h2 className="text-2xl font-bold">Тарифные планы</h2>
                                    </div>

                                    {content.pricing.map((plan, i) => (
                                        <div key={i} className="bg-brand-navy/40 border border-white/10 p-6 rounded-2xl space-y-4">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                                <h3 className="font-bold text-brand-teal">{plan.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" checked={plan.popular} onChange={(e) => updateArrayField('pricing', i, 'popular', e.target.checked)} id={`pop-${i}`} />
                                                    <label htmlFor={`pop-${i}`} className="text-sm text-brand-muted select-none">Популярный</label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs uppercase text-brand-muted mb-1">Метка</label>
                                                    <input type="text" value={plan.label} onChange={(e) => updateArrayField('pricing', i, 'label', e.target.value)} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs uppercase text-brand-muted mb-1">Цена (₽)</label>
                                                    <input type="number" value={plan.price} onChange={(e) => updateArrayField('pricing', i, 'price', Number(e.target.value))} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs uppercase text-brand-muted mb-2">Особенности (каждая с новой строки)</label>
                                                <textarea
                                                    value={plan.features.join('\n')}
                                                    onChange={(e) => updateArrayField('pricing', i, 'features', e.target.value.split('\n'))}
                                                    className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-xs min-h-[100px] font-mono"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-6 border-t border-white/10">
                                        <h3 className="text-sm font-bold uppercase mb-4">Тест скорости</h3>
                                        <div className="space-y-4">
                                            <input type="text" value={content.calculator.title} onChange={(e) => setContent({ ...content, calculator: { ...content.calculator, title: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" placeholder="Заголовок теста скорости" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION: INSTALL */}
                            {activeTab === "install" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                        <Smartphone className="text-brand-teal" />
                                        <h2 className="text-2xl font-bold">Инструкции по установке</h2>
                                    </div>

                                    {(['ios', 'android', 'windows', 'mac'] as const).map((os) => (
                                        <div key={os} className="p-4 bg-brand-navy/30 rounded-xl border border-white/5 space-y-4">
                                            <h3 className="font-bold text-brand-cream uppercase tracking-widest text-sm">{os}</h3>
                                            <div>
                                                <label className="block text-xs text-brand-muted mb-2">Шаги инструкции (один на строку)</label>
                                                <textarea
                                                    value={content.install[os].steps.join('\n')}
                                                    onChange={(e) => setContent({
                                                        ...content,
                                                        install: {
                                                            ...content.install,
                                                            [os]: { ...content.install[os], steps: e.target.value.split('\n') }
                                                        }
                                                    })}
                                                    className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm font-mono min-h-[120px]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* SECTION: FOOTER */}
                            {activeTab === "footer" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                        <Info className="text-brand-teal" />
                                        <h2 className="text-2xl font-bold">Контакты и Описание</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-brand-muted mb-2 text-sm uppercase">О проекте (в футере)</label>
                                            <textarea value={content.footer.about} onChange={(e) => setContent({ ...content, footer: { ...content.footer, about: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-4 rounded-xl focus:outline-none" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-brand-muted mb-2 text-sm uppercase">Канал Telegram</label>
                                                <input type="text" value={content.footer.telegram} onChange={(e) => setContent({ ...content, footer: { ...content.footer, telegram: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-brand-muted mb-2 text-sm uppercase">Поддержка Telegram</label>
                                                <input type="text" value={content.footer.supportTelegram} onChange={(e) => setContent({ ...content, footer: { ...content.footer, supportTelegram: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-brand-muted mb-2 text-sm uppercase">Email</label>
                                                <input type="email" value={content.footer.email} onChange={(e) => setContent({ ...content, footer: { ...content.footer, email: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION: TITLES */}
                            {activeTab === "titles" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                        <FileText className="text-brand-teal" />
                                        <h2 className="text-2xl font-bold">Заголовки разделов</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold border-l-2 border-brand-teal pl-2">Раздел Особенностей</h3>
                                            <input type="text" value={content.titles.features} onChange={(e) => setContent({ ...content, titles: { ...content.titles, features: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" placeholder="Заголовок" />
                                            <input type="text" value={content.titles.featuresSub} onChange={(e) => setContent({ ...content, titles: { ...content.titles, featuresSub: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" placeholder="Подзаголовок" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold border-l-2 border-brand-teal pl-2">Раздел Тарифов</h3>
                                            <input type="text" value={content.titles.pricing} onChange={(e) => setContent({ ...content, titles: { ...content.titles, pricing: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" placeholder="Заголовок" />
                                            <input type="text" value={content.titles.pricingSub} onChange={(e) => setContent({ ...content, titles: { ...content.titles, pricingSub: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" placeholder="Подзаголовок" />
                                        </div>
                                        <div className="space-y-4 md:col-span-2">
                                            <h3 className="text-sm font-bold border-l-2 border-brand-teal pl-2">Раздел Инструкций</h3>
                                            <input type="text" value={content.titles.install} onChange={(e) => setContent({ ...content, titles: { ...content.titles, install: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" placeholder="Заголовок" />
                                            <input type="text" value={content.titles.installSub} onChange={(e) => setContent({ ...content, titles: { ...content.titles, installSub: e.target.value } })} className="w-full bg-brand-navy/50 border border-white/10 p-3 rounded-lg text-sm" placeholder="Подзаголовок" />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Legend / Status */}
                        <div className="mt-8 p-6 bg-brand-teal/5 border border-brand-teal/20 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-brand-teal rounded-full animate-pulse" />
                                <span className="text-sm font-medium">CMS Активна</span>
                                <span className="text-xs text-brand-muted ml-4">Версия 1.2 (Full Site Edit)</span>
                            </div>
                            <div className="text-xs text-brand-muted italic">
                                Все изменения применяются мгновенно после сохранения
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer link to site */}
            <div className="py-8 text-center border-t border-white/5 bg-brand-navy/20">
                <Link href="/" className="text-brand-muted hover:text-brand-teal transition-colors flex items-center justify-center gap-2 font-medium">
                    <ArrowLeft size={16} /> Перейти на сайт для проверки
                </Link>
            </div>
        </main>
    );
}

// Simple Arrow icon fix
const ArrowLeft = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
);
