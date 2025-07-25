#!/usr/bin/env python3
"""
BMI Platform - Python FastAPI Backend
Converted from Node.js/Express to Python
"""

import os
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from uuid import uuid4, UUID

from fastapi import FastAPI, HTTPException, Depends, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID as PostgreSQL_UUID, JSONB
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/crm_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI(title="BMI Platform", description="Business Management Intelligence Platform")

# Templates setup
templates = Jinja2Templates(directory="templates")

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Database Models (converted from TypeScript schema)
class User(Base):
    __tablename__ = "users"
    
    id = Column(PostgreSQL_UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="user")
    department = Column(String)
    avatar_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(PostgreSQL_UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, nullable=False)
    domain = Column(String)
    industry = Column(String)
    company_size = Column(String, default="unknown")
    annual_revenue = Column(Float)
    website = Column(String)
    phone = Column(String)
    description = Column(Text)
    address = Column(JSONB)
    billing_address = Column(JSONB)
    account_type = Column(String, default="prospect")
    account_status = Column(String, default="active")
    health_score = Column(Integer, default=50)
    owner_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(PostgreSQL_UUID(as_uuid=True), primary_key=True, default=uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    job_title = Column(String)
    department = Column(String)
    account_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("accounts.id"))
    is_primary = Column(Boolean, default=False)
    contact_status = Column(String, default="active")
    linkedin_url = Column(String)
    twitter_handle = Column(String)
    owner_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(PostgreSQL_UUID(as_uuid=True), primary_key=True, default=uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    company = Column(String)
    job_title = Column(String)
    lead_source = Column(String, default="website")
    lead_status = Column(String, default="active")
    lead_stage = Column(String, default="new")
    lead_score = Column(Integer, default=0)
    temperature = Column(String, default="cold")
    owner_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(PostgreSQL_UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, nullable=False)
    amount = Column(Float, default=0)
    stage = Column(String, default="qualification")
    probability = Column(Integer, default=0)
    expected_close_date = Column(DateTime)
    actual_close_date = Column(DateTime)
    account_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("accounts.id"))
    contact_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("contacts.id"))
    owner_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("users.id"))
    deal_type = Column(String, default="new_business")
    deal_health = Column(String, default="healthy")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(PostgreSQL_UUID(as_uuid=True), primary_key=True, default=uuid4)
    subject = Column(String, nullable=False)
    description = Column(Text)
    activity_type = Column(String, default="task")
    status = Column(String, default="open")
    priority = Column(String, default="medium")
    due_date = Column(DateTime)
    completed_date = Column(DateTime)
    account_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("accounts.id"))
    contact_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("contacts.id"))
    lead_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("leads.id"))
    deal_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("deals.id"))
    owner_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(PostgreSQL_UUID(as_uuid=True), primary_key=True, default=uuid4)
    employee_id = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    department = Column(String, nullable=False)
    position = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    hire_date = Column(DateTime, nullable=False)
    salary = Column(Float, nullable=False)
    status = Column(String, default="active")
    work_location = Column(String, default="office")
    annual_leave_balance = Column(Integer, default=25)
    sick_leave_balance = Column(Integer, default=10)
    personal_leave_balance = Column(Integer, default=5)
    manager_id = Column(PostgreSQL_UUID(as_uuid=True), ForeignKey("employees.id"))
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    emergency_contact_relationship = Column(String)
    address = Column(Text)
    overtime_eligible = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models for API
class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    role: str = "user"

class AccountCreate(BaseModel):
    name: str
    domain: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None

class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    job_title: Optional[str] = None
    account_id: Optional[UUID] = None

class LeadCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    lead_source: str = "website"

class DealCreate(BaseModel):
    name: str
    amount: float = 0
    stage: str = "qualification"
    probability: int = 0
    account_id: Optional[UUID] = None
    contact_id: Optional[UUID] = None

class ActivityCreate(BaseModel):
    subject: str
    description: Optional[str] = None
    activity_type: str = "task"
    priority: str = "medium"
    due_date: Optional[datetime] = None

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
Base.metadata.create_all(bind=engine)

# Routes
@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/crm", response_class=HTMLResponse)
async def crm_dashboard(request: Request):
    return templates.TemplateResponse("crm.html", {"request": request})

@app.get("/hrms", response_class=HTMLResponse)
async def hrms_dashboard(request: Request):
    return templates.TemplateResponse("hrms.html", {"request": request})

# API Routes - Accounts
@app.get("/api/accounts")
async def get_accounts(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    return [
        {
            "id": str(account.id),
            "name": account.name,
            "domain": account.domain,
            "industry": account.industry,
            "website": account.website,
            "phone": account.phone,
            "account_type": account.account_type,
            "health_score": account.health_score,
            "created_at": account.created_at.isoformat() if account.created_at else None
        }
        for account in accounts
    ]

@app.post("/api/accounts")
async def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    db_account = Account(**account.dict())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return {"id": str(db_account.id), "name": db_account.name}

@app.get("/api/accounts/{account_id}")
async def get_account(account_id: str, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return {
        "id": str(account.id),
        "name": account.name,
        "domain": account.domain,
        "industry": account.industry,
        "website": account.website,
        "phone": account.phone,
        "description": account.description,
        "account_type": account.account_type,
        "health_score": account.health_score,
        "created_at": account.created_at.isoformat() if account.created_at else None
    }

# API Routes - Contacts
@app.get("/api/contacts")
async def get_contacts(db: Session = Depends(get_db)):
    contacts = db.query(Contact).all()
    return [
        {
            "id": str(contact.id),
            "first_name": contact.first_name,
            "last_name": contact.last_name,
            "email": contact.email,
            "phone": contact.phone,
            "job_title": contact.job_title,
            "account_id": str(contact.account_id) if contact.account_id else None,
            "created_at": contact.created_at.isoformat() if contact.created_at else None
        }
        for contact in contacts
    ]

@app.post("/api/contacts")
async def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return {"id": str(db_contact.id), "name": f"{db_contact.first_name} {db_contact.last_name}"}

# API Routes - Leads
@app.get("/api/leads")
async def get_leads(db: Session = Depends(get_db)):
    leads = db.query(Lead).all()
    return [
        {
            "id": str(lead.id),
            "first_name": lead.first_name,
            "last_name": lead.last_name,
            "email": lead.email,
            "phone": lead.phone,
            "company": lead.company,
            "job_title": lead.job_title,
            "lead_source": lead.lead_source,
            "lead_status": lead.lead_status,
            "lead_stage": lead.lead_stage,
            "lead_score": lead.lead_score,
            "temperature": lead.temperature,
            "created_at": lead.created_at.isoformat() if lead.created_at else None
        }
        for lead in leads
    ]

@app.post("/api/leads")
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    db_lead = Lead(**lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return {"id": str(db_lead.id), "name": f"{db_lead.first_name} {db_lead.last_name}"}

# API Routes - Deals
@app.get("/api/deals")
async def get_deals(db: Session = Depends(get_db)):
    deals = db.query(Deal).all()
    return [
        {
            "id": str(deal.id),
            "name": deal.name,
            "amount": deal.amount,
            "stage": deal.stage,
            "probability": deal.probability,
            "expected_close_date": deal.expected_close_date.isoformat() if deal.expected_close_date else None,
            "account_id": str(deal.account_id) if deal.account_id else None,
            "contact_id": str(deal.contact_id) if deal.contact_id else None,
            "deal_type": deal.deal_type,
            "deal_health": deal.deal_health,
            "created_at": deal.created_at.isoformat() if deal.created_at else None
        }
        for deal in deals
    ]

@app.post("/api/deals")
async def create_deal(deal: DealCreate, db: Session = Depends(get_db)):
    db_deal = Deal(**deal.dict())
    db.add(db_deal)
    db.commit()
    db.refresh(db_deal)
    return {"id": str(db_deal.id), "name": db_deal.name}

# API Routes - Activities
@app.get("/api/activities")
async def get_activities(db: Session = Depends(get_db)):
    activities = db.query(Activity).all()
    return [
        {
            "id": str(activity.id),
            "subject": activity.subject,
            "description": activity.description,
            "activity_type": activity.activity_type,
            "status": activity.status,
            "priority": activity.priority,
            "due_date": activity.due_date.isoformat() if activity.due_date else None,
            "account_id": str(activity.account_id) if activity.account_id else None,
            "contact_id": str(activity.contact_id) if activity.contact_id else None,
            "lead_id": str(activity.lead_id) if activity.lead_id else None,
            "deal_id": str(activity.deal_id) if activity.deal_id else None,
            "created_at": activity.created_at.isoformat() if activity.created_at else None
        }
        for activity in activities
    ]

@app.post("/api/activities")
async def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    db_activity = Activity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return {"id": str(db_activity.id), "subject": db_activity.subject}

# API Routes - Employees (HRMS)
@app.get("/api/employees")
async def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return [
        {
            "id": str(employee.id),
            "employee_id": employee.employee_id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "email": employee.email,
            "phone": employee.phone,
            "department": employee.department,
            "position": employee.position,
            "job_title": employee.job_title,
            "hire_date": employee.hire_date.isoformat() if employee.hire_date else None,
            "salary": employee.salary,
            "status": employee.status,
            "work_location": employee.work_location,
            "annual_leave_balance": employee.annual_leave_balance,
            "sick_leave_balance": employee.sick_leave_balance,
            "personal_leave_balance": employee.personal_leave_balance,
            "created_at": employee.created_at.isoformat() if employee.created_at else None
        }
        for employee in employees
    ]

# Metrics endpoints
@app.get("/api/hrms/metrics/employees")
async def get_employee_metrics(db: Session = Depends(get_db)):
    total_employees = db.query(Employee).count()
    active_employees = db.query(Employee).filter(Employee.status == "active").count()
    
    # Department counts
    departments = db.query(Employee.department).distinct().all()
    department_counts = {}
    for dept in departments:
        if dept[0]:
            count = db.query(Employee).filter(Employee.department == dept[0]).count()
            department_counts[dept[0]] = str(count)
    
    # Average salary
    avg_salary_result = db.query(Employee).all()
    avg_salary = sum(emp.salary for emp in avg_salary_result) / len(avg_salary_result) if avg_salary_result else 0
    
    return {
        "totalEmployees": str(total_employees),
        "activeEmployees": str(active_employees),
        "departmentCounts": department_counts,
        "averageSalary": avg_salary
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)