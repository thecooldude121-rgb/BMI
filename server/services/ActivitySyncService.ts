// Activity Sync Service for Bidirectional Synchronization
import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export class ActivitySyncService {
  // Sync activities between CRM and Lead Generation modules
  static async syncActivityToLeadGen(activityId: string) {
    try {
      const activity = await db
        .select()
        .from(schema.activities)
        .where(eq(schema.activities.id, activityId))
        .limit(1);

      if (activity.length === 0) {
        throw new Error(`Activity ${activityId} not found`);
      }

      const activityData = activity[0];

      // Update source to LeadGen for sync tracking
      await db
        .update(schema.activities)
        .set({ 
          source: 'LeadGen',
          updatedAt: new Date()
        })
        .where(eq(schema.activities.id, activityId));

      console.log(`🔄 Activity ${activityId} synced to Lead Generation module`);
      return { success: true, activity: activityData };

    } catch (error) {
      console.error('❌ Error syncing activity to LeadGen:', error);
      throw error;
    }
  }

  // Sync activities from Lead Generation to CRM
  static async syncActivityToCRM(activityId: string) {
    try {
      const activity = await db
        .select()
        .from(schema.activities)
        .where(eq(schema.activities.id, activityId))
        .limit(1);

      if (activity.length === 0) {
        throw new Error(`Activity ${activityId} not found`);
      }

      const activityData = activity[0];

      // Update source to CRM for sync tracking
      await db
        .update(schema.activities)
        .set({ 
          source: 'CRM',
          updatedAt: new Date()
        })
        .where(eq(schema.activities.id, activityId));

      console.log(`🔄 Activity ${activityId} synced to CRM module`);
      return { success: true, activity: activityData };

    } catch (error) {
      console.error('❌ Error syncing activity to CRM:', error);
      throw error;
    }
  }

  // Get activities for a specific deal (for Lead Gen company detail pages)
  static async getActivitiesForDeal(dealId: string) {
    try {
      const activities = await db
        .select({
          id: schema.activities.id,
          subject: schema.activities.subject,
          type: schema.activities.type,
          status: schema.activities.status,
          priority: schema.activities.priority,
          description: schema.activities.description,
          outcome: schema.activities.outcome,
          duration: schema.activities.duration,
          scheduledAt: schema.activities.scheduledAt,
          completedAt: schema.activities.completedAt,
          source: schema.activities.source,
          createdAt: schema.activities.createdAt,
          updatedAt: schema.activities.updatedAt,
          assignedToUser: {
            id: schema.users.id,
            firstName: schema.users.firstName,
            lastName: schema.users.lastName,
            email: schema.users.email
          }
        })
        .from(schema.activities)
        .leftJoin(schema.users, eq(schema.activities.assignedTo, schema.users.id))
        .where(eq(schema.activities.dealId, dealId))
        .orderBy(desc(schema.activities.createdAt));

      console.log(`📊 Retrieved ${activities.length} activities for deal ${dealId}`);
      return activities;

    } catch (error) {
      console.error('❌ Error getting activities for deal:', error);
      throw error;
    }
  }

  // Get activities for a specific account (for Lead Gen company detail pages)
  static async getActivitiesForAccount(accountId: string) {
    try {
      const activities = await db
        .select({
          id: schema.activities.id,
          subject: schema.activities.subject,
          type: schema.activities.type,
          status: schema.activities.status,
          priority: schema.activities.priority,
          description: schema.activities.description,
          outcome: schema.activities.outcome,
          duration: schema.activities.duration,
          scheduledAt: schema.activities.scheduledAt,
          completedAt: schema.activities.completedAt,
          source: schema.activities.source,
          dealId: schema.activities.dealId,
          createdAt: schema.activities.createdAt,
          updatedAt: schema.activities.updatedAt,
          assignedToUser: {
            id: schema.users.id,
            firstName: schema.users.firstName,
            lastName: schema.users.lastName,
            email: schema.users.email
          },
          deal: {
            id: schema.deals.id,
            name: schema.deals.name,
            value: schema.deals.value,
            stage: schema.deals.stage
          }
        })
        .from(schema.activities)
        .leftJoin(schema.users, eq(schema.activities.assignedTo, schema.users.id))
        .leftJoin(schema.deals, eq(schema.activities.dealId, schema.deals.id))
        .where(eq(schema.activities.accountId, accountId))
        .orderBy(desc(schema.activities.createdAt));

      console.log(`📊 Retrieved ${activities.length} activities for account ${accountId}`);
      return activities;

    } catch (error) {
      console.error('❌ Error getting activities for account:', error);
      throw error;
    }
  }

  // Create a new activity with sync support
  static async createActivity(activityData: any) {
    try {
      const [newActivity] = await db
        .insert(schema.activities)
        .values({
          ...activityData,
          source: activityData.source || 'CRM',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      console.log(`✅ Created new activity: ${newActivity.subject} (${newActivity.id})`);
      return newActivity;

    } catch (error) {
      console.error('❌ Error creating activity:', error);
      throw error;
    }
  }

  // Update an existing activity
  static async updateActivity(activityId: string, updateData: any) {
    try {
      const [updatedActivity] = await db
        .update(schema.activities)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(schema.activities.id, activityId))
        .returning();

      if (!updatedActivity) {
        throw new Error(`Activity ${activityId} not found`);
      }

      console.log(`✅ Updated activity: ${updatedActivity.subject} (${activityId})`);
      return updatedActivity;

    } catch (error) {
      console.error('❌ Error updating activity:', error);
      throw error;
    }
  }

  // Get sync status for activities
  static async getSyncStatus(accountId?: string, dealId?: string) {
    try {
      let whereCondition;
      if (accountId) {
        whereCondition = eq(schema.activities.accountId, accountId);
      } else if (dealId) {
        whereCondition = eq(schema.activities.dealId, dealId);
      }

      const syncStats = await db
        .select({
          source: schema.activities.source
        })
        .from(schema.activities)
        .where(whereCondition);

      const stats = (syncStats as any[]).reduce((acc: any, stat) => {
        acc[stat.source || 'unknown'] = (acc[stat.source || 'unknown'] || 0) + 1;
        return acc;
      }, {});

      return {
        crm: stats.CRM || 0,
        leadGen: stats.LeadGen || 0,
        manual: stats.manual || 0,
        total: Object.values(stats).reduce((sum: any, count: any) => sum + count, 0)
      };

    } catch (error) {
      console.error('❌ Error getting sync status:', error);
      return { crm: 0, leadGen: 0, manual: 0, total: 0 };
    }
  }

  // Bulk sync activities for an account/deal
  static async bulkSyncActivities(entityId: string, entityType: 'account' | 'deal', targetModule: 'CRM' | 'LeadGen') {
    try {
      const whereCondition = entityType === 'account' 
        ? eq(schema.activities.accountId, entityId)
        : eq(schema.activities.dealId, entityId);

      const result = await db
        .update(schema.activities)
        .set({ 
          source: targetModule,
          updatedAt: new Date()
        })
        .where(whereCondition)
        .returning({ id: schema.activities.id });

      console.log(`🔄 Bulk synced ${result.length} activities to ${targetModule} for ${entityType} ${entityId}`);
      return { syncedCount: result.length };

    } catch (error) {
      console.error('❌ Error bulk syncing activities:', error);
      throw error;
    }
  }
}