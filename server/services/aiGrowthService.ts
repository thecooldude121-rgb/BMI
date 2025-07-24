import OpenAI from 'openai';
import * as schema from '@shared/schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface AccountAnalysisData {
  account: schema.Account;
  deals: schema.Deal[];
  activities: schema.Activity[];
  contacts: schema.Contact[];
  leads: schema.Lead[];
  totalRevenue: number;
  avgDealSize: number;
  dealCloseRate: number;
  lastActivityDate: Date | null;
  engagementScore: number;
  healthScore: number;
}

export interface GrowthRecommendationRequest {
  accountId: string;
  analysisData: AccountAnalysisData;
  userId: string;
}

export class AIGrowthService {
  async generateGrowthRecommendations(request: GrowthRecommendationRequest): Promise<schema.InsertGrowthRecommendation[]> {
    try {
      const { account, deals, activities, contacts, leads, totalRevenue, avgDealSize, dealCloseRate } = request.analysisData;
      
      // Prepare comprehensive account context for AI analysis
      const accountContext = this.buildAccountContext(request.analysisData);
      
      const prompt = `
As an expert B2B sales consultant and account growth strategist, analyze the following account data and provide 3-5 specific, actionable growth recommendations.

ACCOUNT OVERVIEW:
Company: ${account.name}
Industry: ${account.industry || 'Unknown'}
Size: ${account.companySize || 'Unknown'}
Annual Revenue: $${account.annualRevenue || 'Unknown'}
Health Score: ${request.analysisData.healthScore}/100

PERFORMANCE METRICS:
- Total Revenue Generated: $${totalRevenue.toLocaleString()}
- Average Deal Size: $${avgDealSize.toLocaleString()}
- Deal Close Rate: ${dealCloseRate}%
- Active Deals: ${deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage || '')).length}
- Total Contacts: ${contacts.length}
- Recent Activities: ${activities.length}
- Open Leads: ${leads.filter(l => l.status === 'active').length}

CONTEXT DATA:
${accountContext}

Please provide recommendations in JSON format with the following structure:
{
  "recommendations": [
    {
      "type": "upsell|cross_sell|expansion|retention|engagement|pricing|contract_renewal|product_adoption",
      "priority": "low|medium|high|critical",
      "title": "Brief title (max 80 chars)",
      "description": "Detailed description of the recommendation",
      "rationale": "Data-driven explanation for why this recommendation makes sense",
      "confidence": 85.5,
      "potentialRevenue": 50000,
      "estimatedTimeframe": "3-6 months",
      "requiredActions": [
        "Specific action item 1",
        "Specific action item 2"
      ],
      "aiInsights": {
        "keyIndicators": ["List of key data points that support this recommendation"],
        "riskFactors": ["Potential challenges or risks"],
        "successFactors": ["What needs to go right for this to succeed"]
      },
      "marketTrends": {
        "industryGrowth": "Relevant industry trend",
        "competitivePressure": "Competitive landscape insights",
        "technologyShifts": "Technology or market shifts affecting this recommendation"
      }
    }
  ]
}

Focus on:
1. Data-driven insights based on actual account performance
2. Industry-specific recommendations
3. Realistic revenue projections
4. Concrete, actionable next steps
5. Risk assessment and mitigation strategies
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert B2B sales strategist with deep expertise in account growth, revenue optimization, and customer success. Provide data-driven, actionable recommendations based on comprehensive account analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.3
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
      const recommendations = aiResponse.recommendations || [];

      // Convert AI recommendations to database format
      return recommendations.map((rec: any) => ({
        accountId: request.accountId,
        type: rec.type,
        priority: rec.priority,
        status: 'pending' as const,
        title: rec.title,
        description: rec.description,
        rationale: rec.rationale,
        confidence: rec.confidence?.toString(),
        potentialRevenue: rec.potentialRevenue?.toString(),
        estimatedTimeframe: rec.estimatedTimeframe,
        requiredActions: rec.requiredActions,
        aiInsights: rec.aiInsights,
        marketTrends: rec.marketTrends,
        competitorAnalysis: this.generateCompetitorAnalysis(account),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        createdBy: request.userId
      }));

    } catch (error) {
      console.error('Error generating AI growth recommendations:', error);
      throw new Error('Failed to generate growth recommendations');
    }
  }

  private buildAccountContext(data: AccountAnalysisData): string {
    const { account, deals, activities, contacts, leads } = data;
    
    let context = `Account Status: ${account.accountStatus || 'Unknown'}\n`;
    context += `Account Type: ${account.accountType || 'Unknown'}\n`;
    context += `Website: ${account.website || 'Not provided'}\n\n`;

    // Deal pipeline analysis
    const activeDealStages = deals
      .filter(d => !['closed-won', 'closed-lost'].includes(d.stage || ''))
      .map(d => d.stage)
      .filter(Boolean);
    
    if (activeDealStages.length > 0) {
      context += `Active Deal Stages: ${activeDealStages.join(', ')}\n`;
    }

    // Recent activity patterns
    const recentActivities = activities
      .filter(a => a.createdAt && new Date(a.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .slice(0, 5);
    
    if (recentActivities.length > 0) {
      context += `\nRecent Activities (last 30 days):\n`;
      recentActivities.forEach(a => {
        context += `- ${a.type}: ${a.subject} (${a.status})\n`;
      });
    }

    // Contact engagement
    const primaryContacts = contacts.filter(c => c.isPrimary).length;
    context += `\nPrimary Contacts: ${primaryContacts}\n`;
    context += `Total Contacts: ${contacts.length}\n`;

    // Lead conversion insights
    const convertedLeads = leads.filter(l => l.stage === 'won').length;
    const conversionRate = leads.length > 0 ? (convertedLeads / leads.length * 100).toFixed(1) : 0;
    context += `Lead Conversion Rate: ${conversionRate}%\n`;

    return context;
  }

  private generateCompetitorAnalysis(account: schema.Account) {
    // Generate industry-specific competitor insights
    const industryCompetitors: Record<string, string[]> = {
      'technology': ['salesforce', 'hubspot', 'pipedrive', 'zoho'],
      'healthcare': ['epic', 'cerner', 'allscripts'],
      'finance': ['quickbooks', 'sage', 'netsuite'],
      'manufacturing': ['sap', 'oracle', 'microsoft'],
      'retail': ['shopify', 'magento', 'bigcommerce']
    };

    const relevantCompetitors = industryCompetitors[account.industry || ''] || ['salesforce', 'hubspot'];
    
    return {
      primaryCompetitors: relevantCompetitors.slice(0, 3),
      competitivePressure: 'medium',
      differentiationOpportunities: [
        'Personalized service approach',
        'Industry-specific solutions',
        'Competitive pricing structure'
      ],
      marketPosition: 'Growing market with increasing demand for digital solutions'
    };
  }

  async analyzeAccountGrowthPotential(accountId: string): Promise<{
    growthScore: number;
    growthFactors: string[];
    riskFactors: string[];
    opportunityAreas: string[];
  }> {
    // This would typically fetch comprehensive account data and perform AI analysis
    // For now, returning a structured analysis framework
    
    return {
      growthScore: Math.round(Math.random() * 40 + 60), // 60-100 range
      growthFactors: [
        'Strong engagement in recent quarters',
        'Expanding team size indicates growth',
        'High product adoption rates',
        'Positive feedback from stakeholders'
      ],
      riskFactors: [
        'Contract renewal approaching',
        'Competitive pressure in market',
        'Budget constraints reported',
        'Key contact turnover'
      ],
      opportunityAreas: [
        'Additional product lines',
        'Department expansion',
        'Multi-year contract negotiation',
        'Strategic partnership opportunities'
      ]
    };
  }
}

export const aiGrowthService = new AIGrowthService();