import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
  pgEnum,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

// --- Enums ---------------------------------------------------------------

// 'stylist' added to the customer/admin split from the structure doc, to
// match the three-way role split (customer / admin / stylist) called for
// in the requirements doc.
export const userRoleEnum = pgEnum("user_role", ["customer", "admin", "stylist"]);

export const productTypeEnum = pgEnum("product_type", ["fabric", "outfit"]);

export const orderTypeEnum = pgEnum("order_type", ["ready_made", "custom"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending", // Order Placed
  "confirmed", // Confirmed
  "in_production", // In Production/Tailoring
  "ready", // Ready / Ready for Pickup
  "shipped", // Shipped
  "delivered", // Delivered
  "cancelled",
]);

export const consultationStatusEnum = pgEnum("consultation_status", [
  "requested",
  "scheduled",
  "completed",
  "cancelled",
]);

// Live call (calendar scheduling, later integration) vs. async written consultation.
export const consultationTypeEnum = pgEnum("consultation_type", ["live", "async"]);

// Added so the bride's mood-board review flow (comment / request revisions /
// approve) from the requirements doc has somewhere to live.
export const moodBoardStatusEnum = pgEnum("mood_board_status", [
  "draft",
  "shared",
  "revision_requested",
  "approved",
]);

// --- Core tables -----------------------------------------------------------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"), // nullable if using OAuth providers later
  role: userRoleEnum("role").notNull().default("customer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: productTypeEnum("type").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category"), // e.g. casual, native wear, bridal, aso-ebi
  material: text("material"), // fabric type, e.g. lace, ankara, silk
  color: text("color"),
  occasion: text("occasion"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isCustomOrderable: boolean("is_custom_orderable").notNull().default(false),
  stockQuantity: integer("stock_quantity"), // nullable for made-to-order
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  cloudinaryPublicId: text("cloudinary_public_id").notNull(),
  position: integer("position").notNull().default(0),
});

// Fabric colors, outfit sizes, etc.
export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  attributeName: text("attribute_name").notNull(), // e.g. "size", "color"
  attributeValue: text("attribute_value").notNull(),
  priceAdjustment: numeric("price_adjustment", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: orderTypeEnum("type").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paystackReference: text("paystack_reference"),
  customNotes: text("custom_notes"), // measurements, special requests
  includesTailoring: boolean("includes_tailoring").notNull().default(false),
  moodBoardId: uuid("mood_board_id").references((): AnyPgColumn => moodBoards.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // Hook point for later-version notifications: a status-change trigger
  // (DB trigger, or an app-layer check in the order-update route) should
  // fire an email/SMS job here once that service exists. Not built yet.
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  variantId: uuid("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const bridalConsultations = pgTable("bridal_consultations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  consultationType: consultationTypeEnum("consultation_type").notNull(),
  preferredDate: timestamp("preferred_date"), // for live consultations
  status: consultationStatusEnum("status").notNull().default("requested"),
  weddingDate: date("wedding_date"),
  venueType: text("venue_type"),
  season: text("season"),
  budgetRange: text("budget_range"),
  styleInspiration: text("style_inspiration"),
  stylePreferences: jsonb("style_preferences"), // free-form intake answers
  notes: text("notes"), // consultant notes
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const moodBoards = pgTable("mood_boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Nullable so sample/demo boards (isSample: true) — shown on the public
  // /bridal page to inspire brides before they book — don't need a real
  // consultation behind them. Every real, client-linked board still has one.
  consultationId: uuid("consultation_id").references(() => bridalConsultations.id),
  title: text("title").notNull(),
  // One-line mood/style descriptor, e.g. "Soft, romantic, garden-inspired".
  styleDescriptor: text("style_descriptor"),
  colorPalette: jsonb("color_palette").$type<{ hex: string; label: string }[]>(),
  status: moodBoardStatusEnum("status").notNull().default("draft"),
  isSample: boolean("is_sample").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const moodBoardItems = pgTable("mood_board_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  moodBoardId: uuid("mood_board_id")
    .notNull()
    .references(() => moodBoards.id, { onDelete: "cascade" }),
  cloudinaryPublicId: text("cloudinary_public_id"),
  productId: uuid("product_id").references(() => products.id), // nullable — links to real catalog item
  position: integer("position").notNull().default(0),
});

// Supports the bride's "comment / request revisions" flow on her mood board.
export const moodBoardComments = pgTable("mood_board_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  moodBoardId: uuid("mood_board_id")
    .notNull()
    .references(() => moodBoards.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
