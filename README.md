# Authentication Security Lab

Authentication Security Lab is a small Node.js and Express project for learning
how authentication systems can be implemented insecurely, then improved. It uses
SQLite for local data storage and includes simple browser pages for signup and
login.

The project is useful for comparing common authentication mistakes against a more
secure implementation:

- storing passwords in plain text vs. hashing them with bcrypt
- revealing whether an email exists vs. using generic login errors
- keeping route logic inline vs. moving authentication logic into a controller
- using separate local SQLite databases for vulnerable and secure experiments

This is a learning project, not a production authentication service.

## Branches

### `main`

The `main` branch contains the intentionally vulnerable version of the lab.

Notable behavior:

- Passwords are stored and compared as plain text.
- Login and signup errors reveal whether an email address exists.
- Authentication route logic lives directly in `src/routes/authRoutes.js`.
- The local database file is created at `db/auth-lab-vulnerable.sqlite`.
- A demo user is seeded automatically:
  - email: `student@example.test`
  - password: `password123`

### `secure-auth`

The `secure-auth` branch contains a safer version of the same authentication
flow.

Notable behavior:

- Passwords are hashed with bcrypt before storage.
- Existing plain-text passwords are migrated to bcrypt hashes.
- Login failures use a generic `Invalid email or password.` response.
- Authentication logic is moved into `src/controllers/authController.js`.
- The local database file is created at `db/auth-lab-secure.sqlite`.
- A demo user is seeded automatically:
  - email: `student@example.test`
  - password: `password123`

## Project Structure

```text
.
├── db/
│   └── db.js
├── public/
│   ├── login.html
│   ├── login.js
│   ├── signup.html
│   ├── signup.js
│   └── styles.css
├── src/
│   ├── app.js
│   └── routes/
│       └── authRoutes.js
├── package.json
└── README.md
```

On the `secure-auth` branch, `src/controllers/authController.js` is also present.

## Requirements

- Node.js
- npm

## Setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd authentication-security-lab
npm install
```

Run the app:

```bash
npm start
```

Open the app in your browser:

```text
http://localhost:3000
```

The server uses port `3000` by default. To use another port:

```bash
PORT=4000 npm start
```

## Working With Branches

Run the vulnerable version:

```bash
git checkout main
npm install
npm start
```

Run the secure version:

```bash
git checkout secure-auth
npm install
npm start
```

Each branch creates its own SQLite database file inside `db/`, so you can compare
the implementations without sharing the same local user table.

## API Endpoints

### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "student@example.test",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.test",
  "password": "password123"
}
```

## Notes

- SQLite database files are generated locally when the app starts.
- There is no automated test suite yet; `npm test` is currently a placeholder.
- Do not reuse the vulnerable branch patterns in real applications.
