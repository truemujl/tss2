"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/api";

export default function TelegramAuth() {
  const router = useRouter();

  // Listen for messages from the auth popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TELEGRAM_AUTH_SUCCESS') {
        setToken(event.data.token);
        router.push('/dashboard');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleTelegramLogin = () => {
    // Открываем отдельную страницу для аутентификации
    const popup = window.open('/auth.html', '_blank', 'width=500,height=700');
    
    // Focus the popup window
    if (popup) {
      popup.focus();
    }
  };

  return (
    <div 
      className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0099dd] text-white font-medium py-4 rounded-xl mb-6 transition-all cursor-pointer"
      onClick={handleTelegramLogin}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.12.098.153.228.166.331.014.103.03.338.017.521z" />
      </svg>
      Войти через Telegram
    </div>
  );
}