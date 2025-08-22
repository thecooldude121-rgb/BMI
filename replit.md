# CRM/Business Management Intelligence Platform

## Overview
This is a comprehensive CRM and Business Management Intelligence platform designed to provide a centralized solution for managing customer relationships and business operations. It includes modules for HRMS, CRM, Deal Management, Calendar, Analytics (BI Board), and Lead Generation. The platform aims to offer enterprise-grade functionality, intelligent automation, and gamified experiences to enhance productivity and drive business growth.

## User Preferences
- Technical communication preferred
- Focus on robust, production-ready implementations
- Emphasis on security and data integrity
- Clean, maintainable code structure

## System Architecture
The platform is built with a modern full-stack architecture:
- **Backend**: Node.js with Express server, providing RESTful APIs with comprehensive CRUD operations.
- **Database**: PostgreSQL (Neon) with Drizzle ORM, featuring a comprehensive schema with proper relations, UUID-based primary keys, and server-side operations only.
- **Frontend**: React with TypeScript, TanStack Query, and Tailwind CSS, featuring a collapsible sidebar navigation and responsive design.
- **Authentication**: JWT-based authentication system.
- **UI/UX**: Emphasis on a modern enterprise design with features like glassmorphism effects, animated backgrounds, 3D cards, particle effects, and comprehensive animated micro-interactions using Framer Motion. Enhanced with smooth tab transitions, staggered sidebar animations, card hover effects, and button interactions. UI components are primarily standard HTML with Tailwind CSS. Layouts are optimized for compact presentation with minimal spacing. **COMPLETE LIGHT THEME IMPLEMENTATION**: Platform-wide light theme with white/light gray backgrounds, dark gray text, and preserved accent colors across all modules including CRM, HRMS, Analytics, Deal Management, and Lead Generation. All left sidebar sections (Activities, Contacts, Deals, Tasks, Notes) fully converted to light theme with consistent BMI design principles.
- **Core Modules**:
    - **HRMS**: Standalone module with dedicated routing and navigation, including employee management, attendance tracking, and performance reviews.
    - **CRM**: Comprehensive module featuring advanced Leads, Accounts, Contacts, Deals, and Activities management. Includes multi-view modes (Kanban, Tile, List), AI-powered fuzzy search, advanced filtering, and analytics dashboards.
    - **Gamification**: Integrated directly into the CRM, offering real-time XP tracking, level progression, badges, challenges, leaderboards, and peer recognition to motivate sales teams.
    - **AI Automation**: Intelligent activity suggestion engine based on CRM data patterns, lead behavior, and deal stages, with features like contextual reasoning, confidence scoring, and one-click activity creation.
    - **Analytics (BI Board)**: Comprehensive dashboard with real-time business intelligence, pipeline analytics, account health monitoring, and performance metrics.
    - **Deal Management**: Features a drag-and-drop Kanban board with enhanced embossed card styling, multi-view support (detailed/compact toggle), inline editing, and a single scrollable deal detail view with timeline activities and robust attachment/comment management. Enhanced with AI-powered contextual help and comprehensive deal intelligence including web-based company analysis, market trends monitoring, and actionable insights for deal closure. Cards feature professional depth styling with gradient backgrounds, comprehensive deal information display, and left-aligned closing date presentation. Deal progress bar now uses contextual stage icons instead of numbers for better visual representation.
    - **Company Insights**: Real-time intelligence platform integrated into company detail pages, featuring latest news mentions with sentiment analysis, technology adoption tracking with confidence levels, comprehensive funding history with investor details, employee growth trends visualization, and active job postings monitoring. Data automatically sourced from LinkedIn Sales Navigator, Crunchbase, NewsAPI, BuiltWith, Wappalyzer, Indeed, Glassdoor, Clearbit, ZoomInfo, Pitchbook, Twitter API, and GitHub with 24-hour refresh cycles and on-demand updates.
    - **Layout Structure (FINALIZED)**: Company Detail page features a fixed two-column layout with all widgets consolidated in the left sidebar (company information, contacts, deals, tasks, and notes) and main content area taking full remaining width. This layout is frozen and should not be modified without explicit user request.
    - **Employee Directory Enhancement (COMPLETED - Aug 2025)**: Enhanced employee list with separate job title column, removed source column, hidden data sources section, interactive network visualization with three view modes (Hierarchy, Department, Connections), dynamic export functionality supporting CSV/JSON/Excel formats with advanced filtering, and optimized header spacing (124px) for better visual hierarchy.
    - **Playful Micro-Interactions (COMPLETED - Aug 2025)**: Implemented comprehensive playful micro-interactions throughout the Company Detail page including button hover states with scale, rotate, and color transitions, enhanced shadow effects, active press-down animations, and smooth tab navigation with lift-up effects. All buttons now feature delightful hover states that enhance user experience with professional animations.
    - **CRM-LeadGen Synchronization (COMPLETED - Aug 19, 2025)**: Implemented comprehensive bidirectional synchronization between CRM Accounts and Lead Generation companies modules. CRM Accounts now serves as the primary data source for Lead Generation company discovery, with local database as secondary fallback. Company data is automatically converted and synchronized across modules for consistent user experience and real-time data accuracy.
    - **Enhanced Activities Bidirectional Sync (COMPLETED - Aug 22, 2025)**: Successfully implemented enhanced bidirectional synchronization between CRM activities and Lead Generation activities in company detail pages. Features include real-time sync tracking with source identification, Lead Gen specific cache invalidation, integrated ActivityLogModal with Lead Gen context, manual sync button with loading states, and comprehensive sync status indicators. Activities now seamlessly sync between CRM and Lead Generation modules with optimal performance and user experience.
    - **Account Management**: Next-generation module with account hierarchy, documents, enrichment, audit tracking, and AI-powered health dashboards.
    - **Activity Management**: Enhanced module supporting cross-module synchronization, recurrence, audit logs, comments, attachments, tags, and automation triggers.
- **Security**: Input validation with Zod schemas, environment-based configuration, and secure API endpoints with robust error handling.

## External Dependencies
- **Database**: Neon (for PostgreSQL)
- **AI Integration**: Google Gemini 2.5 Pro (for AI-powered insights sidebar and predictive analytics)
- **Meeting Integrations**: Google Meet, Microsoft Teams (for calendar functionality and quick meeting creation)
- **Drag-and-Drop Library**: `react-beautiful-dnd` (for Kanban board functionality)
- **Animation Library**: Framer Motion (for page transition animations)