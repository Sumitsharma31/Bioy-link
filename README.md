# 🚀 Bioy-Link: The Ultimate Link-in-Bio Solution

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://bioy-link.vercel.app)
[![Tech Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Supabase%20%7C%20Tailwind-blue?style=for-the-badge)](#tech-stack)

Bioy-Link is a high-performance, premium "Link-in-Bio" platform designed for creators, entrepreneurs, and brands. Built with speed and aesthetics in mind, it allows users to centralize their online presence with style.

🔗 **Demo Link:** [https://bioy-link.vercel.app](https://bioy-link.vercel.app)

---

## ✨ Key Features

- **💎 Premium Dashboard:** Minimalist and intuitive interface for managing your profile and links.
- **📊 Advanced Analytics:** Track clicks, views, and visitor locations in real-time.
- **🖼️ Custom Branding:** Upload logos, change themes, and personalize your profile with Cloudinary integration.
- **💳 Monetization:** Integrated payment gateways via Razorpay for pro features.
- **📱 Responsive Design:** Flawless experience across desktop, tablet, and mobile devices.
- **⚡ Built for Speed:** Leverages Next.js App Router and React Server Components for near-instant load times.
- **🔒 Secure Authentication:** Seamless login and account management powered by Supabase.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database:** [Supabase](https://supabase.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Image Hosting:** [Cloudinary](https://cloudinary.com/)
- **Payments:** [Razorpay](https://razorpay.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- A Supabase project
- A Cloudinary account
- A Razorpay account (for payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sumitsharma31/Bioy-link.git
   cd Bioy-link
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

The easiest way to deploy Bioy-Link is via [Vercel](https://vercel.com/):

1. Connect your GitHub repository to Vercel.
2. Add the environment variables from your `.env.local` to the Vercel project settings.
3. Deploy!

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ by <a href="https://github.com/Sumitsharma31">Sumit Sharma</a></p>
