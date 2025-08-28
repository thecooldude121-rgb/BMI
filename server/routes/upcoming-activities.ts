import { Request, Response } from 'express';
import { db } from '../db';
import { activities } from '../../shared/schema';
import { eq, and, gte, isNull, lte } from 'drizzle-orm';

/**
 * Get upcoming planned activities (open status with future due dates)
 */
export async function getUpcomingActivities(req: Request, res: Response) {
  try {
    const { dealId, days = 30 } = req.query;
    
    // Get all planned activities first
    const allActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.status, 'planned'));
    
    // Filter and process in JavaScript for better error handling
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + Number(days));
    
    let upcomingActivities = allActivities.filter(activity => {
      // Check if activity has a due date and is not completed
      if (!activity.dueDate || activity.completedAt) return false;
      
      // Check if it's upcoming (due date >= today)
      const dueDate = new Date(activity.dueDate);
      if (dueDate < today) return false;
      
      // Filter by deal if specified
      if (dealId && activity.dealId !== dealId) return false;
      
      return true;
    });
    
    // Sort by due date
    upcomingActivities.sort((a, b) => {
      const dateA = new Date(a.dueDate!);
      const dateB = new Date(b.dueDate!);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Group activities by date for better organization
    const groupedByDate = upcomingActivities.reduce((acc, activity) => {
      const dateKey = activity.dueDate?.toISOString().split('T')[0] || 'no-date';
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(activity);
      return acc;
    }, {} as Record<string, any[]>);
    
    res.json({
      activities: upcomingActivities,
      groupedByDate,
      totalCount: upcomingActivities.length,
      dateRange: {
        from: today.toISOString(),
        to: futureDate.toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching upcoming activities:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming activities' });
  }
}

/**
 * Get upcoming activities metrics and insights
 */
export async function getUpcomingActivitiesMetrics(req: Request, res: Response) {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    
    // Get activities for different time periods
    const [thisWeekActivities, thisMonthActivities, overdueActivities] = await Promise.all([
      // This week
      db.select().from(activities).where(
        and(
          eq(activities.status, 'planned'),
          gte(activities.dueDate, today),
          lte(activities.dueDate, nextWeek),
          isNull(activities.completedAt)
        )
      ),
      
      // This month
      db.select().from(activities).where(
        and(
          eq(activities.status, 'planned'),
          gte(activities.dueDate, today),
          lte(activities.dueDate, nextMonth),
          isNull(activities.completedAt)
        )
      ),
      
      // Overdue activities (past due date but still planned)
      db.select().from(activities).where(
        and(
          eq(activities.status, 'planned'),
          lte(activities.dueDate, today),
          isNull(activities.completedAt)
        )
      )
    ]);
    
    // Count by activity type
    const typeBreakdown = thisMonthActivities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by priority
    const priorityBreakdown = thisMonthActivities.reduce((acc, activity) => {
      acc[activity.priority] = (acc[activity.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    res.json({
      thisWeek: {
        count: thisWeekActivities.length,
        activities: thisWeekActivities
      },
      thisMonth: {
        count: thisMonthActivities.length,
        activities: thisMonthActivities
      },
      overdue: {
        count: overdueActivities.length,
        activities: overdueActivities
      },
      breakdown: {
        byType: typeBreakdown,
        byPriority: priorityBreakdown
      }
    });
    
  } catch (error) {
    console.error('Error fetching upcoming activities metrics:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming activities metrics' });
  }
}