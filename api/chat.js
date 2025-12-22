export const config = {
    runtime: 'edge',
};

const SYSTEM_INSTRUCTION = `You are the GMP Payroll AI Specialist. You are professional, accurate, and helpful. You specialize in global payroll implementation, tax compliance (including MPF/CPF), and workflow automation. If you don't know an answer, politely ask the user to contact support@gmppayroll.org. Keep your answers concise and business-focused.`;

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
