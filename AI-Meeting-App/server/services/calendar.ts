import { google } from 'googleapis';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees: string[];
  meetingUrl?: string;
  description?: string;
}

export class CalendarService {
  private calendar;
  private auth;

  constructor() {
    // Initialize Google Auth
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      credentials: process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ? 
        JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) : undefined,
      scopes: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events.readonly'
      ],
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  async getUpcomingMeetings(maxResults: number = 10): Promise<CalendarEvent[]> {
    try {
      const now = new Date();
      const endOfWeek = new Date();
      endOfWeek.setDate(now.getDate() + 7);

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        timeMax: endOfWeek.toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      
      return events.map((event: any) => ({
        id: event.id || '',
        title: event.summary || 'Untitled Meeting',
        start: event.start?.dateTime || event.start?.date || '',
        end: event.end?.dateTime || event.end?.date || '',
        attendees: event.attendees?.map((attendee: any) => attendee.email || '') || [],
        meetingUrl: this.extractMeetingUrl(event.description || '', event.location),
        description: event.description
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  async getTodaysMeetings(): Promise<CalendarEvent[]> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      
      return events.map((event: any) => ({
        id: event.id || '',
        title: event.summary || 'Untitled Meeting',
        start: event.start?.dateTime || event.start?.date || '',
        end: event.end?.dateTime || event.end?.date || '',
        attendees: event.attendees?.map((attendee: any) => attendee.email || '') || [],
        meetingUrl: this.extractMeetingUrl(event.description || '', event.location),
        description: event.description
      }));
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
      return [];
    }
  }

  private extractMeetingUrl(description: string, location?: string): string | undefined {
    // Extract meeting URLs from description or location
    const urlPatterns = [
      /https:\/\/meet\.google\.com\/[a-z\-]+/,
      /https:\/\/zoom\.us\/j\/\d+/,
      /https:\/\/teams\.microsoft\.com\/l\/meetup-join\/[^?\s]+/,
      /https:\/\/.*\.zoom\.us\/j\/\d+/
    ];

    const text = `${description} ${location || ''}`;
    
    for (const pattern of urlPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return undefined;
  }

  async createEvent(eventData: {
    title: string;
    start: string;
    end: string;
    description?: string;
    attendees?: string[];
  }) {
    try {
      const event = {
        summary: eventData.title,
        start: {
          dateTime: eventData.start,
          timeZone: 'UTC',
        },
        end: {
          dateTime: eventData.end,
          timeZone: 'UTC',
        },
        description: eventData.description,
        attendees: eventData.attendees?.map(email => ({ email })),
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }
}

export const calendarService = new CalendarService();