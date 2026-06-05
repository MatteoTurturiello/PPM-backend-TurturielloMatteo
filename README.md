# PPM Social Network - Matteo Turturiello

## Live Demo
🔗 **[App su Railway](https://ppm-backend-turturiellomatteo-production.up.railway.app)** | [Railway Dashboard](https://railway.app/dashboard)

## Project type
Full-Stack Web Application

## Framework
- Backend: Django 5.2.1
- Frontend UI shell: React + TypeScript bundled with esbuild

## Short description
Social network minimale in stile Instagram con feed, profili, richieste di amicizia, like, chat dirette, supporto immagini leggere e interfaccia rinnovata.

## Main features

### Standard user
- Registrazione, login e logout con pagine iniziali restyling.
- Profilo utente con bio e foto profilo opzionale.
- Creazione, modifica e cancellazione dei propri post.
- Post con testo, emoji e immagine opzionale.
- Like ai post del feed e dei profili visibili.
- Feed con i propri contenuti e quelli degli amici.
- Lista utenti con accesso al profilo, richiesta di amicizia e avvio chat.
- Chat dirette con eliminazione della conversazione.
- Menu sticky laterali per **Messaggi** e **Impostazioni**.

### Moderator
- Visualizzazione completa del feed.
- Eliminazione di post di qualsiasi utente.
- Disattivazione e riattivazione account dalla pagina di moderazione.

## Upload images
- Foto profilo e immagini dei post supportate.
- Limite massimo: **450 KB**.
- Dimensioni massime: **1600x1600 px**.
- L'obiettivo è mantenere il deploy leggero e contenere l'uso di memoria su Railway.

## Project structure
- `accounts`: autenticazione, profili, ruoli, moderazione account.
- `social`: feed, post, amicizie, notifiche, like, chat dirette.
- `templates`: layout e pagine Django server-rendered.
- `frontend/src/social-shell.tsx`: shell React/TypeScript per menu sticky di messaggi e impostazioni.
- `static/css/app.css`: stile principale dell'app.
- `static/js/post-composer.js`: enhancement del form post (emoji rapide e file selezionato).

## Local installation
1. Clona il repository:
   ```bash
   git clone <repo-url>
   cd PPM-backend-TurturielloMatteo
   ```
2. Crea e attiva un virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   ```
3. Installa le dipendenze backend:
   ```bash
   pip install -r requirements.txt
   ```
4. Installa le dipendenze frontend:
   ```bash
   npm install
   ```
5. Genera il bundle frontend:
   ```bash
   npm run build:frontend
   ```
6. Applica le migrazioni:
   ```bash
   python manage.py migrate
   ```
7. Popola il database demo:
   ```bash
   python manage.py seed_demo
   ```
8. Avvia il server:
   ```bash
   python manage.py runserver
   ```

## Included SQLite demo database
- File: `db.sqlite3`
- Include dati demo aggiornati con like, chat e immagini di esempio.

## Demo accounts
- `admin_demo` / `admin12345` - moderator / superuser
- `manager_demo` / `manager12345` - moderator
- `user_demo` / `user12345` - standard user
- `user_friend` / `user12345` - standard user

## Demo content included
- Foto profilo demo generate automaticamente.
- Post demo con immagini leggere in stile emoticon.
- Like di esempio tra utenti demo.
- Chat demo tra `user_demo` e `user_friend`.

## Main pages
- `/accounts/login/` login
- `/accounts/signup/` registrazione
- `/` feed
- `/posts/new/` creazione post
- `/accounts/users/` utenti disponibili
- `/accounts/profile/<id>/` profilo utente
- `/profile/<id>/posts/` post utente
- `/messages/<id>/` dettaglio chat
- `/accounts/moderation/users/` moderazione account

## Frontend notes
- La shell dei menu sticky laterali è scritta in React + TypeScript.
- Il bundle distribuito è `static/js/social-shell.js`.
- Se modifichi `frontend/src/social-shell.tsx`, rigenera il bundle con:
  ```bash
  npm run build:frontend
  ```

## Deploy su Railway
Il progetto continua a usare Railway con Django + WhiteNoise.

### Build/start command
Il file `railway.toml` usa:
```bash
python manage.py migrate && python manage.py collectstatic --noinput && gunicorn PPMbackend.wsgi:application --bind 0.0.0.0:$PORT
```

### Environment variables
Configura almeno:
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `RAILWAY_PUBLIC_DOMAIN` (opzionale)

### Important note for uploads
Le immagini caricate vengono salvate localmente nella cartella `media/`.
Su deploy Railway questo storage è semplice e adatto a demo/progetti piccoli; per persistenza forte in produzione conviene usare un object storage esterno.

## Validation commands
```bash
python manage.py check
python manage.py test
python manage.py collectstatic --noinput
```

## Suggested manual test flow
1. Accedi come `user_demo`.
2. Apri il feed e verifica like, immagini demo e menu sticky.
3. Vai sul tuo profilo e aggiorna la foto profilo con un file piccolo.
4. Crea un nuovo post con emoji e immagine.
5. Apri il profilo di `user_friend` e avvia la chat.
6. Elimina una chat dal menu **Messaggi**.
7. Fai logout e accedi come `manager_demo`.
8. Verifica la pagina di moderazione account.
