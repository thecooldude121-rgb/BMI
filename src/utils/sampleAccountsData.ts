import {
  EnhancedAccount,
  AccountActivity,
  AccountNote,
  AccountDocument,
  AccountContact,
  AccountDeal,
  AccountView,
  AccountWorkflow
} from '../types/accounts';

export const generateSampleAccounts = () => {
  const accounts: EnhancedAccount[] = [
    {
      id: 'acc_001',
      name: 'Acme Corporation',
      accountNumber: 'ACC-001',
      parentAccountId: undefined,
      type: 'customer',
      industry: 'Technology',
      subIndustry: 'Enterprise Software',
      accountSize: '501-1000',
      annualRevenue: 50000000,
      revenueCurrency: 'USD',
      employeeCount: 750,
      website: 'https://acme-corp.com',
      phone: '+1-555-0100',
      email: 'contact@acme-corp.com',
      billingAddress: {
        street: '123 Tech Boulevard',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'United States'
      },
      shippingAddress: {
        street: '123 Tech Boulevard',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'United States'
      },
      description: 'Leading enterprise software company specializing in cloud solutions and digital transformation.',
      businessModel: 'B2B SaaS',
      foundingYear: 2010,
      status: 'active',
      rating: 'hot',
      priority: 'high',
      ownerId: 'user_001',
      linkedinUrl: 'https://linkedin.com/company/acme-corp',
      customFields: {
        'primary_contact_department': 'IT',
        'contract_renewal_date': '2025-12-31',
        'account_tier': 'Enterprise'
      },
      tags: ['strategic', 'high-value', 'enterprise'],
      healthScore: 92,
      engagementScore: 88,
      firstContactDate: '2023-01-15T10:00:00Z',
      lastActivityDate: '2025-10-05T14:30:00Z',
      lastContactedDate: '2025-10-04T09:00:00Z',
      nextFollowUpDate: '2025-10-15T10:00:00Z',
      dataConsent: true,
      dataConsentDate: '2023-01-15T10:00:00Z',
      doNotContact: false,
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2025-10-05T14:30:00Z',
      createdBy: 'user_001',
      updatedBy: 'user_001'
    },
    {
      id: 'acc_002',
      name: 'Acme West Division',
      accountNumber: 'ACC-002',
      parentAccountId: 'acc_001',
      type: 'customer',
      industry: 'Technology',
      subIndustry: 'Enterprise Software',
      accountSize: '201-500',
      annualRevenue: 15000000,
      revenueCurrency: 'USD',
      employeeCount: 300,
      website: 'https://west.acme-corp.com',
      phone: '+1-555-0101',
      email: 'west@acme-corp.com',
      billingAddress: {
        street: '456 Innovation Way',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'United States'
      },
      shippingAddress: {
        street: '456 Innovation Way',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'United States'
      },
      description: 'Western division of Acme Corporation, focusing on regional operations.',
      status: 'active',
      rating: 'warm',
      priority: 'medium',
      ownerId: 'user_001',
      customFields: {},
      tags: ['division', 'regional'],
      healthScore: 85,
      engagementScore: 78,
      firstContactDate: '2023-06-10T10:00:00Z',
      dataConsent: true,
      doNotContact: false,
      createdAt: '2023-06-10T10:00:00Z',
      updatedAt: '2025-09-28T11:00:00Z',
      createdBy: 'user_001',
      updatedBy: 'user_001'
    },
    {
      id: 'acc_003',
      name: 'TechStart Innovations',
      accountNumber: 'ACC-003',
      type: 'prospect',
      industry: 'Technology',
      subIndustry: 'Artificial Intelligence',
      accountSize: '51-200',
      annualRevenue: 8000000,
      revenueCurrency: 'USD',
      employeeCount: 120,
      website: 'https://techstart.io',
      phone: '+1-555-0200',
      email: 'hello@techstart.io',
      billingAddress: {
        street: '789 Startup Lane',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'United States'
      },
      shippingAddress: {
        street: '789 Startup Lane',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'United States'
      },
      description: 'Innovative AI startup developing machine learning solutions for enterprise clients.',
      businessModel: 'B2B SaaS',
      foundingYear: 2020,
      status: 'active',
      rating: 'hot',
      priority: 'high',
      ownerId: 'user_002',
      linkedinUrl: 'https://linkedin.com/company/techstart',
      twitterUrl: 'https://twitter.com/techstart',
      customFields: {
        'funding_stage': 'Series B',
        'investors': 'Sequoia, Andreessen Horowitz'
      },
      tags: ['startup', 'ai', 'high-potential'],
      healthScore: 78,
      engagementScore: 85,
      firstContactDate: '2025-08-01T10:00:00Z',
      lastActivityDate: '2025-10-03T16:00:00Z',
      nextFollowUpDate: '2025-10-10T14:00:00Z',
      dataConsent: true,
      doNotContact: false,
      createdAt: '2025-08-01T10:00:00Z',
      updatedAt: '2025-10-03T16:00:00Z',
      createdBy: 'user_002',
      updatedBy: 'user_002'
    },
    {
      id: 'acc_004',
      name: 'Global Manufacturing Inc',
      accountNumber: 'ACC-004',
      type: 'customer',
      industry: 'Manufacturing',
      subIndustry: 'Industrial Equipment',
      accountSize: '1001-5000',
      annualRevenue: 250000000,
      revenueCurrency: 'USD',
      employeeCount: 3200,
      website: 'https://globalmfg.com',
      phone: '+1-555-0300',
      email: 'info@globalmfg.com',
      billingAddress: {
        street: '1000 Industrial Parkway',
        city: 'Detroit',
        state: 'MI',
        postalCode: '48201',
        country: 'United States'
      },
      shippingAddress: {
        street: '1000 Industrial Parkway',
        city: 'Detroit',
        state: 'MI',
        postalCode: '48201',
        country: 'United States'
      },
      description: 'International manufacturer of industrial equipment and machinery.',
      businessModel: 'B2B Manufacturing',
      foundingYear: 1985,
      stockSymbol: 'GMI',
      status: 'active',
      rating: 'warm',
      priority: 'high',
      ownerId: 'user_003',
      linkedinUrl: 'https://linkedin.com/company/global-mfg',
      customFields: {
        'account_tier': 'Enterprise',
        'contract_value': 5000000,
        'renewal_probability': 85
      },
      tags: ['enterprise', 'manufacturing', 'long-term-client'],
      healthScore: 88,
      engagementScore: 82,
      firstContactDate: '2020-03-10T10:00:00Z',
      lastActivityDate: '2025-10-02T10:00:00Z',
      dataConsent: true,
      doNotContact: false,
      createdAt: '2020-03-10T10:00:00Z',
      updatedAt: '2025-10-02T10:00:00Z',
      createdBy: 'user_003',
      updatedBy: 'user_003'
    },
    {
      id: 'acc_005',
      name: 'HealthCare Systems LLC',
      accountNumber: 'ACC-005',
      type: 'prospect',
      industry: 'Healthcare',
      subIndustry: 'Hospital Systems',
      accountSize: '5000+',
      annualRevenue: 1200000000,
      revenueCurrency: 'USD',
      employeeCount: 15000,
      website: 'https://healthcare-systems.com',
      phone: '+1-555-0400',
      email: 'contact@healthcare-systems.com',
      billingAddress: {
        street: '500 Medical Center Drive',
        city: 'Boston',
        state: 'MA',
        postalCode: '02115',
        country: 'United States'
      },
      shippingAddress: {
        street: '500 Medical Center Drive',
        city: 'Boston',
        state: 'MA',
        postalCode: '02115',
        country: 'United States'
      },
      description: 'Leading healthcare system operating multiple hospitals and medical centers across the Northeast.',
      businessModel: 'Healthcare Services',
      foundingYear: 1950,
      status: 'active',
      rating: 'warm',
      priority: 'critical',
      ownerId: 'user_002',
      customFields: {
        'compliance_requirements': 'HIPAA, SOC 2',
        'decision_timeline': 'Q1 2026'
      },
      tags: ['healthcare', 'enterprise', 'compliance-critical'],
      healthScore: 72,
      engagementScore: 68,
      firstContactDate: '2025-09-15T10:00:00Z',
      lastActivityDate: '2025-09-30T14:00:00Z',
      nextFollowUpDate: '2025-10-20T10:00:00Z',
      dataConsent: true,
      doNotContact: false,
      createdAt: '2025-09-15T10:00:00Z',
      updatedAt: '2025-09-30T14:00:00Z',
      createdBy: 'user_002',
      updatedBy: 'user_002'
    },
    {
      id: 'acc_006',
      name: 'Retail Chain Plus',
      accountNumber: 'ACC-006',
      type: 'customer',
      industry: 'Retail',
      subIndustry: 'Consumer Goods',
      accountSize: '501-1000',
      annualRevenue: 85000000,
      revenueCurrency: 'USD',
      employeeCount: 650,
      website: 'https://retailchainplus.com',
      phone: '+1-555-0500',
      email: 'business@retailchainplus.com',
      billingAddress: {
        street: '200 Commerce Street',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'United States'
      },
      shippingAddress: {
        street: '200 Commerce Street',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'United States'
      },
      description: 'Regional retail chain with 50+ locations across the Midwest.',
      businessModel: 'B2C Retail',
      foundingYear: 1995,
      status: 'active',
      rating: 'cold',
      priority: 'low',
      ownerId: 'user_003',
      customFields: {
        'store_count': 52,
        'expansion_plans': 'Midwest'
      },
      tags: ['retail', 'multi-location'],
      healthScore: 58,
      engagementScore: 52,
      firstContactDate: '2024-02-20T10:00:00Z',
      lastActivityDate: '2025-08-15T10:00:00Z',
      dataConsent: true,
      doNotContact: false,
      createdAt: '2024-02-20T10:00:00Z',
      updatedAt: '2025-08-15T10:00:00Z',
      createdBy: 'user_003',
      updatedBy: 'user_003'
    }
  ];

  const activities: AccountActivity[] = [
    {
      id: 'act_001',
      accountId: 'acc_001',
      activityType: 'meeting',
      subject: 'Quarterly Business Review',
      description: 'Reviewed Q3 performance and discussed expansion opportunities for Q4.',
      contactId: 'contact_001',
      dealId: 'deal_001',
      direction: 'outbound',
      status: 'completed',
      priority: 'high',
      outcome: 'Positive - Client interested in expanding to 3 additional departments',
      scheduledAt: '2025-10-05T14:00:00Z',
      completedAt: '2025-10-05T15:30:00Z',
      durationMinutes: 90,
      meetingUrl: 'https://zoom.us/j/123456789',
      participants: [
        { id: 'user_001', type: 'user', name: 'John Doe', email: 'john@company.com' },
        { id: 'contact_001', type: 'contact', name: 'Jane Smith', email: 'jane@acme-corp.com', role: 'VP of IT' }
      ],
      attendees: ['user_001', 'contact_001'],
      attachmentUrls: ['https://storage.example.com/qbr-presentation.pdf'],
      createdBy: 'user_001',
      assignedTo: 'user_001',
      automated: false,
      createdAt: '2025-10-05T14:00:00Z',
      updatedAt: '2025-10-05T15:30:00Z'
    },
    {
      id: 'act_002',
      accountId: 'acc_001',
      activityType: 'email',
      subject: 'Follow-up: Contract Renewal Discussion',
      description: 'Sent detailed proposal for contract renewal with updated pricing.',
      direction: 'outbound',
      status: 'completed',
      priority: 'high',
      completedAt: '2025-10-04T09:00:00Z',
      participants: [],
      attendees: [],
      attachmentUrls: ['https://storage.example.com/renewal-proposal.pdf'],
      createdBy: 'user_001',
      automated: false,
      createdAt: '2025-10-04T09:00:00Z',
      updatedAt: '2025-10-04T09:00:00Z'
    },
    {
      id: 'act_003',
      accountId: 'acc_003',
      activityType: 'demo',
      subject: 'Product Demo - AI Platform',
      description: 'Demonstrated our AI platform capabilities and integration options.',
      status: 'completed',
      priority: 'high',
      outcome: 'Very positive - Technical team impressed with API capabilities',
      scheduledAt: '2025-10-03T16:00:00Z',
      completedAt: '2025-10-03T17:00:00Z',
      durationMinutes: 60,
      meetingUrl: 'https://zoom.us/j/987654321',
      participants: [
        { id: 'user_002', type: 'user', name: 'Sarah Johnson', email: 'sarah@company.com' },
        { id: 'contact_002', type: 'contact', name: 'Mike Chen', email: 'mike@techstart.io', role: 'CTO' }
      ],
      attendees: ['user_002', 'contact_002'],
      attachmentUrls: [],
      createdBy: 'user_002',
      assignedTo: 'user_002',
      automated: false,
      createdAt: '2025-10-03T16:00:00Z',
      updatedAt: '2025-10-03T17:00:00Z'
    },
    {
      id: 'act_004',
      accountId: 'acc_004',
      activityType: 'call',
      subject: 'Check-in Call',
      description: 'Monthly check-in to discuss system performance and any issues.',
      direction: 'outbound',
      status: 'completed',
      priority: 'medium',
      outcome: 'No issues reported, positive feedback on recent updates',
      scheduledAt: '2025-10-02T10:00:00Z',
      completedAt: '2025-10-02T10:30:00Z',
      durationMinutes: 30,
      participants: [],
      attendees: ['user_003'],
      attachmentUrls: [],
      createdBy: 'user_003',
      assignedTo: 'user_003',
      automated: false,
      createdAt: '2025-10-02T10:00:00Z',
      updatedAt: '2025-10-02T10:30:00Z'
    }
  ];

  const notes: AccountNote[] = [
    {
      id: 'note_001',
      accountId: 'acc_001',
      content: 'Client expressed strong interest in expanding to additional departments. Key decision maker is Jane Smith (VP of IT). Budget approved for Q1 2026.',
      noteType: 'opportunity',
      mentions: [],
      mentionedUsers: [],
      attachments: [],
      isPrivate: false,
      visibleToTeam: true,
      createdBy: 'user_001',
      createdAt: '2025-10-05T15:45:00Z',
      updatedAt: '2025-10-05T15:45:00Z',
      reactions: {
        'thumbs_up': ['user_002', 'user_003']
      }
    },
    {
      id: 'note_002',
      accountId: 'acc_003',
      content: 'CTO was very impressed with our API documentation and integration capabilities. @user_002 should follow up with technical proposal by end of week.',
      noteType: 'general',
      mentions: [{ userId: 'user_002', userName: 'Sarah Johnson', position: 45 }],
      mentionedUsers: ['user_002'],
      attachments: [],
      isPrivate: false,
      visibleToTeam: true,
      createdBy: 'user_002',
      createdAt: '2025-10-03T17:15:00Z',
      updatedAt: '2025-10-03T17:15:00Z',
      reactions: {}
    },
    {
      id: 'note_003',
      accountId: 'acc_005',
      content: 'IMPORTANT: This account has strict HIPAA compliance requirements. All communications and data handling must follow healthcare compliance protocols.',
      noteType: 'risk',
      mentions: [],
      mentionedUsers: [],
      attachments: [],
      isPrivate: false,
      visibleToTeam: true,
      createdBy: 'user_002',
      createdAt: '2025-09-15T11:00:00Z',
      updatedAt: '2025-09-15T11:00:00Z',
      reactions: {
        'important': ['user_001', 'user_002', 'user_003']
      }
    }
  ];

  const documents: AccountDocument[] = [
    {
      id: 'doc_001',
      accountId: 'acc_001',
      fileName: 'Contract_2025_Acme_Corp.pdf',
      fileType: 'application/pdf',
      fileSize: 2458000,
      fileUrl: 'https://storage.example.com/contracts/acme-2025.pdf',
      storagePath: '/contracts/acme-2025.pdf',
      documentType: 'contract',
      description: '2025 Annual Service Agreement',
      version: 1,
      isConfidential: true,
      accessLevel: 'team',
      uploadedBy: 'user_001',
      uploadedAt: '2025-01-15T10:00:00Z',
      downloadedCount: 5,
      lastAccessedAt: '2025-10-01T14:00:00Z',
      lastAccessedBy: 'user_002',
      createdAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 'doc_002',
      accountId: 'acc_001',
      fileName: 'QBR_Presentation_Q3_2025.pptx',
      fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      fileSize: 5120000,
      fileUrl: 'https://storage.example.com/presentations/qbr-q3-2025.pptx',
      storagePath: '/presentations/qbr-q3-2025.pptx',
      documentType: 'presentation',
      description: 'Q3 2025 Quarterly Business Review Presentation',
      version: 1,
      relatedActivityId: 'act_001',
      isConfidential: false,
      accessLevel: 'account',
      uploadedBy: 'user_001',
      uploadedAt: '2025-10-05T13:00:00Z',
      downloadedCount: 3,
      createdAt: '2025-10-05T13:00:00Z'
    }
  ];

  const accountContacts: AccountContact[] = [
    {
      id: 'ac_001',
      accountId: 'acc_001',
      contactId: 'contact_001',
      relationshipType: 'executive',
      isPrimary: true,
      title: 'VP of IT',
      department: 'Information Technology',
      influenceLevel: 'decision_maker',
      notes: 'Primary decision maker for all technology purchases',
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2023-01-15T10:00:00Z'
    },
    {
      id: 'ac_002',
      accountId: 'acc_001',
      contactId: 'contact_002',
      relationshipType: 'technical',
      isPrimary: false,
      title: 'IT Manager',
      department: 'Information Technology',
      influenceLevel: 'high',
      notes: 'Day-to-day technical contact',
      createdAt: '2023-02-01T10:00:00Z',
      updatedAt: '2023-02-01T10:00:00Z'
    },
    {
      id: 'ac_003',
      accountId: 'acc_003',
      contactId: 'contact_003',
      relationshipType: 'executive',
      isPrimary: true,
      title: 'CTO',
      department: 'Technology',
      influenceLevel: 'decision_maker',
      createdAt: '2025-08-01T10:00:00Z',
      updatedAt: '2025-08-01T10:00:00Z'
    }
  ];

  const accountDeals: AccountDeal[] = [
    {
      id: 'ad_001',
      accountId: 'acc_001',
      dealId: 'deal_001',
      isPrimaryAccount: true,
      createdAt: '2025-09-01T10:00:00Z'
    },
    {
      id: 'ad_002',
      accountId: 'acc_003',
      dealId: 'deal_002',
      isPrimaryAccount: true,
      createdAt: '2025-08-15T10:00:00Z'
    }
  ];

  const views: AccountView[] = [
    {
      id: 'view_001',
      name: 'My Active Accounts',
      description: 'All active accounts owned by me',
      filter: {
        status: ['active'],
        ownerId: ['current_user']
      },
      columns: ['name', 'type', 'industry', 'healthScore', 'lastActivityDate'],
      sortBy: 'lastActivityDate',
      sortOrder: 'desc',
      isDefault: true,
      isPublic: false,
      createdBy: 'user_001',
      createdAt: '2025-01-01T10:00:00Z'
    },
    {
      id: 'view_002',
      name: 'High Priority Accounts',
      description: 'Accounts with high or critical priority',
      filter: {
        priority: ['high', 'critical'],
        status: ['active']
      },
      columns: ['name', 'type', 'priority', 'healthScore', 'annualRevenue', 'lastActivityDate'],
      sortBy: 'priority',
      sortOrder: 'desc',
      isDefault: false,
      isPublic: true,
      createdBy: 'user_001',
      createdAt: '2025-01-01T10:00:00Z'
    },
    {
      id: 'view_003',
      name: 'At Risk Accounts',
      description: 'Accounts with low health scores that need attention',
      filter: {
        status: ['active'],
        healthScoreRange: { min: 0, max: 60 }
      },
      columns: ['name', 'healthScore', 'engagementScore', 'lastActivityDate', 'owner'],
      sortBy: 'healthScore',
      sortOrder: 'asc',
      isDefault: false,
      isPublic: true,
      createdBy: 'user_002',
      createdAt: '2025-02-01T10:00:00Z'
    }
  ];

  const workflows: AccountWorkflow[] = [
    {
      id: 'wf_001',
      name: 'New Account Welcome Sequence',
      description: 'Automatically create welcome tasks when a new account is created',
      triggerType: 'created',
      triggerConditions: [],
      actions: [
        {
          type: 'create_task',
          parameters: {
            title: 'Send welcome email',
            description: 'Send personalized welcome email to primary contact',
            priority: 'high',
            dueInDays: 1
          }
        },
        {
          type: 'create_task',
          parameters: {
            title: 'Schedule discovery call',
            description: 'Schedule initial discovery call with decision maker',
            priority: 'high',
            dueInDays: 3
          }
        },
        {
          type: 'send_notification',
          parameters: {
            message: 'New account created - follow up required',
            recipients: ['owner']
          }
        }
      ],
      isActive: true,
      runOnce: false,
      priority: 1,
      executionCount: 45,
      successCount: 43,
      failureCount: 2,
      lastExecutedAt: '2025-10-01T10:00:00Z',
      createdBy: 'user_001',
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-01T10:00:00Z'
    },
    {
      id: 'wf_002',
      name: 'Health Score Alert',
      description: 'Alert account owner when health score drops below threshold',
      triggerType: 'field_changed',
      triggerConditions: [
        {
          field: 'healthScore',
          operator: 'less_than',
          value: 60
        }
      ],
      actions: [
        {
          type: 'send_notification',
          parameters: {
            title: 'Account Health Alert',
            message: 'Health score has dropped below 60',
            priority: 'high',
            recipients: ['owner', 'manager']
          }
        },
        {
          type: 'create_task',
          parameters: {
            title: 'Review account health',
            description: 'Investigate reasons for declining health score',
            priority: 'high',
            dueInDays: 2
          }
        },
        {
          type: 'add_tag',
          parameters: {
            tags: ['at-risk', 'needs-attention']
          }
        }
      ],
      isActive: true,
      runOnce: false,
      priority: 2,
      executionCount: 12,
      successCount: 12,
      failureCount: 0,
      lastExecutedAt: '2025-09-28T10:00:00Z',
      createdBy: 'user_002',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    }
  ];

  return {
    accounts,
    activities,
    notes,
    documents,
    accountContacts,
    accountDeals,
    views,
    workflows
  };
};
