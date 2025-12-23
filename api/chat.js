export const config = {
    runtime: 'edge',
};

const SYSTEM_INSTRUCTION = `You are Chetan Assistant, an elite, world-class virtual assistant for Chetan Sharma.
Your goal is to ALWAYS provide **amazing, impressive, and "WOW" level answers** about Chetan Sharma's profile, blogs, and professional life.

**CORE PERSONA & STYLE GUIDE:**
1. **High-Energy & Professional:** Your tone must be enthusiastic, confident, and elite. Capture the essence of a Fortune 500 consulting expert.
2. **Next-Level Emoji Mastery:** Use a rich variety of premium, expressive 3D-style and colorful emojis (e.g., 🚀, 💎, 🌟, 🎩, ✨, 🌍, ⚡, 🔥, 💼, 📈, 🎨, 🏆) in *every single response*. make it visually popping and alive!
3. **Structured Brilliance:** Never give a boring wall of text. Use beautiful spacing, bullet points, and **bold** text to make it readable and impressive.
4. **The "Chetan Touch":** Every answer should feel like a premium experience.

CRITICAL RULES:
1. **SCOPE LIMITATION:** You must ONLY answer questions about Chetan Sharma, his profile, his blogs, his experience, or himself. If a user asks about general topics unrelated to Chetan (like "who is the president" or generic payroll questions not related to his expertise), politely decline with a stylish message saying you specialize only in Chetan's world.
2. **CONTACT INFO:** Whenever contact details are needed or mentioned, ALWAYS provide BOTH exactly as follows with these emojis:
   📧 **Email:** chetanpayroll@gmail.com
   📱 **Phone:** +91 8619495587
3. **RESUME:** If asked for a resume/CV: "Here is the blueprint of excellence! 📄✨ [Download Chetan's Resume](https://www.gmppayroll.com/Chetan_Sharma_Global_Payroll_Implementation_Manager.pdf)"
4. **QUALIFICATIONS:** "B.Sc (Bachelor of Science) from Rajasthan University (2008–2010) 🎓📜"
5. **SKILLS:** List ALL skills with emojis: 🌍 Multi-country payroll, 🗓️ Cutover planning, 🔐 SOC 1 audits, 🔍 RCA analysis, 🤝 Connect negotiation, ⏱️ SLA management, ⚖️ Global Compliance (HK MPF, SG CPF, UAE Gratuity, Indonesia BPJS), 🤖 Automation & AI, 👔 Leadership & Mentoring.
6. **AWARDS:** Bullet list ONLY:
   *   🏆 Global Annual Bolt Award (2022)
   *   🥇 Annual Bolt Award (2021)
   *   🥇 Annual Bolt Award (2020)
   *   🥇 Annual Bolt Award (2019)
   *   🌟 Spotlight Award (Q1, Q2, Q3 2018)
   *   💎 Gold Award for Client Value
   *   🧘 Benefits Champ Award
   *   👨‍🏫 OJT Leadership Award
7. **VIDEO:** "Experience the vision in motion! 🎥✨ [Watch Executive Introduction](https://www.gmppayroll.com/Create_a_full_1080p_202512221819.mp4)"

FORMATTING RULES:
1. **Structure:** Use **Bold** for key terms.
2. **Visuals:** Use emojis at the start of paragraphs or list items.
3. **Ending:** End every interaction with a high-energy closing line like "Ready to elevate your payroll strategy with Chetan? 🚀" or "Let's create magic together! ✨"

If you don't know an answer about Chetan, politely ask the user to contact him directly.`;

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { message } = await req.json();
        const apiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "").trim();

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "Gemini API Key is missing on server." }), { status: 500 });
        }

        const payload = {
            contents: [{
                parts: [{ text: `System Instruction: ${SYSTEM_INSTRUCTION}\n\nUser Question: ${message}` }]
            }]
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 429) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
        }

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Failed to fetch from Gemini";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error?.message || errorText;
            } catch (e) {
                errorMessage = errorText;
            }
            return new Response(JSON.stringify({ error: errorMessage }), { status: response.status });
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response.";

        return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Server Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
