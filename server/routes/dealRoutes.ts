import { Router } from 'express';
import { db } from '../db';
import { deals, dealNotes, dealFiles, dealCommunications, dealScorecards, dealAuditLog } from '@shared/schema';
import { eq } from 'drizzle-orm';
import multer from 'multer';
import { ObjectStorageService } from '../objectStorage';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const objectStorageService = new ObjectStorageService();

// Enhanced Deal Routes

// Get deal with enhanced data
router.get('/deals/:id/enhanced', async (req, res) => {
  try {
    const dealId = req.params.id;
    
    // Get basic deal data
    const deal = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);
    if (!deal.length) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Get related data
    const [notes, files, communications, scorecard, auditLog] = await Promise.all([
      db.select().from(dealNotes).where(eq(dealNotes.dealId, dealId)),
      db.select().from(dealFiles).where(eq(dealFiles.dealId, dealId)),
      db.select().from(dealCommunications).where(eq(dealCommunications.dealId, dealId)),
      db.select().from(dealScorecards).where(eq(dealScorecards.dealId, dealId)).limit(1),
      db.select().from(dealAuditLog).where(eq(dealAuditLog.dealId, dealId))
    ]);

    res.json({
      deal: deal[0],
      notes,
      files,
      communications,
      scorecard: scorecard[0] || null,
      auditLog
    });
  } catch (error) {
    console.error('Error fetching enhanced deal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add deal note
router.post('/deals/:id/notes', async (req, res) => {
  try {
    const dealId = req.params.id;
    const { content, noteType = 'internal', isPrivate = false, mentions = [] } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const note = await db.insert(dealNotes).values({
      dealId,
      content,
      noteType,
      isPrivate,
      authorId: 'user-id', // Would come from auth
      mentions: JSON.stringify(mentions),
      metadata: JSON.stringify({})
    }).returning();

    res.json(note[0]);
  } catch (error) {
    console.error('Error creating deal note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload deal file
router.post('/deals/:id/files', upload.single('file'), async (req, res) => {
  try {
    const dealId = req.params.id;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { documentType = 'other', accessLevel = 'team' } = req.body;

    // In a real implementation, you would upload to object storage here
    const mockFileUrl = `https://example.com/files/${Date.now()}_${file.originalname}`;

    const savedFile = await db.insert(dealFiles).values({
      dealId,
      fileName: `${Date.now()}_${file.originalname}`,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileUrl: mockFileUrl,
      documentType,
      accessLevel,
      uploadedBy: 'user-id', // Would come from auth
      tags: JSON.stringify([]),
      metadata: JSON.stringify({})
    }).returning();

    res.json(savedFile[0]);
  } catch (error) {
    console.error('Error uploading deal file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log communication
router.post('/deals/:id/communications', async (req, res) => {
  try {
    const dealId = req.params.id;
    const {
      communicationType,
      direction,
      subject,
      content,
      duration,
      outcome,
      participants = [],
      sentiment = 'neutral',
      actionItems = [],
      followUpRequired = false,
      followUpDate
    } = req.body;

    if (!communicationType || !direction || !subject) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const communication = await db.insert(dealCommunications).values({
      dealId,
      communicationType,
      direction,
      subject,
      content,
      duration,
      outcome,
      participants: JSON.stringify(participants),
      sentiment,
      actionItems: JSON.stringify(actionItems),
      followUpRequired,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      metadata: JSON.stringify({}),
      createdBy: 'user-id', // Would come from auth
      occurredAt: new Date()
    }).returning();

    res.json(communication[0]);
  } catch (error) {
    console.error('Error logging communication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update deal scorecard
router.post('/deals/:id/scorecard', async (req, res) => {
  try {
    const dealId = req.params.id;
    const {
      overallScore,
      healthStatus,
      engagementScore,
      fitScore,
      urgencyScore,
      budgetScore,
      authorityScore,
      timelineScore,
      riskFactors = [],
      opportunities = [],
      strengths = [],
      recommendations = [],
      winProbability,
      forecastCategory,
      riskLevel
    } = req.body;

    if (typeof overallScore !== 'number') {
      return res.status(400).json({ error: 'Overall score is required' });
    }

    // Check if scorecard exists
    const existingScorecard = await db.select().from(dealScorecards)
      .where(eq(dealScorecards.dealId, dealId)).limit(1);

    let scorecard;
    if (existingScorecard.length > 0) {
      // Update existing scorecard
      scorecard = await db.update(dealScorecards)
        .set({
          overallScore,
          healthStatus,
          engagementScore,
          fitScore,
          urgencyScore,
          budgetScore,
          authorityScore,
          timelineScore,
          riskFactors: JSON.stringify(riskFactors),
          opportunities: JSON.stringify(opportunities),
          strengths: JSON.stringify(strengths),
          recommendations: JSON.stringify(recommendations),
          winProbability,
          forecastCategory,
          riskLevel,
          lastCalculated: new Date()
        })
        .where(eq(dealScorecards.dealId, dealId))
        .returning();
    } else {
      // Create new scorecard
      scorecard = await db.insert(dealScorecards).values({
        dealId,
        overallScore,
        healthStatus,
        engagementScore,
        fitScore,
        urgencyScore,
        budgetScore,
        authorityScore,
        timelineScore,
        riskFactors: JSON.stringify(riskFactors),
        opportunities: JSON.stringify(opportunities),
        strengths: JSON.stringify(strengths),
        recommendations: JSON.stringify(recommendations),
        winProbability,
        forecastCategory,
        riskLevel
      }).returning();
    }

    res.json(scorecard[0]);
  } catch (error) {
    console.error('Error updating deal scorecard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get deal audit log
router.get('/deals/:id/audit', async (req, res) => {
  try {
    const dealId = req.params.id;
    
    const audit = await db.select().from(dealAuditLog)
      .where(eq(dealAuditLog.dealId, dealId))
      .orderBy(dealAuditLog.createdAt);

    res.json(audit);
  } catch (error) {
    console.error('Error fetching deal audit log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create audit log entry
router.post('/deals/:id/audit', async (req, res) => {
  try {
    const dealId = req.params.id;
    const { action, fieldChanged, oldValue, newValue, changeReason } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    const auditEntry = await db.insert(dealAuditLog).values({
      dealId,
      action,
      fieldChanged,
      oldValue,
      newValue,
      changeReason,
      performedBy: 'user-id', // Would come from auth
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: JSON.stringify({})
    }).returning();

    res.json(auditEntry[0]);
  } catch (error) {
    console.error('Error creating audit log entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deal configuration endpoints
router.get('/deal-configuration', async (req, res) => {
  try {
    // Return default deal configuration
    res.json({
      pipelineStages: [
        { id: 'qualification', name: 'Qualification', probability: 10 },
        { id: 'proposal', name: 'Proposal', probability: 25 },
        { id: 'negotiation', name: 'Negotiation', probability: 50 },
        { id: 'closed-won', name: 'Closed Won', probability: 100 },
        { id: 'closed-lost', name: 'Closed Lost', probability: 0 }
      ],
      stageRequirements: {
        qualification: ['contact_verified', 'budget_discussed'],
        proposal: ['proposal_sent', 'stakeholder_identified'],
        negotiation: ['terms_discussed', 'decision_timeline']
      },
      customFields: [],
      automationRules: [],
      notificationSettings: {
        stageChange: true,
        valueChange: true,
        overdue: true
      }
    });
  } catch (error) {
    console.error('Error fetching deal configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;