# Viva Leve Portal

> Porque viver bem não precisa ser complicado.

**Viva Leve Portal** is a specialized physical product store designed for the Brazilian 60+ audience. Built for accessibility and ease of use, it transforms the digital shopping experience into something warm, clear, and intuitive.

---

## 📖 Overview

The project solves the complexity barrier in modern e-commerce for older adults. By adhering to strict UX standards — high contrast, large touch targets, and zero jargon — we provide a premium shopping experience.

The business model relies on **physical products** integrated with the **Logzz/Coinzz** network for logistics and Cash on Delivery (COD) scenarios, complemented by **Stripe** for upfront credit card and Pix payments.

---

## 🛠 Tech Stack

| Technology | Version | Description |
| :--- | :--- | :--- |
| **Next.js** | 14.x | App Router based framework |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Static typing |
| **MongoDB** | - | Database for users and operational logs |
| **Mongoose** | - | ODM for MongoDB |
| **Stripe** | - | Credit card and Pix payments |
| **NextAuth.js** | 5.x | Admin and User authentication |
| **next-intl** | - | Internationalization (PT-BR focus) |
| **Tailwind CSS** | 3.x | Styling and Design Tokens |
| **Cloudinary** | - | Product image management |
| **Resend / Nodemailer** | - | Transactional emails |
| **Logzz API** | - | Fulfillment and delivery management |

---

## 🏗 Architecture

The system follows an integrated service architecture:

1.  **Next.js App Router**: Manages the public store and the private admin panel.
2.  **Stripe**: Handles immediate payments and notifies the system via webhooks.
3.  **Logzz API**: Receives order data for physical fulfillment. In the local database, we only store the `logzzProductId` and `logzzProductUrl`, as inventory and shipping are managed by Logzz.
4.  **Admin Panel**: Used by the team to manage products (via Cloudinary), view orders, and monitor customers.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── [locale]/             ← i18n routing
│   │   ├── (store)/          ← Public store routes (Home, Products, Cart)
│   │   ├── admin/            ← Admin panel shell (NextAuth protected)
│   │   └── api/              ← Stripe webhooks and internal endpoints
├── components/               ← Shared UI components (atomic design)
├── config/                   ← Global constants and tenant settings
├── hooks/                    ← Custom React hooks
├── lib/                      ← Library wrappers (Mongodb, Mongoose models, Stripe)
├── messages/                 ← Translation files (pt.json, en.json)
├── middleware.ts             ← Protection for /admin and /account
└── payload-types.ts          ← (Legacy/Transitional) types mapping
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in the required keys.

| Variable | Example Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_STORE_URL` | `http://localhost:3000` | Public URL of the store |
| `NEXT_PUBLIC_STORE_NAME` | `"Viva Leve Portal"` | Name displayed in UI and emails |
| `MONGODB_URI` | `mongodb+srv://...` | Connection string for Atlas |
| `NEXTAUTH_SECRET` | `your_secret_here` | Secret for NextAuth session encryption |
| `JWT_SECRET` | `your_jwt_secret` | Secret for manual buyer JWTs |
| `CLOUDINARY_CLOUD_NAME` | `viva-leve` | Cloudinary identification |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe private key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe webhook verification secret |
| `LOGZZ_API_KEY` | `logzz_...` | API key for fulfillment integration |

---

## 🏁 Getting Started

1.  **Clone and Install**:
    ```bash
    git clone https://github.com/viva-leve/viva-leve-portal.git
    cd viva-leve-portal
    npm install
    ```

2.  **Database Initial State**:
    Run a script to seed the initial categories required for the 60+ audience.
    ```bash
    npm run seed:categories
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Access: `http://localhost:3000/pt`

---

## 💳 Stripe Setup

To handle payment confirmation locally:

1.  **Install Stripe CLI**.
2.  **Login**: `stripe login`.
3.  **Forward Webhooks**:
    ```bash
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```
4.  Copy the `whsec_...` key to your `.env.local`.

---

## 🚛 Logzz Integration

The order flow follows this sequence:

1.  **Order Placement**: User completes checkout (either Stripe or COD).
2.  **Payload Dispatch**: The system sends order details to the Logzz API.
3.  **Stock Awareness**: The store does **not** track stock locally. It queries Logzz or relies on Logzz's refusal if stock is zero.
4.  **Physical Fulfillment**: Logzz manages picking, packing, and shipping.

---

## 🎨 White-label Configuration

You can customize the store appearance via environment variables or the `src/config/tenant.ts` file:

- **Primary Color**: Set `NEXT_PUBLIC_PRIMARY_COLOR` for the brand identity.
- **Categories**: Seeded via database, but labels are manageable in the Admin panel.

---

## 🚀 Deployment

Recommended deployment on **Vercel**:

-   **Database**: MongoDB Atlas (Free Tier or dedicated).
-   **Images**: Cloudinary (Media assets).
-   **Environment**: Add all variables in Vercel project settings before the first deploy.

---

## 🤝 Contributing

-   **Branch naming**: `feature/your-feature` or `fix/your-fix`.
-   **Commit style**: Use Conventional Commits (`feat: add logzz shipping`, `fix: checkout button contrast`).
-   **PR Process**: Open a PR to `main` and wait for a green check from automated linting.
