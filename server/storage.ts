import { 
  flatmates, 
  tasks, 
  groceryItems, 
  expenses, 
  expenseShares, 
  activities,
  type Flatmate, 
  type InsertFlatmate,
  type Task, 
  type InsertTask,
  type GroceryItem, 
  type InsertGroceryItem,
  type Expense, 
  type InsertExpense,
  type ExpenseShare, 
  type InsertExpenseShare,
  type Activity, 
  type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // Flatmates
  getFlatmates(): Promise<Flatmate[]>;
  getFlatmate(id: number): Promise<Flatmate | undefined>;
  createFlatmate(flatmate: InsertFlatmate): Promise<Flatmate>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  completeTask(id: number, completedBy: number): Promise<Task | undefined>;

  // Grocery Items
  getGroceryItems(): Promise<GroceryItem[]>;
  getGroceryItem(id: number): Promise<GroceryItem | undefined>;
  createGroceryItem(item: InsertGroceryItem): Promise<GroceryItem>;
  updateGroceryItem(id: number, updates: Partial<GroceryItem>): Promise<GroceryItem | undefined>;
  deleteGroceryItem(id: number): Promise<boolean>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;

  // Expense Shares
  getExpenseShares(expenseId?: number): Promise<ExpenseShare[]>;
  createExpenseShare(share: InsertExpenseShare): Promise<ExpenseShare>;
  updateExpenseShare(id: number, updates: Partial<ExpenseShare>): Promise<ExpenseShare | undefined>;

  // Activities
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private flatmates: Map<number, Flatmate> = new Map();
  private tasks: Map<number, Task> = new Map();
  private groceryItems: Map<number, GroceryItem> = new Map();
  private expenses: Map<number, Expense> = new Map();
  private expenseShares: Map<number, ExpenseShare> = new Map();
  private activities: Map<number, Activity> = new Map();
  
  private currentFlatemateId = 1;
  private currentTaskId = 1;
  private currentGroceryId = 1;
  private currentExpenseId = 1;
  private currentExpenseShareId = 1;
  private currentActivityId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create sample flatmates
    const sampleFlatmates = [
      { name: "Alex Johnson", email: "alex@example.com", initials: "AJ", color: "#3B82F6" },
      { name: "Sarah Miller", email: "sarah@example.com", initials: "SM", color: "#10B981" },
      { name: "Mike Wilson", email: "mike@example.com", initials: "MW", color: "#8B5CF6" },
      { name: "Emma Thompson", email: "emma@example.com", initials: "ET", color: "#F59E0B" },
    ];

    sampleFlatmates.forEach(flatmate => {
      const id = this.currentFlatemateId++;
      this.flatmates.set(id, { ...flatmate, id });
    });

    // Create sample tasks
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const sampleTasks = [
      {
        title: "Clean Kitchen",
        category: "cleaning",
        assignedTo: 1,
        dueDate: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM today
        completed: false,
        createdBy: 1,
        createdAt: new Date(),
      },
      {
        title: "Grocery Shopping",
        category: "groceries",
        assignedTo: 2,
        dueDate: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6 PM today
        completed: false,
        createdBy: 2,
        createdAt: new Date(),
      },
      {
        title: "Take Out Garbage",
        category: "garbage",
        assignedTo: 3,
        dueDate: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000), // 8 AM tomorrow
        completed: false,
        createdBy: 3,
        createdAt: new Date(),
      },
    ];

    sampleTasks.forEach(task => {
      const id = this.currentTaskId++;
      this.tasks.set(id, { ...task, id });
    });

    // Create sample grocery items
    const sampleGroceryItems = [
      { name: "Milk (2L)", addedBy: 3, completed: false, createdAt: new Date() },
      { name: "Bread", addedBy: 2, completed: false, createdAt: new Date() },
      { name: "Bananas", addedBy: 4, completed: true, createdAt: new Date() },
      { name: "Toilet Paper", addedBy: 1, completed: false, createdAt: new Date() },
    ];

    sampleGroceryItems.forEach(item => {
      const id = this.currentGroceryId++;
      this.groceryItems.set(id, { ...item, id });
    });

    // Create sample activities
    const sampleActivities = [
      {
        type: "task_completed",
        description: "completed Vacuum Living Room",
        userId: 2,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        type: "grocery_added",
        description: "added Milk, Bread, Eggs to grocery list",
        userId: 3,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        type: "expense_paid",
        description: "paid $34.50 for groceries",
        userId: 4,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];

    sampleActivities.forEach(activity => {
      const id = this.currentActivityId++;
      this.activities.set(id, { ...activity, id });
    });
  }

  // Flatmates
  async getFlatmates(): Promise<Flatmate[]> {
    return Array.from(this.flatmates.values());
  }

  async getFlatmate(id: number): Promise<Flatmate | undefined> {
    return this.flatmates.get(id);
  }

  async createFlatmate(flatmate: InsertFlatmate): Promise<Flatmate> {
    const id = this.currentFlatemateId++;
    const newFlatmate: Flatmate = { ...flatmate, id };
    this.flatmates.set(id, newFlatmate);
    return newFlatmate;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const newTask: Task = { 
      ...task, 
      id,
      createdAt: new Date(),
      completedAt: null,
      completedBy: null,
    };
    this.tasks.set(id, newTask);
    
    // Create activity
    await this.createActivity({
      type: "task_created",
      description: `created task: ${task.title}`,
      userId: task.createdBy,
    });
    
    return newTask;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async completeTask(id: number, completedBy: number): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { 
      ...task, 
      completed: true, 
      completedAt: new Date(), 
      completedBy 
    };
    this.tasks.set(id, updatedTask);
    
    // Create activity
    await this.createActivity({
      type: "task_completed",
      description: `completed ${task.title}`,
      userId: completedBy,
    });
    
    return updatedTask;
  }

  // Grocery Items
  async getGroceryItems(): Promise<GroceryItem[]> {
    return Array.from(this.groceryItems.values());
  }

  async getGroceryItem(id: number): Promise<GroceryItem | undefined> {
    return this.groceryItems.get(id);
  }

  async createGroceryItem(item: InsertGroceryItem): Promise<GroceryItem> {
    const id = this.currentGroceryId++;
    const newItem: GroceryItem = { 
      ...item, 
      id,
      createdAt: new Date(),
    };
    this.groceryItems.set(id, newItem);
    
    // Create activity
    await this.createActivity({
      type: "grocery_added",
      description: `added ${item.name} to grocery list`,
      userId: item.addedBy,
    });
    
    return newItem;
  }

  async updateGroceryItem(id: number, updates: Partial<GroceryItem>): Promise<GroceryItem | undefined> {
    const item = this.groceryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.groceryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteGroceryItem(id: number): Promise<boolean> {
    return this.groceryItems.delete(id);
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const id = this.currentExpenseId++;
    const newExpense: Expense = { 
      ...expense, 
      id,
      createdAt: new Date(),
    };
    this.expenses.set(id, newExpense);
    
    // Create activity
    await this.createActivity({
      type: "expense_paid",
      description: `paid $${expense.amount} for ${expense.description}`,
      userId: expense.paidBy,
    });
    
    return newExpense;
  }

  // Expense Shares
  async getExpenseShares(expenseId?: number): Promise<ExpenseShare[]> {
    const shares = Array.from(this.expenseShares.values());
    if (expenseId) {
      return shares.filter(share => share.expenseId === expenseId);
    }
    return shares;
  }

  async createExpenseShare(share: InsertExpenseShare): Promise<ExpenseShare> {
    const id = this.currentExpenseShareId++;
    const newShare: ExpenseShare = { ...share, id };
    this.expenseShares.set(id, newShare);
    return newShare;
  }

  async updateExpenseShare(id: number, updates: Partial<ExpenseShare>): Promise<ExpenseShare | undefined> {
    const share = this.expenseShares.get(id);
    if (!share) return undefined;
    
    const updatedShare = { ...share, ...updates };
    this.expenseShares.set(id, updatedShare);
    return updatedShare;
  }

  // Activities
  async getActivities(limit = 10): Promise<Activity[]> {
    const activities = Array.from(this.activities.values());
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = { 
      ...activity, 
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }
}

export const storage = new MemStorage();
