import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const faqs = [
    {
        q: "Что такое VPN?",
        a: "VPN (Virtual Private Network) — технология, создающая зашифрованное соединение между вашим устройством и интернетом, обеспечивая приватность и безопасность."
    },
    {
        q: "Какой протокол вы используете?",
        a: "Мы используем протокол VLESS с технологией Reality — самое современное решение для обхода блокировок, которое невозможно обнаружить системами DPI."
    },
    {
        q: "На каких устройствах работает?",
        a: "TssVPN работает на iOS, Android, Windows, macOS и Linux. Один ключ можно использовать на нескольких устройствах в зависимости от тарифа."
    },
    {
        q: "Как быстро активируется подписка?",
        a: "Мгновенно. После оплаты вы сразу получите ключ доступа в личном кабинете и в Telegram."
    },
    {
        q: "Вы храните логи?",
        a: "Нет. Мы придерживаемся строгой политики «без логов» — не храним историю посещений, IP-адреса и другие данные о вашей активности."
    },
    {
        q: "Можно ли вернуть деньги?",
        a: "Да, в течение 7 дней после покупки вы можете запросить полный возврат без объяснения причин."
    },
    {
        q: "Как связаться с поддержкой?",
        a: "Напишите нам в Telegram: @tssvpn_support — мы отвечаем в течение нескольких часов."
    },
];

export default function FAQPage() {
    return (
        <main className="min-h-screen gradient-hero py-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-teal mb-8 transition-colors">
                    <ArrowLeft size={18} />
                    На главную
                </Link>

                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-brand-cream mb-8">Часто задаваемые вопросы</h1>

                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border-b border-white/10 pb-6 last:border-0">
                                <h3 className="font-bold text-brand-teal mb-2">{faq.q}</h3>
                                <p className="text-brand-cream/80">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
