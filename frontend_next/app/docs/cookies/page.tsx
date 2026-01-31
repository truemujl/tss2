import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
    return (
        <main className="min-h-screen gradient-hero py-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-teal mb-8 transition-colors">
                    <ArrowLeft size={18} />
                    На главную
                </Link>

                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-brand-cream mb-8">Политика Cookie</h1>

                    <div className="prose prose-invert max-w-none space-y-6 text-brand-cream/80">
                        <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>

                        <h2 className="text-xl font-bold text-brand-cream">1. Что такое Cookie?</h2>
                        <p>
                            Cookie — небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении сайта.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">2. Какие Cookie мы используем</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Необходимые:</strong> для работы авторизации и основных функций</li>
                            <li><strong>Функциональные:</strong> для сохранения ваших настроек</li>
                        </ul>

                        <h2 className="text-xl font-bold text-brand-cream">3. Мы НЕ используем</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Рекламные Cookie</li>
                            <li>Трекеры третьих сторон</li>
                            <li>Аналитику, отслеживающую поведение</li>
                        </ul>

                        <h2 className="text-xl font-bold text-brand-cream">4. Управление Cookie</h2>
                        <p>
                            Вы можете удалить Cookie через настройки браузера. Это может повлиять на работу некоторых функций сайта.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
