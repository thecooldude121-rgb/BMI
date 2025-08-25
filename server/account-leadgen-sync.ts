import { storage } from './storage';
import { aiLeadGenerationEngine } from './ai-lead-generation';
import type { Account } from '@shared/schema';

export interface CompanyEnrichmentData {
  // Company Details
  website?: string;
  linkedinUrl?: string;
  industry?: string;
  employees?: number;
  annualRevenue?: number;
  foundedYear?: number;
  headquarters?: string;
  phone?: string;
  description?: string;
  
  // Technology & Business Intelligence
  technologies?: string[];
  techStack?: string[];
  competitors?: string[];
  fundingStage?: string;
  keyExecutives?: Array<{
    name: string;
    title: string;
    linkedinUrl?: string;
  }>;
  
  // AI Insights
  healthScore?: number;
  growthIndicators?: string[];
  marketPresence?: string;
  riskFactors?: string[];
  
  // Data Sources & Confidence
  dataSources?: string[];
  confidence?: number;
  lastEnriched?: Date;
}

export interface SyncStatus {
  lastSync?: Date;
  syncHealth: 'healthy' | 'warning' | 'error';
  conflicts?: number;
  pendingUpdates?: number;
  autoSyncEnabled: boolean;
}

export interface SyncOperation {
  id: string;
  type: 'account_to_leadgen' | 'leadgen_to_account' | 'activity_sync' | 'enrichment';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  details: string;
  error?: string;
}

export class AccountLeadGenSyncService {
  private syncOperations: Map<string, SyncOperation> = new Map();

  /**
   * Enrich account data from LeadGen sources and AI
   */
  async enrichAccountData(accountId: string): Promise<CompanyEnrichmentData> {
    const syncOp = this.createSyncOperation('enrichment', `Enriching account ${accountId}`);
    
    try {
      const account = await storage.getAccount(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      // Get existing enrichment data
      const existingEnrichment = await this.getAccountEnrichment(accountId);
      
      // Use AI Lead Generation engine for enrichment
      const enrichmentData = await aiLeadGenerationEngine.enrichLeadData({
        email: account.domain ? `info@${account.domain}` : undefined,
        company: account.name || 'Unknown Company',
        name: account.name || 'Unknown Company'
      });

      // Extract relevant company data
      const companyData: CompanyEnrichmentData = {
        website: account.website || (account.domain ? `https://${account.domain}` : undefined),
        linkedinUrl: account.linkedinUrl,
        industry: account.industry || enrichmentData.company?.industry,
        employees: account.employees || enrichmentData.company?.employees,
        annualRevenue: account.annualRevenue,
        foundedYear: account.foundedYear,
        headquarters: account.address,
        phone: account.phone,
        description: account.description,
        
        technologies: account.technologies || enrichmentData.company?.techStack || [],
        techStack: enrichmentData.company?.techStack || [],
        competitors: account.competitors || [],
        fundingStage: enrichmentData.company?.fundingStage || 'Unknown',
        keyExecutives: [],
        
        healthScore: 75,
        growthIndicators: enrichmentData.intent?.signals || [],
        marketPresence: 'established',
        riskFactors: [],
        
        dataSources: ['ai_engine', 'crm_data'],
        confidence: enrichmentData.aiInsights?.leadScore || 85,
        lastEnriched: new Date()
      };

      // Store enrichment data
      await this.storeAccountEnrichment(accountId, companyData);
      
      this.completeSyncOperation(syncOp.id, 'Account enrichment completed successfully');
      
      return companyData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.failSyncOperation(syncOp.id, errorMessage);
      throw error;
    }
  }

  /**
   * Sync account data to LeadGen Companies module
   */
  async syncAccountToLeadGen(accountId: string): Promise<void> {
    const syncOp = this.createSyncOperation('account_to_leadgen', `Syncing account ${accountId} to LeadGen`);
    
    try {
      const account = await storage.getAccount(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      // Convert to LeadGen Company format
      const companyData = {
        id: account.id,
        name: account.name,
        domain: account.domain,
        website: account.website,
        linkedinUrl: account.linkedinUrl,
        industry: account.industry,
        location: account.address,
        employeeCount: this.mapEmployeeCount(account.employees),
        revenue: this.formatRevenue(account.annualRevenue),
        founded: account.foundedYear,
        description: account.description,
        technologies: account.technologies || [],
        keywords: this.generateKeywords(account),
        funding: 'Unknown',
        saved: true,
        logo: this.generateLogo(account.name),
        lastSynced: new Date()
      };

      // Store in LeadGen format (this would typically update a LeadGen storage)
      await this.updateLeadGenCompany(companyData);
      
      this.completeSyncOperation(syncOp.id, 'Account synced to LeadGen successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.failSyncOperation(syncOp.id, errorMessage);
      throw error;
    }
  }

  /**
   * Sync LeadGen company data back to Account
   */
  async syncLeadGenToAccount(companyId: string, leadGenData: any): Promise<void> {
    const syncOp = this.createSyncOperation('leadgen_to_account', `Syncing LeadGen company ${companyId} to Account`);
    
    try {
      // Find matching account by ID or domain
      let account = await storage.getAccount(companyId);
      
      if (!account && leadGenData.domain) {
        const accounts = await storage.getAccounts();
        account = accounts.find(acc => acc.domain === leadGenData.domain);
      }

      if (!account) {
        // Create new account from LeadGen data
        const newAccountData = {
          name: leadGenData.name || 'Unknown Company',
          domain: leadGenData.domain,
          website: leadGenData.website,
          linkedinUrl: leadGenData.linkedinUrl,
          industry: leadGenData.industry || 'Technology',
          address: leadGenData.location,
          employees: this.parseEmployeeCount(leadGenData.employeeCount),
          annualRevenue: this.parseRevenue(leadGenData.revenue),
          foundedYear: leadGenData.founded,
          description: leadGenData.description,
          technologies: leadGenData.technologies || [],
          ownerId: '1', // Default owner
          tags: leadGenData.keywords || [],
          customFields: {},
          accountType: 'prospect' as const,
          accountStatus: 'active' as const
        };

        account = await storage.createAccount(newAccountData);
      } else {
        // Update existing account with LeadGen data
        const updateData = {
          website: leadGenData.website || account.website,
          linkedinUrl: leadGenData.linkedinUrl || account.linkedinUrl,
          industry: leadGenData.industry || account.industry,
          address: leadGenData.location || account.address,
          employees: this.parseEmployeeCount(leadGenData.employeeCount) || account.employees,
          annualRevenue: this.parseRevenue(leadGenData.revenue) || account.annualRevenue,
          foundedYear: leadGenData.founded || account.foundedYear,
          description: leadGenData.description || account.description,
          technologies: leadGenData.technologies || account.technologies,
        };

        account = await storage.updateAccount(account.id, updateData);
      }

      this.completeSyncOperation(syncOp.id, 'LeadGen data synced to Account successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.failSyncOperation(syncOp.id, errorMessage);
      throw error;
    }
  }

  /**
   * Sync activities, notes, and tasks between modules
   */
  async syncActivitiesAcrossModules(accountId: string): Promise<void> {
    const syncOp = this.createSyncOperation('activity_sync', `Syncing activities for account ${accountId}`);
    
    try {
      // Get all activities and notes for the account
      const activities = await storage.getActivitiesByAccount(accountId);
      const notes = await storage.getDealsByAccount(accountId); // Using available method for now
      const tasks: any[] = []; // Tasks not implemented yet

      // Sync to LeadGen module (this would typically call LeadGen API)
      await this.syncActivitiesWithLeadGen(accountId, { activities, notes, tasks });
      
      this.completeSyncOperation(syncOp.id, 'Activities synced successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.failSyncOperation(syncOp.id, errorMessage);
      throw error;
    }
  }

  /**
   * Get sync status for an account
   */
  async getSyncStatus(accountId: string): Promise<SyncStatus> {
    const lastEnrichment = await this.getAccountEnrichment(accountId);
    const recentOperations = Array.from(this.syncOperations.values())
      .filter(op => op.details.includes(accountId))
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    const failedOps = recentOperations.filter(op => op.status === 'failed').length;
    const pendingOps = recentOperations.filter(op => op.status === 'pending' || op.status === 'processing').length;

    return {
      lastSync: lastEnrichment?.lastEnriched,
      syncHealth: failedOps > 2 ? 'error' : failedOps > 0 ? 'warning' : 'healthy',
      conflicts: failedOps,
      pendingUpdates: pendingOps,
      autoSyncEnabled: true
    };
  }

  /**
   * Auto-fill new account creation with LeadGen and Deals data
   */
  async autoFillAccountData(partialData: { name?: string; domain?: string; website?: string }): Promise<Partial<Account>> {
    try {
      // Try to find LeadGen company data
      const leadGenData = await this.findLeadGenCompany(partialData);
      
      if (leadGenData) {
        return {
          name: leadGenData.name,
          domain: leadGenData.domain,
          website: leadGenData.website,
          linkedinUrl: leadGenData.linkedinUrl,
          industry: leadGenData.industry,
          address: leadGenData.location,
          employees: this.parseEmployeeCount(leadGenData.employeeCount),
          annualRevenue: this.parseRevenue(leadGenData.revenue),
          foundedYear: leadGenData.founded,
          description: leadGenData.description,
          technologies: leadGenData.technologies,
          tags: leadGenData.keywords || []
        };
      }

      // Use AI enrichment if no LeadGen data found
      if (partialData.domain || partialData.website) {
        const enrichmentData = await aiLeadGenerationEngine.enrichLeadData({
          email: partialData.domain ? `info@${partialData.domain}` : undefined,
          company: partialData.name
        });

        return {
          industry: enrichmentData.company?.industry,
          employees: enrichmentData.company?.employees,
          annualRevenue: this.parseRevenue(enrichmentData.company?.revenue || ''),
          foundedYear: enrichmentData.company?.founded,
          description: enrichmentData.company?.description,
          technologies: enrichmentData.company?.techStack
        };
      }

      return {};
    } catch (error) {
      console.error('Auto-fill error:', error);
      return {};
    }
  }

  // Helper methods
  private createSyncOperation(type: SyncOperation['type'], details: string): SyncOperation {
    const operation: SyncOperation = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'pending',
      startTime: new Date(),
      details
    };
    
    this.syncOperations.set(operation.id, operation);
    return operation;
  }

  private completeSyncOperation(id: string, details: string): void {
    const operation = this.syncOperations.get(id);
    if (operation) {
      operation.status = 'completed';
      operation.endTime = new Date();
      operation.details = details;
    }
  }

  private failSyncOperation(id: string, error: string): void {
    const operation = this.syncOperations.get(id);
    if (operation) {
      operation.status = 'failed';
      operation.endTime = new Date();
      operation.error = error;
    }
  }

  private async getAccountEnrichment(accountId: string): Promise<CompanyEnrichmentData | null> {
    // This would query the accountEnrichment table
    // For now, return null - will be implemented with database queries
    return null;
  }

  private async storeAccountEnrichment(accountId: string, data: CompanyEnrichmentData): Promise<void> {
    // This would store in the accountEnrichment table
    // For now, just log - will be implemented with database queries
    console.log(`Storing enrichment for account ${accountId}:`, data);
  }

  private async updateLeadGenCompany(companyData: any): Promise<void> {
    // This would update the LeadGen company storage
    console.log('Updating LeadGen company:', companyData);
  }

  private async syncActivitiesWithLeadGen(accountId: string, data: any): Promise<void> {
    // This would sync activities with LeadGen module
    console.log('Syncing activities with LeadGen for account:', accountId, data);
  }

  private async findLeadGenCompany(searchData: any): Promise<any | null> {
    // This would search LeadGen companies
    return null;
  }

  private mapEmployeeCount(employees?: number): string {
    if (!employees) return '1-10';
    if (employees <= 10) return '1-10';
    if (employees <= 50) return '11-50';
    if (employees <= 200) return '51-200';
    if (employees <= 500) return '201-500';
    if (employees <= 1000) return '501-1000';
    return '1000+';
  }

  private parseEmployeeCount(range: string): number | undefined {
    const ranges: Record<string, number> = {
      '1-10': 5,
      '11-50': 30,
      '51-200': 125,
      '201-500': 350,
      '501-1000': 750,
      '1000+': 2000
    };
    return ranges[range];
  }

  private formatRevenue(revenue?: number): string {
    if (!revenue) return 'N/A';
    if (revenue >= 1000000) return `$${(revenue / 1000000).toFixed(1)}M`;
    if (revenue >= 1000) return `$${(revenue / 1000).toFixed(1)}K`;
    return `$${revenue}`;
  }

  private parseRevenue(revenue: string): number | undefined {
    if (!revenue || revenue === 'N/A') return undefined;
    const match = revenue.match(/\$?(\d+(?:\.\d+)?)([KM])?/);
    if (!match) return undefined;
    
    const value = parseFloat(match[1]);
    const multiplier = match[2] === 'M' ? 1000000 : match[2] === 'K' ? 1000 : 1;
    return value * multiplier;
  }

  private generateKeywords(account: Account): string[] {
    const keywords = [];
    if (account.industry) keywords.push(account.industry);
    if (account.name) keywords.push(...account.name.split(' ').filter((w: string) => w.length > 3));
    if (account.technologies) keywords.push(...account.technologies);
    return keywords;
  }

  private generateLogo(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '🏢';
  }
}

export const accountLeadGenSyncService = new AccountLeadGenSyncService();