'use client';

import React, { useEffect } from 'react';

export default function AuthPage() {
  useEffect(() => {
    // Функция, которая будет вызвана при успешной аутентификации
    (window as any).onTelegramAuth = (user: any) => {
      console.log('Telegram auth success:', user);
      
      // Отправляем данные на наш backend (маршрут проксируется в nginx)
      fetch('/auth/telegram/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id: user.id.toString(),
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          username: user.username || '',
          photo_url: user.photo_url || '',
          auth_date: user.auth_date.toString(),
          hash: user.hash
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          // Отправляем токен в родительское окно
          window.opener.postMessage({
            type: 'TELEGRAM_AUTH_SUCCESS',
            token: data.access_token
          }, '*');
          
          // Закрываем всплывающее окно
          window.close();
        } else {
          console.error('Auth error:', data);
          alert('Ошибка авторизации: ' + (data.detail || JSON.stringify(data)));
        }
      })
      .catch(error => {
        console.error('Network error:', error);
        alert('Произошла ошибка при соединении с сервером');
      });
    };

    // Динамически добавляем виджет Telegram после загрузки страницы
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'tssvpn_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-lang', 'ru');
    script.async = true;
    
    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 rounded-xl shadow-lg bg-white max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Авторизация через Telegram</h2>
        <div id="telegram-login-container">
          {/* Telegram Login Button will be inserted here */}
        </div>
      </div>
    </div>
  );
}