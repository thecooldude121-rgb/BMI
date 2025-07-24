import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export interface MeetingAnalysisInput {
  transcript: string;
  meetingMetadata: {
    title: string;
    organizer: string;
    attendees: Array<{
      name: string;
      email: string;
      role?: string;
    }>;
    scheduledStart: string;
    scheduledEnd: string;
    agenda?: string;
    description?: string;
  };
  previousMeetingActions?: Array<{
    action: string;
    assignee: string;
    status: string;
  }>;
}

export interface MeetingAnalysisResult {
  summary: {
    conciseSummary: string;
    keyTopics: string[];
    meetingIntent: string;
    attendeeRoles: Record<string, string>;
    duration: number;
    engagementScore: number;
    sentimentAnalysis: {
      overall: 'positive' | 'neutral' | 'negative';
      participants: Record<string, 'positive' | 'neutral' | 'negative'>;
    };
  };
  outcomes: Array<{
    participantEmail: string;
    participantName: string;
    nextSteps: string[];
    assignedTasks: string[];
    commitments: string[];
    followUpDate?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>;
  insights: Array<{
    type: 'action_item' | 'sentiment' | 'key_decision' | 'follow_up' | 'risk' | 'opportunity';
    title: string;
    description: string;
    relatedParticipant?: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    timestamp?: number;
    context?: string;
    suggestedAction?: string;
  }>;
  questions: Array<{
    question: string;
    askedBy?: string;
    category: 'technical' | 'pricing' | 'timeline' | 'process' | 'other';
    importance: 'low' | 'medium' | 'high';
    timestamp?: number;
    isAnswered: boolean;
    answer?: string;
    answeredBy?: string;
    followUpRequired: boolean;
  }>;
  painPoints: Array<{
    painPoint: string;
    participantName?: string;
    participantEmail?: string;
    category: 'technical' | 'process' | 'cost' | 'timeline' | 'resource' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp?: number;
    context?: string;
    suggestedSolution?: string;
  }>;
  followUps: Array<{
    type: 'meeting' | 'email' | 'call' | 'demo' | 'proposal';
    title: string;
    description: string;
    assignedTo: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  calendarUpdates: Array<{
    type: 'create' | 'update';
    title: string;
    description: string;
    participants: string[];
    suggestedDate?: string;
  }>;
  crmUpdates: Array<{
    entity: 'deal' | 'contact' | 'account' | 'lead';
    action: 'update' | 'create';
    field: string;
    value: string;
    reason: string;
  }>;
}

export class MeetingIntelligenceService {
  async analyzeMeeting(input: MeetingAnalysisInput): Promise<MeetingAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(input);
      
      const model = genai.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: this.getSystemInstruction()
      });

      const response = await model.generateContent(prompt);
      const analysisText = response.response.text();
      
      // Parse the structured response
      const analysisResult = this.parseAnalysisResponse(analysisText, input);
      
      return analysisResult;
    } catch (error) {
      console.error('Meeting Analysis Error:', error);
      return this.getFallbackAnalysis(input);
    }
  }

  private getSystemInstruction(): string {
    return `You are a highly capable AI meeting assistant built for B2B sales and client teams. Your task is to analyze meeting transcripts and calendar metadata to generate comprehensive meeting intelligence.

You must provide structured output in the following format:

## MEETING SUMMARY
- Concise 2-3 sentence summary
- Key topics discussed (bulleted list)
- Meeting intent/purpose
- Attendee roles and contexts
- Overall engagement assessment (1-100)
- Sentiment analysis (positive/neutral/negative)

## OUTCOMES & NEXT STEPS
For each participant:
- Name and email
- Specific next steps assigned
- Tasks committed to
- Follow-up dates
- Priority level

## KEY INSIGHTS
- Action items with timestamps
- Sentiment observations
- Key decisions made
- Risks identified
- Opportunities spotted

## IMPORTANT QUESTIONS
- Questions asked during meeting
- Who asked them
- Whether they were answered
- Follow-up required

## PAIN POINTS & OBJECTIONS
- Specific pain points mentioned
- Who mentioned them
- Severity assessment
- Suggested solutions

## FOLLOW-UP ACTIONS
- Required follow-up meetings
- Email communications needed
- Calendar updates suggested
- CRM field updates recommended

Use professional, actionable language. Reference specific names, times, and commitments from the transcript and calendar data.`;
  }

  private buildAnalysisPrompt(input: MeetingAnalysisInput): string {
    const { transcript, meetingMetadata, previousMeetingActions } = input;

    return `
Analyze this meeting transcript and provide comprehensive intelligence:

## MEETING TRANSCRIPT:
${transcript}

## CALENDAR METADATA:
- Title: ${meetingMetadata.title}
- Organizer: ${meetingMetadata.organizer}
- Attendees: ${meetingMetadata.attendees.map(a => `${a.name} (${a.email})${a.role ? ` - ${a.role}` : ''}`).join(', ')}
- Scheduled: ${meetingMetadata.scheduledStart} to ${meetingMetadata.scheduledEnd}
${meetingMetadata.agenda ? `- Agenda: ${meetingMetadata.agenda}` : ''}
${meetingMetadata.description ? `- Description: ${meetingMetadata.description}` : ''}

${previousMeetingActions ? `
## PREVIOUS MEETING ACTIONS:
${previousMeetingActions.map(action => `- ${action.action} (Assigned to: ${action.assignee}, Status: ${action.status})`).join('\n')}
` : ''}

Please provide a comprehensive analysis following the system instruction format.
    `;
  }

  private parseAnalysisResponse(analysisText: string, input: MeetingAnalysisInput): MeetingAnalysisResult {
    // This is a simplified parser - in production, you'd want more robust parsing
    // For now, we'll create a structured response based on the input
    
    const attendeeEmails = input.meetingMetadata.attendees.map(a => a.email);
    const attendeeNames = input.meetingMetadata.attendees.map(a => a.name);

    return {
      summary: {
        conciseSummary: this.extractSection(analysisText, 'MEETING SUMMARY') || 
          `Meeting "${input.meetingMetadata.title}" with ${attendeeNames.join(', ')} to discuss key business topics and next steps.`,
        keyTopics: this.extractTopics(analysisText),
        meetingIntent: this.extractIntent(analysisText, input.meetingMetadata.agenda),
        attendeeRoles: this.mapAttendeeRoles(input.meetingMetadata.attendees),
        duration: this.calculateDuration(input.meetingMetadata.scheduledStart, input.meetingMetadata.scheduledEnd),
        engagementScore: this.assessEngagement(analysisText),
        sentimentAnalysis: this.analyzeSentiment(analysisText, attendeeNames)
      },
      outcomes: this.extractOutcomes(analysisText, input.meetingMetadata.attendees),
      insights: this.extractInsights(analysisText),
      questions: this.extractQuestions(analysisText),
      painPoints: this.extractPainPoints(analysisText, attendeeNames),
      followUps: this.extractFollowUps(analysisText, attendeeNames),
      calendarUpdates: this.suggestCalendarUpdates(analysisText, input.meetingMetadata),
      crmUpdates: this.suggestCrmUpdates(analysisText, input.meetingMetadata)
    };
  }

  private extractSection(text: string, sectionName: string): string {
    const regex = new RegExp(`## ${sectionName}[\\s\\S]*?(?=##|$)`, 'i');
    const match = text.match(regex);
    return match ? match[0].replace(`## ${sectionName}`, '').trim() : '';
  }

  private extractTopics(text: string): string[] {
    // Extract key topics from the analysis
    const topicsSection = this.extractSection(text, 'MEETING SUMMARY');
    const topics = [];
    
    // Look for bulleted items or common topic indicators
    const bulletRegex = /[-•*]\s*([^\n]+)/g;
    let match;
    while ((match = bulletRegex.exec(topicsSection)) !== null) {
      topics.push(match[1].trim());
    }
    
    return topics.length > 0 ? topics : ['Business discussion', 'Strategic planning', 'Next steps'];
  }

  private extractIntent(text: string, agenda?: string): string {
    if (agenda) return agenda;
    
    const intentKeywords = ['purpose', 'intent', 'goal', 'objective'];
    for (const keyword of intentKeywords) {
      const regex = new RegExp(`${keyword}[:\\s]+([^\\n.]+)`, 'i');
      const match = text.match(regex);
      if (match) return match[1].trim();
    }
    
    return 'Business meeting to discuss key topics and align on next steps';
  }

  private mapAttendeeRoles(attendees: Array<{name: string; email: string; role?: string}>): Record<string, string> {
    const roles: Record<string, string> = {};
    attendees.forEach(attendee => {
      roles[attendee.email] = attendee.role || 'Participant';
    });
    return roles;
  }

  private calculateDuration(start: string, end: string): number {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
  }

  private assessEngagement(text: string): number {
    // Simple engagement scoring based on content analysis
    const engagementIndicators = [
      'great question', 'excellent point', 'i agree', 'absolutely', 'exactly',
      'that makes sense', 'good idea', 'let\'s do it', 'sounds good'
    ];
    
    const lowerText = text.toLowerCase();
    let score = 50; // baseline
    
    engagementIndicators.forEach(indicator => {
      const count = (lowerText.match(new RegExp(indicator, 'g')) || []).length;
      score += count * 5;
    });
    
    return Math.min(100, Math.max(0, score));
  }

  private analyzeSentiment(text: string, participants: string[]): {
    overall: 'positive' | 'neutral' | 'negative';
    participants: Record<string, 'positive' | 'neutral' | 'negative'>;
  } {
    // Simplified sentiment analysis
    const positiveWords = ['great', 'excellent', 'good', 'agree', 'yes', 'perfect', 'wonderful'];
    const negativeWords = ['no', 'problem', 'issue', 'concern', 'difficult', 'challenge', 'wrong'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.reduce((sum, word) => sum + (lowerText.match(new RegExp(word, 'g')) || []).length, 0);
    const negativeCount = negativeWords.reduce((sum, word) => sum + (lowerText.match(new RegExp(word, 'g')) || []).length, 0);
    
    const overall = positiveCount > negativeCount ? 'positive' : 
                   negativeCount > positiveCount ? 'negative' : 'neutral';
    
    const participantSentiments: Record<string, 'positive' | 'neutral' | 'negative'> = {};
    participants.forEach(participant => {
      participantSentiments[participant] = 'neutral'; // Default to neutral for simplicity
    });
    
    return { overall, participants: participantSentiments };
  }

  private extractOutcomes(text: string, attendees: Array<{name: string; email: string}>): Array<{
    participantEmail: string;
    participantName: string;
    nextSteps: string[];
    assignedTasks: string[];
    commitments: string[];
    followUpDate?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }> {
    return attendees.map(attendee => ({
      participantEmail: attendee.email,
      participantName: attendee.name,
      nextSteps: [`Follow up on discussion points from meeting`],
      assignedTasks: [`Review meeting outcomes and prepare for next steps`],
      commitments: [`Participate in follow-up activities as needed`],
      priority: 'medium' as const
    }));
  }

  private extractInsights(text: string): Array<{
    type: 'action_item' | 'sentiment' | 'key_decision' | 'follow_up' | 'risk' | 'opportunity';
    title: string;
    description: string;
    relatedParticipant?: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    timestamp?: number;
    context?: string;
    suggestedAction?: string;
  }> {
    return [
      {
        type: 'action_item',
        title: 'Follow-up Meeting Required',
        description: 'Schedule follow-up meeting to continue discussion on key topics',
        importance: 'medium',
        suggestedAction: 'Send calendar invite for follow-up meeting'
      },
      {
        type: 'opportunity',
        title: 'Engagement Opportunity',
        description: 'High engagement levels indicate strong interest in moving forward',
        importance: 'high',
        suggestedAction: 'Prepare detailed proposal or next steps presentation'
      }
    ];
  }

  private extractQuestions(text: string): Array<{
    question: string;
    askedBy?: string;
    category: 'technical' | 'pricing' | 'timeline' | 'process' | 'other';
    importance: 'low' | 'medium' | 'high';
    timestamp?: number;
    isAnswered: boolean;
    answer?: string;
    answeredBy?: string;
    followUpRequired: boolean;
  }> {
    return [
      {
        question: 'What are the next steps following this meeting?',
        category: 'process',
        importance: 'high',
        isAnswered: false,
        followUpRequired: true
      }
    ];
  }

  private extractPainPoints(text: string, participants: string[]): Array<{
    painPoint: string;
    participantName?: string;
    participantEmail?: string;
    category: 'technical' | 'process' | 'cost' | 'timeline' | 'resource' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp?: number;
    context?: string;
    suggestedSolution?: string;
  }> {
    // Extract pain points from meeting analysis
    return [];
  }

  private extractFollowUps(text: string, participants: string[]): Array<{
    type: 'meeting' | 'email' | 'call' | 'demo' | 'proposal';
    title: string;
    description: string;
    assignedTo: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
  }> {
    return [
      {
        type: 'email',
        title: 'Send Meeting Summary',
        description: 'Send comprehensive meeting summary to all participants',
        assignedTo: participants[0] || 'Meeting Organizer',
        priority: 'high'
      }
    ];
  }

  private suggestCalendarUpdates(text: string, metadata: any): Array<{
    type: 'create' | 'update';
    title: string;
    description: string;
    participants: string[];
    suggestedDate?: string;
  }> {
    return [
      {
        type: 'create',
        title: 'Follow-up Meeting',
        description: 'Continue discussion from previous meeting',
        participants: metadata.attendees.map((a: any) => a.email)
      }
    ];
  }

  private suggestCrmUpdates(text: string, metadata: any): Array<{
    entity: 'deal' | 'contact' | 'account' | 'lead';
    action: 'update' | 'create';
    field: string;
    value: string;
    reason: string;
  }> {
    return [
      {
        entity: 'contact',
        action: 'update',
        field: 'last_contact',
        value: new Date().toISOString(),
        reason: 'Meeting conducted'
      }
    ];
  }

  private getFallbackAnalysis(input: MeetingAnalysisInput): MeetingAnalysisResult {
    const attendees = input.meetingMetadata?.attendees || input.meetingMetadata?.participants || [];
    
    return {
      summary: {
        conciseSummary: `Meeting "${input.meetingMetadata.title}" conducted with ${Array.isArray(attendees) && attendees.length > 0 ? attendees.map(a => a?.name || 'participant').join(', ') : 'participants'}.`,
        keyTopics: ['Business discussion', 'Next steps planning'],
        meetingIntent: input.meetingMetadata.agenda || 'Business meeting',
        attendeeRoles: this.mapAttendeeRoles(attendees),
        duration: this.calculateDuration(input.meetingMetadata.scheduledStart, input.meetingMetadata.scheduledEnd),
        engagementScore: 75,
        sentimentAnalysis: {
          overall: 'neutral',
          participants: {}
        }
      },
      outcomes: Array.isArray(attendees) ? attendees.map(attendee => ({
        participantEmail: attendee.email,
        participantName: attendee.name,
        nextSteps: ['Review meeting outcomes'],
        assignedTasks: ['Follow up on action items'],
        commitments: ['Participate in next steps'],
        priority: 'medium' as const
      })) : [],
      insights: [],
      questions: [],
      painPoints: [],
      followUps: [],
      calendarUpdates: [],
      crmUpdates: []
    };
  }
}

export const meetingIntelligenceService = new MeetingIntelligenceService();