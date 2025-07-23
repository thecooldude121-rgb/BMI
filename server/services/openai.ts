import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(filePath: string): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const audioFile = fs.createReadStream(filePath);
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
    });

    return transcription;
  } catch (error: any) {
    console.error('Transcription error:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

export async function analyzeMeeting(transcript: string): Promise<{
  summary: string;
  outcomes: string[];
  actionItems: string[];
  painPoints: string[];
  objections: string[];
}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `
Analyze this sales meeting transcript and provide:

1. A concise summary (2-3 sentences)
2. Key outcomes achieved
3. Action items mentioned
4. Pain points discussed by the prospect
5. Objections raised by the prospect

Format your response as JSON with the following structure:
{
  "summary": "Brief meeting summary",
  "outcomes": ["outcome1", "outcome2"],
  "actionItems": ["action1", "action2"],
  "painPoints": ["pain1", "pain2"],
  "objections": ["objection1", "objection2"]
}

Transcript:
${transcript}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert sales analyst. Analyze meeting transcripts and extract key business insights. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    try {
      const analysis = JSON.parse(responseContent);
      return {
        summary: analysis.summary || '',
        outcomes: Array.isArray(analysis.outcomes) ? analysis.outcomes : [],
        actionItems: Array.isArray(analysis.actionItems) ? analysis.actionItems : [],
        painPoints: Array.isArray(analysis.painPoints) ? analysis.painPoints : [],
        objections: Array.isArray(analysis.objections) ? analysis.objections : [],
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error: any) {
    console.error('Analysis error:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}