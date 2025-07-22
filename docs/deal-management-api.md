# Deal Management API Documentation

## Base URL
```
/api/v1/deals
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header.

## Endpoints

### Deal Management

#### GET /api/deals
Get all deals with filtering and pagination

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20, max: 100)
- `owner_id` (UUID, optional): Filter by deal owner
- `stage_id` (UUID, optional): Filter by deal stage
- `pipeline_id` (UUID, optional): Filter by pipeline
- `deal_type` (string, optional): Filter by deal type
- `country` (string, optional): Filter by country code
- `amount_min` (decimal, optional): Minimum deal amount
- `amount_max` (decimal, optional): Maximum deal amount
- `closing_date_start` (date, optional): Filter deals closing after this date
- `closing_date_end` (date, optional): Filter deals closing before this date
- `search` (string, optional): Search in deal name and number
- `sort` (string, optional): Sort field (default: created_at)
- `order` (string, optional): Sort order - asc/desc (default: desc)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "dealNumber": "DEAL-2024-001",
      "name": "Enterprise Software License - TechCorp",
      "ownerId": "uuid",
      "dealType": "new-business",
      "country": "US",
      "pipelineId": "uuid",
      "accountId": "uuid",
      "contactId": "uuid",
      "amount": 150000.00,
      "currency": "USD",
      "closingDate": "2024-03-15",
      "stageId": "uuid",
      "probability": 75,
      "createdBy": "uuid",
      "platformFee": 15000.00,
      "customFee": 10000.00,
      "licenseFee": 120000.00,
      "onboardingFee": 5000.00,
      "totalAmount": 150000.00,
      "description": "Enterprise software implementation",
      "tags": ["enterprise", "high-value"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z",
      "lastActivityAt": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### GET /api/deals/:id
Get single deal by ID with full details

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "dealNumber": "DEAL-2024-001",
    "name": "Enterprise Software License - TechCorp",
    // ... all deal fields
    "products": [
      {
        "id": "uuid",
        "productId": "uuid",
        "name": "Enterprise License",
        "quantity": 1,
        "unitPrice": 120000.00,
        "discount": 0,
        "discountType": "percentage",
        "totalPrice": 120000.00
      }
    ],
    "stageHistory": [
      {
        "id": "uuid",
        "fromStageId": "uuid",
        "fromStageName": "Lead",
        "toStageId": "uuid",
        "toStageName": "Qualified",
        "enteredAt": "2024-01-16T14:00:00Z",
        "exitedAt": "2024-01-18T10:00:00Z",
        "duration": 44,
        "changedBy": "uuid"
      }
    ],
    "activities": [...],
    "emails": [...],
    "tasks": [...],
    "meetings": [...],
    "attachments": [...]
  }
}
```

#### POST /api/deals
Create new deal

**Request Body:**
```json
{
  "name": "New Deal Name",
  "ownerId": "uuid",
  "dealType": "new-business",
  "country": "US",
  "pipelineId": "uuid",
  "accountId": "uuid",
  "contactId": "uuid",
  "amount": 50000.00,
  "currency": "USD",
  "closingDate": "2024-06-15",
  "stageId": "uuid",
  "probability": 25,
  "platformFee": 5000.00,
  "customFee": 2000.00,
  "licenseFee": 40000.00,
  "onboardingFee": 3000.00,
  "description": "Deal description",
  "tags": ["tag1", "tag2"],
  "customFields": {},
  "products": [
    {
      "productId": "uuid",
      "quantity": 1,
      "unitPrice": 40000.00,
      "discount": 0,
      "discountType": "percentage"
    }
  ]
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "dealNumber": "DEAL-2024-002",
    // ... full deal object
  }
}
```

#### PUT /api/deals/:id
Update existing deal

**Request Body:** Same as create, all fields optional

#### DELETE /api/deals/:id
Delete deal (soft delete - marks as deleted)

#### PUT /api/deals/:id/stage
Move deal to new stage

**Request Body:**
```json
{
  "stageId": "uuid",
  "reason": "Moved to negotiation after successful demo",
  "notes": "Client is ready to discuss pricing"
}
```

### Deal Products

#### GET /api/deals/:id/products
Get all products for a deal

#### POST /api/deals/:id/products
Add product to deal

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 2,
  "unitPrice": 25000.00,
  "discount": 5,
  "discountType": "percentage"
}
```

#### PUT /api/deals/:dealId/products/:productId
Update deal product

#### DELETE /api/deals/:dealId/products/:productId
Remove product from deal

### Deal Activities

#### GET /api/deals/:id/activities
Get all activities for a deal

**Query Parameters:**
- `type` (string, optional): Filter by activity type
- `status` (string, optional): Filter by status
- `assigned_to` (UUID, optional): Filter by assignee

#### POST /api/deals/:id/activities
Log new activity for deal

**Request Body:**
```json
{
  "type": "call",
  "subject": "Discovery Call",
  "description": "Discussed requirements and timeline",
  "status": "completed",
  "priority": "medium",
  "scheduledAt": "2024-01-25T10:00:00Z",
  "duration": 60,
  "outcome": "Positive - ready for proposal",
  "assignedTo": "uuid"
}
```

#### PUT /api/deals/:dealId/activities/:activityId
Update activity

#### DELETE /api/deals/:dealId/activities/:activityId
Delete activity

### Deal Tasks

#### GET /api/deals/:id/tasks
Get all tasks for a deal

#### POST /api/deals/:id/tasks
Create new task for deal

**Request Body:**
```json
{
  "title": "Prepare proposal document",
  "description": "Create detailed proposal based on discovery call",
  "priority": "high",
  "dueDate": "2024-01-30T17:00:00Z",
  "assignedTo": "uuid"
}
```

#### PUT /api/deals/:dealId/tasks/:taskId
Update task

#### DELETE /api/deals/:dealId/tasks/:taskId
Delete task

#### PUT /api/deals/:dealId/tasks/:taskId/complete
Mark task as complete

### Deal Emails

#### GET /api/deals/:id/emails
Get all emails related to deal

**Query Parameters:**
- `direction` (string, optional): inbound/outbound
- `status` (string, optional): Filter by email status

#### POST /api/deals/:id/emails
Send or schedule email for deal

**Request Body:**
```json
{
  "subject": "Follow up from meeting",
  "body": "Thank you for the productive meeting yesterday...",
  "toEmails": ["contact@company.com"],
  "ccEmails": ["manager@company.com"],
  "scheduledAt": "2024-01-26T09:00:00Z",
  "attachments": [
    {
      "name": "Proposal.pdf",
      "url": "https://...",
      "type": "application/pdf",
      "size": 1024000
    }
  ]
}
```

### Deal Meetings

#### GET /api/deals/:id/meetings
Get all meetings for deal

#### POST /api/deals/:id/meetings
Schedule new meeting for deal

**Request Body:**
```json
{
  "title": "Product Demo",
  "description": "Demonstrate key features",
  "startTime": "2024-01-30T14:00:00Z",
  "endTime": "2024-01-30T15:00:00Z",
  "location": "Conference Room A",
  "meetingUrl": "https://zoom.us/j/123456789",
  "attendees": [
    {
      "type": "user",
      "userId": "uuid",
      "email": "user@company.com",
      "name": "John Doe"
    },
    {
      "type": "contact",
      "contactId": "uuid",
      "email": "contact@client.com",
      "name": "Jane Smith"
    }
  ]
}
```

### Deal Attachments

#### GET /api/deals/:id/attachments
Get all attachments for deal

#### POST /api/deals/:id/attachments
Upload attachment to deal

**Request:** Multipart form data with file

#### DELETE /api/deals/:dealId/attachments/:attachmentId
Delete attachment

### Deal History & Audit

#### GET /api/deals/:id/history
Get complete stage history for deal

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "fromStageId": "uuid",
      "fromStageName": "Lead",
      "toStageId": "uuid",
      "toStageName": "Qualified",
      "enteredAt": "2024-01-16T14:00:00Z",
      "exitedAt": "2024-01-18T10:00:00Z",
      "duration": 44,
      "changedBy": "uuid",
      "reason": "Qualified in discovery call",
      "notes": "Strong interest in enterprise features"
    }
  ]
}
```

### Pipeline Management

#### GET /api/pipelines
Get all deal pipelines

#### GET /api/pipelines/:id
Get single pipeline with stages

#### POST /api/pipelines
Create new pipeline

#### PUT /api/pipelines/:id
Update pipeline

#### DELETE /api/pipelines/:id
Delete pipeline

#### GET /api/pipelines/:id/stages
Get pipeline stages

#### POST /api/pipelines/:id/stages
Add stage to pipeline

#### PUT /api/pipelines/:pipelineId/stages/:stageId
Update pipeline stage

#### DELETE /api/pipelines/:pipelineId/stages/:stageId
Delete pipeline stage

### Analytics & Reporting

#### GET /api/deals/analytics/pipeline
Get pipeline analytics

**Response:**
```json
{
  "data": {
    "totalValue": 2500000.00,
    "weightedValue": 1250000.00,
    "averageDealSize": 85000.00,
    "conversionRate": 32.5,
    "stageBreakdown": [
      {
        "stageId": "uuid",
        "stageName": "Qualified",
        "dealCount": 15,
        "totalValue": 750000.00,
        "averageTime": 12.5
      }
    ],
    "monthlyTrends": [...],
    "forecasting": {
      "thisMonth": 185000.00,
      "nextMonth": 245000.00,
      "nextQuarter": 680000.00
    }
  }
}
```

#### GET /api/deals/analytics/performance
Get team performance analytics

#### GET /api/deals/analytics/forecasting
Get AI-powered deal forecasting

### Bulk Operations

#### PUT /api/deals/bulk/stage
Move multiple deals to new stage

**Request Body:**
```json
{
  "dealIds": ["uuid1", "uuid2", "uuid3"],
  "stageId": "uuid",
  "reason": "Bulk stage update"
}
```

#### PUT /api/deals/bulk/owner
Reassign multiple deals to new owner

#### PUT /api/deals/bulk/tags
Add/remove tags from multiple deals

#### DELETE /api/deals/bulk
Bulk delete deals

### Integration Endpoints

#### POST /api/deals/:id/sync/email
Sync emails from Gmail/Outlook

#### POST /api/deals/:id/sync/calendar
Sync calendar events

#### GET /api/deals/webhooks
Get webhook configurations

#### POST /api/deals/webhooks
Create webhook for deal events

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/deals",
  "events": ["deal.created", "deal.stage_changed", "deal.won", "deal.lost"],
  "secret": "your-webhook-secret"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": {
    "amount": "Amount must be greater than 0",
    "stageId": "Invalid stage ID"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "FORBIDDEN", 
  "message": "Insufficient permissions to access this deal"
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Deal not found"
}
```

### 409 Conflict
```json
{
  "error": "CONFLICT",
  "message": "Deal number already exists"
}
```

## Rate Limiting

- Standard endpoints: 1000 requests per hour
- Analytics endpoints: 100 requests per hour
- Bulk operations: 10 requests per hour
- File uploads: 50 requests per hour

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Webhooks

Deal management supports real-time webhooks for the following events:

- `deal.created`: New deal created
- `deal.updated`: Deal updated
- `deal.deleted`: Deal deleted
- `deal.stage_changed`: Deal moved between stages
- `deal.won`: Deal marked as won
- `deal.lost`: Deal marked as lost
- `deal.activity_added`: New activity logged
- `deal.task_created`: New task created
- `deal.task_completed`: Task completed
- `deal.email_sent`: Email sent from deal
- `deal.meeting_scheduled`: Meeting scheduled

Webhook payload example:
```json
{
  "event": "deal.stage_changed",
  "timestamp": "2024-01-25T15:30:00Z",
  "data": {
    "dealId": "uuid",
    "fromStageId": "uuid",
    "toStageId": "uuid",
    "changedBy": "uuid"
  }
}
```