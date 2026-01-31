'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken } from '@/lib/api';

declare global {
  interface Window {
    Telegram?: {
      LoginWidget?: {
        onLogin: (callback: (user: any) => void) => void;
      };
    };
  }
}

export default function TelegramLoginButton() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Create and inject the Telegram Login script
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_BOT_USERNAME || 'tssvpn_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/telegram/callback`);
      script.setAttribute('data-request-access', 'write');
      document.body.appendChild(script);

      // Wait for the script to load and initialize the login callback
      script.onload = () => {
        // Define the login callback
        if (window.Telegram?.LoginWidget) {
          window.Telegram.LoginWidget.onLogin = async (user: any) => {
            try {
              // Send the user data to our API route
              const response = await fetch('/api/auth/telegram/callback', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name || '',
                  username: user.username || '',
                  photo_url: user.photo_url || '',
                  auth_date: user.auth_date,
                  hash: user.hash,
                }).toString(),
              });

              if (response.ok) {
                const data = await response.json();
                
                // Store the token and redirect to dashboard
                if (data.access_token) {
                  setToken(data.access_token);
                  router.push('/dashboard');
                }
              } else {
                console.error('Telegram auth failed:', await response.text());
              }
            } catch (error) {
              console.error('Error during Telegram auth:', error);
            }
          };
        }
      };

      // Cleanup function to remove the script when component unmounts
      return () => {
        const existingScript = document.querySelector('script[src*="telegram-widget"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [router]);

  // Render only on client side
  if (!isClient) {
    return (
      <div
        className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0099dd] text-white font-medium py-4 rounded-xl mb-6 transition-all opacity-0"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.12.098.153.228.166.331.014.103.03.338.017.521z" />
        </svg>
        Войти через Telegram
      </div>
    );
  }

  return (
    <div
      className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0099dd] text-white font-medium py-4 rounded-xl mb-6 transition-all"
      id="telegram-login-button"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.12.098.153.228.166.331.014.103.03.338.017.521z" />
      </svg>
      Войти через Telegram
    </div>
  );
}