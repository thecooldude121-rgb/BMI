import { storage } from "./storage";
import * as schema from "@shared/schema";

export async function seedGamificationData() {
  try {
    console.log('🎮 Starting gamification seeding...');

    // Create initial badges
    const badges = [
      {
        name: "First Deal",
        description: "Closed your first deal!",
        icon: "🎯",
        color: "green",
        criteria: JSON.stringify({ type: "deal_count", value: 1 }),
        points: 100
      },
      {
        name: "Deal Hunter",
        description: "Closed 5 deals",
        icon: "🏹",
        color: "blue",
        criteria: JSON.stringify({ type: "deal_count", value: 5 }),
        points: 500
      },
      {
        name: "Big Deal Hunter",
        description: "Closed a deal worth $100K+",
        icon: "💰",
        color: "gold",
        criteria: JSON.stringify({ type: "deal_value", value: 100000 }),
        points: 1000
      },
      {
        name: "Lead Converter",
        description: "Converted 10 leads to deals",
        icon: "🔄",
        color: "purple",
        criteria: JSON.stringify({ type: "lead_conversion", value: 10 }),
        points: 300
      },
      {
        name: "Meeting Master",
        description: "Scheduled 20 meetings",
        icon: "📅",
        color: "orange",
        criteria: JSON.stringify({ type: "meeting_count", value: 20 }),
        points: 200
      },
      {
        name: "Monthly Target",
        description: "Hit monthly sales target",
        icon: "🎖️",
        color: "red",
        criteria: JSON.stringify({ type: "monthly_target", value: 100 }),
        points: 750
      },
      {
        name: "Streak Master",
        description: "5 consecutive days with activities",
        icon: "🔥",
        color: "orange",
        criteria: JSON.stringify({ type: "activity_streak", value: 5 }),
        points: 400
      },
      {
        name: "Team Player",
        description: "Helped close 3 team deals",
        icon: "🤝",
        color: "indigo",
        criteria: JSON.stringify({ type: "team_deals", value: 3 }),
        points: 250
      }
    ];

    let createdBadges = 0;
    for (const badge of badges) {
      try {
        await storage.createBadge(badge);
        createdBadges++;
      } catch (error) {
        // Badge might already exist, skip
        console.log(`Badge "${badge.name}" already exists or failed to create`);
      }
    }

    // Get the first user for sample data - using a simple query since we don't have getUsers method
    try {
      // Get the first available user from the database instead of using hardcoded ID
      const users = await storage.db.select().from(storage.schema.profiles).limit(1);
      const firstUser = users[0];
      if (!firstUser) {
        console.log('⚠️ No users found, skipping user-specific gamification data');
        return;
      }
    
      // Create sample sales points
    const samplePoints = [
      {
        userId: firstUser.id,
        points: 100,
        activityType: "deal_closed",
        description: "Closed TechCorp Enterprise License deal",
        earnedAt: new Date('2025-01-15'),
        createdAt: new Date('2025-01-15')
      },
      {
        userId: firstUser.id,
        points: 50,
        activityType: "lead_converted",
        description: "Converted lead to opportunity",
        earnedAt: new Date('2025-01-18'),
        createdAt: new Date('2025-01-18')
      },
      {
        userId: firstUser.id,
        points: 25,
        activityType: "meeting_scheduled",
        description: "Scheduled demo call with prospect",
        earnedAt: new Date('2025-01-20'),
        createdAt: new Date('2025-01-20')
      },
      {
        userId: firstUser.id,
        points: 200,
        activityType: "deal_closed",
        description: "Closed Innovation Solutions Platform deal",
        earnedAt: new Date('2025-01-21'),
        createdAt: new Date('2025-01-21')
      }
    ];

    let createdPoints = 0;
    for (const point of samplePoints) {
      try {
        await storage.createSalesPoints(point);
        createdPoints++;
      } catch (error) {
        console.log(`Points entry already exists or failed to create`);
      }
    }

    // Create sample sales target
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    try {
      await storage.createSalesTarget({
        userId: firstUser.id,
        targetType: "monthly",
        targetValue: "500000.00",
        currentValue: "375000.00",
        targetPeriod: currentMonth,
        isActive: true
      });
      console.log('✅ Created sample sales target');
    } catch (error) {
      console.log('Sales target might already exist');
    }

    // Create sample achievements
    const sampleAchievements = [
      {
        userId: firstUser.id,
        title: "First Deal Milestone",
        description: "Successfully closed your first deal worth $250,000",
        type: "milestone",
        value: "250000.00"
      },
      {
        userId: firstUser.id,
        title: "Lead Conversion Champion",
        description: "Achieved 80% lead conversion rate this month",
        type: "competition",
        value: "80.00"
      }
    ];

    let createdAchievements = 0;
    for (const achievement of sampleAchievements) {
      try {
        await storage.createAchievement(achievement);
        createdAchievements++;
      } catch (error) {
        console.log(`Achievement already exists or failed to create`);
      }
    }

    // Award some badges to the user
    try {
      const allBadges = await storage.getBadges();
      const firstDealBadge = allBadges.find(b => b.name === "First Deal");
      const bigDealBadge = allBadges.find(b => b.name === "Big Deal Hunter");
      
      if (firstDealBadge) {
        await storage.awardBadge({
          userId: firstUser.id,
          badgeId: firstDealBadge.id,
          earnedAt: new Date('2025-01-15'),
          progress: 100
        });
      }
      
      if (bigDealBadge) {
        await storage.awardBadge({
          userId: firstUser.id,
          badgeId: bigDealBadge.id,
          earnedAt: new Date('2025-01-15'),
          progress: 100
        });
      }
      
      console.log('✅ Awarded sample badges to user');
    } catch (error) {
      console.log('Badges might already be awarded');
    }
    
    } catch (error) {
      console.log('Error creating user-specific gamification data:', error);
    }

    console.log(`✅ Gamification seeding completed!`);
    console.log(`Created ${createdBadges} badges`);

  } catch (error) {
    console.error('❌ Error seeding gamification data:', error);
  }
}