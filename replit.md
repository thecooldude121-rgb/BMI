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
- **UI/UX**: Emphasis on a modern enterprise design with features like glassmorphism effects, animated backgrounds, 3D cards, particle effects, and comprehensive animated micro-interactions using Framer Motion. Enhanced with smooth tab transitions, staggered sidebar animations, card hover effects, and button interactions. UI components are primarily standard HTML with Tailwind CSS. Layouts are optimized for compact presentation with minimal spacing.
- **Core Modules**:
    - **HRMS**: Standalone module with dedicated routing and navigation, including employee management, attendance tracking, and performance reviews.
    - **CRM**: Comprehensive module featuring advanced Leads, Accounts, Contacts, Deals, and Activities management. Includes multi-view modes (Kanban, Tile, List), AI-powered fuzzy search, advanced filtering, and analytics dashboards.
    - **Gamification**: Integrated directly into the CRM, offering real-time XP tracking, level progression, badges, challenges, leaderboards, and peer recognition to motivate sales teams.
    - **AI Automation**: Intelligent activity suggestion engine based on CRM data patterns, lead behavior, and deal stages, with features like contextual reasoning, confidence scoring, and one-click activity creation.
    - **Analytics (BI Board)**: Comprehensive dashboard with real-time business intelligence, pipeline analytics, account health monitoring, and performance metrics.
    - **Deal Management**: Features a drag-and-drop Kanban board with enhanced embossed card styling, multi-view support (detailed/compact toggle), inline editing, and a single scrollable deal detail view with timeline activities and robust attachment/comment management. Enhanced with AI-powered contextual help and comprehensive deal intelligence including web-based company analysis, market trends monitoring, and actionable insights for deal closure. Cards feature professional depth styling with gradient backgrounds, comprehensive deal information display, and left-aligned closing date presentation. Deal progress bar now uses contextual stage icons instead of numbers for better visual representation.
    - **Account Management**: Next-generation module with account hierarchy, documents, enrichment, audit tracking, and AI-powered health dashboards.
    - **Activity Management**: Enhanced module supporting cross-module synchronization, recurrence, audit logs, comments, attachments, tags, and automation triggers.
- **Security**: Input validation with Zod schemas, environment-based configuration, and secure API endpoints with robust error handling.

## External Dependencies
- **Database**: Neon (for PostgreSQL)
- **AI Integration**: Google Gemini 2.5 Pro (for AI-powered insights sidebar and predictive analytics)
- **Meeting Integrations**: Google Meet, Microsoft Teams (for calendar functionality and quick meeting creation)
- **Drag-and-Drop Library**: `react-beautiful-dnd` (for Kanban board functionality)
- **Animation Library**: Framer Motion (for page transition animations)