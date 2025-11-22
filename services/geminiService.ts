import { GoogleGenAI, Type } from "@google/genai";
import { GenerateResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAiNumbers = async (wish?: string): Promise<GenerateResponse> => {
  try {
    const prompt = `
      사용자가 로또 번호(1~45 사이의 숫자 6개)를 추천받고 싶어합니다.
      ${wish ? `사용자의 소원: "${wish}"` : '특별한 소원은 없지만 행운이 필요합니다.'}
      
      이 소원을 바탕으로 행운의 로또 번호 1세트(6개 숫자)를 생성하고, 
      왜 이 숫자들이 행운을 가져다 줄지 짧고 재미있는 이유(50자 이내)를 한국어로 설명해주세요.
      숫자는 반드시 오름차순으로 정렬되어야 합니다.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            numbers: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: "6 unique integers between 1 and 45, sorted ascending."
            },
            reason: {
              type: Type.STRING,
              description: "A short explanation in Korean about why these numbers are lucky."
            }
          },
          required: ["numbers", "reason"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as GenerateResponse;
    
    // Safety check for 6 numbers and valid range
    const validNumbers = result.numbers.filter(n => n >= 1 && n <= 45);
    const uniqueNumbers = Array.from(new Set(validNumbers)).sort((a, b) => a - b);
    
    // If AI fails to generate valid set, fallback logic (though unlikely with schema)
    if (uniqueNumbers.length < 6) {
        // Fallback fill
        while(uniqueNumbers.length < 6) {
            const n = Math.floor(Math.random() * 45) + 1;
            if(!uniqueNumbers.includes(n)) uniqueNumbers.push(n);
        }
        uniqueNumbers.sort((a,b) => a - b);
    }

    return {
        numbers: uniqueNumbers.slice(0, 6),
        reason: result.reason
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback purely random if AI fails
    const nums = new Set<number>();
    while (nums.size < 6) nums.add(Math.floor(Math.random() * 45) + 1);
    return {
      numbers: Array.from(nums).sort((a, b) => a - b),
      reason: "AI 연결이 불안정하여 무작위 행운 번호를 생성했습니다!"
    };
  }
};