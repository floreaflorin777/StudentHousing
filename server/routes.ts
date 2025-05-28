import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, 
  insertGroceryItemSchema, 
  insertExpenseSchema,
  insertExpenseShareSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Flatmates
  app.get("/api/flatmates", async (req, res) => {
    try {
      const flatmates = await storage.getFlatmates();
      res.json(flatmates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flatmates" });
    }
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id/complete", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { completedBy } = req.body;
      
      if (!completedBy) {
        return res.status(400).json({ message: "completedBy is required" });
      }
      
      const task = await storage.completeTask(id, completedBy);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // Grocery Items
  app.get("/api/grocery-items", async (req, res) => {
    try {
      const items = await storage.getGroceryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grocery items" });
    }
  });

  app.post("/api/grocery-items", async (req, res) => {
    try {
      const itemData = insertGroceryItemSchema.parse(req.body);
      const item = await storage.createGroceryItem(itemData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid grocery item data" });
    }
  });

  app.patch("/api/grocery-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const item = await storage.updateGroceryItem(id, updates);
      if (!item) {
        return res.status(404).json({ message: "Grocery item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update grocery item" });
    }
  });

  app.delete("/api/grocery-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGroceryItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Grocery item not found" });
      }
      
      res.json({ message: "Grocery item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete grocery item" });
    }
  });

  // Expenses
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const { expense, shares } = req.body;
      
      const expenseData = insertExpenseSchema.parse(expense);
      const createdExpense = await storage.createExpense(expenseData);
      
      // Create expense shares
      if (shares && Array.isArray(shares)) {
        for (const share of shares) {
          const shareData = insertExpenseShareSchema.parse({
            ...share,
            expenseId: createdExpense.id,
          });
          await storage.createExpenseShare(shareData);
        }
      }
      
      res.json(createdExpense);
    } catch (error) {
      res.status(400).json({ message: "Invalid expense data" });
    }
  });

  // Expense Shares
  app.get("/api/expense-shares", async (req, res) => {
    try {
      const shares = await storage.getExpenseShares();
      res.json(shares);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expense shares" });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      const flatmates = await storage.getFlatmates();
      const groceryItems = await storage.getGroceryItems();
      const expenseShares = await storage.getExpenseShares();
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const tasksToday = tasks.filter(task => 
        !task.completed && 
        task.dueDate >= today && 
        task.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      ).length;
      
      const overdueTasks = tasks.filter(task => 
        !task.completed && task.dueDate < today
      ).length;
      
      const completedThisWeek = tasks.filter(task => 
        task.completed && 
        task.completedAt && 
        task.completedAt >= weekStart
      ).length;
      
      const activeFlatmates = flatmates.length;
      
      // Calculate grocery balance (simplified)
      const totalOwed = expenseShares
        .filter(share => !share.paid)
        .reduce((sum, share) => sum + parseFloat(share.amount), 0);
      
      res.json({
        tasksToday,
        overdueTasks,
        completedThisWeek,
        activeFlatmates,
        groceryBalance: totalOwed.toFixed(2),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
