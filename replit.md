# MeetingAI - AI-Powered Sales Meeting Assistant

## Overview

MeetingAI is a comprehensive AI-powered meeting assistant that automatically transcribes, analyzes, and extracts actionable insights from uploaded meeting audio files. The application provides a complete workflow from audio upload to AI-generated summaries, featuring a modern web interface with dashboard analytics, settings management, and detailed meeting insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 24, 2025)

✓ **Successfully switched Meeting Intelligence from OpenAI to Google Gemini API**
✓ Updated all AI services to use Gemini 1.5 Pro for transcription and analysis
✓ Updated Settings page to display "Google Gemini API Connected"
✓ Updated README.md and documentation to reference Gemini instead of OpenAI
✓ Created .env.example with GEMINI_API_KEY configuration
✓ Server application code is fully functional and starts correctly
✅ **DEPLOYMENT READY**: Multiple deployment platforms configured
✅ **EXPORT READY**: Created deployment packages for Railway, Vercel, Render, etc.
✅ **ALTERNATIVE DEPLOYMENT**: All configuration files created for external hosting
→ **Next Step**: Export to GitHub and deploy on Railway/Render for live access

## Previous Changes (July 23-24, 2025)

✓ Successfully integrated AI Meeting App as separate module within BMI platform
✓ Added comprehensive Meeting Intelligence module to navigation
✓ Created meeting upload, transcription, and analysis components
✓ **Switched from OpenAI to Google Gemini 1.5 Pro for all AI services**
✓ Integrated Google Gemini 1.5 Pro for speech-to-text transcription  
✓ Implemented Gemini AI for intelligent meeting analysis and insights
✓ Updated Settings page to reflect Gemini API integration
✓ Updated all documentation to reference Gemini instead of OpenAI
✓ Configured file upload system supporting MP3, WAV, M4A, MP4 formats
✓ Built meeting dashboard with statistics and processing status
✓ Added meeting detail modal with insights display and transcript download
✓ Preserved existing CRM, HRMS, and other business modules

## Previous Changes (January 22, 2025)

✓ Enhanced UI with accessible dialog components and descriptions
✓ Added comprehensive Analytics page with pain point and objection trends
✓ Created Settings page with API configuration and data management
✓ Implemented proper navigation with active state indicators
✓ Added multi-page routing with Dashboard, Analytics, and Settings
✓ Fixed TypeScript diagnostics and improved code quality
✓ Enhanced README with complete documentation and usage guide
✓ Built modern Meetings page similar to Sybill's interface with search and filters
✓ Integrated Google Calendar API for displaying upcoming meetings with join buttons
✓ Added comprehensive documentation for Google Calendar setup process
✓ Created calendar service with proper error handling and authentication

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **UI Library**: Shadcn UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for consistent type safety across the stack
- **API Design**: RESTful endpoints with proper HTTP status codes
- **File Handling**: Multer middleware for multipart form uploads
- **Async Processing**: Non-blocking audio processing with status updates

### Database Strategy
- **Current**: In-memory storage using Map data structures
- **Schema**: Drizzle ORM with PostgreSQL schema definitions
- **Migration Ready**: Database abstraction layer allows easy migration to PostgreSQL
- **Data Models**: Meeting entities with comprehensive metadata and AI insights

## Key Components

### Audio Processing Pipeline
1. **Upload Validation**: File type and size restrictions (MP3, WAV, M4A, MP4 up to 100MB)
2. **Transcription Service**: OpenAI Whisper API integration for speech-to-text
3. **AI Analysis**: GPT-4o for generating summaries and extracting insights
4. **Status Tracking**: Real-time processing status updates

### Core Features
- **Meeting Dashboard**: Overview of all processed meetings with statistics
- **Upload Interface**: Drag-and-drop file upload with metadata input
- **Detail Views**: Full transcript display with AI-generated insights
- **Export Functionality**: Transcript download capabilities

### AI Integration
- **Transcription**: Google Gemini 1.5 Pro for accurate speech recognition
- **Analysis**: Gemini AI for intelligent content analysis including:
  - Meeting summaries
  - Key outcomes and action items
  - Pain points identification
  - Objection handling insights

## Data Flow

1. **Upload**: User uploads audio file with meeting metadata
2. **Storage**: File saved to local filesystem, meeting record created
3. **Transcription**: Audio sent to Google Gemini API
4. **Analysis**: Transcript processed by Gemini AI for insights
5. **Storage Update**: Results saved to meeting record
6. **Display**: Real-time status updates shown to user

## External Dependencies

### AI Services
- **Google Gemini API**: Gemini 1.5 Pro for transcription and analysis
- **Configuration**: API key management through environment variables

### Frontend Libraries
- **UI Components**: Comprehensive Radix UI component library
- **Icons**: Lucide React for consistent iconography
- **Utilities**: Class variance authority for component variants

### Backend Dependencies
- **File Upload**: Multer for handling multipart form data
- **Database**: Drizzle ORM with Neon serverless PostgreSQL support
- **Session Management**: Connect-pg-simple for session storage

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **API Proxy**: Integrated development setup with backend/frontend coordination
- **Environment**: Replit-optimized configuration

### Production Considerations
- **Build Process**: Separate client and server build processes
- **Static Assets**: Vite handles frontend asset optimization
- **Database Migration**: Ready for PostgreSQL deployment with existing schema
- **File Storage**: Current local storage easily replaceable with cloud solutions

### Configuration Management
- **Environment Variables**: Centralized configuration for API keys and database URLs
- **Schema Validation**: Zod for runtime type checking and validation
- **Error Handling**: Comprehensive error boundaries and API error responses

The architecture prioritizes rapid development and easy deployment while maintaining the flexibility to scale and migrate to production-ready infrastructure when needed.