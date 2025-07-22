// Use server-side API endpoint for secure AI analysis
const API_BASE = window.location.origin;

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
      // Prepare minimal data for AI analysis to avoid payload size issues
      const minimalDeals = deals.map(deal => ({
        id: deal.id,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        expectedCloseDate: deal.expectedCloseDate
      }));
      
      const minimalLeads = leads.map(lead => ({
        id: lead.id,
        stage: lead.stage,
        score: lead.score,
        source: lead.source,
        industry: lead.industry,
        value: lead.value
      }));
      
      const minimalAccounts = accounts.map(account => ({
        id: account.id,
        industry: account.industry,
        companySize: account.companySize
      }));

      // Make request to server-side AI analysis endpoint
      const response = await fetch(`${API_BASE}/api/ai/analyze-sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deals: minimalDeals,
          leads: minimalLeads,
          accounts: minimalAccounts
        })
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.statusText}`);
      }

      const analysisResult = await response.json();
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