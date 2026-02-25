// src/hooks/useMiniApp.js
// Eitaa WebApp SDK Integration
// API مشابه Telegram WebApp است

import { useState, useEffect, useCallback } from 'react';

/**
 * دریافت شیء WebApp از SDK ایتا
 */
const getEitaaWebApp = () => {
  if (typeof window !== 'undefined' && window.Eitaa && window.Eitaa.WebApp) {
    return window.Eitaa.WebApp;
  }
  return null;
};

/**
 * پارس کردن initData از query string
 */
const parseInitData = (initDataStr) => {
  if (!initDataStr) return null;
  try {
    const params = new URLSearchParams(initDataStr);
    const userData = Object.fromEntries(params);
    if (userData.user) {
      userData.user = JSON.parse(userData.user);
    }
    return userData;
  } catch (e) {
    console.warn('useMiniApp: failed to parse initData', e);
    return null;
  }
};

/**
 * هوک اصلی برای استفاده از SDK ایتا
 */
export function useMiniApp() {
  const [isEitaa, setIsEitaa] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [colorScheme, setColorScheme] = useState('light');
  const [themeParams, setThemeParams] = useState({});

  useEffect(() => {
    const wa = getEitaaWebApp();

    if (!wa) {
      console.log('useMiniApp: Eitaa WebApp not detected, running in browser mode');
      setIsEitaa(false);
      setIsReady(true);
      return;
    }

    setIsEitaa(true);

    try { wa.expand(); } catch (e) { console.warn('useMiniApp: expand failed', e); }
    try { wa.ready(); } catch (e) { console.warn('useMiniApp: ready failed', e); }

    try {
      if (wa.initDataUnsafe && wa.initDataUnsafe.user) {
        setUser(wa.initDataUnsafe.user);
      } else if (wa.initData) {
        const parsed = parseInitData(wa.initData);
        if (parsed && parsed.user) setUser(parsed.user);
      }
    } catch (e) { console.warn('useMiniApp: failed to get user data', e); }

    try {
      if (wa.colorScheme) setColorScheme(wa.colorScheme);
      if (wa.themeParams) setThemeParams(wa.themeParams);
    } catch (e) { console.warn('useMiniApp: failed to get theme', e); }

    setIsReady(true);

    try {
      wa.onEvent('themeChanged', () => {
        if (wa.colorScheme) setColorScheme(wa.colorScheme);
        if (wa.themeParams) setThemeParams(wa.themeParams);
      });
    } catch (e) {}
  }, []);

  const close = useCallback(() => {
    const wa = getEitaaWebApp();
    if (wa) { try { wa.close(); } catch (e) {} }
  }, []);

  const sendData = useCallback((data) => {
    const wa = getEitaaWebApp();
    if (wa) { try { wa.sendData(typeof data === 'string' ? data : JSON.stringify(data)); } catch (e) {} }
  }, []);

  const showMainButton = useCallback((text, onClick) => {
    const wa = getEitaaWebApp();
    if (wa && wa.MainButton) {
      try {
        wa.MainButton.setText(text);
        wa.MainButton.onClick(onClick);
        wa.MainButton.show();
      } catch (e) { console.warn('useMiniApp: MainButton error', e); }
    }
  }, []);

  const hideMainButton = useCallback(() => {
    const wa = getEitaaWebApp();
    if (wa && wa.MainButton) { try { wa.MainButton.hide(); } catch (e) {} }
  }, []);

  const showBackButton = useCallback((onClick) => {
    const wa = getEitaaWebApp();
    if (wa && wa.BackButton) {
      try {
        wa.BackButton.onClick(onClick);
        wa.BackButton.show();
      } catch (e) { console.warn('useMiniApp: BackButton error', e); }
    }
  }, []);

  const hideBackButton = useCallback(() => {
    const wa = getEitaaWebApp();
    if (wa && wa.BackButton) { try { wa.BackButton.hide(); } catch (e) {} }
  }, []);

  const hapticImpact = useCallback((style = 'medium') => {
    const wa = getEitaaWebApp();
    if (wa && wa.HapticFeedback) { try { wa.HapticFeedback.impactOccurred(style); } catch (e) {} }
  }, []);

  const hapticNotification = useCallback((type = 'success') => {
    const wa = getEitaaWebApp();
    if (wa && wa.HapticFeedback) { try { wa.HapticFeedback.notificationOccurred(type); } catch (e) {} }
  }, []);

  const hapticSelection = useCallback(() => {
    const wa = getEitaaWebApp();
    if (wa && wa.HapticFeedback) { try { wa.HapticFeedback.selectionChanged(); } catch (e) {} }
  }, []);

  /**
   * ست کردن هندلر دکمه بازگشت گوشی
   * 
   * در محیط ایتا: از Eitaa.WebApp.BackButton (دکمه بک نیتیو) استفاده می‌کند
   * در مرورگر: از History API و رویداد popstate استفاده می‌کند
   * 
   * @param {Function|null} handler - تابع callback هنگام فشار دکمه بک، null = غیرفعال کردن
   * @returns {Function} cleanup function
   */
  const setBackHandler = useCallback((handler) => {
    const wa = getEitaaWebApp();

    if (wa && wa.BackButton) {
      // ── حالت ایتا: BackButton نیتیو SDK ──
      // اول هندلرهای قبلی رو پاک کن
      try { wa.BackButton.offClick(); } catch (e) {}

      if (handler) {
        try {
          wa.BackButton.onClick(handler);
          wa.BackButton.show();
        } catch (e) {
          console.warn('useMiniApp: BackButton.onClick failed', e);
        }
      } else {
        try { wa.BackButton.hide(); } catch (e) {}
      }

      // cleanup: موقع unmount، هندلر رو برداشته و دکمه رو مخفی کن
      return () => {
        try { wa.BackButton.offClick(); } catch (e) {}
        try { wa.BackButton.hide(); } catch (e) {}
      };

    } else {
      // ── حالت مرورگر/اندروید: History API ──
      // با pushState یه state جدید میسازیم تا بک اندروید اون رو pop کنه
      // به جای اینکه مستقیم از اپ خارج بشه
      if (!handler) return () => {};

      // یه state به history اضافه کن
      window.history.pushState({ eitaaBackHandled: true }, '');

      const onPopState = () => {
        handler();
      };

      window.addEventListener('popstate', onPopState);

      // cleanup
      return () => {
        window.removeEventListener('popstate', onPopState);
      };
    }
  }, []);

  return {
    isEitaa,
    isReady,
    user,
    colorScheme,
    themeParams,
    close,
    sendData,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticImpact,
    hapticNotification,
    hapticSelection,
    setBackHandler,
  };
}