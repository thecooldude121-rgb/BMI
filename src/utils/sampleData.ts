import { Lead, Company, Contact, Activity, EmailTemplate, Sequence, Deal, Task, Employee, Meeting } from '../types/crm';

export const generateSampleData = () => {
  const companies: Company[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      industry: 'Technology',
      size: 'Medium',
      website: 'https://techcorp.com',
      phone: '+1-555-0101',
      address: '123 Tech Street, San Francisco, CA 94105',
      description: 'Leading technology solutions provider',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      customFields: {}
    },
    {
      id: '2',
      name: 'Global Manufacturing Inc',
      industry: 'Manufacturing',
      size: 'Large',
      website: 'https://globalmfg.com',
      phone: '+1-555-0102',
      address: '456 Industrial Blvd, Detroit, MI 48201',
      description: 'International manufacturing company',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      customFields: {}
    },
    {
      id: '3',
      name: 'StartupX',
      industry: 'Technology',
      size: 'Small',
      website: 'https://startupx.io',
      phone: '+1-555-0103',
      address: '789 Innovation Ave, Austin, TX 78701',
      description: 'Innovative startup in AI space',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
      customFields: {}
    }
  ];

  const contacts: Contact[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-1001',
      position: 'CEO',
      companyId: '1',
      leadSource: 'Website',
      tags: ['decision-maker', 'tech-savvy'],
      socialProfiles: {
        linkedin: 'https://linkedin.com/in/johnsmith'
      },
      preferences: {
        communicationMethod: 'email',
        timezone: 'PST'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      customFields: {}
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@globalmfg.com',
      phone: '+1-555-1002',
      position: 'VP of Operations',
      companyId: '2',
      leadSource: 'Referral',
      tags: ['operations', 'budget-holder'],
      socialProfiles: {
        linkedin: 'https://linkedin.com/in/sarahjohnson'
      },
      preferences: {
        communicationMethod: 'phone',
        timezone: 'EST'
      },
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      customFields: {}
    }
  ];

  const leads: Lead[] = [
    {
      id: '1',
      firstName: 'Mike',
      lastName: 'Davis',
      name: 'Mike Davis',
      email: 'mike.davis@example.com',
      phone: '+1-555-2001',
      company: 'Davis Consulting',
      position: 'Founder',
      stage: 'qualified',
      score: 85,
      source: 'LinkedIn',
      assignedTo: 'user1',
      value: 25000,
      probability: 80,
      status: 'active',
      industry: 'Consulting',
      tags: ['hot-lead', 'consulting'],
      notes: 'Very interested in our enterprise solution',
      lastContactDate: new Date('2024-01-20'),
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-20'),
      customFields: {}
    },
    {
      id: '2',
      firstName: 'Lisa',
      lastName: 'Chen',
      name: 'Lisa Chen',
      email: 'lisa.chen@retailco.com',
      phone: '+1-555-2002',
      company: 'RetailCo',
      position: 'IT Director',
      stage: 'contacted',
      score: 72,
      source: 'Website',
      assignedTo: 'user2',
      value: 18500,
      probability: 65,
      status: 'nurturing',
      industry: 'Retail',
      tags: ['retail', 'it-decision-maker'],
      notes: 'Needs solution for inventory management',
      lastContactDate: new Date('2024-01-19'),
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-19'),
      customFields: {}
    }
  ];

  const deals: Deal[] = [
    {
      id: '1',
      name: 'TechCorp Enterprise License',
      contactId: '1',
      companyId: '1',
      stage: 'proposal',
      value: 50000,
      probability: 75,
      expectedCloseDate: new Date('2024-02-15'),
      assignedTo: 'user1',
      products: [
        {
          id: 'prod1',
          name: 'Enterprise Software License',
          quantity: 1,
          unitPrice: 50000,
          discount: 0
        }
      ],
      competitors: ['CompetitorA', 'CompetitorB'],
      lostReason: '',
      tags: ['enterprise', 'high-value'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      customFields: {}
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'call',
      subject: 'Discovery Call with John Smith',
      description: 'Discussed requirements and timeline',
      contactId: '1',
      dealId: '1',
      userId: 'user1',
      duration: 30,
      outcome: 'positive',
      scheduledAt: new Date('2024-01-20T10:00:00'),
      completedAt: new Date('2024-01-20T10:30:00'),
      createdAt: new Date('2024-01-20'),
      customFields: {}
    }
  ];

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Follow up with TechCorp',
      description: 'Send proposal document',
      assignedTo: 'user1',
      contactId: '1',
      dealId: '1',
      priority: 'high',
      status: 'pending',
      dueDate: new Date('2024-01-25'),
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      customFields: {}
    }
  ];

  const emailTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to our platform!',
      body: 'Hi {{firstName}}, welcome to our platform. We\'re excited to work with you!',
      category: 'onboarding',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  const sequences: Sequence[] = [
    {
      id: '1',
      name: 'New Lead Nurture',
      description: 'Automated sequence for new leads',
      isActive: true,
      steps: [
        {
          id: 'step1',
          type: 'email',
          templateId: '1',
          delay: 0,
          conditions: []
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  const employees: Employee[] = [
    {
      id: 'user1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@company.com',
      role: 'Sales',
      department: 'Sales',
      phone: '+1-555-3001',
      hireDate: new Date('2023-06-01'),
      status: 'active',
      permissions: ['crm:read', 'crm:write'],
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-01')
    },
    {
      id: 'user2',
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob@company.com',
      role: 'Manager',
      department: 'Sales',
      phone: '+1-555-3002',
      hireDate: new Date('2023-03-15'),
      status: 'active',
      permissions: ['crm:read', 'crm:write', 'crm:admin'],
      createdAt: new Date('2023-03-15'),
      updatedAt: new Date('2023-03-15')
    }
  ];

  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Sales Review Meeting',
      description: 'Weekly sales team review',
      startTime: new Date('2024-01-22T14:00:00'),
      endTime: new Date('2024-01-22T15:00:00'),
      attendees: ['user1', 'user2'],
      contactId: '1',
      dealId: '1',
      location: 'Conference Room A',
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'scheduled',
      summary: '',
      actionItems: [],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ];

  return {
    leads,
    companies,
    contacts,
    activities,
    emailTemplates,
    sequences,
    deals,
    tasks,
    employees,
    meetings
  };
};