# Bridal/Fashion E-commerce — Project Structure & Schema

**Stack:** Next.js (App Router) + PostgreSQL + Auth.js (NextAuth) + Cloudinary + Paystack
**DB hosting:** Managed (Supabase/Neon/Railway — pick one before scaffolding; schema below is host-agnostic)

---

## 1. Folder Structure

```
bridal-ecommerce/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                  # Home
│   │   └── about/page.tsx
│   ├── (shop)/
│   │   ├── catalog/
│   │   │   ├── fabrics/page.tsx
│   │   │   ├── fabrics/[slug]/page.tsx
│   │   │   ├── outfits/page.tsx
│   │   │   └── outfits/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx
│   ├── (bridal)/
│   │   ├── consultation/
│   │   │   ├── page.tsx              # Booking form
│   │   │   └── [bookingId]/page.tsx  # Status/details
│   │   └── moodboard/[boardId]/page.tsx
│   ├── (account)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── orders/page.tsx
│   │   └── bookings/page.tsx
│   ├── (admin)/
│   │   ├── products/page.tsx
│   │   ├── orders/page.tsx
│   │   └── consultations/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/route.ts
│   │   ├── orders/route.ts
│   │   ├── consultations/route.ts
│   │   ├── moodboard/route.ts
│   │   ├── payments/paystack/route.ts
│   │   └── webhooks/paystack/route.ts
│   └── layout.tsx
├── components/
│   ├── catalog/
│   ├── cart/
│   ├── bridal/
│   └── ui/
├── lib/
│   ├── db.ts                         # Postgres client (e.g. Drizzle/Prisma)
│   ├── auth.ts                       # NextAuth config
│   ├── cloudinary.ts
│   └── paystack.ts
├── db/
│   ├── schema.ts                     # ORM schema definitions
│   └── migrations/
└── types/
```

**Notes:**
- Route groups `(shop)`, `(bridal)`, `(account)`, `(admin)` keep concerns separated without affecting URLs.
- Recommend **Drizzle ORM** or **Prisma** over raw SQL for the Postgres layer — either works with Supabase/Neon/Railway.

---

## 2. Data Model (Schema)

### `users`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text | |
| email | text, unique | |
| password_hash | text | nullable if using OAuth providers |
| role | enum('customer','admin') | default 'customer' |
| created_at | timestamp | |

### `products`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| type | enum('fabric','outfit') | |
| name | text | |
| slug | text, unique | |
| description | text | |
| price | numeric | |
| is_custom_orderable | boolean | true for made-to-order items |
| stock_quantity | int | nullable for made-to-order |
| created_at | timestamp | |

### `product_images`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| product_id | uuid, FK → products | |
| cloudinary_public_id | text | |
| position | int | display order |

### `product_variants` (optional, for fabric colors/outfit sizes)
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| product_id | uuid, FK → products | |
| attribute_name | text | e.g. "size", "color" |
| attribute_value | text | |
| price_adjustment | numeric | default 0 |

### `orders`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users | |
| type | enum('ready_made','custom') | |
| status | enum('pending','confirmed','in_production','shipped','delivered','cancelled') | |
| total_amount | numeric | |
| paystack_reference | text | |
| custom_notes | text | nullable — measurements, special requests |
| mood_board_id | uuid, FK → mood_boards | nullable — set when a custom order originates from a bridal mood board |
| created_at | timestamp | |

### `order_items`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| order_id | uuid, FK → orders | |
| product_id | uuid, FK → products | |
| variant_id | uuid, FK → product_variants | nullable |
| quantity | int | |
| unit_price | numeric | |

### `bridal_consultations`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users | |
| preferred_date | timestamp | |
| status | enum('requested','scheduled','completed','cancelled') | |
| wedding_date | date | nullable |
| style_preferences | jsonb | free-form intake answers |
| notes | text | consultant notes |
| created_at | timestamp | |

### `mood_boards`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| consultation_id | uuid, FK → bridal_consultations | |
| title | text | |
| color_palette | jsonb | array of hex codes + labels |
| created_at | timestamp | |

### `mood_board_items`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| mood_board_id | uuid, FK → mood_boards | |
| cloudinary_public_id | text | reference image/inspiration |
| product_id | uuid, FK → products | nullable — link to a real catalog item |
| position | int | |

---

## 3. Key Relationships
- A **user** has many **orders** and may have one or more **bridal_consultations**.
- A **bridal_consultation** produces one **mood_board** (1:1 or 1:many if revisions are versioned).
- A **mood_board** has many **mood_board_items**, which can optionally point back to a **product** (so a mood board can recommend actual fabrics/outfits from the catalog).
- An **order** can be `custom`, referencing `custom_notes` and, when it originates from a bridal consultation, `mood_board_id` — linking the order directly back to the mood board that inspired it.

---

## 4. Suggested Build Order (once scaffolded)
1. Auth + user accounts
2. Product catalog (fabrics/outfits) + images via Cloudinary
3. Cart + checkout + Paystack integration
4. Order management (customer + admin views)
5. Bridal consultation booking flow
6. Mood board generation + display
