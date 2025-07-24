import { db } from './storage';
import * as schema from '../shared/schema';

export async function createSampleContacts() {
  try {
    // Get existing accounts
    const accounts = await db.select().from(schema.accounts).limit(5);
    if (accounts.length === 0) return;

    // Get existing user
    const users = await db.select().from(schema.users).limit(1);
    if (users.length === 0) return;

    const userId = users[0].id;

    // Create simplified contacts with proper typing
    const contactsData = [
      {
        accountId: accounts[0].id,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1-555-0123',
        mobile: '+1-555-0223',
        workPhone: '+1-555-0323',
        position: 'Chief Technology Officer',
        department: 'Technology',
        linkedinUrl: 'https://linkedin.com/in/sarah-johnson-tech',
        isPrimary: true,
        status: 'active' as const,
        engagementStatus: 'active' as const,
        persona: 'decision_maker' as const,
        preferredChannel: 'email' as const,
        relationshipScore: 85,
        influenceLevel: 9,
        decisionMakingPower: 10,
        responseRate: '75.5',
        ownerId: userId
      },
      {
        accountId: accounts[1]?.id || accounts[0].id,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@company.com',
        phone: '+1-555-0124',
        mobile: '+1-555-0224',
        workPhone: '+1-555-0324',
        position: 'VP Operations',
        department: 'Operations',
        linkedinUrl: 'https://linkedin.com/in/michael-chen',
        isPrimary: true,
        status: 'active' as const,
        engagementStatus: 'recently_engaged' as const,
        persona: 'champion' as const,
        preferredChannel: 'phone' as const,
        relationshipScore: 78,
        influenceLevel: 7,
        decisionMakingPower: 8,
        responseRate: '82.3',
        ownerId: userId
      },
      {
        accountId: accounts[2]?.id || accounts[0].id,
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@startup.com',
        phone: '+1-555-0125',
        mobile: '+1-555-0225',
        workPhone: '+1-555-0325',
        position: 'CEO',
        department: 'Executive',
        linkedinUrl: 'https://linkedin.com/in/emma-wilson',
        isPrimary: true,
        status: 'active' as const,
        engagementStatus: 'active' as const,
        persona: 'economic_buyer' as const,
        preferredChannel: 'linkedin' as const,
        relationshipScore: 92,
        influenceLevel: 10,
        decisionMakingPower: 10,
        responseRate: '88.9',
        ownerId: userId
      }
    ];

    // Clear existing contacts first
    await db.delete(schema.contacts);
    
    // Insert new contacts
    const newContacts = await db.insert(schema.contacts).values(contactsData).returning();
    
    console.log(`✅ Created ${newContacts.length} sample contacts`);
    return newContacts;
  } catch (error) {
    console.error('Error creating sample contacts:', error);
    return [];
  }
}