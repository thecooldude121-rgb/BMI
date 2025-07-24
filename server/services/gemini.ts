import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function transcribeAudio(filePath: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Read the audio file
    const audioBuffer = fs.readFileSync(filePath);
    const audioBase64 = audioBuffer.toString('base64');
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Please transcribe the following audio file. Provide only the transcript text without any additional formatting or commentary.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: audioBase64,
          mimeType: 'audio/mp3'
        }
      }
    ]);

    const response = await result.response;
    return response.text();
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
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

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

Respond with valid JSON only, no additional text or formatting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseContent = response.text();

    if (!responseContent) {
      throw new Error('No response from Gemini');
    }

    try {
      // Clean the response to ensure it's valid JSON
      const cleanedResponse = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(cleanedResponse);
      
      return {
        summary: analysis.summary || '',
        outcomes: Array.isArray(analysis.outcomes) ? analysis.outcomes : [],
        actionItems: Array.isArray(analysis.actionItems) ? analysis.actionItems : [],
        painPoints: Array.isArray(analysis.painPoints) ? analysis.painPoints : [],
        objections: Array.isArray(analysis.objections) ? analysis.objections : [],
      };
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseContent);
      throw new Error('Invalid response format from Gemini');
    }
  } catch (error: any) {
    console.error('Analysis error:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}