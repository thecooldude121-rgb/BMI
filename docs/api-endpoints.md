# BMI Platform API Endpoints

## Authentication

### POST /api/auth/login
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### POST /api/auth/logout
Logout current user

### GET /api/auth/me
Get current user profile

### PUT /api/auth/profile
Update user profile

---

## CRM Module

### Leads

#### GET /api/leads
Get all leads with filtering and pagination
Query parameters:
- `page` (integer): Page number
- `limit` (integer): Items per page
- `stage` (string): Filter by stage
- `assigned_to` (uuid): Filter by assignee
- `industry` (string): Filter by industry
- `source` (string): Filter by source
- `search` (string): Search in name, company, email

#### GET /api/leads/:id
Get single lead by ID

#### POST /api/leads
Create new lead
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@company.com",
  "phone": "+1-555-0123",
  "company": "Tech Corp",
  "position": "VP of Sales",
  "industry": "Technology",
  "source": "LinkedIn",
  "estimated_value": 50000,
  "notes": "Interested in enterprise solution"
}
```

#### PUT /api/leads/:id
Update lead

#### DELETE /api/leads/:id
Delete lead

#### PUT /api/leads/:id/stage
Update lead stage
```json
{
  "stage": "qualified",
  "notes": "Qualified in discovery call"
}
```

#### POST /api/leads/:id/activities
Log activity for lead
```json
{
  "type": "call",
  "subject": "Discovery call",
  "description": "Discussed requirements and timeline",
  "outcome": "Positive",
  "duration": 30,
  "scheduled_at": "2024-01-20T10:00:00Z"
}
```

#### GET /api/leads/:id/ai-insights
Get AI insights for specific lead

### Deals

#### GET /api/deals
Get all deals with filtering

#### GET /api/deals/:id
Get single deal

#### POST /api/deals
Create new deal
```json
{
  "lead_id": "uuid",
  "name": "Enterprise Package Deal",
  "value": 75000,
  "stage": "proposal",
  "probability": 70,
  "expected_close_date": "2024-03-15",
  "description": "Enterprise software implementation"
}
```

#### PUT /api/deals/:id
Update deal

#### DELETE /api/deals/:id
Delete deal

#### GET /api/deals/:id/forecast
Get AI deal forecast and recommendations

### Contacts

#### GET /api/contacts
Get all contacts

#### POST /api/contacts
Create new contact

#### PUT /api/contacts/:id
Update contact

#### DELETE /api/contacts/:id
Delete contact

### Tasks

#### GET /api/tasks
Get tasks with filtering
Query parameters:
- `assigned_to` (uuid): Filter by assignee
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `due_date` (date): Filter by due date

#### POST /api/tasks
Create new task
```json
{
  "title": "Follow up with lead",
  "description": "Schedule demo call",
  "priority": "high",
  "due_date": "2024-01-25T10:00:00Z",
  "assigned_to": "uuid",
  "related_type": "lead",
  "related_id": "uuid"
}
```

#### PUT /api/tasks/:id
Update task

#### DELETE /api/tasks/:id
Delete task

---

## HRMS Module

### Employees

#### GET /api/employees
Get all employees

#### GET /api/employees/:id
Get single employee

#### POST /api/employees
Create new employee
```json
{
  "user_id": "uuid",
  "employee_id": "EMP001",
  "hire_date": "2024-01-15",
  "job_title": "Sales Representative",
  "department": "Sales",
  "salary": 65000,
  "employment_type": "full_time"
}
```

#### PUT /api/employees/:id
Update employee

### Attendance

#### GET /api/attendance
Get attendance records
Query parameters:
- `employee_id` (uuid): Filter by employee
- `date_from` (date): Start date
- `date_to` (date): End date

#### POST /api/attendance
Record attendance
```json
{
  "employee_id": "uuid",
  "date": "2024-01-20",
  "check_in": "09:00:00",
  "check_out": "17:30:00",
  "status": "present"
}
```

### Leave Requests

#### GET /api/leave-requests
Get leave requests

#### POST /api/leave-requests
Create leave request
```json
{
  "employee_id": "uuid",
  "leave_type": "vacation",
  "start_date": "2024-02-01",
  "end_date": "2024-02-05",
  "reason": "Family vacation"
}
```

#### PUT /api/leave-requests/:id/approve
Approve leave request

#### PUT /api/leave-requests/:id/reject
Reject leave request

### Workflows

#### GET /api/workflows
Get all workflows

#### POST /api/workflows
Create new workflow

#### GET /api/workflows/:id/instances
Get workflow instances

---

## Analytics & Intelligence

### Dashboard

#### GET /api/dashboard/stats
Get dashboard statistics
```json
{
  "total_leads": 150,
  "qualified_leads": 45,
  "total_deals": 25,
  "pipeline_value": 750000,
  "won_deals": 8,
  "conversion_rate": 0.32
}
```

### Analytics

#### GET /api/analytics/sales-funnel
Get sales funnel data

#### GET /api/analytics/team-performance
Get team performance metrics

#### GET /api/analytics/industry-breakdown
Get performance by industry

#### GET /api/analytics/forecast
Get sales forecast with AI predictions

### AI Intelligence

#### GET /api/ai/recommendations
Get AI recommendations for user
Query parameters:
- `type` (string): Filter by recommendation type
- `limit` (integer): Number of recommendations

#### GET /api/ai/lead-scoring
Get lead scoring for all leads

#### POST /api/ai/find-similar-leads
Find similar leads based on persona
```json
{
  "lead_id": "uuid",
  "limit": 10
}
```

#### GET /api/ai/personas
Get identified lead personas

#### POST /api/ai/generate-prospects
Generate prospect suggestions
```json
{
  "industry": "Technology",
  "job_titles": ["CTO", "VP of Technology"],
  "company_size": ["500+"],
  "limit": 50
}
```

---

## Calendar & Meetings

### Meetings

#### GET /api/meetings
Get meetings with filtering
Query parameters:
- `date_from` (date): Start date
- `date_to` (date): End date
- `type` (string): Meeting type
- `attendee` (uuid): Filter by attendee

#### POST /api/meetings
Create new meeting
```json
{
  "title": "Product Demo",
  "description": "Demo for potential client",
  "start_time": "2024-01-25T14:00:00Z",
  "end_time": "2024-01-25T15:00:00Z",
  "meeting_type": "demo",
  "attendees": [
    {
      "user_id": "uuid"
    },
    {
      "contact_id": "uuid"
    }
  ],
  "lead_id": "uuid"
}
```

#### PUT /api/meetings/:id
Update meeting

#### DELETE /api/meetings/:id
Delete meeting

#### POST /api/meetings/:id/summary
Add meeting summary and action items
```json
{
  "summary": "Productive demo session",
  "action_items": [
    "Send pricing proposal",
    "Schedule technical deep-dive"
  ]
}
```

---

## Integrations

### Email Integration

#### GET /api/integrations/email/sync
Sync emails from connected accounts

#### POST /api/integrations/email/send
Send email through platform
```json
{
  "to": ["contact@company.com"],
  "subject": "Follow up from meeting",
  "body": "Thank you for the productive meeting...",
  "template_id": "uuid",
  "lead_id": "uuid"
}
```

### Calendar Integration

#### GET /api/integrations/calendar/sync
Sync calendar events

#### POST /api/integrations/calendar/connect
Connect calendar account
```json
{
  "provider": "google",
  "credentials": {
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

---

## Data Management

### Import/Export

#### POST /api/data/import/leads
Import leads from CSV
Form data with file upload

#### GET /api/data/export/leads
Export leads to CSV

#### GET /api/data/export/contacts
Export contacts to CSV

#### GET /api/data/export/deals
Export deals to CSV

---

## System

### Settings

#### GET /api/settings/user
Get user settings

#### PUT /api/settings/user
Update user settings

#### GET /api/settings/notifications
Get notification preferences

#### PUT /api/settings/notifications
Update notification preferences

### Audit

#### GET /api/audit/logs
Get audit logs (admin only)
Query parameters:
- `user_id` (uuid): Filter by user
- `entity_type` (string): Filter by entity type
- `action` (string): Filter by action
- `date_from` (date): Start date
- `date_to` (date): End date

---

## Error Responses

All endpoints return standard HTTP status codes and error responses:

### 400 Bad Request
```json
{
  "error": "validation_error",
  "message": "Invalid input data",
  "details": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API endpoints are rate limited:
- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated requests
- AI endpoints: 100 requests per hour

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)