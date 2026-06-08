import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

type PanelName = 'settings' | 'messages' | null;
type LanguageCode = 'it' | 'en' | 'es' | 'fr' | 'de' | 'zh';
type ThemeName = 'light' | 'dark';
type TranslationKey =
  | 'settingsTitle'
  | 'messagesTitle'
  | 'languageSectionTitle'
  | 'chooseLanguageAction'
  | 'themeToggleAction'
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
  | 'deleteAccountConfirmTitle'
  | 'myProfileLabel'
  | 'discoverUsersLabel'
  | 'usersLabel'
  | 'newPostDescription'
  | 'postTextLabel'
  | 'postPhotoLabel'
  | 'quickEmojisLabel'
  | 'noFileSelected'
  | 'selectedFilePrefix'
  | 'savePostAction'
  | 'settingsEyebrow'
  | 'editProfileDescription'
  | 'firstNameLabel'
  | 'lastNameLabel'
  | 'emailLabel'
  | 'bioLabel'
  | 'profilePhotoLabel'
  | 'saveProfileAction'
  | 'chatEyebrow'
  | 'chatDescription'
  | 'deleteChatAction'
  | 'chatNoMessagesPrefix'
  | 'maxPhotoSize'
  | 'confirmPasswordLabel'
  | 'usernameLabel'
  | 'passwordLabel'
  | 'loginAction'
  | 'createAccountAction'
  | 'requiredFieldMessage'
  | 'postContentPlaceholder'
  | 'usernamePlaceholder'
  | 'firstNamePlaceholder'
  | 'lastNamePlaceholder'
  | 'emailPlaceholder'
  | 'bioPlaceholder'
  | 'noAccountPrompt'
  | 'signupNowAction'
  | 'hasAccountPrompt'
  | 'currentFileLabel'
  | 'changeFileLabel'
  | 'chooseFileAction'
  | 'removePhotoAction'
  | 'newMessageLabel'
  | 'sendAction'
  | 'openProfileAction'
  | 'loginEyebrow'
  | 'loginTitle'
  | 'loginSubtitle'
  | 'signupEyebrow'
  | 'signupTitle'
  | 'signupSubtitle'
  | 'availableUsersTitle'
  | 'availableUsersDescription'
  | 'profileAction'
  | 'addAction'
  | 'messageAction'
  | 'noOtherUsersMessage'
  | 'chatWithTemplate'
  | 'descriptionLabel'
  | 'roleLabel'
  | 'nameLabel'
  | 'emailLabelWithColon'
  | 'notAvailableLabel'
  | 'chatMessagePlaceholder'
  | 'privacyModalTitle'
  | 'privacyModalParagraph1'
  | 'privacyModalParagraph2'
  | 'privacyModalParagraph3'
  | 'privacyModalParagraph4'
  | 'contactModalTitle'
  | 'contactModalDescription'
  | 'messageLabel'
  | 'contactMessagePlaceholder'
  | 'mustBeAuthenticatedMessage'
  | 'authenticatedLinkLabel'
  | 'unknownRoleLabel'
  | 'roleStandard'
  | 'roleModerator';

const PANELS = ['settings', 'messages'] as const;
const LANGUAGE_STORAGE_KEY = 'ppm-language';
const THEME_STORAGE_KEY = 'ppm-theme';
const LANGUAGES: LanguageCode[] = ['it', 'en', 'es', 'fr', 'de', 'zh'];

const TRANSLATIONS: Record<LanguageCode, Record<TranslationKey, string>> = {
  it: {
    settingsTitle: '⚙️ Impostazioni',
    messagesTitle: '💬 Messaggi',
    languageSectionTitle: '🌐 Lingua',
    chooseLanguageAction: 'Scegli lingua',
    themeToggleAction: 'Cambio tema',
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
    myProfileLabel: 'Il mio profilo',
    discoverUsersLabel: 'Scopri utenti',
    usersLabel: 'Utenti',
    newPostDescription: 'Aggiungi testo, emoji e una foto al tuo post.',
    postTextLabel: 'Testo del post',
    postPhotoLabel: 'Foto del post',
    quickEmojisLabel: 'Emoji rapide',
    noFileSelected: 'Nessun file selezionato.',
    selectedFilePrefix: 'File selezionato',
    savePostAction: 'Salva post',
    settingsEyebrow: 'Impostazioni',
    editProfileDescription: 'Aggiorna i tuoi dati e aggiungi una foto profilo leggera.',
    firstNameLabel: 'Nome',
    lastNameLabel: 'Cognome',
    emailLabel: 'Email',
    bioLabel: 'Bio',
    profilePhotoLabel: 'Foto profilo',
    saveProfileAction: 'Salva profilo',
    chatEyebrow: 'Messaggi',
    chatDescription: 'La chat resta disponibile nel menu messaggi finché non la elimini.',
    deleteChatAction: 'Elimina chat',
    chatNoMessagesPrefix: 'Nessun messaggio ancora. Inizia la conversazione con',
    maxPhotoSize: 'Massimo 450 KB e 1600×1600 px.',
    confirmPasswordLabel: 'Conferma password',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    loginAction: 'Accedi',
    createAccountAction: 'Crea account',
    requiredFieldMessage: 'Compila questo campo.',
    postContentPlaceholder: 'Condividi un pensiero, una foto o una emoji ✨',
    usernamePlaceholder: 'Scegli un username',
    firstNamePlaceholder: 'Nome',
    lastNamePlaceholder: 'Cognome',
    emailPlaceholder: 'email@esempio.it',
    bioPlaceholder: 'Racconta qualcosa di te',
    noAccountPrompt: 'Non hai un account?',
    signupNowAction: 'Registrati ora',
    hasAccountPrompt: 'Hai già un account?',
    currentFileLabel: 'Attualmente',
    changeFileLabel: 'Modifica',
    chooseFileAction: 'Scegli file',
    removePhotoAction: 'Rimuovi foto',
    newMessageLabel: 'Nuovo messaggio',
    sendAction: 'Invia',
    openProfileAction: 'Apri profilo',
    loginEyebrow: 'Bentornato',
    loginTitle: 'Accedi al tuo social.',
    loginSubtitle: 'Rientra nel feed, controlla le chat e pubblica nuovi contenuti in pochi click.',
    signupEyebrow: 'Nuovo account',
    signupTitle: 'Crea il tuo profilo.',
    signupSubtitle: 'Registrati per entrare nel feed, aggiungere amici, lasciare like e iniziare a chattare.',
    availableUsersTitle: 'Utenti disponibili',
    availableUsersDescription: 'Scopri profili, invia richieste di amicizia e apri nuove chat.',
    profileAction: 'Profilo',
    addAction: 'Aggiungi',
    messageAction: 'Messaggio',
    noOtherUsersMessage: 'Nessun altro utente disponibile.',
    chatWithTemplate: 'Chat con {username}',
    descriptionLabel: 'Descrizione:',
    roleLabel: 'Ruolo:',
    nameLabel: 'Nome:',
    emailLabelWithColon: 'Email:',
    notAvailableLabel: 'Non disponibile',
    chatMessagePlaceholder: 'Scrivi un messaggio o aggiungi una emoji 💬',
    privacyModalTitle: 'Privacy Policy',
    privacyModalParagraph1: 'Questa piattaforma raccoglie i dati personali forniti durante la registrazione (username, password) al solo scopo di fornire il servizio di social network.',
    privacyModalParagraph2: 'I dati non vengono ceduti a terzi né utilizzati per scopi commerciali. Le immagini caricate sono visibili agli altri utenti registrati.',
    privacyModalParagraph3: 'Hai diritto di accedere, modificare o cancellare i tuoi dati in qualsiasi momento tramite le impostazioni del profilo.',
    privacyModalParagraph4: 'Per qualsiasi richiesta relativa alla privacy, utilizza la funzione "Contact us".',
    contactModalTitle: "Contatta l'admin",
    contactModalDescription: "Invia un messaggio privato all'amministratore della piattaforma.",
    messageLabel: 'Messaggio',
    contactMessagePlaceholder: 'Scrivi il tuo messaggio...',
    mustBeAuthenticatedMessage: 'Devi essere {link} per inviare un messaggio.',
    authenticatedLinkLabel: 'autenticato',
    unknownRoleLabel: 'Ruolo non disponibile',
    roleStandard: 'Utente standard',
    roleModerator: 'Moderatore',
  },
  en: {
    settingsTitle: '⚙️ Settings',
    messagesTitle: '💬 Messages',
    languageSectionTitle: '🌐 Language',
    chooseLanguageAction: 'Choose language',
    themeToggleAction: 'Switch theme',
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
    myProfileLabel: 'My profile',
    discoverUsersLabel: 'Discover users',
    usersLabel: 'Users',
    newPostDescription: 'Add text, emojis and a photo to your post.',
    postTextLabel: 'Post text',
    postPhotoLabel: 'Post photo',
    quickEmojisLabel: 'Quick emojis',
    noFileSelected: 'No file selected.',
    selectedFilePrefix: 'Selected file',
    savePostAction: 'Save post',
    settingsEyebrow: 'Settings',
    editProfileDescription: 'Update your info and add a lightweight profile photo.',
    firstNameLabel: 'First name',
    lastNameLabel: 'Last name',
    emailLabel: 'Email',
    bioLabel: 'Bio',
    profilePhotoLabel: 'Profile photo',
    saveProfileAction: 'Save profile',
    chatEyebrow: 'Messages',
    chatDescription: 'The chat remains available in the messages menu until you delete it.',
    deleteChatAction: 'Delete chat',
    chatNoMessagesPrefix: 'No messages yet. Start the conversation with',
    maxPhotoSize: 'Maximum 450 KB and 1600×1600 px.',
    confirmPasswordLabel: 'Confirm password',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    loginAction: 'Sign in',
    createAccountAction: 'Create account',
    requiredFieldMessage: 'Please fill out this field.',
    postContentPlaceholder: 'Share a thought, a photo or an emoji ✨',
    usernamePlaceholder: 'Choose a username',
    firstNamePlaceholder: 'First name',
    lastNamePlaceholder: 'Last name',
    emailPlaceholder: 'email@example.com',
    bioPlaceholder: 'Tell us something about you',
    noAccountPrompt: 'Don’t have an account?',
    signupNowAction: 'Sign up now',
    hasAccountPrompt: 'Already have an account?',
    currentFileLabel: 'Currently',
    changeFileLabel: 'Change',
    chooseFileAction: 'Choose file',
    removePhotoAction: 'Remove photo',
    newMessageLabel: 'New message',
    sendAction: 'Send',
    openProfileAction: 'Open profile',
    loginEyebrow: 'Welcome back',
    loginTitle: 'Sign in to your social.',
    loginSubtitle: 'Jump back into the feed, check your chats and post new content in a few clicks.',
    signupEyebrow: 'New account',
    signupTitle: 'Create your profile.',
    signupSubtitle: 'Register to join the feed, add friends, leave likes and start chatting.',
    availableUsersTitle: 'Available users',
    availableUsersDescription: 'Discover profiles, send friend requests and open new chats.',
    profileAction: 'Profile',
    addAction: 'Add',
    messageAction: 'Message',
    noOtherUsersMessage: 'No other users available.',
    chatWithTemplate: 'Chat with {username}',
    descriptionLabel: 'Description:',
    roleLabel: 'Role:',
    nameLabel: 'Name:',
    emailLabelWithColon: 'Email:',
    notAvailableLabel: 'Not available',
    chatMessagePlaceholder: 'Write a message or add an emoji 💬',
    privacyModalTitle: 'Privacy Policy',
    privacyModalParagraph1: 'This platform collects personal data provided during registration (username, password) only to provide the social network service.',
    privacyModalParagraph2: 'Data is not shared with third parties and is not used for commercial purposes. Uploaded images are visible to other registered users.',
    privacyModalParagraph3: 'You can access, edit or delete your data at any time through profile settings.',
    privacyModalParagraph4: 'For any privacy-related request, use the "Contact us" function.',
    contactModalTitle: 'Contact admin',
    contactModalDescription: "Send a private message to the platform administrator.",
    messageLabel: 'Message',
    contactMessagePlaceholder: 'Write your message...',
    mustBeAuthenticatedMessage: 'You must be {link} to send a message.',
    authenticatedLinkLabel: 'authenticated',
    unknownRoleLabel: 'Role unavailable',
    roleStandard: 'Standard user',
    roleModerator: 'Moderator',
  },
  es: {
    settingsTitle: '⚙️ Configuración',
    messagesTitle: '💬 Mensajes',
    languageSectionTitle: '🌐 Idioma',
    chooseLanguageAction: 'Elegir idioma',
    themeToggleAction: 'Cambiar tema',
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
    myProfileLabel: 'Mi perfil',
    discoverUsersLabel: 'Descubrir usuarios',
    usersLabel: 'Usuarios',
    newPostDescription: 'Añade texto, emoji y una foto a tu publicación.',
    postTextLabel: 'Texto de la publicación',
    postPhotoLabel: 'Foto de la publicación',
    quickEmojisLabel: 'Emojis rápidos',
    noFileSelected: 'Ningún archivo seleccionado.',
    selectedFilePrefix: 'Archivo seleccionado',
    savePostAction: 'Guardar publicación',
    settingsEyebrow: 'Configuración',
    editProfileDescription: 'Actualiza tus datos y añade una foto de perfil ligera.',
    firstNameLabel: 'Nombre',
    lastNameLabel: 'Apellido',
    emailLabel: 'Correo electrónico',
    bioLabel: 'Biografía',
    profilePhotoLabel: 'Foto de perfil',
    saveProfileAction: 'Guardar perfil',
    chatEyebrow: 'Mensajes',
    chatDescription: 'El chat permanece disponible en el menú de mensajes hasta que lo elimines.',
    deleteChatAction: 'Eliminar chat',
    chatNoMessagesPrefix: 'Aún no hay mensajes. Empieza la conversación con',
    maxPhotoSize: 'Máximo 450 KB y 1600×1600 px.',
    confirmPasswordLabel: 'Confirmar contraseña',
    usernameLabel: 'Nombre de usuario',
    passwordLabel: 'Contraseña',
    loginAction: 'Iniciar sesión',
    createAccountAction: 'Crear cuenta',
    requiredFieldMessage: 'Completa este campo.',
    postContentPlaceholder: 'Comparte un pensamiento, una foto o un emoji ✨',
    usernamePlaceholder: 'Elige un nombre de usuario',
    firstNamePlaceholder: 'Nombre',
    lastNamePlaceholder: 'Apellido',
    emailPlaceholder: 'correo@ejemplo.com',
    bioPlaceholder: 'Cuéntanos algo sobre ti',
    noAccountPrompt: '¿No tienes una cuenta?',
    signupNowAction: 'Regístrate ahora',
    hasAccountPrompt: '¿Ya tienes una cuenta?',
    currentFileLabel: 'Actualmente',
    changeFileLabel: 'Cambiar',
    chooseFileAction: 'Elegir archivo',
    removePhotoAction: 'Quitar foto',
    newMessageLabel: 'Nuevo mensaje',
    sendAction: 'Enviar',
    openProfileAction: 'Abrir perfil',
    loginEyebrow: 'Bienvenido de nuevo',
    loginTitle: 'Accede a tu red social.',
    loginSubtitle: 'Vuelve al feed, revisa los chats y publica nuevo contenido en pocos clics.',
    signupEyebrow: 'Nueva cuenta',
    signupTitle: 'Crea tu perfil.',
    signupSubtitle: 'Regístrate para unirte al feed, añadir amigos, dar me gusta y empezar a chatear.',
    availableUsersTitle: 'Usuarios disponibles',
    availableUsersDescription: 'Descubre perfiles, envía solicitudes de amistad y abre nuevos chats.',
    profileAction: 'Perfil',
    addAction: 'Añadir',
    messageAction: 'Mensaje',
    noOtherUsersMessage: 'No hay otros usuarios disponibles.',
    chatWithTemplate: 'Chat con {username}',
    descriptionLabel: 'Descripción:',
    roleLabel: 'Rol:',
    nameLabel: 'Nombre:',
    emailLabelWithColon: 'Correo electrónico:',
    notAvailableLabel: 'No disponible',
    chatMessagePlaceholder: 'Escribe un mensaje o añade un emoji 💬',
    privacyModalTitle: 'Política de privacidad',
    privacyModalParagraph1: 'Esta plataforma recopila los datos personales proporcionados durante el registro (usuario y contraseña) únicamente para ofrecer el servicio de red social.',
    privacyModalParagraph2: 'Los datos no se ceden a terceros ni se usan con fines comerciales. Las imágenes subidas son visibles para otros usuarios registrados.',
    privacyModalParagraph3: 'Puedes acceder, editar o eliminar tus datos en cualquier momento desde la configuración del perfil.',
    privacyModalParagraph4: 'Para cualquier solicitud relacionada con la privacidad, usa la función "Contáctanos".',
    contactModalTitle: 'Contactar al admin',
    contactModalDescription: 'Envía un mensaje privado al administrador de la plataforma.',
    messageLabel: 'Mensaje',
    contactMessagePlaceholder: 'Escribe tu mensaje...',
    mustBeAuthenticatedMessage: 'Debes estar {link} para enviar un mensaje.',
    authenticatedLinkLabel: 'autenticado',
    unknownRoleLabel: 'Rol no disponible',
    roleStandard: 'Usuario estándar',
    roleModerator: 'Moderador',
  },
  fr: {
    settingsTitle: '⚙️ Paramètres',
    messagesTitle: '💬 Messages',
    languageSectionTitle: '🌐 Langue',
    chooseLanguageAction: 'Choisir la langue',
    themeToggleAction: 'Changer le thème',
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
    myProfileLabel: 'Mon profil',
    discoverUsersLabel: 'Découvrir des utilisateurs',
    usersLabel: 'Utilisateurs',
    newPostDescription: 'Ajoutez du texte, des emojis et une photo à votre publication.',
    postTextLabel: 'Texte de la publication',
    postPhotoLabel: 'Photo de la publication',
    quickEmojisLabel: 'Emojis rapides',
    noFileSelected: 'Aucun fichier sélectionné.',
    selectedFilePrefix: 'Fichier sélectionné',
    savePostAction: 'Enregistrer la publication',
    settingsEyebrow: 'Paramètres',
    editProfileDescription: 'Mettez à jour vos informations et ajoutez une photo de profil légère.',
    firstNameLabel: 'Prénom',
    lastNameLabel: 'Nom',
    emailLabel: 'Email',
    bioLabel: 'Bio',
    profilePhotoLabel: 'Photo de profil',
    saveProfileAction: 'Enregistrer le profil',
    chatEyebrow: 'Messages',
    chatDescription: "La discussion reste disponible dans le menu messages jusqu'à ce que vous la supprimiez.",
    deleteChatAction: 'Supprimer la discussion',
    chatNoMessagesPrefix: "Aucun message pour l'instant. Commencez la conversation avec",
    maxPhotoSize: 'Maximum 450 Ko et 1600×1600 px.',
    confirmPasswordLabel: 'Confirmer le mot de passe',
    usernameLabel: 'Nom d’utilisateur',
    passwordLabel: 'Mot de passe',
    loginAction: 'Se connecter',
    createAccountAction: 'Créer un compte',
    requiredFieldMessage: 'Veuillez renseigner ce champ.',
    postContentPlaceholder: 'Partagez une pensée, une photo ou un emoji ✨',
    usernamePlaceholder: "Choisissez un nom d'utilisateur",
    firstNamePlaceholder: 'Prénom',
    lastNamePlaceholder: 'Nom',
    emailPlaceholder: 'email@exemple.fr',
    bioPlaceholder: 'Parlez-nous un peu de vous',
    noAccountPrompt: 'Vous n’avez pas de compte ?',
    signupNowAction: 'Inscrivez-vous maintenant',
    hasAccountPrompt: 'Vous avez déjà un compte ?',
    currentFileLabel: 'Actuellement',
    changeFileLabel: 'Modifier',
    chooseFileAction: 'Choisir un fichier',
    removePhotoAction: 'Supprimer la photo',
    newMessageLabel: 'Nouveau message',
    sendAction: 'Envoyer',
    openProfileAction: 'Ouvrir le profil',
    loginEyebrow: 'Bon retour',
    loginTitle: 'Connectez-vous à votre réseau.',
    loginSubtitle: 'Retournez au fil, consultez vos discussions et publiez de nouveaux contenus en quelques clics.',
    signupEyebrow: 'Nouveau compte',
    signupTitle: 'Créez votre profil.',
    signupSubtitle: "Inscrivez-vous pour rejoindre le fil, ajouter des amis, laisser des likes et commencer à discuter.",
    availableUsersTitle: 'Utilisateurs disponibles',
    availableUsersDescription: 'Découvrez des profils, envoyez des demandes d’amitié et ouvrez de nouvelles discussions.',
    profileAction: 'Profil',
    addAction: 'Ajouter',
    messageAction: 'Message',
    noOtherUsersMessage: 'Aucun autre utilisateur disponible.',
    chatWithTemplate: 'Discussion avec {username}',
    descriptionLabel: 'Description :',
    roleLabel: 'Rôle :',
    nameLabel: 'Nom :',
    emailLabelWithColon: 'Email :',
    notAvailableLabel: 'Non disponible',
    chatMessagePlaceholder: 'Écrivez un message ou ajoutez un emoji 💬',
    privacyModalTitle: 'Politique de confidentialité',
    privacyModalParagraph1: 'Cette plateforme collecte les données personnelles fournies lors de l’inscription (nom d’utilisateur, mot de passe) uniquement pour fournir le service de réseau social.',
    privacyModalParagraph2: 'Les données ne sont pas cédées à des tiers ni utilisées à des fins commerciales. Les images téléchargées sont visibles par les autres utilisateurs inscrits.',
    privacyModalParagraph3: 'Vous pouvez accéder, modifier ou supprimer vos données à tout moment depuis les paramètres du profil.',
    privacyModalParagraph4: 'Pour toute demande liée à la confidentialité, utilisez la fonction « Contactez-nous ».',
    contactModalTitle: "Contacter l'admin",
    contactModalDescription: "Envoyez un message privé à l'administrateur de la plateforme.",
    messageLabel: 'Message',
    contactMessagePlaceholder: 'Écrivez votre message...',
    mustBeAuthenticatedMessage: 'Vous devez être {link} pour envoyer un message.',
    authenticatedLinkLabel: 'authentifié',
    unknownRoleLabel: 'Rôle indisponible',
    roleStandard: 'Utilisateur standard',
    roleModerator: 'Modérateur',
  },
  de: {
    settingsTitle: '⚙️ Einstellungen',
    messagesTitle: '💬 Nachrichten',
    languageSectionTitle: '🌐 Sprache',
    chooseLanguageAction: 'Sprache wählen',
    themeToggleAction: 'Thema wechseln',
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
    myProfileLabel: 'Mein Profil',
    discoverUsersLabel: 'Nutzer entdecken',
    usersLabel: 'Nutzer',
    newPostDescription: 'Füge Text, Emojis und ein Foto zu deinem Beitrag hinzu.',
    postTextLabel: 'Beitragstext',
    postPhotoLabel: 'Beitragsfoto',
    quickEmojisLabel: 'Schnelle Emojis',
    noFileSelected: 'Keine Datei ausgewählt.',
    selectedFilePrefix: 'Ausgewählte Datei',
    savePostAction: 'Beitrag speichern',
    settingsEyebrow: 'Einstellungen',
    editProfileDescription: 'Aktualisiere deine Daten und füge ein leichtes Profilbild hinzu.',
    firstNameLabel: 'Vorname',
    lastNameLabel: 'Nachname',
    emailLabel: 'E-Mail',
    bioLabel: 'Biografie',
    profilePhotoLabel: 'Profilbild',
    saveProfileAction: 'Profil speichern',
    chatEyebrow: 'Nachrichten',
    chatDescription: 'Der Chat ist im Nachrichtenmenü verfügbar, bis du ihn löschst.',
    deleteChatAction: 'Chat löschen',
    chatNoMessagesPrefix: 'Noch keine Nachrichten. Starte die Unterhaltung mit',
    maxPhotoSize: 'Maximal 450 KB und 1600×1600 px.',
    confirmPasswordLabel: 'Passwort bestätigen',
    usernameLabel: 'Benutzername',
    passwordLabel: 'Passwort',
    loginAction: 'Anmelden',
    createAccountAction: 'Konto erstellen',
    requiredFieldMessage: 'Bitte fülle dieses Feld aus.',
    postContentPlaceholder: 'Teile einen Gedanken, ein Foto oder ein Emoji ✨',
    usernamePlaceholder: 'Wähle einen Benutzernamen',
    firstNamePlaceholder: 'Vorname',
    lastNamePlaceholder: 'Nachname',
    emailPlaceholder: 'email@beispiel.de',
    bioPlaceholder: 'Erzähl etwas über dich',
    noAccountPrompt: 'Du hast noch kein Konto?',
    signupNowAction: 'Jetzt registrieren',
    hasAccountPrompt: 'Hast du schon ein Konto?',
    currentFileLabel: 'Aktuell',
    changeFileLabel: 'Ändern',
    chooseFileAction: 'Datei auswählen',
    removePhotoAction: 'Foto entfernen',
    newMessageLabel: 'Neue Nachricht',
    sendAction: 'Senden',
    openProfileAction: 'Profil öffnen',
    loginEyebrow: 'Willkommen zurück',
    loginTitle: 'Melde dich in deinem Netzwerk an.',
    loginSubtitle: 'Kehre zum Feed zurück, prüfe deine Chats und veröffentliche neue Inhalte mit wenigen Klicks.',
    signupEyebrow: 'Neues Konto',
    signupTitle: 'Erstelle dein Profil.',
    signupSubtitle: 'Registriere dich, um dem Feed beizutreten, Freunde hinzuzufügen, Likes zu geben und zu chatten.',
    availableUsersTitle: 'Verfügbare Nutzer',
    availableUsersDescription: 'Entdecke Profile, sende Freundschaftsanfragen und starte neue Chats.',
    profileAction: 'Profil',
    addAction: 'Hinzufügen',
    messageAction: 'Nachricht',
    noOtherUsersMessage: 'Keine anderen Nutzer verfügbar.',
    chatWithTemplate: 'Chat mit {username}',
    descriptionLabel: 'Beschreibung:',
    roleLabel: 'Rolle:',
    nameLabel: 'Name:',
    emailLabelWithColon: 'E-Mail:',
    notAvailableLabel: 'Nicht verfügbar',
    chatMessagePlaceholder: 'Schreibe eine Nachricht oder füge ein Emoji hinzu 💬',
    privacyModalTitle: 'Datenschutzerklärung',
    privacyModalParagraph1: 'Diese Plattform sammelt die bei der Registrierung angegebenen personenbezogenen Daten (Benutzername, Passwort) ausschließlich zur Bereitstellung des sozialen Netzwerks.',
    privacyModalParagraph2: 'Die Daten werden nicht an Dritte weitergegeben und nicht zu kommerziellen Zwecken verwendet. Hochgeladene Bilder sind für andere registrierte Nutzer sichtbar.',
    privacyModalParagraph3: 'Du kannst jederzeit über die Profileinstellungen auf deine Daten zugreifen, sie ändern oder löschen.',
    privacyModalParagraph4: 'Für alle datenschutzbezogenen Anfragen nutze die Funktion „Kontakt“.',
    contactModalTitle: 'Admin kontaktieren',
    contactModalDescription: 'Sende eine private Nachricht an den Administrator der Plattform.',
    messageLabel: 'Nachricht',
    contactMessagePlaceholder: 'Schreibe deine Nachricht...',
    mustBeAuthenticatedMessage: 'Du musst {link} um eine Nachricht zu senden.',
    authenticatedLinkLabel: 'angemeldet sein',
    unknownRoleLabel: 'Rolle nicht verfügbar',
    roleStandard: 'Standardnutzer',
    roleModerator: 'Moderator',
  },
  zh: {
    settingsTitle: '⚙️ 设置',
    messagesTitle: '💬 消息',
    languageSectionTitle: '🌐 语言',
    chooseLanguageAction: '选择语言',
    themeToggleAction: '切换主题',
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
    myProfileLabel: '我的主页',
    discoverUsersLabel: '发现用户',
    usersLabel: '用户',
    newPostDescription: '为你的帖子添加文字、表情和图片。',
    postTextLabel: '帖子文字',
    postPhotoLabel: '帖子图片',
    quickEmojisLabel: '快捷表情',
    noFileSelected: '未选择文件。',
    selectedFilePrefix: '已选择文件',
    savePostAction: '保存帖子',
    settingsEyebrow: '设置',
    editProfileDescription: '更新您的信息并添加一张轻量级头像。',
    firstNameLabel: '名字',
    lastNameLabel: '姓氏',
    emailLabel: '邮箱',
    bioLabel: '个人简介',
    profilePhotoLabel: '头像',
    saveProfileAction: '保存资料',
    chatEyebrow: '消息',
    chatDescription: '聊天记录在消息菜单中保持可用，直到你删除它。',
    deleteChatAction: '删除聊天',
    chatNoMessagesPrefix: '还没有消息。开始与',
    maxPhotoSize: '最大 450 KB，1600×1600 像素。',
    confirmPasswordLabel: '确认密码',
    usernameLabel: '用户名',
    passwordLabel: '密码',
    loginAction: '登录',
    createAccountAction: '创建账户',
    requiredFieldMessage: '请填写此字段。',
    postContentPlaceholder: '分享一个想法、照片或表情 ✨',
    usernamePlaceholder: '选择用户名',
    firstNamePlaceholder: '名字',
    lastNamePlaceholder: '姓氏',
    emailPlaceholder: 'email@example.com',
    bioPlaceholder: '介绍一下你自己',
    noAccountPrompt: '还没有账号？',
    signupNowAction: '立即注册',
    hasAccountPrompt: '已有账号？',
    currentFileLabel: '当前',
    changeFileLabel: '修改',
    chooseFileAction: '选择文件',
    removePhotoAction: '移除头像',
    newMessageLabel: '新消息',
    sendAction: '发送',
    openProfileAction: '打开资料',
    loginEyebrow: '欢迎回来',
    loginTitle: '登录你的社交网络。',
    loginSubtitle: '回到动态，查看聊天，几步发布新内容。',
    signupEyebrow: '新账户',
    signupTitle: '创建你的个人资料。',
    signupSubtitle: '注册加入动态，添加朋友，点赞并开始聊天。',
    availableUsersTitle: '可用用户',
    availableUsersDescription: '查看个人资料、发送好友请求并开启新聊天。',
    profileAction: '资料',
    addAction: '添加',
    messageAction: '消息',
    noOtherUsersMessage: '没有其他可用用户。',
    chatWithTemplate: '与 {username} 聊天',
    descriptionLabel: '描述：',
    roleLabel: '角色：',
    nameLabel: '姓名：',
    emailLabelWithColon: '邮箱：',
    notAvailableLabel: '不可用',
    chatMessagePlaceholder: '输入消息或添加表情 💬',
    privacyModalTitle: '隐私政策',
    privacyModalParagraph1: '本平台仅为提供社交网络服务而收集注册时提供的个人数据（用户名、密码）。',
    privacyModalParagraph2: '数据不会提供给第三方，也不会用于商业目的。上传的图片对其他已注册用户可见。',
    privacyModalParagraph3: '您可以随时在个人资料设置中访问、修改或删除您的数据。',
    privacyModalParagraph4: '如有任何隐私相关请求，请使用“联系我们”功能。',
    contactModalTitle: '联系管理员',
    contactModalDescription: '向平台管理员发送私信。',
    messageLabel: '消息',
    contactMessagePlaceholder: '输入你的消息...',
    mustBeAuthenticatedMessage: '你必须先{link}才能发送消息。',
    authenticatedLinkLabel: '登录',
    unknownRoleLabel: '角色不可用',
    roleStandard: '普通用户',
    roleModerator: '版主',
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
  return 'en';
}

function getSavedTheme(): ThemeName {
  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

function applyThemeToUi(theme: ThemeName, language: LanguageCode) {
  document.body.dataset.theme = theme;
  const icon = theme === 'dark' ? '🌙' : '☀️';
  const label = TRANSLATIONS[language].themeToggleAction;

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', `${label}: ${icon}`);
    const iconElement = button.querySelector<HTMLElement>('[data-theme-icon]');
    if (iconElement) {
      iconElement.textContent = icon;
    }
  });
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

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (!key || !isTranslationKey(key)) {
      return;
    }
    element.placeholder = dictionary[key];
  });

  document
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('form input[required], form textarea[required], form select[required]')
    .forEach((field) => {
      field.dataset.requiredMessage = dictionary.requiredFieldMessage;
      if (field.dataset.i18nValidationBound === 'true') {
        return;
      }
      field.dataset.i18nValidationBound = 'true';
      field.addEventListener('invalid', () => {
        if (!field.validity.valueMissing) {
          return;
        }
        const requiredMessage = field.dataset.requiredMessage ?? dictionary.requiredFieldMessage;
        field.setCustomValidity(requiredMessage);
      });
      const clearValidityMessage = () => {
        field.setCustomValidity('');
      };
      field.addEventListener('input', clearValidityMessage);
      field.addEventListener('change', clearValidityMessage);
    });

  document.querySelectorAll<HTMLElement>('[data-selected-file]').forEach((element) => {
    element.dataset.selectedFilePrefix = dictionary.selectedFilePrefix;
    element.dataset.noFileText = dictionary.noFileSelected;
    const fileInputId = element.dataset.fileInputId;
    const fileInput = fileInputId ? document.getElementById(fileInputId) as HTMLInputElement | null : null;
    const file = fileInput?.files?.[0];
    element.textContent = file ? `${dictionary.selectedFilePrefix}: ${file.name}` : dictionary.noFileSelected;
  });

  document.querySelectorAll<HTMLInputElement>('input[type="file"][data-i18n-file-input]').forEach((fileInput) => {
    if (fileInput.dataset.i18nFileBound === 'true') {
      return;
    }
    fileInput.dataset.i18nFileBound = 'true';
    fileInput.addEventListener('change', () => {
      const fileLabel = document.querySelector<HTMLElement>(`[data-selected-file][data-file-input-id="${fileInput.id}"]`);
      if (!fileLabel) {
        return;
      }
      const [file] = fileInput.files ?? [];
      const selectedFilePrefix = fileLabel.dataset.selectedFilePrefix ?? dictionary.selectedFilePrefix;
      const noFileText = fileLabel.dataset.noFileText ?? dictionary.noFileSelected;
      fileLabel.textContent = file ? `${selectedFilePrefix}: ${file.name}` : noFileText;
    });
  });

  document.querySelectorAll<HTMLElement>('[data-role-value]').forEach((element) => {
    const role = element.dataset.roleValue;
    if (role === 'moderator') {
      element.textContent = dictionary.roleModerator;
      return;
    }
    if (role === 'standard') {
      element.textContent = dictionary.roleStandard;
      return;
    }
    if (role) {
      console.warn(`Unknown role value for translation: ${role}`);
      element.textContent = dictionary.unknownRoleLabel;
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-chat-title]').forEach((element) => {
    const username = element.dataset.chatTitleUser;
    if (!username) {
      return;
    }
    element.textContent = dictionary.chatWithTemplate.replace('{username}', username);
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-template-key]').forEach((element) => {
    const key = element.dataset.i18nTemplateKey;
    if (!key || !isTranslationKey(key)) {
      return;
    }

    const template = dictionary[key];
    const link = element.querySelector<HTMLAnchorElement>('[data-auth-link]');
    if (!link || !template.includes('{link}')) {
      element.textContent = template;
      return;
    }

    const [prefix = '', suffix = ''] = template.split('{link}');
    const translatedLink = link.cloneNode(true) as HTMLAnchorElement;
    translatedLink.textContent = dictionary.authenticatedLinkLabel;

    element.replaceChildren(document.createTextNode(prefix), translatedLink, document.createTextNode(suffix));
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

  applyThemeToUi(getSavedTheme(), language);
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
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [theme, setTheme] = useState<ThemeName>('light');

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
    const currentTheme = getSavedTheme();
    setLanguage(currentLanguage);
    setTheme(currentTheme);
    applyLanguageToUi(currentLanguage);
    applyThemeToUi(currentTheme, currentLanguage);
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
    applyThemeToUi(theme, language);
  }, [theme, language]);

  useEffect(() => {
    const themeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]'));
    const onThemeClick = () => {
      setTheme((currentTheme) => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        return nextTheme;
      });
    };

    themeButtons.forEach((button) => button.addEventListener('click', onThemeClick));
    return () => {
      themeButtons.forEach((button) => button.removeEventListener('click', onThemeClick));
    };
  }, []);

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
