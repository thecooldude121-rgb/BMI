import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ContextualHelpRequest {
  context: {
    page: string;
    section: string;
    userRole?: string;
    dealStage?: string;
    dealValue?: number;
    accountType?: string;
    currentData?: any;
  };
}

export interface AIInsight {
  type: 'tip' | 'recommendation' | 'warning' | 'best_practice';
  title: string;
  content: string;
  actionable?: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export async function generateContextualInsights(request: ContextualHelpRequest): Promise<AIInsight[]> {
  const { context } = request;
  
  // Create a detailed prompt based on the context
  const prompt = `You are an expert CRM consultant providing contextual help for a business management platform. 
  
Context:
- Page: ${context.page}
- Section: ${context.section}
- User Role: ${context.userRole || 'Sales User'}
- Deal Stage: ${context.dealStage || 'Not specified'}
- Deal Value: ${context.dealValue ? `$${context.dealValue.toLocaleString()}` : 'Not specified'}
- Account Type: ${context.accountType || 'Not specified'}
- Current Data: ${context.currentData ? JSON.stringify(context.currentData) : 'Not provided'}

Provide 2-4 specific, actionable insights for this context. Each insight should be:
1. Relevant to the current page/section
2. Actionable and specific
3. Based on CRM best practices
4. Helpful for improving sales performance or data quality

Return insights in JSON format:
{
  "insights": [
    {
      "type": "tip|recommendation|warning|best_practice",
      "title": "Short descriptive title",
      "content": "Specific actionable advice (50-100 words)",
      "actionable": true/false,
      "priority": "low|medium|high",
      "category": "data_quality|sales_strategy|process_optimization|best_practices"
    }
  ]
}

Focus on practical advice that a sales professional would find valuable.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a CRM expert providing contextual help. Always respond with valid JSON containing practical insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.insights || [];
  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Fallback insights based on context
    return generateFallbackInsights(context);
  }
}

function generateFallbackInsights(context: any): AIInsight[] {
  const insights: AIInsight[] = [];

  // General insights based on page context
  if (context.page === 'deals') {
    if (context.section === 'stage_progression') {
      insights.push({
        type: 'tip',
        title: 'Optimize Deal Progression',
        content: 'Review your deal stages regularly and ensure each stage has clear exit criteria. This helps maintain consistent sales processes.',
        actionable: true,
        priority: 'medium',
        category: 'process_optimization'
      });
    }
    
    if (context.dealValue && context.dealValue > 50000) {
      insights.push({
        type: 'recommendation',
        title: 'High-Value Deal Management',
        content: 'For deals over $50K, consider involving senior stakeholders and implementing a structured approval process.',
        actionable: true,
        priority: 'high',
        category: 'sales_strategy'
      });
    }
  }

  if (context.page === 'form_field') {
    insights.push({
      type: 'best_practice',
      title: 'Data Quality Matters',
      content: 'Complete and accurate field data improves reporting accuracy and helps identify sales patterns.',
      actionable: true,
      priority: 'medium',
      category: 'data_quality'
    });
  }

  return insights.length > 0 ? insights : [{
    type: 'tip',
    title: 'CRM Best Practice',
    content: 'Keep your CRM data updated regularly to ensure accurate reporting and effective sales management.',
    actionable: true,
    priority: 'low',
    category: 'best_practices'
  }];
}

// Specific insight generators for common scenarios
export function getDealStageInsights(stage: string, dealValue?: number): AIInsight[] {
  const insights: AIInsight[] = [];

  switch (stage.toLowerCase()) {
    case 'qualification':
    case '1 - prospecting':
      insights.push({
        type: 'tip',
        title: 'Qualification Best Practices',
        content: 'Focus on understanding the prospect\'s budget, authority, need, and timeline (BANT). This helps qualify leads effectively.',
        actionable: true,
        priority: 'high',
        category: 'sales_strategy'
      });
      break;

    case 'proposal':
    case '3 - proposal':
      insights.push({
        type: 'recommendation',
        title: 'Proposal Strategy',
        content: 'Ensure your proposal addresses specific pain points identified during discovery. Include clear ROI calculations.',
        actionable: true,
        priority: 'high',
        category: 'sales_strategy'
      });
      break;

    case 'negotiation':
    case '4 - negotiation':
      insights.push({
        type: 'warning',
        title: 'Negotiation Focus',
        content: 'Avoid competing solely on price. Focus on value differentiation and total cost of ownership.',
        actionable: true,
        priority: 'high',
        category: 'sales_strategy'
      });
      break;
  }

  return insights;
}

export function getFieldSpecificInsights(fieldName: string, currentValue?: any): AIInsight[] {
  const insights: AIInsight[] = [];

  switch (fieldName.toLowerCase()) {
    case 'probability':
      if (currentValue && currentValue > 80) {
        insights.push({
          type: 'tip',
          title: 'High Probability Deal',
          content: 'With high probability, ensure all stakeholders are aligned and contracts are ready for final review.',
          actionable: true,
          priority: 'high',
          category: 'sales_strategy'
        });
      }
      break;

    case 'closedate':
    case 'closing date':
      insights.push({
        type: 'best_practice',
        title: 'Realistic Close Dates',
        content: 'Set realistic close dates based on your sales cycle length and current deal stage.',
        actionable: true,
        priority: 'medium',
        category: 'process_optimization'
      });
      break;

    case 'value':
    case 'amount':
      insights.push({
        type: 'tip',
        title: 'Deal Sizing',
        content: 'Regularly validate deal size with prospects. Oversized deals often stall in the pipeline.',
        actionable: true,
        priority: 'medium',
        category: 'data_quality'
      });
      break;
  }

  return insights;
}