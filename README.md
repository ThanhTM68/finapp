# Fincoin - Personal Finance App

Ứng dụng quản lý tài chính cá nhân với kiến trúc Offline-first, xây dựng trên Expo Router (mobile) và Node.js (backend).

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo Router + TypeScript |
| State | Zustand |
| Data fetching | TanStack React Query v5 |
| Local DB | SQLite (expo-sqlite async API) |
| Backend | Node.js + Express + TypeScript |
| Auth | JWT (access + refresh tokens) |
| Security | expo-secure-store, expo-local-authentication |
| Sync | Offline-first queue to REST API |

## Cau truc du an

```
finapp/
├── app/                   # Expo Router screens
│   ├── _layout.tsx        # Root layout + providers
│   ├── (auth)/            # Auth flow: onboarding/login/register/reset-password
│   └── (tabs)/            # Main tabs: home/transactions/budgets/reports/account
├── src/
│   ├── core/              # Config, providers, constants
│   ├── domain/            # TypeScript domain models
│   ├── data/              # SQLite DAOs, API client, repositories, sync
│   ├── services/          # Application use-cases
│   ├── store/             # Zustand stores
│   ├── hooks/             # React hooks
│   ├── ui/                # Shared UI components
│   ├── security/          # Secure storage, app lock
│   ├── utils/             # Utilities (currency, date, validation...)
│   └── i18n/              # Translations (vi, en)
├── assets/
├── backend/               # Node.js REST API
│   └── src/
│       ├── config/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── middlewares/
│       └── utils/
└── README.md
```

## Chay Mobile App

### Yeu cau
- Node.js 18+
- Expo Go app on your device (or Android/iOS Simulator)

### Cai dat

```bash
# Tu thu muc root finapp/
npm install
```

### Cau hinh moi truong

```bash
cp .env.example .env
# Chinh sua .env: dat EXPO_PUBLIC_API_URL=http://<your-ip>:4000/api/v1
```

### Chay

```bash
npm start          # Expo Dev Server
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

## Chay Backend

### Yeu cau
- Node.js 18+

### Cai dat

```bash
cd backend
npm install
```

### Cau hinh moi truong

```bash
cp .env.example .env
# Chinh sua .env: dat JWT_SECRET, JWT_REFRESH_SECRET, DATABASE_URL
```

### Chay

```bash
npm run dev      # Development voi nodemon
npm run build    # Build TypeScript -> dist/
npm run start    # Chay production build
```

### Health Check

```
GET http://localhost:4000/health
-> { "status": "ok", "env": "development", "timestamp": "..." }
```

## Bien moi truong

### Mobile (.env)

| Bien | Mo ta | Vi du |
|---|---|---|
| EXPO_PUBLIC_API_URL | URL cua backend API | http://localhost:4000/api/v1 |
| EXPO_PUBLIC_APP_ENV | Moi truong | development hoac production |

### Backend (.env)

| Bien | Mo ta |
|---|---|
| PORT | Port backend (mac dinh 4000) |
| NODE_ENV | development hoac production |
| JWT_SECRET | Secret key cho access token |
| JWT_REFRESH_SECRET | Secret key cho refresh token |
| JWT_EXPIRES_IN | Thoi han access token (vd: 15m) |
| JWT_REFRESH_EXPIRES_IN | Thoi han refresh token (vd: 7d) |
| DATABASE_URL | Connection string DB |
| BCRYPT_ROUNDS | So vong bcrypt (mac dinh 12) |

## Kien truc

```
UI Screens (app/)
    |
Custom Hooks (src/hooks/)
    |
Services / Use-cases (src/services/)
    |
Repositories (src/data/repositories/)
    |
DAOs + SQLite (src/data/db/)  <- Source of truth (offline)
    |
Sync Queue (src/data/sync/)
    |
REST API (backend/)           <- Sync khi online
```

Quy tac cot loi cho Transaction:
1. Insert transaction vao SQLite
2. Cap nhat so du vi trong SQLite
3. Them vao sync_queue
4. Background sync day len server khi co mang

## Cac buoc tiep theo

- [ ] SQL migration thuc te voi version tracking day du
- [ ] Implement authentication flow (login/register) voi real API
- [ ] Implement transaction use-case hoan chinh (numpad UI, category picker)
- [ ] Sync engine thuc te (conflict resolution, pull from server)
- [ ] Charts (Line/Pie/Bar) cho man Reports
- [ ] Push notification khi ngan sach > 80%
- [ ] Export CSV/Excel
- [ ] App lock (PIN + Biometrics)
- [ ] Dark mode
- [ ] Connect backend voi real database (MongoDB/PostgreSQL)
- [ ] Deploy backend
