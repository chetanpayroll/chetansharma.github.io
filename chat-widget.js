(function () {
    // Styles
    const styles = `
        #gmp-chat-widget-container {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            position: fixed;
            bottom: 32px;
            right: 32px;
            z-index: 99999;
        }

        #gmp-chat-toggle {
            background: linear-gradient(135deg, #003366 0%, #0f172a 100%);
            color: white;
            border-radius: 50px;
            padding: 14px 28px;
            box-shadow: 0 10px 25px rgba(0, 51, 102, 0.4);
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            width: auto;
            opacity: 1;
            transform: translateY(0);
            backdrop-filter: blur(10px);
        }

        #gmp-chat-toggle:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 35px rgba(0, 51, 102, 0.5);
        }

        #gmp-chat-toggle.hidden {
            width: 0;
            opacity: 0;
            pointer-events: none;
            padding: 0;
            transform: scale(0.9);
        }

        #gmp-chat-window {
            position: fixed;
            bottom: 32px;
            right: 32px;
            width: 90%;
            max-width: 420px;
            height: 650px;
            max-height: 80vh;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(16px);
            border-radius: 24px;
            box-shadow: 0 24px 60px -12px rgba(50, 50, 93, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            transform: scale(1) translateY(20px);
            transform-origin: bottom right;
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(255, 255, 255, 0.5);
            overflow: hidden;
        }

        #gmp-chat-window.open {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: auto;
        }

        .chat-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .new-chat-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 20px;
            transition: all 0.2s;
        }

        .new-chat-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .close-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            line-height: 1;
            transition: color 0.2s;
        }

        .close-btn:hover {
            color: white;
        }

        .messages-area {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            background: linear-gradient(to bottom, #f8fafc, #ffffff);
        }

        /* Scrollbar styling */
        .messages-area::-webkit-scrollbar {
            width: 6px;
        }
        .messages-area::-webkit-scrollbar-track {
            background: transparent;
        }
        .messages-area::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        .message {
            padding: 16px 20px;
            max-width: 85%;
            font-size: 15px;
            line-height: 1.6;
            position: relative;
            animation: messageSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(10px);
        }

        @keyframes messageSlideIn {
            to { opacity: 1; transform: translateY(0); }
        }

        .message.assistant {
            align-self: flex-start;
            background: white;
            color: #334155;
            border-radius: 20px 20px 20px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #003366 0%, #2563eb 100%);
            color: white;
            border-radius: 20px 20px 0 20px;
            box-shadow: 0 4px 15px rgba(0, 51, 102, 0.2);
        }

        .input-area {
            padding: 20px;
            background: white;
            border-top: 1px solid rgba(226, 232, 240, 0.8);
            position: relative;
        }

        .input-form {
            display: flex;
            gap: 12px;
            background: #f1f5f9;
            padding: 8px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
        }

        .input-form:focus-within {
            background: white;
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .chat-input {
            flex: 1;
            padding: 8px 12px;
            background: transparent;
            border: none;
            font-size: 15px;
            outline: none;
            color: #0f172a;
            font-family: inherit;
        }

        .send-btn {
            background: linear-gradient(135deg, #003366 0%, #2563eb 100%);
            color: white;
            border: none;
            border-radius: 12px;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }

        .send-btn:hover:not(:disabled) {
            transform: scale(1.05);
            box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
        }

        .send-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background: #94a3b8;
            box-shadow: none;
        }

        .typing-indicator span {
            width: 5px;
            height: 5px;
            background-color: #64748b;
            border-radius: 50%;
            display: inline-block;
            margin: 0 1px;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.16s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.32s; }

        @media (max-width: 480px) {
            #gmp-chat-window {
                right: 0;
                left: 0;
                bottom: 0;
                width: 100%;
                max-width: none;
                height: 100vh;
                max-height: 100vh;
                border-radius: 0;
            }
            #gmp-chat-widget-container {
                z-index: 2147483647;
            }
        }

        /* Enhanced Markdown Styles */
        .message strong {
            font-weight: 700;
            color: inherit;
        }
        
        .message.assistant strong {
            color: #0f172a;
            background: linear-gradient(120deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%);
            padding: 0 4px;
            border-radius: 4px;
        }

        .message ul {
            margin: 12px 0;
            padding-left: 0;
            list-style: none;
        }
        
        .message li {
            position: relative;
            padding-left: 28px;
            margin-bottom: 10px;
        }
        
        .message li::before {
            content: "🔹";
            position: absolute;
            left: 0;
            top: 2px;
            font-size: 14px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        /* Advanced Premium Link/Action Buttons */
        .chat-link-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            background: white;
            color: #0f172a !important;
            padding: 14px 18px;
            border-radius: 16px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
        }

        .chat-link-btn::before {
            content: "✨";
            font-size: 1.2em;
            background: linear-gradient(135deg, #e0f2fe 0%, #f3e8ff 100%);
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
        }

        .chat-link-btn::after {
            content: "→";
            margin-left: auto;
            color: #94a3b8;
            transition: transform 0.2s;
        }

        .chat-link-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
            border-color: #cbd5e1;
        }

        .chat-link-btn:hover::after {
            transform: translateX(4px);
            color: #3b82f6;
        }

        .chat-link-btn:active {
            transform: translateY(0);
        }

        /* Video Container Polish */
        .video-container {
            margin-top: 16px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(0,0,0,0.05);
            background: black;
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
                        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: white;">Chetan Assistant</h3>
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
        content: "Hello! I'm Chetan's AI Assistant. How can I help you learn more about Chetan's profile?"
    };

    function formatMessage(content) {
        // Escape HTML first to prevent XSS (basic)
        let safeContent = content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Bold: **text** -> <strong>text</strong>
        safeContent = safeContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Links: [text](url) -> Button or Video
        safeContent = safeContent.replace(
            /\[(.*?)\]\((.*?)\)/g,
            (match, text, url) => {
                if (url.match(/\.mp4$/i)) {
                    return `<br><div class="video-container" style="margin-top:10px; border-radius:12px; overflow:hidden; box-shadow:0 8px 16px rgba(0,0,0,0.2);"><video controls width="100%" style="display:block;"><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video></div><br>`;
                }
                return `<br><a href="${url}" class="chat-link-btn" target="_blank" rel="noopener noreferrer">${text}</a><br>`;
            }
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

        if (role === 'assistant') {
            div.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
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
                appendMessage('assistant', "Our **Chetan Assistant** is currently resting due to high demand. 🌟🧘‍♂️\n\n**✨ Connect with Chetan Directly:** 👇\n\n🌈 **Email:**\n[chetanpayroll@gmail.com](mailto:chetanpayroll@gmail.com)\n\n💎 **Phone:**\n[+91 8619495587](tel:+918619495587)\n\nHold tight! **Chetan Sharma himself** will personally connect with you to deliver world-class expertise! 🎩✨");
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
