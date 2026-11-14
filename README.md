<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:FF5733,50:C2569B,100:A855F7&height=200&section=header&text=Grocify&fontSize=62&fontColor=ffffff&animation=fadeIn&desc=Farm-fresh%20groceries%2C%20delivered%20in%2030%20minutes&descSize=18&descAlignY=62" alt="Grocify banner" />

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

<a href="https://grocify-client-three.vercel.app/"><img src="https://img.shields.io/badge/%F0%9F%94%97%20Live%20Demo-F97316?style=for-the-badge&labelColor=F97316" alt="Live demo" /></a>
<a href="https://github.com/SBHimel/grocify-server"><img src="https://img.shields.io/badge/%E2%9A%99%EF%B8%8F%20Server%20Repo-A855F7?style=for-the-badge&labelColor=A855F7" alt="Server repo" /></a>

</div>

<br/>

<a href="https://grocify-client-three.vercel.app/">
  <img src="https://himel-portfolio-brown.vercel.app/grocify.png" alt="Grocify screenshot" width="100%" />
</a>

## 📖 Overview

**Grocify** is a modern, responsive e-commerce web application for online grocery shopping. Customers can browse fresh organic produce by category, search products, add items to a cart, and place an order with Cash on Delivery. The app also includes secure authentication and an AI-powered shopping assistant.

This repository contains the **frontend (client)**. The REST API lives in the [grocify-server](https://github.com/SBHimel/grocify-server) repository.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Authentication | Better Auth & JWT (JSON Web Token) |
| Payments | Stripe Checkout |
| API | REST API → [grocify-server](https://github.com/SBHimel/grocify-server) (Express + MongoDB) |
| Deployment | Vercel |

## ✨ Key Features

- 🛒 **Browse by Category** — 8 fresh grocery aisles (Fresh Fruits, Crisp Veggies, Dairy & Eggs, Artisan Bakery, Cold Drinks, Organic Pantry, Meat & Poultry, Healthy Snacks) with server-side pagination, sorting, and category filters
- 🔍 **Live Search & Instant Suggestions** — Header search bar with debounced real-time suggestions dropdown and dedicated full search results page
- 🧺 **Shopping Cart & Slide-Over Drawer** — LocalStorage-persisted cart, real-time subtotal, interactive slide-over drawer, and free delivery progress indicator
- 🔐 **Secure Authentication & Route Guard Proxy** — Powered by Better Auth with MongoDB adapter, email/password credentials, role-signed JWTs, and Next.js network route guard proxy (`proxy.ts`)
- 👥 **Multi-Role Portals & Dashboards**:
  - 👑 **Admin / Owner Dashboard** — Executive overview, real-time platform statistics, and user role management
  - 📦 **Seller & Operations Dashboard** — Product catalog management (add/edit products with ImgBB image uploading), batch inventory tracking, and order fulfillment status workflows
  - 👤 **Buyer / Customer Portal** — Order history tracking with live order status indicators (`Pending`, `Confirmed`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`) and profile management
- 💳 **Seller Subscription Plans** — Dedicated seller pricing tiers (`/pricing`) with Stripe Checkout integration
- ⭐ **Product Reviews & Ratings** — Full review system with 1–5 star ratings, review submission, deletion, star breakdown metrics, and verified buyer badges
- 💵 **Cash on Delivery (COD)** — Streamlined checkout with form validation (name, phone, delivery address min 10 characters, instructions) and instant order confirmation
- 🏷️ **Deals & Seasonal Promotions** — Animated Embla carousel banners, seasonal harvest highlights, announcement bar, and trust badges
- 🤖 **AI Shopping Assistant** — Floating chatbot widget connecting shoppers directly with the AI recommendation service
- 📱 **Fully Responsive UI** — Mobile-first responsive layout powered by Tailwind CSS v4, HeroUI, and Lucide icons

## 📦 Dependencies

Main packages used in this project (matching [`package.json`](./package.json) exactly):

### Production Dependencies (`dependencies`)

- `next` (`^16.2.9`) — Core React framework with App Router
- `react` (`19.2.4`) — UI library
- `react-dom` (`19.2.4`) — React DOM rendering
- `better-auth` (`^1.6.17`) — Authentication framework with email/password and session management
- `@better-auth/mongo-adapter` (`^1.6.17`) — MongoDB database adapter for Better Auth
- `mongodb` (`^7.3.0`) — Official MongoDB driver for database persistence
- `jose-cjs` (`^6.2.3`) — JSON Web Token (JWT) signing and JWKS verification
- `@heroui/react` (`^3.1.0`) — Accessible, modern UI component library
- `@heroui/styles` (`^3.1.0`) — Styling system for HeroUI components
- `stripe` (`^22.6.2`) — Stripe Node.js SDK for checkout sessions
- `@stripe/stripe-js` (`^10.1.0`) — Stripe client-side SDK for payments
- `lucide-react` (`^1.18.0`) — Modern storefront and dashboard icon set
- `react-icons` (`^5.6.0`) — Extended icon collection
- `@gravity-ui/icons` (`^2.18.0`) — Gravity UI icon set
- `embla-carousel-react` (`^8.6.0`) — Carousel slider library for React
- `embla-carousel-autoplay` (`^8.6.0`) — Autoplay plugin for Embla carousel
- `react-hot-toast` (`^2.6.0`) — Lightweight notifications and toast alerts
- `next-themes` (`^0.4.6`) — Theme management for Next.js

### Development Dependencies (`devDependencies`)

- `typescript` (`^6.0.3`) — Static type checking
- `tailwindcss` (`^4`) — Utility-first CSS framework (v4)
- `@tailwindcss/postcss` (`^4`) — PostCSS integration for Tailwind CSS v4
- `eslint` (`^9`) — JavaScript and TypeScript linter
- `eslint-config-next` (`16.2.9`) — ESLint configuration for Next.js
- `babel-plugin-react-compiler` (`1.0.0`) — React Compiler Babel optimization plugin
- `@types/node` (`^26.6.5`) — TypeScript definitions for Node.js
- `@types/react` (`^19.3.0`) — TypeScript definitions for React
- `@types/react-dom` (`^19.3.0`) — TypeScript definitions for React DOM

For the full list and version lock, see [`package.json`](./package.json).

## 🚀 Run Locally

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Clone the repository
git clone https://github.com/SBHimel/grocify-client.git
cd grocify-client

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and fill in the values listed below

# 4. Start the development server
npm run dev
```

### Environment Variables (`.env.example`)

Configure the following variables in `.env.local`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `BETTER_AUTH_SECRET` | 32-character secret key for Better Auth | `your_32_character_secret_key_here` |
| `BETTER_AUTH_URL` | Better Auth base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Public Better Auth URL for client-side authentication | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string (must point to same database as server) | `mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority` |
| `AUTH_DB_NAME` | Database name for auth collections | `Grocify` |
| `DB_NAME` | Database name for application data | `Grocify` |
| `SERVER_URL` | Express backend server URL (server-side proxy/API calls) | `http://localhost:5000` |
| `NEXT_PUBLIC_SERVER_URL` | Express backend server URL (client-side API calls) | `http://localhost:5000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for client-side checkout | `pk_test_your_stripe_publishable_key` |
| `STRIPE_SECRET_KEY` | Stripe secret key for backend checkout session creation | `sk_test_your_stripe_secret_key` |
| `NEXT_PUBLIC_IMGBB_KEY` | ImgBB API key for seller product image uploads | `your_imgbb_api_key` |

### Available Scripts

Run these scripts from the repository root:

| Command | Script in `package.json` | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start development server on [http://localhost:3000](http://localhost:3000) |
| `npm run build` | `next build` | Build the application for production |
| `npm run start` | `next start` | Start the production server |
| `npm run lint` | `eslint` | Run ESLint check across all files |
| `npm run type-check` | `tsc --noEmit` | Validate TypeScript types without emitting output |

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 The client needs the API to work. Run [grocify-server](https://github.com/SBHimel/grocify-server) first and point the client to it in `.env.local`.

## 🧠 Why These Technologies?

- **Next.js** — file-based routing, fast page loads and easy Vercel deployment.
- **TypeScript** — catches bugs early and makes the cart / user data shapes predictable.
- **Tailwind CSS** — build a consistent, responsive UI quickly without writing long custom CSS.
- **JWT** — stateless, simple and secure authentication that works well with a separate REST API.
- **Separate Express + MongoDB backend** — keeps the API independent so the frontend can be deployed and scaled on its own.

## 🧗 Challenges I Faced

<!-- ✏️ EDIT: replace with your real experience. Keep it honest and specific. -->
- Connecting a separate frontend and backend (CORS, environment variables, deployed URLs)
- Keeping the user logged in and protecting private routes
- Managing cart state across pages
- Building a layout that stays clean on every screen size
- Integrating the AI assistant into the shopping flow

## ✅ Challenges Solved

<!-- ✏️ EDIT: match these to the challenges above. -->
- Configured CORS and environment-based API URLs so local and production both work
- Implemented JWT-based login with protected routes
- Centralised cart logic so items and totals stay in sync
- Used a responsive Tailwind grid for mobile-first design
- Added a chatbot that helps users find products faster

## 🔗 Links

| | |
| :--- | :--- |
| 🌐 Live site | https://grocify-client-three.vercel.app/ |
| ⚙️ Server repo | https://github.com/SBHimel/grocify-server |
| 👤 Portfolio | https://himel-portfolio-brown.vercel.app/ |
| 💼 LinkedIn | https://www.linkedin.com/in/sbhimel/ |

---

<div align="center">

Built with ❤️ by **[S.B. Himel](https://github.com/SBHimel)**

⭐ If you like this project, give it a star!

</div>