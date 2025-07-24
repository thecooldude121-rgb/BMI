import { users, type User, type InsertUser } from "@shared/schema";

// Define basic BMI Platform entities
export interface Lead {
  id: number;
  name: string;
  email: string;
  company?: string;
  stage: 'new' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost';
  value?: number;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: number;
  title: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  leadId?: number;
  accountId?: number;
  ownerId?: number;
  expectedCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: number;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  revenue?: number;
  employees?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  position?: string;
  salary?: number;
  hireDate?: Date;
  status: 'active' | 'inactive' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // CRM methods
  getAllLeads(): Promise<Lead[]>;
  getAllDeals(): Promise<Deal[]>;
  getAllAccounts(): Promise<Account[]>;
  
  // HRMS methods
  getAllEmployees(): Promise<Employee[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private deals: Map<number, Deal>;
  private accounts: Map<number, Account>;
  private employees: Map<number, Employee>;
  private currentUserId: number;
  private currentLeadId: number;
  private currentDealId: number;
  private currentAccountId: number;
  private currentEmployeeId: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.deals = new Map();
    this.accounts = new Map();
    this.employees = new Map();
    this.currentUserId = 1;
    this.currentLeadId = 1;
    this.currentDealId = 1;
    this.currentAccountId = 1;
    this.currentEmployeeId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const now = new Date();
    
    // Sample Leads
    this.leads.set(1, {
      id: 1,
      name: "John Smith",
      email: "john.smith@techcorp.com",
      company: "TechCorp Inc",
      stage: "qualified",
      value: 50000,
      source: "Website",
      createdAt: now,
      updatedAt: now
    });
    
    this.leads.set(2, {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@innovate.co",
      company: "Innovate Solutions",
      stage: "proposal",
      value: 75000,
      source: "Referral",
      createdAt: now,
      updatedAt: now
    });
    
    // Sample Deals
    this.deals.set(1, {
      id: 1,
      title: "Enterprise Software License",
      value: 120000,
      stage: "negotiation",
      probability: 75,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: now,
      updatedAt: now
    });
    
    this.deals.set(2, {
      id: 2,
      title: "Professional Services Contract",
      value: 85000,
      stage: "closed-won",
      probability: 100,
      createdAt: now,
      updatedAt: now
    });
    
    // Sample Accounts
    this.accounts.set(1, {
      id: 1,
      name: "Global Enterprises",
      industry: "Technology",
      website: "https://globalent.com",
      phone: "+1-555-0123",
      revenue: 10000000,
      employees: 500,
      createdAt: now,
      updatedAt: now
    });
    
    // Sample Employees
    this.employees.set(1, {
      id: 1,
      firstName: "Alice",
      lastName: "Brown",
      email: "alice.brown@company.com",
      department: "Sales",
      position: "Sales Manager",
      salary: 85000,
      status: "active",
      createdAt: now,
      updatedAt: now
    });
    
    this.employees.set(2, {
      id: 2,
      firstName: "Bob",
      lastName: "Wilson",
      email: "bob.wilson@company.com",
      department: "Engineering",
      position: "Software Engineer",
      salary: 95000,
      status: "active",
      createdAt: now,
      updatedAt: now
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // CRM methods
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAllDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAllAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // HRMS methods
  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
