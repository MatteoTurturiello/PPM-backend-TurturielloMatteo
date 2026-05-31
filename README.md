# PPM Social Network - Matteo Turturiello

## Project type
Full-Stack Web Application

## Framework
Django 5.2.1

## Short description
Applicazione social network con profili utente, post, richieste di amicizia, feed notizie e moderazione contenuti/account.

## Implemented features

### Utente standard
- Registrazione, login e logout.
- Modifica del proprio profilo.
- Creazione, visualizzazione, modifica e cancellazione dei propri post.
- Invio e gestione di richieste di amicizia.
- Feed con i propri post e quelli degli amici.
- Visualizzazione pagina profilo e pagina post degli amici.

### Moderatore
- Eliminazione post inappropriati di qualsiasi utente.
- Disattivazione/riattivazione account dalla pagina di moderazione.

## Project structure
- `accounts` app: utente custom, registrazione, profili, ruoli, moderazione account.
- `social` app: post, richieste/relazioni di amicizia, feed, autorizzazioni CRUD.

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
3. Installa le dipendenze:
   ```bash
   pip install -r requirements.txt
   ```
4. Applica le migrazioni:
   ```bash
   python manage.py migrate
   ```
5. Popola il database demo:
   ```bash
   python manage.py seed_demo
   ```
6. Avvia il server:
   ```bash
   python manage.py runserver
   ```

## Included SQLite demo database
- File: `db.sqlite3`
- Il database incluso contiene dati demo pronti all'uso (utenti, post, amicizie, richieste).

## Demo accounts
- `admin_demo` / `admin12345` - administrator/superuser (moderatore)
- `manager_demo` / `manager12345` - moderator
- `user_demo` / `user12345` - standard user
- `user_friend` / `user12345` - standard user (account di supporto)

## Roles and permissions summary
- `standard`: gestione del proprio profilo e dei propri post.
- `moderator`: tutte le capacità standard + moderazione post e stato account utenti.

## Online deployment link
- https://ppm-backend-turturiellomatteo-production.up.railway.app/

## Railway deployment (step by step)

### 1) Create Railway account
- Vai su Railway e fai login con GitHub.
- Autorizza Railway ad accedere al repository.

### 2) Create project from GitHub
- In Railway: **New Project** → **Deploy from GitHub Repo**.
- Seleziona `PPM-backend-TurturielloMatteo`.

### 3) Configure environment variables
Apri il servizio su Railway → tab **Variables** e imposta:

- `DJANGO_SECRET_KEY`: chiave segreta lunga e casuale.
- `DJANGO_DEBUG`: `False`.
- `DJANGO_ALLOWED_HOSTS`: il dominio pubblico Railway (separati da virgola se più host), ad esempio:
  `ppm-backend-turturiellomatteo-production.up.railway.app`.
- `DJANGO_CSRF_TRUSTED_ORIGINS`: URL completi (con `https://`), ad esempio:
  `https://ppm-backend-turturiellomatteo-production.up.railway.app`.
- `RAILWAY_PUBLIC_DOMAIN`: opzionale, Railway lo valorizza automaticamente e il progetto lo aggiunge ad `ALLOWED_HOSTS`.

### 4) Build and deploy
- Non serve lanciare build manuale: Railway effettua build e deploy ad ogni push su GitHub.
- Il file `railway.toml` contiene già il comando di avvio:
  ```
  python manage.py migrate && python manage.py collectstatic --noinput && gunicorn PPMbackend.wsgi:application --bind 0.0.0.0:$PORT
  ```

### 5) Verify public domain
- In Railway apri **Settings/Networking** e copia il dominio pubblico assegnato.
- Usa esattamente quel dominio nelle variabili `DJANGO_ALLOWED_HOSTS` e `DJANGO_CSRF_TRUSTED_ORIGINS`.

### 6) If browser shows `Not Found`
Controlla in ordine:
1. Dominio corretto e collegato al servizio giusto.
2. Ultimo deploy completato senza errori (tab **Deployments/Logs**).
3. Variabili impostate correttamente (`DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, `DJANGO_DEBUG=False`).
4. Ri-deploy dopo modifica variabili.

### 7) Final test
- Apri `https://your-domain.up.railway.app/` oppure `https://your-domain.up.railway.app/accounts/login/`.
- Se risponde, il deploy è attivo e i push successivi aggiorneranno automaticamente il servizio.

### Production behavior enabled in settings
When `DJANGO_DEBUG=False`, the app automatically enables:
- forced redirect to HTTPS,
- secure `session` and `csrf` cookies,
- correct handling of Railway HTTPS proxy headers (`X-Forwarded-Proto`),
- static files served via WhiteNoise (no separate static file server needed).

### Real online URL check
To verify that the site is online from your machine:

```bash
nslookup ppm-backend-turturiellomatteo-production.up.railway.app
curl -I https://ppm-backend-turturiellomatteo-production.up.railway.app/
```

If you receive `HTTP/1.1 200` or `302`, the deployment is reachable.

## Browser test scenario
1. Accedi come `user_demo`.
2. Vai su **Nuovo post**, crea un post, poi modificalo dal feed.
3. Vai su **Utenti**, invia una richiesta di amicizia (se disponibile).
4. Apri il profilo di un amico e verifica la pagina post.
5. Fai logout e accedi come `manager_demo`.
6. Vai su **Feed** ed elimina un post di un altro utente (azione moderatore).
7. Vai su **Moderazione account** e disattiva/riattiva un account standard.
8. Verifica che un utente senza ruolo moderatore non veda il menu di moderazione e riceva feedback se tenta azioni non consentite.

## Main endpoints/pages
- `/accounts/login/` login
- `/accounts/signup/` registrazione
- `/` feed
- `/posts/new/` creazione post
- `/accounts/users/` lista utenti e richieste amicizia
- `/accounts/profile/<id>/` pagina profilo
- `/accounts/moderation/users/` moderazione account

## Validation and test commands
```bash
python manage.py check
python manage.py test
```
