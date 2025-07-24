# MeetingAI - AI-Powered Sales Meeting Assistant

MeetingAI is a comprehensive sales meeting assistant that automatically transcribes, analyzes, and extracts actionable insights from uploaded meeting audio files. Built with modern web technologies and powered by Google's Gemini AI models.

## ✨ Features

### Core Functionality
- **🎤 Audio Upload**: Drag-and-drop interface supporting MP3, WAV, M4A, and MP4 files (up to 100MB)
- **🔄 Automated Transcription**: High-accuracy speech-to-text using Google Gemini 1.5 Pro
- **🧠 AI Analysis**: Advanced meeting analysis powered by Gemini AI generating:
  - Concise meeting summaries
  - Key outcomes and action items
  - Prospect pain points identification
  - Objections and follow-up questions
- **⚡ Asynchronous Processing**: Non-blocking background processing with real-time status updates

### User Interface
- **📊 Dashboard**: Comprehensive overview with meeting statistics and processing status
- **📈 Analytics Page**: Detailed insights including pain point trends and objection patterns
- **⚙️ Settings Panel**: Configuration management and data export options
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🎨 Modern UI**: Clean, professional interface built with Shadcn UI components

### Data Management
- **💾 Persistent Storage**: In-memory storage with PostgreSQL migration support
- **📥 Export Functionality**: Download transcripts and meeting data
- **🗂️ Meeting Organization**: Searchable meeting history with metadata

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern styling
- **Shadcn UI** components built on Radix UI primitives
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing
- **Vite** for fast development and optimized builds

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for end-to-end type safety
- **Multer** for secure file upload handling
- **Drizzle ORM** with PostgreSQL support
- **RESTful API** design with proper HTTP status codes

### AI & External Services
- **Google Gemini 1.5 Pro** for audio transcription
- **Gemini AI** for meeting analysis and insights
- **Secure API key management** through environment variables

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Google Gemini API key** with available credits
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## ⚡ Quick Start

### 1. Environment Setup
```bash
# Clone and navigate to project
git clone <repository-url>
cd meetingai

# Install dependencies
npm install
```

### 2. Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Launch Application
```bash
# Start development server
npm run dev

# Open browser to http://localhost:5000
```

## 📖 Usage Guide

### Uploading Meetings
1. Click **"New Meeting"** button on the dashboard
2. Drag and drop your audio file or click to browse
3. Enter meeting title and participants (optional)
4. Click **"Upload & Process"**

### Viewing Results
1. Monitor processing status on the dashboard
2. Click on completed meetings to view detailed insights
3. Download transcripts using the download button
4. Navigate to Analytics page for trend analysis

### Managing Data
- Access Settings page for configuration options
- Export all meeting data for backup
- Clear session data when needed

## 🔧 API Reference

### Meeting Management
```bash
# Get all meetings
GET /api/meetings

# Get specific meeting
GET /api/meetings/:id

# Upload new meeting
POST /api/meetings/upload
Content-Type: multipart/form-data
Body: { audio: File, title: string, participants?: string }

# Delete meeting
DELETE /api/meetings/:id
```

### Dashboard Data
```bash
# Get dashboard statistics
GET /api/dashboard/stats
Response: { totalMeetings, processed, processing, insights }
```

## 🏗️ Project Structure

```
meetingai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Shadcn UI components
│   │   │   └── *.tsx      # Custom components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── services/          # External service integrations
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data persistence layer
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── uploads/               # Temporary file storage
```

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI services | ✅ Yes | - |
| `DATABASE_URL` | PostgreSQL connection string | No | In-memory |
| `NODE_ENV` | Runtime environment | No | `development` |
| `PORT` | Server port | No | `5000` |

## 🚢 Deployment

### Development
```bash
npm run dev        # Start development server
```

### Production
```bash
npm run build      # Build frontend
npm start          # Start production server
```

### Database Migration
```bash
npm run db:push    # Apply schema changes
npm run db:studio  # Open database studio
```

## 🔄 Migration to PostgreSQL

The application includes full PostgreSQL support. To migrate from in-memory storage:

1. Set up PostgreSQL database
2. Configure `DATABASE_URL` environment variable
3. Run `npm run db:push` to apply schema
4. Update storage initialization in `server/storage.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **API Keys**: Visit [OpenAI Platform](https://platform.openai.com/api-keys) for API key management

## 🎯 Roadmap

- [ ] User authentication and multi-tenancy
- [ ] Email integration for automated follow-ups
- [ ] Advanced analytics and reporting
- [ ] Integration with CRM systems
- [ ] Real-time collaboration features
- [ ] Mobile application

