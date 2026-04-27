import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateSmartSchedule(data: {
  classes: any[],
  teachers: any[],
  subjects: any[],
  availability: Record<string, any[]>,
  slots: any[],
  constraints?: string
}) {
  const prompt = `
    You are a school scheduling system. Your goal is to generate a weekly school schedule for the following classes, subjects, and teachers while respecting their availability.

    DATA:
    - Classes: ${JSON.stringify(data.classes.map(c => ({ id: c.id, name: c.name, grade: c.grade })))}
    - Subjects: ${JSON.stringify(data.subjects.map(s => ({ id: s.id, name: s.name })))}
    - Teachers: ${JSON.stringify(data.teachers.map(t => ({ id: t.id, name: t.name, subjects: t.subjects })))}
    - Teacher Availability: ${JSON.stringify(data.availability)}
    - Available Time Slots: ${JSON.stringify(data.slots)}

    CONSTRAINTS:
    - Days: Sunday, Monday, Tuesday, Wednesday, Thursday
    - For each day, you MUST fill every available time slot provided in the Data section for each class.
    - Each subject should appear at least twice a week per class if possible.
    - No teacher should be double-booked in the same slot.
    ${data.constraints ? `- Extra Constraints: ${data.constraints}` : ''}

    OUTPUT FORMAT:
    Return ONLY a JSON array of objects with the following structure:
    [{ "classId": "...", "day": "...", "subject": "...", "teacherId": "...", "startTime": "...", "endTime": "...", "room": "..." }]

    IMPORTANT: Response must be valid JSON only.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text || '';
    // Extract JSON from markdown if needed
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Schedule Generation Error:", error);
    throw error;
  }
}
