import { db } from "./db";
import {
  contacts,
  leads,
  type CreateContactRequest,
  type ContactResponse,
  type InsertLead,
  type Lead
} from "@shared/schema";

export interface IStorage {
  createContact(contact: CreateContactRequest): Promise<ContactResponse>;
  createLead(lead: InsertLead): Promise<Lead>;
}

export class DatabaseStorage implements IStorage {
  async createContact(insertContact: CreateContactRequest): Promise<ContactResponse> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead)
      .onConflictDoUpdate({
        target: leads.sessionId,
        set: { email: insertLead.email }
      })
      .returning();
    return lead;
  }
}

export const storage = new DatabaseStorage();
