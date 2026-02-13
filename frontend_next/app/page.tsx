"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import BentoGrid from "@/components/BentoGrid";
import Calculator from "@/components/Calculator";
import InstallationTabs from "@/components/InstallationTabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/api";

const defaultPlans = [
  { id: "plan_1m_new", name: "1 месяц", label: "Стартовый", price: 99, features: ["10 устройств", "Безлимитный трафик", "Все локации", "Поддержка в Telegram"], popular: false },
  { id: "plan_3m_new", name: "3 месяца", label: "Оптимальный", price: 249, features: ["10 устройств", "Безлимитный трафик", "Все локации", "Приоритетная поддержка", "Экономия 16%"], popular: true },
  { id: "plan_1y_new", name: "1 год", label: "Максимум", price: 1000, features: ["10 устройств", "Безлимитный трафик", "Все локации", "VIP-поддержка", "Экономия 16%", "Установка на роутер"], popular: false },
];

export default function Home() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const savedContent = localStorage.getItem("cms_content");
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (e) { }
    }
  }, []);

  const handleSelectPlan = (planId: string) => {
    // Redirect to checkout directly. Login will be requested at the final step.
    router.push(`/checkout?plan=${planId}`);
  };

  // Content fallbacks
  const hero = content?.hero || { title: "Ваш надежный узел в свободном интернете", subtitle: "Быстрая настройка VLESS Reality за несколько секунд.", ctaText: "Начать использование", posterImage: "/hero-poster-v1.jpg" };
  const tickerMsg = content?.ticker?.message;
  const features = content?.features;
  const calcTitle = content?.calculator?.title;
  const plans = content?.pricing || defaultPlans;
  const installData = content?.install;
  const footer = content?.footer || { about: "Современный VPN для тех, кто ценит приватность и скорость.", telegram: "https://t.me/tssvpn", supportTelegram: "https://t.me/tssvpn_support", email: "support@tssvpn.com" };
  const titles = content?.titles || {
    features: "Особенности TssVPN",
    featuresSub: "Безопасность и скорость без компромиссов",
    pricing: "Тарифные планы",
    pricingSub: "Выберите оптимальный период. Мы принимаем карты и криптовалюты.",
    install: "База знаний",
    installSub: "Подключитесь к защищенной сети за считанные минуты",
  };

  return (
    <main className="min-h-screen">
      <Header />
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        ctaText={hero.ctaText}
        posterImage={hero.posterImage}
      />

      {/* Subtle Ticker */}
      <div className="bg-white/5 py-4 border-y border-white/5">
        <Ticker message={tickerMsg || "✦ Оплата картами РФ и СБП ✦ Оплата криптовалютой ✦ Безлимитный трафик ✦ До 10 устройств на любом тарифе ✦ Выбор локации сервера ✦ Установка на роутер ✦ Поддержка 24/7 ✦"} />
      </div>

      {/* Features */}
      <section id="features" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {titles.features}
          </h2>
          <p className="text-brand-text-dim max-w-2xl mx-auto text-lg">
            {titles.featuresSub}
          </p>
        </div>
        <BentoGrid features={features} />
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {titles.pricing}
          </h2>
          <p className="text-brand-text-dim max-w-2xl mx-auto text-lg">
            {titles.pricingSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan: any) => (
            <div
              key={plan.id}
              className={`glass rounded-[32px] p-10 transition-all duration-500 glass-hover flex flex-col h-full ${plan.popular
                ? "border-brand-accent/50 relative"
                : "border-white/5"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-accent text-white font-bold text-xs uppercase tracking-widest px-5 py-2 rounded-full shadow-[0_4px_20px_var(--color-brand-accent-glow)]">
                  Лучший выбор
                </div>
              )}
              <div className="mb-10">
                <div className="text-brand-text-dim text-sm font-semibold uppercase tracking-widest mb-4">
                  {plan.label}
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-xl text-brand-text-dim">₽</span>
                </div>
              </div>

              <ul className="mb-10 space-y-4">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-brand-text-dim text-sm">
                    <span className="w-5 h-5 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full font-bold py-5 rounded-2xl transition-all duration-300 mt-auto ${plan.popular
                  ? "bg-brand-accent text-white hover:shadow-[0_0_25px_var(--color-brand-accent-glow)]"
                  : "bg-white/5 text-white hover:bg-white/10"
                  }`}
              >
                Выбрать план
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Installation */}
      <section id="install" className="py-20 bg-brand-dark/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-cream mb-4 text-center">
            {titles.install}
          </h2>
          <p className="text-brand-muted text-center mb-12 max-w-2xl mx-auto">
            {titles.installSub}
          </p>
          <InstallationTabs data={installData} />
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="border-t border-white/10 bg-brand-navy py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-brand-cream mb-4">TssVPN</h4>
              <p className="text-brand-muted text-sm">
                {footer.about}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-brand-cream mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li><a href={footer.telegram} className="text-brand-muted hover:text-brand-teal">Telegram канал</a></li>
                <li><a href={footer.supportTelegram} className="text-brand-muted hover:text-brand-teal">Поддержка</a></li>
                <li><a href={`mailto:${footer.email}`} className="text-brand-muted hover:text-brand-teal">{footer.email}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-cream mb-4">Информация</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs/faq" className="text-brand-muted hover:text-brand-teal">FAQ</Link></li>
                <li><Link href="/#install" className="text-brand-muted hover:text-brand-teal">Инструкции</Link></li>
                <li><Link href="/#pricing" className="text-brand-muted hover:text-brand-teal">Цены</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-cream mb-4">Документы</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs/privacy" className="text-brand-muted hover:text-brand-teal">Политика конфиденциальности</Link></li>
                <li><Link href="/docs/cookies" className="text-brand-muted hover:text-brand-teal">Политика cookie</Link></li>
                <li><Link href="/docs/terms" className="text-brand-muted hover:text-brand-teal">Договор оферты</Link></li>
                <li><Link href="/docs/refund" className="text-brand-muted hover:text-brand-teal">Политика возврата</Link></li>
                <li><Link href="/docs/cancellation" className="text-brand-muted hover:text-brand-teal">Отмена подписки</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-brand-muted text-sm">
              © {new Date().getFullYear()} TssVPN. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
