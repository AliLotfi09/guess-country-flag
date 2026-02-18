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
 * 
 * این هوک:
 * - اپ را expand می‌کند (تمام‌صفحه)
 * - ready() را صدا می‌زند
 * - اطلاعات کاربر را می‌خواند
 * - تم را می‌خواند
 * - دکمه‌های MainButton و BackButton را کنترل می‌کند
 * - HapticFeedback را مدیریت می‌کند
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
      // در محیط غیر از ایتا (مثلاً مرورگر معمولی)
      console.log('useMiniApp: Eitaa WebApp not detected, running in browser mode');
      setIsEitaa(false);
      setIsReady(true);
      return;
    }

    setIsEitaa(true);

    // ۱. expand - تمام‌صفحه کردن
    try {
      wa.expand();
    } catch (e) {
      console.warn('useMiniApp: expand failed', e);
    }

    // ۲. ready - اعلام آماده بودن برنامک
    try {
      wa.ready();
    } catch (e) {
      console.warn('useMiniApp: ready failed', e);
    }

    // ۳. خواندن اطلاعات کاربر
    try {
      // روش اول: initDataUnsafe (شبیه Telegram)
      if (wa.initDataUnsafe && wa.initDataUnsafe.user) {
        setUser(wa.initDataUnsafe.user);
      }
      // روش دوم: parse از initData string
      else if (wa.initData) {
        const parsed = parseInitData(wa.initData);
        if (parsed && parsed.user) {
          setUser(parsed.user);
        }
      }
    } catch (e) {
      console.warn('useMiniApp: failed to get user data', e);
    }

    // ۴. تم
    try {
      if (wa.colorScheme) {
        setColorScheme(wa.colorScheme);
      }
      if (wa.themeParams) {
        setThemeParams(wa.themeParams);
      }
    } catch (e) {
      console.warn('useMiniApp: failed to get theme', e);
    }

    setIsReady(true);

    // گوش دادن به تغییر تم
    try {
      wa.onEvent('themeChanged', () => {
        if (wa.colorScheme) setColorScheme(wa.colorScheme);
        if (wa.themeParams) setThemeParams(wa.themeParams);
      });
    } catch (e) {
      // این متد ممکن است در همه نسخه‌ها موجود نباشد
    }
  }, []);

  /**
   * بستن برنامک
   */
  const close = useCallback(() => {
    const wa = getEitaaWebApp();
    if (wa) {
      try { wa.close(); } catch (e) {}
    }
  }, []);

  /**
   * ارسال داده به بات (فقط در حالت keyboard button)
   */
  const sendData = useCallback((data) => {
    const wa = getEitaaWebApp();
    if (wa) {
      try { wa.sendData(typeof data === 'string' ? data : JSON.stringify(data)); } catch (e) {}
    }
  }, []);

  /**
   * نمایش دکمه اصلی (MainButton)
   */
  const showMainButton = useCallback((text, onClick) => {
    const wa = getEitaaWebApp();
    if (wa && wa.MainButton) {
      try {
        wa.MainButton.setText(text);
        wa.MainButton.onClick(onClick);
        wa.MainButton.show();
      } catch (e) {
        console.warn('useMiniApp: MainButton error', e);
      }
    }
  }, []);

  /**
   * مخفی کردن دکمه اصلی
   */
  const hideMainButton = useCallback(() => {
    const wa = getEitaaWebApp();
    if (wa && wa.MainButton) {
      try { wa.MainButton.hide(); } catch (e) {}
    }
  }, []);

  /**
   * نمایش دکمه برگشت (BackButton)
   */
  const showBackButton = useCallback((onClick) => {
    const wa = getEitaaWebApp();
    if (wa && wa.BackButton) {
      try {
        wa.BackButton.onClick(onClick);
        wa.BackButton.show();
      } catch (e) {
        console.warn('useMiniApp: BackButton error', e);
      }
    }
  }, []);

  /**
   * مخفی کردن دکمه برگشت
   */
  const hideBackButton = useCallback(() => {
    const wa = getEitaaWebApp();
    if (wa && wa.BackButton) {
      try { wa.BackButton.hide(); } catch (e) {}
    }
  }, []);

  /**
   * لرزش لمسی (HapticFeedback)
   * type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
   */
  const hapticImpact = useCallback((style = 'medium') => {
    const wa = getEitaaWebApp();
    if (wa && wa.HapticFeedback) {
      try { wa.HapticFeedback.impactOccurred(style); } catch (e) {}
    }
  }, []);

  /**
   * لرزش اعلان (HapticFeedback)
   * type: 'error' | 'success' | 'warning'
   */
  const hapticNotification = useCallback((type = 'success') => {
    const wa = getEitaaWebApp();
    if (wa && wa.HapticFeedback) {
      try { wa.HapticFeedback.notificationOccurred(type); } catch (e) {}
    }
  }, []);

  /**
   * لرزش انتخاب (HapticFeedback)
   */
  const hapticSelection = useCallback(() => {
    const wa = getEitaaWebApp();
    if (wa && wa.HapticFeedback) {
      try { wa.HapticFeedback.selectionChanged(); } catch (e) {}
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
  };
}
