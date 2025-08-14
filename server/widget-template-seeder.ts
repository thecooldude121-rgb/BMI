import { storage } from "./storage";
import * as schema from "@shared/schema";

export async function seedWidgetTemplates() {
  try {
    console.log('🎨 Starting widget template seeding...');

    const defaultTemplates = [
      {
        name: 'Sales Statistics',
        description: 'Overview of key sales metrics including leads, deals, and conversion rates',
        widgetType: 'stats' as const,
        category: 'sales',
        defaultSize: 'medium' as const,
        defaultConfig: {
          metrics: ['totalLeads', 'qualifiedLeads', 'totalDeals', 'conversionRate'],
          refreshInterval: 300
        },
        isActive: true,
        installCount: 0,
        rating: '4.8',
        version: '1.0.0'
      },
      {
        name: 'Recent Activities',
        description: 'Latest activities and interactions across your CRM',
        widgetType: 'recent_activities' as const,
        category: 'activity',
        defaultSize: 'medium' as const,
        defaultConfig: {
          limit: 10,
          showTimestamps: true,
          refreshInterval: 120
        },
        isActive: true,
        installCount: 0,
        rating: '4.6',
        version: '1.0.0'
      },
      {
        name: 'Sales Pipeline',
        description: 'Visual representation of your sales pipeline stages',
        widgetType: 'pipeline' as const,
        category: 'sales',
        defaultSize: 'medium' as const,
        defaultConfig: {
          showValues: true,
          showCounts: true,
          refreshInterval: 300
        },
        isActive: true,
        installCount: 0,
        rating: '4.7',
        version: '1.0.0'
      },
      {
        name: 'Team Leaderboard',
        description: 'Top performers and team achievements',
        widgetType: 'leaderboard' as const,
        category: 'gamification',
        defaultSize: 'medium' as const,
        defaultConfig: {
          period: 'monthly',
          showPoints: true,
          limit: 5,
          refreshInterval: 600
        },
        isActive: true,
        installCount: 0,
        rating: "rating: 4.5",
        version: '1.0.0'
      },
      {
        name: 'Analytics Chart',
        description: 'Customizable charts for data visualization',
        widgetType: 'chart' as const,
        category: 'analytics',
        defaultSize: 'large' as const,
        defaultConfig: {
          chartType: 'line',
          dataSource: 'deals',
          timeRange: '30d',
          refreshInterval: 300
        },
        isActive: true,
        installCount: 0,
        rating: "rating: 4.4",
        version: '1.0.0'
      },
      {
        name: 'Calendar Events',
        description: 'Upcoming meetings and scheduled activities',
        widgetType: 'calendar' as const,
        category: 'productivity',
        defaultSize: 'medium' as const,
        defaultConfig: {
          view: 'agenda',
          daysAhead: 7,
          refreshInterval: 300
        },
        isActive: true,
        installCount: 0,
        rating: "rating: 4.3",
        version: '1.0.0'
      },
      {
        name: 'Task Manager',
        description: 'Track and manage your pending tasks',
        widgetType: 'tasks' as const,
        category: 'productivity',
        defaultSize: 'medium' as const,
        defaultConfig: {
          showCompleted: false,
          sortBy: 'dueDate',
          limit: 10,
          refreshInterval: 180
        },
        isActive: true,
        installCount: 0,
        rating: "rating: 4.2",
        version: '1.0.0'
      },
      {
        name: 'Revenue Trends',
        description: 'Track revenue performance over time',
        widgetType: 'revenue_trend' as const,
        category: 'analytics',
        defaultSize: 'large' as const,
        defaultConfig: {
          period: 'monthly',
          comparison: 'previous_period',
          refreshInterval: 600
        },
        isActive: true,
        installCount: 0,
        rating: "rating: 4.6",
        version: '1.0.0'
      },
      {
        name: 'Lead Sources',
        description: 'Breakdown of lead sources and their performance',
        widgetType: 'lead_sources' as const,
        category: 'analytics',
        defaultSize: 'medium' as const,
        defaultConfig: {
          chartType: 'pie',
          timeRange: '30d',
          refreshInterval: 600
        },
        isActive: true,
        installCount: 0,
        rating: "rating: 4.5",
        version: '1.0.0'
      },
      {
        name: 'Deal Forecast',
        description: 'Predictive analysis of upcoming deal closures',
        widgetType: 'deal_forecast' as const,
        category: 'analytics',
        defaultSize: 'large' as const,
        defaultConfig: {
          timeHorizon: '90d',
          confidenceLevel: 80,
          refreshInterval: 600
        },
        isActive: true,
        installCount: 0,
        rating: "rating: 4.8",
        version: '1.0.0'
      }
    ];

    let createdTemplates = 0;
    for (const template of defaultTemplates) {
      try {
        await storage.createWidgetTemplate(template);
        createdTemplates++;
        console.log(`✅ Created template: ${template.name}`);
      } catch (error: any) {
        if (error.code === '23505' || error.message.includes('duplicate')) {
          console.log(`⚠️ Template already exists: ${template.name}`);
        } else {
          console.error(`❌ Error creating template ${template.name}:`, error.message);
        }
      }
    }

    console.log(`✅ Widget template seeding completed! Created ${createdTemplates} new templates.`);

  } catch (error) {
    console.error('❌ Error seeding widget templates:', error);
  }
}