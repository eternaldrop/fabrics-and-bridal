# Fabrics & Bridals

Fabric & fashion e-commerce platform with a bridal consultation and mood
board module. Next.js (App Router) + PostgreSQL (Neon) + Drizzle ORM +
Auth.js + Cloudinary + Paystack.

See `requirements.md`, `bridal-ecommerce-structure.md`, and
`design-brief-prompt.md` for the product spec, schema, and design system
this project builds toward.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in real values (Neon
   connection string, Cloudinary keys, Auth secret).
2. `npm install`
3. `npm run db:push` — applies the schema in `db/schema.ts` to your database.
4. `npm run dev` — starts the app at http://localhost:3000
