import { db } from "./db";
import {
  contacts,
  type CreateContactRequest,
  type ContactResponse
} from "@shared/schema";

export interface IStorage {
  createContact(contact: CreateContactRequest): Promise<ContactResponse>;
}

export class DatabaseStorage implements IStorage {
  async createContact(insertContact: CreateContactRequest): Promise<ContactResponse> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
}

export const storage = new DatabaseStorage();
