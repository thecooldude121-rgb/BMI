import { GoogleGenerativeAI } from "@google/generative-ai";

// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const genai = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export interface SalesInsight {
  id: string;
  type: 'trend' | 'opportunity' | 'warning' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  data?: Record<string, any>;
  timestamp: string;
}

export interface SalesAnalysis {
  insights: SalesInsight[];
  summary: string;
  keyMetrics: {
    conversionRate: number;
    averageDealSize: number;
    salesVelocity: number;
    pipelineHealth: number;
  };
}

export class AIInsightsService {
  async analyzeSalesData(deals: any[], leads: any[], accounts: any[]): Promise<SalesAnalysis> {
    try {
      // Prepare data summary for AI analysis
      const dataContext = this.prepareDataContext(deals, leads, accounts);
      
      const prompt = `
        You are a senior sales analyst AI. Analyze the following CRM data and provide actionable sales insights in JSON format.

        CRM Data Context:
        ${JSON.stringify(dataContext, null, 2)}

        Provide analysis in this exact JSON structure:
        {
          "insights": [
            {
              "id": "unique_id",
              "type": "trend|opportunity|warning|recommendation",
              "title": "Brief insight title",
              "description": "Detailed explanation",
              "impact": "high|medium|low",
              "actionable": true|false,
              "data": {}
            }
          ],
          "summary": "2-3 sentence executive summary",
          "keyMetrics": {
            "conversionRate": number,
            "averageDealSize": number,
            "salesVelocity": number,
            "pipelineHealth": number
          }
        }

        Focus on:
        1. Conversion rate trends and patterns
        2. Deal size variations by industry/source
        3. Sales cycle optimization opportunities
        4. Pipeline health indicators
        5. Actionable recommendations for improvement

        Generate 4-6 specific, actionable insights based on the actual data patterns.
      `;

      const systemPrompt = `You are an expert sales analytics AI that provides data-driven insights in JSON format. 
Analyze the provided CRM data and respond with JSON only in this exact structure:
{
  "insights": [
    {
      "id": "unique_id",
      "type": "trend|opportunity|warning|recommendation", 
      "title": "Brief insight title",
      "description": "Detailed explanation",
      "impact": "high|medium|low",
      "actionable": true|false,
      "data": {}
    }
  ],
  "summary": "2-3 sentence executive summary",
  "keyMetrics": {
    "conversionRate": number,
    "averageDealSize": number, 
    "salesVelocity": number,
    "pipelineHealth": number
  }
}`;

      const model = genai.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: systemPrompt
      });

      const response = await model.generateContent(prompt);
      const analysisResult = JSON.parse(response.response.text() || '{}');
      
      // Add timestamps and IDs if missing
      if (analysisResult.insights) {
        analysisResult.insights = analysisResult.insights.map((insight: any, index: number) => ({
          ...insight,
          id: insight.id || `insight_${Date.now()}_${index}`,
          timestamp: new Date().toISOString()
        }));
      }

      return analysisResult as SalesAnalysis;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      
      // Fallback to basic statistical analysis if AI fails
      return this.getFallbackAnalysis(deals, leads, accounts);
    }
  }

  private prepareDataContext(deals: any[], leads: any[], accounts: any[]) {
    const dealStats = this.calculateDealStats(deals);
    const leadStats = this.calculateLeadStats(leads);
    const accountStats = this.calculateAccountStats(accounts);

    return {
      totals: {
        deals: deals.length,
        leads: leads.length,
        accounts: accounts.length
      },
      dealStats,
      leadStats,
      accountStats,
      timeframe: "current_data_snapshot"
    };
  }

  private calculateDealStats(deals: any[]) {
    const totalValue = deals.reduce((sum, deal) => sum + parseFloat(deal.value || 0), 0);
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
    const lostDeals = deals.filter(deal => deal.stage === 'closed-lost');
    const activeDeals = deals.filter(deal => !deal.stage.startsWith('closed'));

    const stageDistribution = deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValue,
      averageValue: deals.length > 0 ? totalValue / deals.length : 0,
      winRate: deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0,
      lossRate: deals.length > 0 ? (lostDeals.length / deals.length) * 100 : 0,
      activeDealCount: activeDeals.length,
      stageDistribution
    };
  }

  private calculateLeadStats(leads: any[]) {
    const qualifiedLeads = leads.filter(lead => lead.stage === 'qualified');
    const sources = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const industries = leads.reduce((acc, lead) => {
      acc[lead.industry] = (acc[lead.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      qualificationRate: leads.length > 0 ? (qualifiedLeads.length / leads.length) * 100 : 0,
      topSources: Object.entries(sources).sort(([,a], [,b]) => (b as number) - (a as number)),
      industryDistribution: industries,
      averageScore: leads.length > 0 ? leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / leads.length : 0
    };
  }

  private calculateAccountStats(accounts: any[]) {
    const industries = accounts.reduce((acc, account) => {
      acc[account.industry] = (acc[account.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      industryDistribution: industries,
      totalAccounts: accounts.length
    };
  }

  private getFallbackAnalysis(deals: any[], leads: any[], accounts: any[]): SalesAnalysis {
    const dealStats = this.calculateDealStats(deals);
    const leadStats = this.calculateLeadStats(leads);

    return {
      insights: [
        {
          id: 'fallback_conversion',
          type: 'trend',
          title: 'Lead Conversion Analysis',
          description: `Current lead qualification rate is ${leadStats.qualificationRate.toFixed(1)}%. This indicates the quality of incoming leads.`,
          impact: leadStats.qualificationRate > 25 ? 'high' : 'medium',
          actionable: true,
          timestamp: new Date().toISOString()
        },
        {
          id: 'fallback_pipeline',
          type: 'opportunity',
          title: 'Pipeline Health Check',
          description: `You have ${dealStats.activeDealCount} active deals with a ${dealStats.winRate.toFixed(1)}% win rate.`,
          impact: 'medium',
          actionable: true,
          timestamp: new Date().toISOString()
        }
      ],
      summary: `Your CRM shows ${deals.length} deals worth $${dealStats.totalValue.toLocaleString()} with ${leads.length} leads across ${accounts.length} accounts.`,
      keyMetrics: {
        conversionRate: leadStats.qualificationRate,
        averageDealSize: dealStats.averageValue,
        salesVelocity: 30, // placeholder
        pipelineHealth: Math.min(100, (dealStats.activeDealCount / Math.max(1, deals.length)) * 100)
      }
    };
  }
}

export const aiInsightsService = new AIInsightsService();