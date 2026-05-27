# SkillBridge — Tutoring Platform (Frontend)

SkillBridge is a full-stack online tutoring marketplace where students can discover tutors, book sessions, and leave reviews. This repository contains the **frontend** of the application, built with Next.js and Tailwind CSS.

---

## 🔗 Live URLs

| Resource      | URL                                                    |
| ------------- | ------------------------------------------------------ |
| Frontend Live | `https://skillbridge-frontend.vercel.app`              |
| Backend Live  | `https://skillbridge-backend.vercel.app`               |
| Backend Repo  | `https://github.com/your-username/skillbridge-backend` |

---

## 🎥 Demo Video

> [Watch Demo on Google Drive](https://drive.google.com/file/d/your-video-id/view)

---

## 🛠️ Tech Stack

| Technology              | Purpose             |
| ----------------------- | ------------------- |
| Next.js 14 (App Router) | Framework & SSR/SSG |
| Tailwind CSS            | Styling             |
| Better Auth (Client)    | Authentication      |
| Stripe.js               | Payment Integration |
| React Hook Form         | Form Management     |
| Zod                     | Schema Validation   |
| Axios / Fetch           | API Communication   |
| TypeScript              | Type Safety         |

---

## ✨ Features

### 🌐 Public

- Browse and search tutors
- Filter tutors by subject, price range, and level
- View detailed tutor profiles
- View tutor reviews and ratings

### 🎓 Student

- Register and login
- Book tutoring sessions with available time slots
- Pay for sessions via **Stripe**
- View upcoming and past sessions
- Leave reviews and ratings for completed sessions

### 🧑‍🏫 Tutor

- Create and update tutor profile
- Create teaching sessions with subjects and hourly rate
- Set weekly availability with time slots
- View all teaching sessions and their statuses
- See student reviews and ratings

### 🔐 Admin

- View and manage all users
- Ban / unban users
- Approve or reject tutor applications
- Manage subjects
- View all bookings with filters

---

## 📁 Project Structure

```
skillbridge-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── admin/
│   │   ├── student/
│   │   └── tutor/
│   ├── tutors/
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── shared/
│   └── forms/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
├── hooks/
├── types/
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🏠 Homepage Sections

1. **Navbar** — Logo, navigation links, login/register buttons
2. **Hero Section** — Headline, search bar, and call-to-action
3. **Features Section** — Platform benefits and highlights
4. **Popular Tutors** — Showcase of top-rated tutors
5. **How It Works** — Step-by-step booking guide
6. **Testimonials** — Student reviews and feedback
7. **Pricing / CTA** — Encourage registration
8. **Footer** — Links, social media, and copyright

---

## 🔐 Authentication

Authentication is handled using **Better Auth** on the client side.

- Session is persisted via cookies
- Protected routes are guarded using middleware
- Role-based rendering for Admin, Tutor, and Student dashboards

---

## 💳 Payment Integration

Payments are processed using **Stripe**.

- Students pay for sessions during booking
- Stripe Checkout is used for secure payment flow
- Payment status is synced with booking records via backend

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Backend server running at `http://localhost:5000`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/skillbridge-frontend.git

# Navigate to project directory
cd skillbridge-frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🧪 Admin Credentials (Demo)

```
Email    : admin@skillbridge.com
Password : admin123
```

---

## 📦 Deployment

The frontend is deployed on **Vercel**.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Make sure to configure the environment variables in your Vercel project settings.

---

## 📄 License

This project is for educational purposes as part of **Batch 6 — Assignment 5**.
