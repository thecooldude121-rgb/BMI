import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IndustryTrend, TrendKeyword, TrendAlert, MarketIntelligence, CompetitorTracking } from '@shared/schema';

// Industry Trend Intelligence Service
export class IndustryTrendsService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Initialize with environment variable or fallback
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  // Core trend analysis methods
  async analyzeTrendData(keyword: string, industry: string, region: string = 'global'): Promise<IndustryTrend> {
    try {
      // Simulate real-time trend analysis with intelligent mock data
      const trendData = await this.simulateTrendAnalysis(keyword, industry, region);
      
      // Use AI to enhance the analysis if available
      if (this.genAI) {
        const enhancedData = await this.enhanceTrendWithAI(trendData, keyword, industry);
        return { ...trendData, ...enhancedData };
      }
      
      return trendData;
    } catch (error) {
      console.error('Error analyzing trend data:', error);
      throw new Error('Failed to analyze trend data');
    }
  }

  async getMarketIntelligence(companyId?: string, keywords: string[] = []): Promise<MarketIntelligence[]> {
    try {
      const intelligence = await this.simulateMarketIntelligence(companyId, keywords);
      
      // Enhance with AI analysis if available
      if (this.genAI) {
        return await Promise.all(
          intelligence.map(async (item) => {
            const enhancedItem = await this.enhanceIntelligenceWithAI(item);
            return { ...item, ...enhancedItem };
          })
        );
      }
      
      return intelligence;
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      throw new Error('Failed to fetch market intelligence');
    }
  }

  async trackCompetitors(companyId: string): Promise<CompetitorTracking[]> {
    try {
      return await this.simulateCompetitorTracking(companyId);
    } catch (error) {
      console.error('Error tracking competitors:', error);
      throw new Error('Failed to track competitors');
    }
  }

  async generateTrendAlerts(userId: string, keywords: TrendKeyword[]): Promise<TrendAlert[]> {
    try {
      const alerts: TrendAlert[] = [];
      
      for (const keyword of keywords) {
        if (!keyword.trackingEnabled) continue;
        
        // Simulate trend monitoring and alert generation
        const currentTrend = await this.analyzeTrendData(keyword.keyword, keyword.industry || 'general');
        const alertThreshold = Number(keyword.alertThreshold) || 20;
        
        // Check if trend change exceeds threshold
        if (Math.abs(Number(currentTrend.changePercent)) >= alertThreshold) {
          const alertType = Number(currentTrend.changePercent) > 0 ? 'spike' : 'drop';
          const alert: TrendAlert = {
            id: crypto.randomUUID(),
            keywordId: keyword.id,
            userId: userId,
            alertType,
            threshold: keyword.alertThreshold || '20',
            actualValue: currentTrend.changePercent,
            message: this.generateAlertMessage(keyword.keyword, currentTrend.changePercent, alertType),
            status: 'unread',
            triggeredAt: new Date(),
          };
          alerts.push(alert);
        }
      }
      
      return alerts;
    } catch (error) {
      console.error('Error generating trend alerts:', error);
      throw new Error('Failed to generate trend alerts');
    }
  }

  // AI Enhancement Methods
  private async enhanceTrendWithAI(trendData: any, keyword: string, industry: string): Promise<Partial<IndustryTrend>> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Analyze the following trend data for "${keyword}" in the ${industry} industry:
      
Trend Score: ${trendData.trendScore}
Change Percent: ${trendData.changePercent}%
Search Volume: ${trendData.searchVolume}
Sentiment: ${trendData.sentimentScore}

Provide enhanced analysis including:
1. Market implications
2. Competitive landscape insights
3. Recommended actions
4. Risk assessment

Format as JSON with keys: implications, insights, recommendations, risks`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const aiAnalysis = JSON.parse(text);
        return {
          metadata: {
            ...trendData.metadata,
            aiAnalysis,
            lastAIUpdate: new Date().toISOString()
          }
        };
      } catch (parseError) {
        // If JSON parsing fails, store as text
        return {
          metadata: {
            ...trendData.metadata,
            aiAnalysis: { summary: text },
            lastAIUpdate: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      console.error('Error enhancing trend with AI:', error);
      return {};
    }
  }

  private async enhanceIntelligenceWithAI(intelligence: any): Promise<Partial<MarketIntelligence>> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Analyze this market intelligence item:
      
Title: ${intelligence.title}
Summary: ${intelligence.summary}
Category: ${intelligence.category}

Provide enhanced analysis including:
1. Strategic implications for businesses
2. Market impact assessment (0-1 scale)
3. Affected industries
4. Timeline for impact

Format as JSON with keys: implications, impactScore, industries, timeline`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const aiAnalysis = JSON.parse(text);
        return {
          impactScore: aiAnalysis.impactScore || intelligence.impactScore,
          entities: {
            ...intelligence.entities,
            aiAnalysis
          }
        };
      } catch (parseError) {
        return {
          entities: {
            ...intelligence.entities,
            aiAnalysis: { summary: text }
          }
        };
      }
    } catch (error) {
      console.error('Error enhancing intelligence with AI:', error);
      return {};
    }
  }

  // Simulation Methods (Real API integrations would replace these)
  private async simulateTrendAnalysis(keyword: string, industry: string, region: string): Promise<any> {
    // Simulate realistic trend data based on keyword and industry
    const baseScore = 40 + Math.random() * 40; // 40-80 base score
    const seasonality = this.getSeasonalityFactor(keyword);
    const industryMultiplier = this.getIndustryMultiplier(industry);
    
    const trendScore = Math.min(100, baseScore * seasonality * industryMultiplier);
    const changePercent = (Math.random() - 0.5) * 60; // -30% to +30%
    const searchVolume = Math.floor(1000 + Math.random() * 50000);
    const sentimentScore = (Math.random() - 0.5) * 2; // -1 to 1
    
    return {
      id: crypto.randomUUID(),
      keyword,
      industry,
      region,
      trendScore: trendScore.toFixed(2),
      changePercent: changePercent.toFixed(2),
      searchVolume,
      competitionLevel: this.getCompetitionLevel(searchVolume),
      sentimentScore: sentimentScore.toFixed(2),
      dataSource: 'simulated_trends_api',
      metadata: {
        lastUpdate: new Date().toISOString(),
        dataPoints: Math.floor(Math.random() * 100) + 50,
        confidence: (0.7 + Math.random() * 0.3).toFixed(2),
        relatedTerms: this.generateRelatedTerms(keyword),
        geographicData: this.generateGeographicData(region)
      },
      isActive: true,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
  }

  private async simulateMarketIntelligence(companyId?: string, keywords: string[] = []): Promise<any[]> {
    const categories = ['news', 'funding', 'product_launch', 'acquisition', 'partnership', 'regulatory'];
    const sourceTypes = ['news', 'press_release', 'social_media', 'filing'];
    
    const intelligence = [];
    const count = 5 + Math.floor(Math.random() * 10); // 5-15 items
    
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const sourceType = sourceTypes[Math.floor(Math.random() * sourceTypes.length)];
      
      intelligence.push({
        id: crypto.randomUUID(),
        companyId,
        topic: this.generateTopicForCategory(category),
        category,
        title: this.generateTitleForCategory(category),
        summary: this.generateSummaryForCategory(category),
        content: null, // Would be populated with full content in real implementation
        sourceUrl: `https://example-news-source.com/article-${i}`,
        sourceType,
        sentimentScore: ((Math.random() - 0.5) * 2).toFixed(2),
        impactScore: (Math.random()).toFixed(2),
        keywords: keywords.length > 0 ? keywords : this.generateKeywordsForCategory(category),
        entities: {
          people: this.generatePeopleEntities(),
          companies: this.generateCompanyEntities(),
          locations: this.generateLocationEntities()
        },
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
        discoveredAt: new Date(),
      });
    }
    
    return intelligence;
  }

  private async simulateCompetitorTracking(companyId: string): Promise<any[]> {
    const competitors = [
      'Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Microsoft Dynamics',
      'Freshworks', 'Copper', 'monday.com', 'Airtable', 'Notion'
    ];
    
    const trackingData = [];
    const competitorCount = 3 + Math.floor(Math.random() * 4); // 3-6 competitors
    
    for (let i = 0; i < competitorCount; i++) {
      const competitor = competitors[i];
      trackingData.push({
        id: crypto.randomUUID(),
        companyId,
        competitorName: competitor,
        competitorDomain: competitor.toLowerCase().replace(/\s+/g, '') + '.com',
        trackingCategories: ['pricing', 'product', 'marketing', 'hiring'],
        lastProductUpdate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        lastPricingChange: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        lastHiringActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        recentActivities: this.generateCompetitorActivities(competitor),
        alertsEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    return trackingData;
  }

  // Helper Methods
  private getSeasonalityFactor(keyword: string): number {
    const month = new Date().getMonth();
    const seasonalKeywords = {
      'ai': 1.0, // Consistent
      'cybersecurity': month >= 9 || month <= 2 ? 1.2 : 1.0, // Higher in Q4/Q1
      'ecommerce': month >= 10 || month <= 1 ? 1.3 : 1.0, // Holiday season
      'fintech': month >= 0 && month <= 3 ? 1.2 : 1.0, // Tax season
      'healthtech': month >= 8 && month <= 11 ? 1.1 : 1.0, // Flu season
    };
    
    const lowerKeyword = keyword.toLowerCase();
    for (const [term, factor] of Object.entries(seasonalKeywords)) {
      if (lowerKeyword.includes(term)) return factor;
    }
    return 1.0;
  }

  private getIndustryMultiplier(industry: string): number {
    const multipliers = {
      'technology': 1.2,
      'healthcare': 1.1,
      'finance': 1.15,
      'manufacturing': 0.9,
      'retail': 1.0,
      'education': 0.95,
    };
    return multipliers[industry.toLowerCase()] || 1.0;
  }

  private getCompetitionLevel(searchVolume: number): string {
    if (searchVolume > 30000) return 'high';
    if (searchVolume > 10000) return 'medium';
    return 'low';
  }

  private generateRelatedTerms(keyword: string): string[] {
    const termMaps = {
      'ai': ['artificial intelligence', 'machine learning', 'automation', 'neural networks'],
      'crm': ['customer management', 'sales automation', 'lead generation', 'customer success'],
      'fintech': ['digital banking', 'payments', 'blockchain', 'cryptocurrency'],
      'saas': ['cloud software', 'subscription', 'enterprise software', 'b2b software'],
    };
    
    const lowerKeyword = keyword.toLowerCase();
    for (const [term, related] of Object.entries(termMaps)) {
      if (lowerKeyword.includes(term)) return related;
    }
    
    return ['related term 1', 'related term 2', 'related term 3'];
  }

  private generateGeographicData(region: string): any {
    return {
      topRegions: ['United States', 'Europe', 'Asia Pacific'],
      growthRegions: ['India', 'Southeast Asia', 'Latin America'],
      penetration: {
        northAmerica: (0.6 + Math.random() * 0.3).toFixed(2),
        europe: (0.5 + Math.random() * 0.3).toFixed(2),
        asiaPacific: (0.4 + Math.random() * 0.4).toFixed(2),
      }
    };
  }

  private generateTopicForCategory(category: string): string {
    const topics = {
      'news': ['Market Analysis', 'Industry Report', 'Regulatory Update', 'Technology Breakthrough'],
      'funding': ['Series A', 'Series B', 'IPO', 'Acquisition'],
      'product_launch': ['New Platform', 'Feature Update', 'Mobile App', 'API Release'],
      'acquisition': ['Strategic Acquisition', 'Merger', 'Asset Purchase', 'Technology Acquisition'],
      'partnership': ['Strategic Partnership', 'Integration', 'Channel Partnership', 'Joint Venture'],
      'regulatory': ['Compliance Update', 'New Regulation', 'Policy Change', 'Legal Ruling'],
    };
    
    const categoryTopics = topics[category] || ['General Update'];
    return categoryTopics[Math.floor(Math.random() * categoryTopics.length)];
  }

  private generateTitleForCategory(category: string): string {
    const titles = {
      'news': [
        'Industry Growth Accelerates in Q4',
        'Market Leader Announces Strategic Pivot',
        'Regulatory Changes Impact Technology Sector',
        'New Research Reveals Consumer Behavior Shifts'
      ],
      'funding': [
        'TechCorp Raises $50M Series B for AI Platform',
        'Healthcare Startup Secures $25M in Series A',
        'Fintech Company Announces IPO Plans',
        'E-commerce Platform Acquired for $2B'
      ],
      'product_launch': [
        'Revolutionary AI Assistant Launches Today',
        'Next-Gen Analytics Platform Goes Live',
        'Mobile App Receives Major Feature Update',
        'New API Enables Advanced Integrations'
      ]
    };
    
    const categoryTitles = titles[category] || ['Important Industry Update'];
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
  }

  private generateSummaryForCategory(category: string): string {
    const summaries = {
      'news': 'Industry analysts report significant growth trends driven by technological innovation and changing consumer preferences.',
      'funding': 'The latest funding round will accelerate product development and market expansion across key geographic regions.',
      'product_launch': 'The new release introduces breakthrough capabilities that address critical customer needs and market gaps.',
      'acquisition': 'This strategic acquisition strengthens the company\'s market position and expands its technology capabilities.',
      'partnership': 'The partnership enables both companies to deliver enhanced value to customers through integrated solutions.',
      'regulatory': 'New regulatory requirements will impact industry operations and require companies to adapt their compliance strategies.',
    };
    
    return summaries[category] || 'Significant development in the industry with potential market implications.';
  }

  private generateKeywordsForCategory(category: string): string[] {
    const keywords = {
      'news': ['market trends', 'industry growth', 'analysis', 'forecast'],
      'funding': ['investment', 'venture capital', 'startup', 'funding round'],
      'product_launch': ['innovation', 'technology', 'platform', 'features'],
      'acquisition': ['merger', 'acquisition', 'consolidation', 'strategy'],
      'partnership': ['collaboration', 'integration', 'alliance', 'partnership'],
      'regulatory': ['compliance', 'regulation', 'policy', 'legal'],
    };
    
    return keywords[category] || ['general', 'business', 'industry'];
  }

  private generatePeopleEntities(): string[] {
    const people = ['John Smith (CEO)', 'Sarah Johnson (CTO)', 'Michael Brown (CFO)', 'Lisa Davis (VP Marketing)'];
    return people.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateCompanyEntities(): string[] {
    const companies = ['TechCorp Inc.', 'Innovation Labs', 'Digital Solutions Ltd.', 'Future Tech Systems'];
    return companies.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private generateLocationEntities(): string[] {
    const locations = ['San Francisco', 'New York', 'London', 'Singapore', 'Tel Aviv'];
    return locations.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private generateCompetitorActivities(competitor: string): any[] {
    const activities = [
      {
        type: 'product_update',
        title: `${competitor} releases new dashboard features`,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        impact: 'medium'
      },
      {
        type: 'pricing_change',
        title: `${competitor} adjusts pricing for enterprise plans`,
        date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        impact: 'high'
      },
      {
        type: 'hiring',
        title: `${competitor} expands engineering team`,
        date: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        impact: 'low'
      }
    ];
    
    return activities.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateAlertMessage(keyword: string, changePercent: string, alertType: string): string {
    const change = Number(changePercent);
    const direction = change > 0 ? 'increased' : 'decreased';
    const magnitude = Math.abs(change);
    
    return `"${keyword}" trend has ${direction} by ${magnitude.toFixed(1)}% in the last 24 hours. ${
      alertType === 'spike' ? 'This represents significant upward momentum.' : 'This indicates declining interest.'
    }`;
  }
}

export const industryTrendsService = new IndustryTrendsService();