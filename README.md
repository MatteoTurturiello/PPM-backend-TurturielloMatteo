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
