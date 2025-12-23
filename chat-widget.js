(function () {
    // Styles
    const styles = `
        #gmp-chat-widget-container {
            font-family: 'Inter', sans-serif;
            position: fixed;
            bottom: 32px;
            right: 32px;
            z-index: 9999;
        }

        #gmp-chat-toggle {
            background-color: #003366;
            color: white;
            border-radius: 50px;
            padding: 12px 24px;
            box-shadow: 0 8px 16px rgba(0,51,102,0.25);
            display: flex;
            align-items: center;
            gap: 12px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            width: auto;
            opacity: 1;
            pointer-events: auto;
        }

        #gmp-chat-toggle.hidden {
            width: 0;
            opacity: 0;
            pointer-events: none;
            padding: 0;
            overflow: hidden;
        }

        #gmp-chat-window {
            position: fixed;
            bottom: 32px;
            right: 32px;
            width: 90%;
            max-width: 400px;
            height: 600px;
            max-height: 80vh;
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            transform: scale(0.8);
            transform-origin: bottom right;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid #E2E8F0;
            overflow: hidden;
        }

        #gmp-chat-window.open {
            transform: scale(1);
            opacity: 1;
            pointer-events: auto;
        }

        .chat-header {
            background-color: #003366;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .new-chat-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            font-size: 12px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background 0.2s;
        }

        .new-chat-btn:hover {
            background: rgba(255,255,255,0.2);
        }

        .close-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            line-height: 1;
        }

        .messages-area {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background-color: #F8FAFC;
        }

        .message {
            padding: 12px 16px;
            max-width: 80%;
            font-size: 14px;
            line-height: 1.5;
        }

        .message.assistant {
            align-self: flex-start;
            background-color: white;
            color: #334155;
            border-radius: 16px 16px 16px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid #E2E8F0;
        }

        .message.user {
            align-self: flex-end;
            background-color: #003366;
            color: white;
            border-radius: 16px 16px 0 16px;
        }

        .input-area {
            padding: 16px;
            background-color: white;
            border-top: 1px solid #E2E8F0;
        }

        .input-form {
            display: flex;
            gap: 8px;
        }

        .chat-input {
            flex: 1;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #CBD5E1;
            font-size: 14px;
            outline: none;
            color: #0F172A;
            background-color: #ffffff;
        }

        .send-btn {
            background-color: #003366;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .typing-indicator span {
            width: 6px;
            height: 6px;
            background-color: #94A3B8;
            border-radius: 50%;
            display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.16s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.32s; }

        @keyframes bounce { 
            0%, 80%, 100% { transform: scale(0); } 
            40% { transform: scale(1); } 
        }

        @media (max-width: 480px) {
            #gmp-chat-window {
                right: 16px;
                left: 16px;
                bottom: 16px;
                width: auto;
                max-width: none;
            }
            .chat-input {
                font-size: 16px; /* Prevent zoom on iOS */
            }
        }

        /* Markdown Styles for AI Responses */
        .message strong {
            font-weight: 800;
            color: #0d47a1;
        }
        
        .message ul {
            margin: 10px 0;
            padding-left: 0;
            list-style: none;
        }
        
        .message li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 8px;
            line-height: 1.6;
        }
        
        .message li::before {
            content: "🔹";
            position: absolute;
            left: 0;
            font-size: 12px;
            top: 2px;
        }
        
        .message p {
            margin-bottom: 10px;
        }
        
        .message p:last-child {
            margin-bottom: 0;
        }

        /* Premium Link Button Style */
        .chat-link-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #0d47a1 0%, #002171 100%);
            color: white !important;
            padding: 10px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 8px;
            box-shadow: 0 4px 6px rgba(13, 71, 161, 0.2);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .chat-link-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(13, 71, 161, 0.3);
            text-decoration: none;
        }

        .chat-link-btn::before {
            content: "📄"; 
            font-size: 1.1em;
        }
    `;

    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Widget HTML
    const widgetHTML = `
        <button id="gmp-chat-toggle">
            <span style="font-size: 24px;">🤖</span>
            <span style="font-weight: 600; font-size: 16px;">AI Assistant</span>
        </button>

        <div id="gmp-chat-window">
            <div class="chat-header">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 8px; height: 8px; background-color: #4ADE80; border-radius: 50%;"></div>
                    <div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: white;">GMP AI Specialist</h3>
                        <p style="margin: 0; font-size: 12px; opacity: 0.8;">Online | Powered by Gemini 3 Flash</p>
                    </div>
                </div>
                <div class="chat-controls">
                    <button class="new-chat-btn" id="gmp-new-chat" title="New Chat">New Chat</button>
                    <button class="close-btn" id="gmp-close-chat">×</button>
                </div>
            </div>

            <div class="messages-area" id="gmp-messages">
                <!-- Messages will appear here -->
            </div>

            <div class="input-area">
                <form class="input-form" id="gmp-chat-form">
                    <input type="text" class="chat-input" id="gmp-chat-input" placeholder="Ask about payroll compliance..." required>
                    <button type="submit" class="send-btn" id="gmp-send-btn">
                        <span style="font-size: 18px;">➤</span>
                    </button>
                </form>
                <div style="text-align: center; margin-top: 8px;">
                    <span style="font-size: 10px; color: #94A3B8;">AI can make mistakes. Contact our experts for critical advice.</span>
                </div>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.id = 'gmp-chat-widget-container';
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);

    // Logic
    const toggleBtn = document.getElementById('gmp-chat-toggle');
    const windowEl = document.getElementById('gmp-chat-window');
    const closeBtn = document.getElementById('gmp-close-chat');
    const newChatBtn = document.getElementById('gmp-new-chat');
    const form = document.getElementById('gmp-chat-form');
    const input = document.getElementById('gmp-chat-input');
    const messagesArea = document.getElementById('gmp-messages');
    const sendBtn = document.getElementById('gmp-send-btn');

    let isError429 = false;

    // Initial Message
    const initialMessage = {
        role: "assistant",
        content: "Hello! I'm the GMP Payroll AI Specialist. How can I help you with global payroll or compliance today?"
    };

    function formatMessage(content) {
        // Escape HTML first to prevent XSS (basic)
        let safeContent = content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Bold: **text** -> <strong>text</strong>
        safeContent = safeContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Links: [text](url) -> <a href="url" class="chat-link-btn" ...>text</a>
        safeContent = safeContent.replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<br><a href="$2" class="chat-link-btn" target="_blank" rel="noopener noreferrer">$1</a><br>'
        );

        // Lists: lines starting with * or - 
        const lines = safeContent.split('\n');
        let html = '';
        let inList = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            if (line.startsWith('* ') || line.startsWith('- ')) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                html += `<li>${line.substring(2)}</li>`;
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                if (line.length > 0) {
                    html += `<p>${line}</p>`;
                }
            }
        }

        if (inList) html += '</ul>';

        return html || safeContent;
    }

    function appendMessage(role, content) {
        const div = document.createElement('div');
        div.className = `message ${role}`;

        if (role === 'assistant') {
            div.innerHTML = formatMessage(content);
        } else {
            div.textContent = content;
        }

        messagesArea.appendChild(div);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function appendTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'message assistant typing-indicator';
        div.id = 'typing-indicator';
        div.innerHTML = '<span></span><span></span><span></span>';
        messagesArea.appendChild(div);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    // Toggle
    toggleBtn.addEventListener('click', () => {
        windowEl.classList.add('open');
        toggleBtn.classList.add('hidden');
        if (messagesArea.children.length === 0) {
            appendMessage(initialMessage.role, initialMessage.content);
        }
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('open');
        toggleBtn.classList.remove('hidden');
    });

    // New Chat
    newChatBtn.addEventListener('click', () => {
        messagesArea.innerHTML = '';
        isError429 = false;
        appendMessage(initialMessage.role, initialMessage.content);
    });

    // Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        appendMessage('user', text);

        sendBtn.disabled = true;
        appendTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            removeTypingIndicator();

            if (response.status === 429) {
                isError429 = true;
                appendMessage('assistant', "Our AI assistant is currently resting. Please leave your email here, and a human expert will get back to you shortly.");
                // Note: simple email capture implementation logic would go here
            } else {
                const data = await response.json();
                const reply = data.reply || data.error || "I apologize, connection trouble.";
                appendMessage('assistant', reply);
            }

        } catch (error) {
            removeTypingIndicator();
            console.error(error);
            appendMessage('assistant', "I'm having trouble connecting right now. Please try again later.");
        } finally {
            sendBtn.disabled = false;
        }
    });

})();
