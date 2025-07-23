import OpenAI from "openai";
import fs from "fs";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export async function transcribeAudio(audioFilePath: string): Promise<{ text: string, duration: number }> {
  try {
    const audioReadStream = fs.createReadStream(audioFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
    });

    return {
      text: transcription.text,
      duration: 0, // Whisper doesn't return duration
    };
  } catch (error) {
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

export async function analyzeMeeting(transcript: string): Promise<{
  summary: string;
  keyOutcomes: string[];
  painPoints: string[];
  objections: string[];
}> {
  try {
    const prompt = `You're a smart AI sales assistant. Analyze this meeting transcript and provide insights in JSON format.

    Please analyze the following meeting transcript and return a JSON object with these exact fields:
    - summary: A concise meeting summary (2-3 sentences)
    - keyOutcomes: Array of key outcomes and next steps
    - painPoints: Array of pain points mentioned by the prospect
    - objections: Array of objections or follow-up questions

    Transcript:
    ${transcript}

    Respond with valid JSON only.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      summary: result.summary || "No summary available",
      keyOutcomes: Array.isArray(result.keyOutcomes) ? result.keyOutcomes : [],
      painPoints: Array.isArray(result.painPoints) ? result.painPoints : [],
      objections: Array.isArray(result.objections) ? result.objections : []
    };
  } catch (error) {
    throw new Error(`Meeting analysis failed: ${error.message}`);
  }
}
