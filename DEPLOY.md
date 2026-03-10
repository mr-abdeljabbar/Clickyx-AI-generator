# Deployment Guide for Netlify

This application is designed to be deployed on Netlify. It uses Netlify Functions to run the Express backend and Netlify's CDN to serve the React frontend.

## Prerequisites

1. A Netlify account.
2. A PostgreSQL database (Neon recommended).
3. Cloudflare Account (Workers AI & R2).
4. PayPal Developer Account.
5. Google Cloud Console Project (OAuth).

## Steps

1. **Connect to Netlify**
   - Push your code to a GitHub/GitLab/Bitbucket repository.
   - Connect the repository to Netlify.

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions` (auto-detected by `netlify.toml`)

3. **Set Environment Variables**
   - Go to "Site settings" > "Environment variables".
   - Add all variables from `.env.example`.
   - Ensure `APP_URL` matches your Netlify domain (e.g., `https://your-app.netlify.app`).
   - Ensure `DATABASE_URL` points to your PostgreSQL instance.
   - **Important**: Create a `NODE_VERSION` variable set to `18`.

4. **Database Migration**
   - Prisma migrations cannot easily run during the Netlify build process if the database is not accessible.
   - It is recommended to run migrations locally before pushing:
     `npx prisma migrate deploy`
   - Ensure your `DATABASE_URL` is accessible from your local machine or a CI pipeline.

5. **Verify Deployment**
   - Once the build succeeds, access your Netlify URL.
   - Register a user.
   - Check "Functions" tab in Netlify if API issues arise.

## PayPal Webhook Setup

1. Go to PayPal Developer Dashboard.
2. Create a Webhook for your app.
3. URL: `https://your-app.netlify.app/api/payments/webhook`
4. Select events:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `PAYMENT.SALE.COMPLETED`
5. Copy the Webhook ID to `PAYPAL_WEBHOOK_ID` env var.

## Google OAuth Setup

1. Go to Google Cloud Console.
2. Create OAuth Credentials.
3. Add Authorized JavaScript Origins: `https://your-app.netlify.app`
4. Copy Client ID and Secret to env vars.
