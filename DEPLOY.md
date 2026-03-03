# Deployment Guide for CapRover

This application is designed to be deployed on CapRover as a single container (Monolith) or separate containers.
For simplicity, we recommend deploying as a single container that serves both the frontend and backend.

## Prerequisites

1. A CapRover server.
2. A PostgreSQL database (Neon or CapRover built-in).
3. Cloudflare Account (Workers AI & R2).
4. PayPal Developer Account.
5. Google Cloud Console Project (OAuth).

## Steps

1. **Create a new App in CapRover**
   - Name: `ai-gen-app`
   - Enable HTTPS.

2. **Set Environment Variables**
   - Go to "App Config" > "Environment Variables".
   - Add all variables from `.env.example`.
   - Ensure `APP_URL` matches your CapRover domain (e.g., `https://ai-gen-app.yourdomain.com`).
   - Ensure `DATABASE_URL` points to your PostgreSQL instance.

3. **Deploy via Captain Definition**
   - Create a `captain-definition` file in the root of your project:

   ```json
   {
     "schemaVersion": 2,
     "dockerfileLines": [
       "FROM node:18-alpine",
       "WORKDIR /app",
       "COPY package*.json ./",
       "RUN npm install",
       "COPY . .",
       "RUN npx prisma generate",
       "RUN npm run build",
       "EXPOSE 3000",
       "CMD [\"npm\", \"start\"]"
     ]
   }
   ```

   - Or use the "Deploy via Image" method if you build the Docker image yourself.

4. **Database Migration**
   - After deployment, you need to run Prisma migrations.
   - You can do this by accessing the container shell in CapRover and running:
     `npx prisma migrate deploy`
   - Or add it to the `CMD` in `captain-definition`:
     `CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]`

5. **Verify Deployment**
   - Access your app URL.
   - Register a user.
   - Check logs in CapRover if issues arise.

## PayPal Webhook Setup

1. Go to PayPal Developer Dashboard.
2. Create a Webhook for your app.
3. URL: `https://ai-gen-app.yourdomain.com/api/payments/webhook`
4. Select events:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `PAYMENT.SALE.COMPLETED`
5. Copy the Webhook ID to `PAYPAL_WEBHOOK_ID` env var.

## Google OAuth Setup

1. Go to Google Cloud Console.
2. Create OAuth Credentials.
3. Add Authorized JavaScript Origins: `https://ai-gen-app.yourdomain.com`
4. Add Authorized Redirect URIs (if using redirect flow, but we use popup/token flow).
5. Copy Client ID and Secret to env vars.
