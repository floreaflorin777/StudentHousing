import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flatmates = pgTable("flatmates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  initials: text("initials").notNull(),
  color: text("color").notNull().default("#3B82F6"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'cleaning', 'groceries', 'garbage'
  assignedTo: integer("assigned_to").references(() => flatmates.id),
  dueDate: timestamp("due_date").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  completedBy: integer("completed_by").references(() => flatmates.id),
  createdBy: integer("created_by").references(() => flatmates.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const groceryItems = pgTable("grocery_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: text("quantity"),
  completed: boolean("completed").notNull().default(false),
  addedBy: integer("added_by").references(() => flatmates.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // 'groceries', 'utilities', 'household', 'other'
  paidBy: integer("paid_by").references(() => flatmates.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const expenseShares = pgTable("expense_shares", {
  id: serial("id").primaryKey(),
  expenseId: integer("expense_id").references(() => expenses.id).notNull(),
  flatmateId: integer("flatmate_id").references(() => flatmates.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paid: boolean("paid").notNull().default(false),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'task_completed', 'grocery_added', 'expense_paid', 'task_created'
  description: text("description").notNull(),
  userId: integer("user_id").references(() => flatmates.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertFlateSchema = createInsertSchema(flatmates).omit({
  id: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  completedBy: true,
});

export const insertGroceryItemSchema = createInsertSchema(groceryItems).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseShareSchema = createInsertSchema(expenseShares).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type Flatmate = typeof flatmates.$inferSelect;
export type InsertFlatmate = z.infer<typeof insertFlateSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type GroceryItem = typeof groceryItems.$inferSelect;
export type InsertGroceryItem = z.infer<typeof insertGroceryItemSchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type ExpenseShare = typeof expenseShares.$inferSelect;
export type InsertExpenseShare = z.infer<typeof insertExpenseShareSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
