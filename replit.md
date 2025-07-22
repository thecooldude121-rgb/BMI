# CRM/Business Management Intelligence Platform

## Overview
This is a comprehensive CRM and Business Management Intelligence platform successfully migrated from Bolt to Replit environment. The platform includes modules for HRMS, CRM, Deal Management, Calendar, Analytics, and Lead Generation.

## Architecture
- **Backend**: Node.js with Express server
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Frontend**: React with TypeScript, TanStack Query, Tailwind CSS
- **Authentication**: JWT-based authentication system
- **API**: RESTful API with comprehensive CRUD operations

## Recent Changes
- **2025-01-22**: Successfully completed migration from Supabase to Neon PostgreSQL
- **2025-01-22**: Implemented comprehensive database schema with proper relations
- **2025-01-22**: Created full API layer with authentication and CRUD operations
- **2025-01-22**: Removed all Supabase dependencies and replaced with Drizzle ORM
- **2025-01-22**: Added database seeding with sample business data
- **2025-01-22**: Established secure client-server separation
- **2025-01-22**: Fixed all TypeScript errors in server routes with proper error handling
- **2025-01-22**: Resolved navigation issues in Deal Detail page
- **2025-01-22**: Enhanced database connection with retry logic
- **2025-01-22**: Created comprehensive sample data: 5 accounts, 5 contacts, 5 leads, 5 deals with full field population
- **2025-01-22**: Implemented AI-powered insights sidebar with Google Gemini 2.5 Pro integration for sales trend analysis
- **2025-01-22**: Fixed CRM module navigation - main /crm route now properly displays CRM functionality
- **2025-01-22**: Resolved data display issues in deals and contacts pages with proper null checks
- **2025-01-22**: Fixed payload size errors for AI analysis requests with optimized data processing

## Database Schema
The platform uses a comprehensive schema including:
- Users, Accounts (Companies), Contacts, Leads
- Deals, Tasks, Activities, Meetings
- Proper relationships and foreign keys
- UUID-based primary keys for scalability

## Security Features
- Server-side database operations only
- Input validation with Zod schemas
- Environment-based configuration
- Secure API endpoints with error handling

## Development Status
✅ Environment setup completed
✅ Database migration and schema creation
✅ API layer implementation
✅ Sample data seeding
✅ Supabase code removal
✅ Client-server separation established
✅ AI-powered insights sidebar implementation
✅ CRM module navigation and routing
✅ Complete CRM functionality (leads, contacts, deals, accounts)
✅ Robust error handling and data validation

## User Preferences
- Technical communication preferred
- Focus on robust, production-ready implementations
- Emphasis on security and data integrity
- Clean, maintainable code structure

## Next Steps
The platform is ready for deployment with full CRM functionality and AI insights. Available for additional features like:
- Enhanced dashboard customization and drag-drop widgets
- Advanced analytics and reporting
- Calendar integration and meeting scheduling
- HRMS module expansion
- Lead generation automation
- Custom field management and pipeline customization