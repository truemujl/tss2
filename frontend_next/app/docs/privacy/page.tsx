import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen gradient-hero py-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-teal mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                    На главную
                </Link>

                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-brand-cream mb-8">Политика конфиденциальности</h1>

                    <div className="prose prose-invert max-w-none space-y-6 text-brand-cream/80">
                        <p>
                            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">1. Сбор информации</h2>
                        <p>
                            TssVPN собирает минимальный объём информации, необходимый для предоставления услуг:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Адрес электронной почты для регистрации и связи</li>
                            <li>Telegram ID при авторизации через Telegram</li>
                            <li>Платёжные данные обрабатываются нашим платёжным провайдером</li>
                        </ul>

                        <h2 className="text-xl font-bold text-brand-cream">2. Политика «Без логов»</h2>
                        <p>
                            Мы не ведём и не храним:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Историю посещённых сайтов</li>
                            <li>IP-адреса подключений</li>
                            <li>Временные метки сессий</li>
                            <li>Объём переданного трафика</li>
                        </ul>

                        <h2 className="text-xl font-bold text-brand-cream">3. Использование данных</h2>
                        <p>
                            Собранные данные используются исключительно для:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Предоставления и улучшения сервиса</li>
                            <li>Обработки платежей</li>
                            <li>Технической поддержки</li>
                            <li>Отправки важных уведомлений</li>
                        </ul>

                        <h2 className="text-xl font-bold text-brand-cream">4. Передача данных третьим лицам</h2>
                        <p>
                            Мы не продаём и не передаём ваши данные третьим лицам, за исключением случаев,
                            предусмотренных законодательством.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">5. Безопасность</h2>
                        <p>
                            Мы применяем современные методы защиты данных, включая шифрование и безопасное хранение.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">6. Контакты</h2>
                        <p>
                            По вопросам конфиденциальности обращайтесь: <a href="mailto:privacy@tssvpn.com" className="text-brand-teal hover:underline">privacy@tssvpn.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
