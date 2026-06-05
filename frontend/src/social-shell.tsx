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
  | 'languageName'
  | 'feedEyebrow'
  | 'feedDescription'
  | 'notificationsTitle'
  | 'markAsReadAction'
  | 'pendingRequestsTitle'
  | 'wantsToConnect'
  | 'acceptAction'
  | 'rejectAction'
  | 'recentPostsTitle'
  | 'noPostsMessage'
  | 'createFirstPostAction'
  | 'editAction'
  | 'deleteAction'
  | 'noChatMessage'
  | 'adminMessagesTitle'
  | 'noAdminMessages'
  | 'myPostsNavLabel'
  | 'profileEyebrow'
  | 'profilePostsDescription'
  | 'noPostsPublished'
  | 'newPostAction'
  | 'editProfileAction'
  | 'viewPostsPageAction'
  | 'startChatAction'
  | 'noBioMessage'
  | 'logoutAction'
  | 'cancelAction'
  | 'deleteAccountTitle'
  | 'deleteAccountDescription'
  | 'deleteAccountAction'
  | 'deleteAccountConfirmTitle';

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
    feedEyebrow: 'Feed',
    feedDescription: 'Scorri i contenuti dei tuoi amici, lascia un like e condividi foto leggere con emoji.',
    notificationsTitle: 'Notifiche',
    markAsReadAction: 'Segna come letta',
    pendingRequestsTitle: 'Richieste ricevute',
    wantsToConnect: 'vuole collegarsi con te.',
    acceptAction: 'Accetta',
    rejectAction: 'Rifiuta',
    recentPostsTitle: 'Post recenti',
    noPostsMessage: 'Nessun post da mostrare nel feed.',
    createFirstPostAction: 'Crea il primo post',
    editAction: 'Modifica',
    deleteAction: 'Elimina',
    noChatMessage: 'Nessuna chat ancora disponibile.',
    adminMessagesTitle: '📩 Messaggi da utenti',
    noAdminMessages: 'Nessun messaggio da utenti.',
    myPostsNavLabel: 'I miei post',
    profileEyebrow: 'Profilo',
    profilePostsDescription: 'Qui trovi tutti i post pubblicati in ordine dal più recente al più vecchio.',
    noPostsPublished: 'Nessun post pubblicato.',
    newPostAction: 'Nuovo post',
    editProfileAction: 'Modifica profilo',
    viewPostsPageAction: 'Vedi pagina post',
    startChatAction: '💬 Avvia chat',
    noBioMessage: 'Nessuna bio impostata.',
    logoutAction: '🚪 Logout',
    cancelAction: 'Annulla',
    deleteAccountTitle: '🗑️ Elimina account',
    deleteAccountDescription: 'Questa azione è irreversibile. Tutti i tuoi dati verranno eliminati.',
    deleteAccountAction: 'Elimina il mio account',
    deleteAccountConfirmTitle: 'Conferma eliminazione',
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
    feedEyebrow: 'Feed',
    feedDescription: 'Browse your friends\u2019 content, leave a like and share light photos with emojis.',
    notificationsTitle: 'Notifications',
    markAsReadAction: 'Mark as read',
    pendingRequestsTitle: 'Pending requests',
    wantsToConnect: 'wants to connect with you.',
    acceptAction: 'Accept',
    rejectAction: 'Reject',
    recentPostsTitle: 'Recent posts',
    noPostsMessage: 'No posts to show in the feed.',
    createFirstPostAction: 'Create the first post',
    editAction: 'Edit',
    deleteAction: 'Delete',
    noChatMessage: 'No chats available yet.',
    adminMessagesTitle: '📩 User messages',
    noAdminMessages: 'No messages from users.',
    myPostsNavLabel: 'My posts',
    profileEyebrow: 'Profile',
    profilePostsDescription: 'Here you find all posts published from most recent to oldest.',
    noPostsPublished: 'No posts published.',
    newPostAction: 'New post',
    editProfileAction: 'Edit profile',
    viewPostsPageAction: 'View posts page',
    startChatAction: '💬 Start chat',
    noBioMessage: 'No bio set.',
    logoutAction: '🚪 Logout',
    cancelAction: 'Cancel',
    deleteAccountTitle: '🗑️ Delete account',
    deleteAccountDescription: 'This action is irreversible. All your data will be deleted.',
    deleteAccountAction: 'Delete my account',
    deleteAccountConfirmTitle: 'Confirm deletion',
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
    feedEyebrow: 'Feed',
    feedDescription: 'Explora el contenido de tus amigos, deja un me gusta y comparte fotos con emojis.',
    notificationsTitle: 'Notificaciones',
    markAsReadAction: 'Marcar como leída',
    pendingRequestsTitle: 'Solicitudes recibidas',
    wantsToConnect: 'quiere conectarse contigo.',
    acceptAction: 'Aceptar',
    rejectAction: 'Rechazar',
    recentPostsTitle: 'Publicaciones recientes',
    noPostsMessage: 'No hay publicaciones para mostrar en el feed.',
    createFirstPostAction: 'Crear la primera publicación',
    editAction: 'Editar',
    deleteAction: 'Eliminar',
    noChatMessage: 'Aún no hay chats disponibles.',
    adminMessagesTitle: '📩 Mensajes de usuarios',
    noAdminMessages: 'No hay mensajes de usuarios.',
    myPostsNavLabel: 'Mis publicaciones',
    profileEyebrow: 'Perfil',
    profilePostsDescription: 'Aquí encuentras todas las publicaciones del más reciente al más antiguo.',
    noPostsPublished: 'No hay publicaciones.',
    newPostAction: 'Nueva publicación',
    editProfileAction: 'Editar perfil',
    viewPostsPageAction: 'Ver publicaciones',
    startChatAction: '💬 Iniciar chat',
    noBioMessage: 'Sin biografía.',
    logoutAction: '🚪 Cerrar sesión',
    cancelAction: 'Cancelar',
    deleteAccountTitle: '🗑️ Eliminar cuenta',
    deleteAccountDescription: 'Esta acción es irreversible. Todos tus datos serán eliminados.',
    deleteAccountAction: 'Eliminar mi cuenta',
    deleteAccountConfirmTitle: 'Confirmar eliminación',
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
    feedEyebrow: 'Fil',
    feedDescription: 'Parcourez le contenu de vos amis, laissez un like et partagez des photos avec des emojis.',
    notificationsTitle: 'Notifications',
    markAsReadAction: 'Marquer comme lu',
    pendingRequestsTitle: 'Demandes reçues',
    wantsToConnect: 'veut se connecter avec vous.',
    acceptAction: 'Accepter',
    rejectAction: 'Refuser',
    recentPostsTitle: 'Publications récentes',
    noPostsMessage: 'Aucune publication à afficher dans le fil.',
    createFirstPostAction: 'Créer la première publication',
    editAction: 'Modifier',
    deleteAction: 'Supprimer',
    noChatMessage: "Aucune discussion disponible pour l'instant.",
    adminMessagesTitle: '📩 Messages des utilisateurs',
    noAdminMessages: 'Aucun message des utilisateurs.',
    myPostsNavLabel: 'Mes publications',
    profileEyebrow: 'Profil',
    profilePostsDescription: 'Ici vous trouvez toutes les publications du plus récent au plus ancien.',
    noPostsPublished: 'Aucune publication.',
    newPostAction: 'Nouvelle publication',
    editProfileAction: 'Modifier le profil',
    viewPostsPageAction: 'Voir les publications',
    startChatAction: '💬 Démarrer le chat',
    noBioMessage: 'Aucune bio définie.',
    logoutAction: '🚪 Déconnexion',
    cancelAction: 'Annuler',
    deleteAccountTitle: '🗑️ Supprimer le compte',
    deleteAccountDescription: 'Cette action est irréversible. Toutes vos données seront supprimées.',
    deleteAccountAction: 'Supprimer mon compte',
    deleteAccountConfirmTitle: 'Confirmer la suppression',
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
    feedEyebrow: 'Feed',
    feedDescription: 'Durchsuche den Inhalt deiner Freunde, hinterlasse ein Like und teile Fotos mit Emojis.',
    notificationsTitle: 'Benachrichtigungen',
    markAsReadAction: 'Als gelesen markieren',
    pendingRequestsTitle: 'Erhaltene Anfragen',
    wantsToConnect: 'möchte sich mit dir verbinden.',
    acceptAction: 'Annehmen',
    rejectAction: 'Ablehnen',
    recentPostsTitle: 'Neueste Beiträge',
    noPostsMessage: 'Keine Beiträge im Feed anzuzeigen.',
    createFirstPostAction: 'Ersten Beitrag erstellen',
    editAction: 'Bearbeiten',
    deleteAction: 'Löschen',
    noChatMessage: 'Noch keine Chats verfügbar.',
    adminMessagesTitle: '📩 Nachrichten von Nutzern',
    noAdminMessages: 'Keine Nachrichten von Nutzern.',
    myPostsNavLabel: 'Meine Beiträge',
    profileEyebrow: 'Profil',
    profilePostsDescription: 'Hier findest du alle Beiträge vom neuesten zum ältesten.',
    noPostsPublished: 'Keine Beiträge veröffentlicht.',
    newPostAction: 'Neuer Beitrag',
    editProfileAction: 'Profil bearbeiten',
    viewPostsPageAction: 'Beitragsseite ansehen',
    startChatAction: '💬 Chat starten',
    noBioMessage: 'Keine Bio eingestellt.',
    logoutAction: '🚪 Abmelden',
    cancelAction: 'Abbrechen',
    deleteAccountTitle: '🗑️ Konto löschen',
    deleteAccountDescription: 'Diese Aktion ist unumkehrbar. Alle deine Daten werden gelöscht.',
    deleteAccountAction: 'Mein Konto löschen',
    deleteAccountConfirmTitle: 'Löschung bestätigen',
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
    feedEyebrow: '动态',
    feedDescription: '浏览朋友的内容，点赞并分享带有表情的图片。',
    notificationsTitle: '通知',
    markAsReadAction: '标为已读',
    pendingRequestsTitle: '收到的好友请求',
    wantsToConnect: '想与您连接。',
    acceptAction: '接受',
    rejectAction: '拒绝',
    recentPostsTitle: '最新帖子',
    noPostsMessage: '动态中没有帖子可显示。',
    createFirstPostAction: '创建第一篇帖子',
    editAction: '编辑',
    deleteAction: '删除',
    noChatMessage: '暂无聊天记录。',
    adminMessagesTitle: '📩 用户消息',
    noAdminMessages: '没有用户消息。',
    myPostsNavLabel: '我的帖子',
    profileEyebrow: '个人资料',
    profilePostsDescription: '在这里您可以找到从最新到最旧排序的所有帖子。',
    noPostsPublished: '没有已发布的帖子。',
    newPostAction: '新帖子',
    editProfileAction: '编辑资料',
    viewPostsPageAction: '查看帖子页面',
    startChatAction: '💬 开始聊天',
    noBioMessage: '未设置个人简介。',
    logoutAction: '🚪 退出登录',
    cancelAction: '取消',
    deleteAccountTitle: '🗑️ 删除账户',
    deleteAccountDescription: '此操作不可逆。您的所有数据将被删除。',
    deleteAccountAction: '删除我的账户',
    deleteAccountConfirmTitle: '确认删除',
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
