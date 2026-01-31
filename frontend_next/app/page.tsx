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
  { id: "basic", name: "1 месяц", label: "Пробный", price: 100, features: ["1 устройство", "Скорость до 100 Мбит/с", "Поддержка в Telegram"], popular: false },
  { id: "standard", name: "3 месяца", label: "Оптимальный", price: 250, features: ["3 устройства", "Скорость до 1 Гбит/с", "Приоритетная поддержка", "Экономия 17%"], popular: true },
  { id: "premium", name: "12 месяцев", label: "Максимум", price: 900, features: ["5 устройств", "VIP-серверы", "Экономия 25%"], popular: false },
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
    if (isLoggedIn()) {
      router.push(`/checkout?plan=${planId}`);
    } else {
      router.push(`/login?redirect=/checkout?plan=${planId}`);
    }
  };

  // Content fallbacks
  const hero = content?.hero || { title: "Безопасный VPN для свободного интернета", subtitle: "Тсс! VPN — надёжный сервис для свободного интернета. Работает везде, настраивается за 2 минуты.", ctaText: "Подключить VPN" };
  const tickerMsg = content?.ticker?.message;
  const features = content?.features;
  const calcTitle = content?.calculator?.title;
  const plans = content?.pricing || defaultPlans;
  const installData = content?.install;
  const footer = content?.footer || { about: "Быстрый и надёжный VPN для свободного интернета", telegram: "https://t.me/tssvpn", supportTelegram: "https://t.me/tssvpn_support", email: "support@tssvpn.com" };
  const titles = content?.titles || {
    features: "Почему выбирают TssVPN",
    featuresSub: "Современные технологии для вашей безопасности в интернете",
    pricing: "Тарифы",
    pricingSub: "Выберите подходящий план. Оплата картой или криптовалютой.",
    install: "Инструкции по подключению",
    installSub: "Настройка занимает всего 2 минуты",
  };

  return (
    <main className="min-h-screen">
      <Header />
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        ctaText={hero.ctaText}
      />
      <Ticker message={tickerMsg} />

      {/* Features */}
      <section id="features" className="py-20 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-cream mb-4 text-center">
          {titles.features}
        </h2>
        <p className="text-brand-muted text-center mb-12 max-w-2xl mx-auto">
          {titles.featuresSub}
        </p>
        <BentoGrid features={features} />
      </section>

      {/* Calculator */}
      <section id="calc" className="py-20 bg-brand-dark/50">
        <div className="container mx-auto px-4">
          <Calculator title={calcTitle} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-cream mb-4 text-center">
          {titles.pricing}
        </h2>
        <p className="text-brand-muted text-center mb-12 max-w-2xl mx-auto">
          {titles.pricingSub}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan: any) => (
            <div
              key={plan.id}
              className={`bg-brand-dark rounded-2xl p-6 transition-all ${plan.popular
                ? "border-2 border-brand-teal relative box-shadow-soft scale-105"
                : "border border-brand-teal/20 hover:border-brand-teal/50"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-teal text-brand-navy font-bold text-sm px-4 py-1 rounded-full">
                  Популярный
                </div>
              )}
              <div className={`text-sm mb-2 ${plan.popular ? "text-brand-teal" : "text-brand-muted"}`}>
                {plan.label}
              </div>
              <h3 className="text-2xl font-bold text-brand-cream mb-4">{plan.name}</h3>
              <div className="text-4xl font-bold text-brand-teal mb-6">{plan.price} ₽</div>
              <ul className="mb-8 space-y-3 text-sm text-brand-cream/70">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className={i === 0 && plan.popular ? "text-brand-teal" : ""}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full font-bold py-3 rounded-lg transition-all ${plan.popular
                  ? "bg-brand-teal text-brand-navy hover:bg-brand-blue"
                  : "bg-brand-teal/10 text-brand-teal border border-brand-teal/30 hover:bg-brand-teal hover:text-brand-navy"
                  }`}
              >
                Выбрать
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
