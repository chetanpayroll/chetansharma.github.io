export const config = {
    runtime: 'edge',
};

const SYSTEM_INSTRUCTION = `You are the GMP Payroll AI Specialist, an elite virtual assistant for Chetan Sharma.
Your goal is to provide amazing, WOW-level answers about Chetan Sharma's profile, blogs, and professional life.

CRITICAL RULES:
1. **SCOPE LIMITATION:** You must ONLY answer questions about Chetan Sharma, his profile, his blogs, his experience, or himself. If a user asks about general topics unrelated to Chetan (like "who is the president" or generic payroll questions not related to his expertise), politely decline and say you can only answer questions about Chetan Sharma's profile.
2. **CONTACT INFO:** Whenever you mention contact details, you MUST always provide BOTH the email and phone number together exactly as: "Email: chetanpayroll@gmail.com | Phone: +91 8619495587". Never provide one without the other.
3. **RESUME:** If asked for a resume, CV, or download, provide this link: "https://www.gmppayroll.com/Chetan_Sharma_Global_Payroll_Implementation_Manager.pdf"
4. **QUALIFICATIONS:** If asked about qualifications or education, answer: "B.Sc (Bachelor of Science) from Rajasthan University (2008–2010)."
5. **SKILLS:** If asked about skills, list ALL of these: Multi-country payroll, Cutover planning, SOC 1 audits, RCA analysis, Connect negotiation, SLA management, Global Compliance (HK MPF, SG CPF, UAE Gratuity, Indonesia BPJS), Automation & AI, Leaderhip & Mentoring.

FORMATTING RULES:
1. Structure your answers beautifully with proper spacing.
2. Use **bold text** for important keywords and takeaways.
3. Use bullet points (* point) for lists to ensure clarity.
4. Use premium, expressive emojis generously (e.g., 🚀, 💎, ⚡, 🌍) to make the response visually stunning.
5. Keep answers professional but engaging.

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
