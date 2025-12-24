document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "AIzaSyBqimP9sMsNQmEfO9hYE6JgZpJVeCFPNRc";
    // Using v1beta as it supports system_instruction
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Inject Chatbot HTML
    const chatbotContainer = document.createElement("div");
    chatbotContainer.innerHTML = `
        <button class="chatbot-toggler" title="Chat with Brainy">
            <span class="chat-icon">💬</span>
        </button>
        <div class="chatbot">
            <header>
                <h2>Brain</h2>
            </header>
            <ul class="chatbox">
                <li class="chat incoming">
                    <p>Hi I'm Brain, I hope that you dont have one thats why im here</p>
                </li>
            </ul>
            <div class="chat-input">
                <textarea placeholder="Ask me something..." spellcheck="false" required></textarea>
                <span id="send-btn" class="send-icon">➤</span>
            </div>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatbot = document.querySelector(".chatbot");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");

    let userMessage = null;
    const inputInitHeight = chatInput.scrollHeight;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        chatLi.innerHTML = `<p></p>`;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    }

    const generateResponse = async (chatElement) => {
        const messageElement = chatElement.querySelector("p");

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userMessage }]
                }],
                system_instruction: {
                    parts: [{ text: "You are 'Brainy', a sarcastic and witty AI assistant for Tharukesh's portfolio website. You should be helpful but also make light jokes or witty remarks. Your first message is always 'Hi I'm Brainy, I hope that you dont have one thats why im here'. Keep responses concise (under 2 sentences). Tharukesh is an aspiring software developer studying B-Tech EEE at MVIT. He knows Java, C, and MySQL. Be roasting but answer the query." }]
                }
            })
        };

        try {
            const response = await fetch(API_URL, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                // If 404, it might mean gemini-1.5-flash isn't on v1beta for this key, so we try a fallback if needed.
                // But for now, let's just report the error clearly.
                throw new Error(data.error?.message || "API connection failed.");
            }

            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                const apiResponse = data.candidates[0].content.parts[0].text;
                messageElement.textContent = apiResponse;
            } else {
                throw new Error("No response from Brainy's void.");
            }
        } catch (error) {
            messageElement.classList.add("error");
            messageElement.textContent = `Error: ${error.message}. Please use 'Live Server' (VS Code) to run this site correctly. Local files (file://) often block AI chat.`;
            console.error("Brainy Error:", error);
        } finally {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    }

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            const incomingChatLi = createChatLi("Let me think...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    }

    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener("click", handleChat);
    chatbotToggler.addEventListener("click", () => {
        chatbot.classList.toggle("show");
        chatbotToggler.classList.toggle("active");
    });
});
