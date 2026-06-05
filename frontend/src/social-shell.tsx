import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

type PanelName = 'settings' | 'messages' | null;
type LanguageCode = 'it' | 'en' | 'es' | 'fr' | 'de' | 'zh';
type TranslationKey =
  | 'settingsTitle'
  | 'messagesTitle'
  | 'languageSectionTitle'
  | 'chooseLanguageAction'
  | 'languageModalTitle'
  | 'languageModalDescription'
  | 'closeAction'
  | 'privacyLabel'
  | 'contactUsLabel'
  | 'likeDefault'
  | 'likeLiked'
  | 'likeSuffix'
  | 'translateAction'
  | 'translatingAction'
  | 'translationError'
  | 'languageName';

const PANELS = ['settings', 'messages'] as const;
const LANGUAGE_STORAGE_KEY = 'ppm-language';
const LANGUAGES: LanguageCode[] = ['it', 'en', 'es', 'fr', 'de', 'zh'];

const TRANSLATIONS: Record<LanguageCode, Record<TranslationKey, string>> = {
  it: {
    settingsTitle: '⚙️ Impostazioni',
    messagesTitle: '💬 Messaggi',
    languageSectionTitle: '🌐 Lingua',
    chooseLanguageAction: 'Scegli lingua',
    languageModalTitle: 'Seleziona lingua',
    languageModalDescription: "Scegli la lingua dell'interfaccia. I testi dei post restano invariati finché non premi Traduci.",
    closeAction: 'Chiudi',
    privacyLabel: 'Privacy',
    contactUsLabel: 'Contact us',
    likeDefault: '♡ Mi piace',
    likeLiked: '♥ Ti piace',
    likeSuffix: 'like',
    translateAction: 'Traduci',
    translatingAction: 'Traduzione...',
    translationError: 'Traduzione non disponibile al momento.',
    languageName: 'Italiano',
  },
  en: {
    settingsTitle: '⚙️ Settings',
    messagesTitle: '💬 Messages',
    languageSectionTitle: '🌐 Language',
    chooseLanguageAction: 'Choose language',
    languageModalTitle: 'Select language',
    languageModalDescription: 'Choose the interface language. Post texts stay unchanged until you press Translate.',
    closeAction: 'Close',
    privacyLabel: 'Privacy',
    contactUsLabel: 'Contact us',
    likeDefault: '♡ Like',
    likeLiked: '♥ Liked',
    likeSuffix: 'likes',
    translateAction: 'Translate',
    translatingAction: 'Translating...',
    translationError: 'Translation is unavailable right now.',
    languageName: 'English',
  },
  es: {
    settingsTitle: '⚙️ Configuración',
    messagesTitle: '💬 Mensajes',
    languageSectionTitle: '🌐 Idioma',
    chooseLanguageAction: 'Elegir idioma',
    languageModalTitle: 'Seleccionar idioma',
    languageModalDescription: 'Elige el idioma de la interfaz. Los textos de las publicaciones no cambian hasta pulsar Traducir.',
    closeAction: 'Cerrar',
    privacyLabel: 'Privacidad',
    contactUsLabel: 'Contáctanos',
    likeDefault: '♡ Me gusta',
    likeLiked: '♥ Te gusta',
    likeSuffix: 'me gusta',
    translateAction: 'Traducir',
    translatingAction: 'Traduciendo...',
    translationError: 'La traducción no está disponible ahora.',
    languageName: 'Español',
  },
  fr: {
    settingsTitle: '⚙️ Paramètres',
    messagesTitle: '💬 Messages',
    languageSectionTitle: '🌐 Langue',
    chooseLanguageAction: 'Choisir la langue',
    languageModalTitle: 'Choisir la langue',
    languageModalDescription: "Choisissez la langue de l'interface. Les textes des posts ne changent pas tant que vous n'appuyez pas sur Traduire.",
    closeAction: 'Fermer',
    privacyLabel: 'Confidentialité',
    contactUsLabel: 'Contactez-nous',
    likeDefault: "♡ J'aime",
    likeLiked: '♥ Aimé',
    likeSuffix: "j'aime",
    translateAction: 'Traduire',
    translatingAction: 'Traduction...',
    translationError: 'Traduction indisponible pour le moment.',
    languageName: 'Français',
  },
  de: {
    settingsTitle: '⚙️ Einstellungen',
    messagesTitle: '💬 Nachrichten',
    languageSectionTitle: '🌐 Sprache',
    chooseLanguageAction: 'Sprache wählen',
    languageModalTitle: 'Sprache auswählen',
    languageModalDescription: 'Wähle die Sprache der Oberfläche. Post-Texte bleiben unverändert, bis du Übersetzen drückst.',
    closeAction: 'Schließen',
    privacyLabel: 'Datenschutz',
    contactUsLabel: 'Kontakt',
    likeDefault: '♡ Gefällt mir',
    likeLiked: '♥ Gefällt dir',
    likeSuffix: 'Likes',
    translateAction: 'Übersetzen',
    translatingAction: 'Übersetzung...',
    translationError: 'Übersetzung momentan nicht verfügbar.',
    languageName: 'Deutsch',
  },
  zh: {
    settingsTitle: '⚙️ 设置',
    messagesTitle: '💬 消息',
    languageSectionTitle: '🌐 语言',
    chooseLanguageAction: '选择语言',
    languageModalTitle: '选择语言',
    languageModalDescription: '选择界面语言。帖子内容会保持原文，直到你点击翻译。',
    closeAction: '关闭',
    privacyLabel: '隐私',
    contactUsLabel: '联系我们',
    likeDefault: '♡ 赞',
    likeLiked: '♥ 已赞',
    likeSuffix: '赞',
    translateAction: '翻译',
    translatingAction: '翻译中...',
    translationError: '当前无法翻译。',
    languageName: '中文',
  },
};

function syncPanelState(activePanel: PanelName) {
  PANELS.forEach((panelName) => {
    const isOpen = activePanel === panelName;
    const menu = document.querySelector<HTMLElement>(`[data-shell-menu="${panelName}"]`);
    const toggle = document.querySelector<HTMLButtonElement>(`[data-shell-toggle="${panelName}"]`);
    const indicator = document.querySelector<HTMLElement>(`[data-shell-indicator="${panelName}"]`);

    if (menu) {
      menu.hidden = !isOpen;
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isOpen));
    }
    if (indicator) {
      indicator.textContent = isOpen ? '−' : '+';
    }
  });
}

function getSavedLanguage(): LanguageCode {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && LANGUAGES.includes(stored as LanguageCode)) {
    return stored as LanguageCode;
  }
  return 'it';
}

function isTranslationKey(value: string): value is TranslationKey {
  return value in TRANSLATIONS.it;
}

function applyLanguageToUi(language: LanguageCode) {
  const dictionary = TRANSLATIONS[language];

  document.documentElement.lang = language;

  document.querySelectorAll<HTMLElement>('[data-i18n-key]').forEach((element) => {
    const { i18nKey } = element.dataset;
    if (!i18nKey || !isTranslationKey(i18nKey)) {
      return;
    }
    element.textContent = dictionary[i18nKey];
  });

  document.querySelectorAll<HTMLButtonElement>('[data-like-button]').forEach((button) => {
    const state = button.dataset.likeState === 'liked' ? 'liked' : 'default';
    button.textContent = state === 'liked' ? dictionary.likeLiked : dictionary.likeDefault;
  });

  document.querySelectorAll<HTMLElement>('[data-likes-count]').forEach((likesLabel) => {
    const count = likesLabel.dataset.likesCount ?? likesLabel.textContent ?? '0';
    likesLabel.textContent = `${count} ${dictionary.likeSuffix}`;
  });

  document.querySelectorAll<HTMLButtonElement>('[data-post-translate]').forEach((button) => {
    button.textContent = `${dictionary.translateAction} (${dictionary.languageName})`;
  });

  document.querySelectorAll<HTMLButtonElement>('[data-language-option]').forEach((button) => {
    const optionLang = button.dataset.languageOption as LanguageCode | undefined;
    button.setAttribute('aria-pressed', String(optionLang === language));
  });
}

async function translateText(text: string, targetLanguage: LanguageCode): Promise<string | null> {
  const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    return null;
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return null;
  }

  const chunks = payload[0] as unknown[];
  const translated = chunks
    .map((chunk) => (Array.isArray(chunk) && typeof chunk[0] === 'string' ? chunk[0] : ''))
    .join('');

  return translated || null;
}

function ShellController() {
  const [activePanel, setActivePanel] = useState<PanelName>(null);
  const [language, setLanguage] = useState<LanguageCode>('it');

  useEffect(() => {
    syncPanelState(activePanel);
  }, [activePanel]);

  useEffect(() => {
    const toggleHandlers = PANELS.map((panelName) => {
      const toggle = document.querySelector<HTMLButtonElement>(`[data-shell-toggle="${panelName}"]`);
      if (!toggle) {
        return () => undefined;
      }

      const handler = () => {
        setActivePanel((current) => (current === panelName ? null : panelName));
      };

      toggle.addEventListener('click', handler);
      return () => toggle.removeEventListener('click', handler);
    });

    const outsideHandler = (event: MouseEvent) => {
      const target = event.target as Node;
      const panel = document.getElementById('social-shell-root');
      if (panel && !panel.contains(target)) {
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', outsideHandler);
    return () => {
      toggleHandlers.forEach((cleanup) => cleanup());
      document.removeEventListener('mousedown', outsideHandler);
    };
  }, []);

  useEffect(() => {
    const currentLanguage = getSavedLanguage();
    setLanguage(currentLanguage);
    applyLanguageToUi(currentLanguage);
  }, []);

  useEffect(() => {
    const languageDialog = document.getElementById('language-modal') as HTMLDialogElement | null;
    const openLanguageDialogButton = document.querySelector<HTMLButtonElement>('[data-language-open]');
    const closeLanguageDialogButton = document.querySelector<HTMLButtonElement>('[data-language-close]');
    const languageButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-language-option]'));

    const openDialog = () => languageDialog?.showModal();
    const closeDialog = () => languageDialog?.close();

    const onLanguageClick = (event: Event) => {
      const button = event.currentTarget as HTMLButtonElement;
      const selected = button.dataset.languageOption as LanguageCode | undefined;
      if (!selected || selected === language) {
        closeDialog();
        return;
      }

      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, selected);
      window.location.reload();
    };

    openLanguageDialogButton?.addEventListener('click', openDialog);
    closeLanguageDialogButton?.addEventListener('click', closeDialog);
    languageButtons.forEach((button) => button.addEventListener('click', onLanguageClick));

    return () => {
      openLanguageDialogButton?.removeEventListener('click', openDialog);
      closeLanguageDialogButton?.removeEventListener('click', closeDialog);
      languageButtons.forEach((button) => button.removeEventListener('click', onLanguageClick));
    };
  }, [language]);

  useEffect(() => {
    const translateButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-post-translate]'));

    const onTranslateClick = async (event: Event) => {
      const button = event.currentTarget as HTMLButtonElement;
      const postCard = button.closest<HTMLElement>('.post-card');
      const postText = postCard?.querySelector<HTMLElement>('[data-post-text]');
      if (!postText) {
        return;
      }

      const originalText = postText.dataset.originalText ?? postText.textContent ?? '';
      if (!originalText.trim()) {
        return;
      }

      postText.dataset.originalText = originalText;
      button.disabled = true;
      button.textContent = TRANSLATIONS[language].translatingAction;

      const translatedText = await translateText(originalText, language).catch(() => null);
      if (translatedText) {
        postText.textContent = translatedText;
      } else {
        button.textContent = TRANSLATIONS[language].translationError;
        window.setTimeout(() => {
          button.textContent = `${TRANSLATIONS[language].translateAction} (${TRANSLATIONS[language].languageName})`;
          button.disabled = false;
        }, 1200);
        return;
      }

      button.textContent = `${TRANSLATIONS[language].translateAction} (${TRANSLATIONS[language].languageName})`;
      button.disabled = false;
    };

    translateButtons.forEach((button) => button.addEventListener('click', onTranslateClick));
    return () => {
      translateButtons.forEach((button) => button.removeEventListener('click', onTranslateClick));
    };
  }, [language]);

  return null;
}

const rootElement = document.getElementById('social-shell-controls');

if (rootElement) {
  createRoot(rootElement).render(<ShellController />);
}
