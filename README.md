## Live Polling System

Full‑stack live polling system with separate **Teacher** and **Student** experiences, built with **React (Vite)** on the frontend and **Express + Socket.io** on the backend.

### Project Structure

- `frontend` – React app (Vite) implementing all UI screens from the Figma design and connecting to the Socket.io backend.
- `backend` – Express + Socket.io server handling poll creation, answers, results, chat, and participant management.

### Getting Started

From the project root:

```bash
cd backend
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL printed by Vite (typically `http://localhost:5173`).

> Note: If you prefer, you can regenerate the frontend with `npm create vite@latest` and point it at the `frontend` folder; this repo is structured to be compatible with that workflow.


