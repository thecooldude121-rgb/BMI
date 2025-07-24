import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedMeetingData() {
  try {
    console.log("🎥 Starting meeting data seeding...");

    // Get existing user
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, 'john.smith@company.com')).limit(1);
    if (existingUser.length === 0) {
      console.log("❌ No user found. Please run main seeding first.");
      return;
    }

    const userId = existingUser[0].id;

    // Check if meeting already exists
    const existingMeeting = await db.select().from(schema.meetings).where(eq(schema.meetings.title, 'Media tech Standup Americas')).limit(1);
    
    if (existingMeeting.length > 0) {
      console.log("📹 Meeting already exists, updating...");
      return;
    }

    // Create sample meeting with transcript
    const sampleMeeting = await db.insert(schema.meetings).values({
      title: 'Media tech Standup Americas',
      description: 'Weekly standup meeting for media technology initiatives and business development partnerships',
      scheduledStart: new Date('2025-01-24T18:02:00Z'),
      scheduledEnd: new Date('2025-01-24T18:35:00Z'),
      type: 'video',
      status: 'completed',
      organizerId: userId,
      transcript: `Nicholas Coston: Good afternoon everyone, let's start our regular media tech standup. Can we begin with updates on our ongoing business development initiatives and partnerships?

Venkatraj Radhakrishnan: Sure, I've been working on the Outdoor Link integration. We've made significant progress on the API connections and should have the bronze-level participation ready for the NBA Atlanta Hawks OOH event.

Nicholas Coston: That's great news. What about the Catchbox Media partnership? Are we on track for the timeline we discussed?

Venkatraj Radhakrishnan: Yes, we've established the partnership agreement and are moving forward with the integration. Also, I wanted to mention that we have new engagement with Edison Interactive regarding their golf cart digital screens project.

Nicholas Coston: Excellent. I need to follow up with Tiffany from Fan TV regarding the demo feedback and pricing discussion we had last week. Venkat, can you help me prepare some comprehensive pricing options?

Venkatraj Radhakrishnan: Absolutely. I'll send you a comprehensive list of media options in the New York City area, including subway stations and other premium locations, by tomorrow.

Nicholas Coston: Perfect. We also need to schedule a meeting with Bright Path to discuss their concepts and platforms. Let's include both of us in that meeting for early next week.

Venkatraj Radhakrishnan: I'll coordinate that. Also, I wanted to update everyone on our progress with Flo Advertising and their HyperVision 3D technology integration. The team has acknowledged good progress, and we're exploring a potential New York City media buy opportunity with multiple vendors.

Nicholas Coston: That's fantastic progress. Let's make sure we capture all action items and follow-ups before we wrap up. Any other business development updates?

Venkatraj Radhakrishnan: Just that we're continuing to explore partnerships across the board and the overall business development initiatives are tracking well.

Nicholas Coston: Excellent work everyone. Let's sync up again next week with updates on all these initiatives.`,
      aiProcessingStatus: 'completed'
    }).returning();

    const meetingId = sampleMeeting[0].id;

    // Create meeting participants
    await db.insert(schema.meetingParticipants).values([
      {
        meetingId,
        userId,
        name: 'Nicholas Coston',
        email: 'nicholas.coston@company.com',
        role: 'organizer',
        status: 'accepted'
      },
      {
        meetingId,
        name: 'Venkatraj Radhakrishnan',
        email: 'venkat.radha@company.com',
        role: 'participant',
        status: 'accepted'
      }
    ]);

    // Create meeting summary
    await db.insert(schema.meetingSummaries).values({
      meetingId,
      conciseSummary: `This media tech standup focused on reviewing ongoing business development initiatives and partnerships. Key outcomes include progress on partnerships with Outdoor Link and Catchbox Media, signing of an NBA Atlanta Hawks agreement for bronze-level participation in the OOH Atlanta event, and new engagement with Edison Interactive regarding their golf cart digital screens. Follow-up actions were established for Fan TV discussions regarding pricing and demo feedback. The team also acknowledged progress with Flo Advertising and their HyperVision 3D technology integration, while a potential New York City media buy opportunity is being explored with multiple vendors.`,
      keyTopics: ['Business Development', 'Partnership Integration', 'Media Buy Opportunities', 'Technology Initiatives'],
      meetingIntent: 'Weekly standup to review business development progress and coordinate upcoming initiatives',
      attendeeRoles: {
        'Nicholas Coston': 'Meeting Organizer, Business Development Lead',
        'Venkatraj Radhakrishnan': 'Technical Integration Lead, Partnership Coordinator'
      },
      duration: 33,
      engagementScore: 85,
      sentimentAnalysis: {
        overall: 'positive',
        participants: {
          'Nicholas Coston': 'positive',
          'Venkatraj Radhakrishnan': 'positive'
        }
      }
    });

    // Create meeting outcomes with tasks
    await db.insert(schema.meetingOutcomes).values([
      {
        meetingId,
        participantEmail: 'nicholas.coston@company.com',
        participantName: 'Nicholas Coston',
        nextSteps: ['Follow up with Tiffany from Fan TV regarding demo feedback and pricing discussion'],
        assignedTasks: ['Send comprehensive list of media options in New York City area to Manjusha for media buy request'],
        commitments: ['Schedule meeting with Bright Path for early next week'],
        priority: 'high',
        followUpDate: new Date('2025-01-25')
      },
      {
        meetingId,
        participantEmail: 'venkat.radha@company.com',
        participantName: 'Venkatraj Radhakrishnan',
        nextSteps: ['Continue Outdoor Link API integration', 'Coordinate Bright Path meeting'],
        assignedTasks: ['Prepare comprehensive pricing options for Fan TV discussion', 'Schedule meeting with Bright Path including both participants'],
        commitments: ['Complete NYC media options list by tomorrow', 'Support pricing discussion preparation'],
        priority: 'medium',
        followUpDate: new Date('2025-01-25')
      }
    ]);

    // Create meeting insights
    await db.insert(schema.meetingInsights).values([
      {
        meetingId,
        type: 'opportunity',
        title: 'NYC Media Buy Expansion',
        description: 'Multiple vendor opportunities identified for New York City media buying expansion',
        importance: 'high',
        suggestedAction: 'Prioritize vendor evaluation and partnership negotiation'
      },
      {
        meetingId,
        type: 'action_item',
        title: 'Fan TV Follow-up Required',
        description: 'Demo feedback and pricing discussion pending with Tiffany from Fan TV',
        relatedParticipant: 'Nicholas Coston',
        importance: 'medium',
        suggestedAction: 'Schedule follow-up call with pricing options prepared'
      }
    ]);

    // Create meeting questions
    await db.insert(schema.meetingQuestions).values([
      {
        meetingId,
        question: 'What are the comprehensive media options available in NYC beyond subway stations?',
        askedBy: 'Nicholas Coston',
        category: 'process',
        importance: 'high',
        isAnswered: false,
        followUpRequired: true
      },
      {
        meetingId,
        question: 'What is the timeline for Bright Path meeting scheduling?',
        askedBy: 'Nicholas Coston',
        category: 'timeline',
        importance: 'medium',
        isAnswered: true,
        answer: 'Early next week with both participants included',
        answeredBy: 'Venkatraj Radhakrishnan',
        followUpRequired: false
      }
    ]);

    // Create follow-ups
    await db.insert(schema.meetingFollowUps).values([
      {
        meetingId,
        type: 'call',
        title: 'Fan TV Pricing Discussion',
        description: 'Follow up with Tiffany regarding demo feedback and prepare comprehensive pricing options',
        assignedTo: 'Nicholas Coston',
        dueDate: new Date('2025-01-25'),
        priority: 'high',
        status: 'pending'
      },
      {
        meetingId,
        type: 'meeting',
        title: 'Bright Path Meeting Coordination',
        description: 'Schedule meeting with Bright Path to discuss concepts and platforms for early next week',
        assignedTo: 'Venkatraj Radhakrishnan',
        dueDate: new Date('2025-01-27'),
        priority: 'medium',
        status: 'pending'
      },
      {
        meetingId,
        type: 'email',
        title: 'NYC Media Options Research',
        description: 'Send comprehensive list of media options in NYC area to Manjusha for media buy request',
        assignedTo: 'Nicholas Coston',
        dueDate: new Date('2025-01-25'),
        priority: 'high',
        status: 'pending'
      }
    ]);

    console.log("✅ Meeting data seeded successfully!");
    console.log(`Created meeting: ${sampleMeeting[0].title}`);
    console.log("Created participants, summary, outcomes, insights, questions, and follow-ups");

  } catch (error) {
    console.error("❌ Error seeding meeting data:", error);
    throw error;
  }
}