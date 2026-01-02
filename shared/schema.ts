import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Request types
export type CreateContactRequest = InsertContact;

// Response types
// Response types
export type ContactResponse = Contact;

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  providerRef: text("provider_ref").unique(),
  payerEmail: text("payer_email"),
  amount: text("amount").notNull(), // numeric often returned as string in JS drivers
  currency: text("currency"),
  status: text("status").notNull(),
  customId: text("custom_id"), // Link user session to payment
  rawEvent: text("raw_event"), // Storing JSON as text/jsonb
  createdAt: timestamp("created_at").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export const leads = pgTable("leads", {
  sessionId: text("session_id").primaryKey(),
  email: text("email").notNull(),
  paid: boolean("paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export const insertLeadSchema = createInsertSchema(leads).omit({ paid: true, createdAt: true });
