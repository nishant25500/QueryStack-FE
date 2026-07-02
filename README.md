# QueryStack Frontend

Interactive React frontend for the QueryStack backend services.

## Stack

- React 18
- Vite
- Material UI

## Local setup

```bash
npm install
npm run dev
```

The dev server proxies backend requests:

- `/api/auth` and `/api/user` -> `http://localhost:8081`
- `/api/question` -> `http://localhost:8080`

If you deploy the frontend separately, set these environment variables:

```bash
VITE_AUTH_BASE_URL=http://localhost:8081/api
VITE_QUESTION_BASE_URL=http://localhost:8080/api
```
