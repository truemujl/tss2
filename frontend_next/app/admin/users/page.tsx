"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Search, Shield, ShieldAlert, CreditCard, Ban } from "lucide-react";
import Link from "next/link";
import { getAdminUsers, UserProfile, isLoggedIn, getProfile } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!isLoggedIn()) {
            router.push("/login");
            return;
        }

        getProfile().then(p => {
            if (!p.is_admin) router.push("/dashboard");
        });

        getAdminUsers()
            .then(setUsers)
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [router]);

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toString().includes(searchTerm)
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-navy text-brand-teal animate-pulse">Загрузка состава...</div>;

    return (
        <main className="min-h-screen bg-brand-navy p-4 md:p-8">
            <div className="container mx-auto">
                <header className="mb-8">
                    <Link href="/admin" className="text-brand-muted hover:text-brand-teal flex items-center gap-2 mb-2 transition-colors">
                        <ArrowLeft size={16} /> Назад в штаб
                    </Link>
                    <h1 className="text-3xl font-black text-brand-cream uppercase tracking-tighter">
                        ЛИЧНЫЙ СОСТАВ
                    </h1>
                </header>

                <div className="bg-brand-dark/40 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Поиск курсанта (ID или имя)..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-brand-cream focus:border-brand-teal outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-xs uppercase text-brand-muted">
                                <tr>
                                    <th className="px-6 py-4">Курсант</th>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Баланс</th>
                                    <th className="px-6 py-4">Статус</th>
                                    <th className="px-6 py-4 text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <Image src={user.avatar_url} alt="Avatar" width={40} height={40} className="object-cover" />
                                                    ) : (
                                                        <Shield className="text-brand-teal" size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-brand-cream">{user.username || "Аноним"}</div>
                                                    {user.is_admin && <span className="text-[10px] bg-brand-red text-white px-1 rounded">ADMIN</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-brand-muted">{user.id}</td>
                                        <td className="px-6 py-4 font-bold text-brand-teal">{user.balance} ₽</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2 text-green-400 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                                Служит
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-brand-teal transition-colors" title="Изменить баланс">
                                                <CreditCard size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-brand-red transition-colors" title="Отстранить (Бан)">
                                                <Ban size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
