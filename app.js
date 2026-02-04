// Real Estate Script Practice Application
class RealEstatePracticeApp {
    constructor() {
        this.scenarios = [
            {
                id: 'fsbo',
                name: 'FSBO (For Sale By Owner)',
                description: 'Practice converting a homeowner selling on their own to list with you',
                prompt: 'You are a homeowner who has decided to sell your home yourself to save on commission. You are somewhat skeptical of real estate agents but open to conversation. Be realistic about objections like "I want to save money" and "I can do this myself".'
            },
            {
                id: 'expired',
                name: 'Expired Listing',
                description: 'Approach a homeowner whose listing recently expired',
                prompt: 'You are a frustrated homeowner whose listing just expired after 6 months on the market. You are disappointed with your previous agent and hesitant to list again. You have concerns about pricing, marketing, and whether any agent can actually sell your home.'
            },
            {
                id: 'circle',
                name: 'Circle Prospecting',
                description: 'Call neighbors about a recent sale or listing in their area',
                prompt: 'You are a homeowner who lives in the neighborhood. You have noticed real estate activity but are not actively thinking about selling. You are curious but cautious about sales calls. You may or may not be interested in a market update.'
            },
            {
                id: 'listing',
                name: 'Listing Presentation',
                description: 'Present your services to a potential seller',
                prompt: 'You are a homeowner interviewing agents to sell your home. You are comparing multiple agents and care about marketing strategy, commission rates, and recent sales in the area. You will ask tough questions and want to see what makes this agent different.'
            },
            {
                id: 'buyer',
                name: 'Buyer Consultation',
                description: 'Meet with a potential home buyer',
                prompt: 'You are a first-time homebuyer who is excited but nervous. You have questions about the process, pre-approval, what you can afford, and how to find the right home. You want an agent who will educate and guide you.'
            },
            {
                id: 'objection',
                name: 'Price Reduction Discussion',
                description: 'Convince a seller to reduce their price',
                prompt: 'You are a homeowner whose house has been on the market for 45 days with little activity. You are emotionally attached to your price and believe your home is worth it. You are resistant to reducing the price and may be defensive.'
            }
        ];

        this.selectedScenario = null;
        this.customScenarioDetails = '';
        this.conversationHistory = [];
        this.currentAudioElement = null;
        this.isProcessing = false;
        this.ratings = {
            confidence: 0,
            objections: 0,
            rapport: 0,
            overall: 0
        };


     
        // Speech recognition
        this.recognition = null;
        this.isRecording = false;

        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.renderScenarios();
        this.attachEventListeners();
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (this.currentTranscriptElement) {
                    this.currentTranscriptElement.textContent = 
                        (this.currentTranscriptFinal + finalTranscript + interimTranscript).trim() || 
                        'Listening...';
                }

                if (finalTranscript) {
                    this.currentTranscriptFinal += finalTranscript;
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopRecording();
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
        }
    }

    renderScenarios() {
        const grid = document.getElementById('scenarioGrid');
        grid.innerHTML = this.scenarios.map(scenario => `
            <div class="scenario-card" data-scenario="${scenario.id}">
                <h3>${scenario.name}</h3>
                <p>${scenario.description}</p>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Scenario selection
        document.getElementById('scenarioGrid').addEventListener('click', (e) => {
            const card = e.target.closest('.scenario-card');
            if (card) {
                document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedScenario = this.scenarios.find(s => s.id === card.dataset.scenario);
                this.updateStartButton();
            }
        });

        updateStartButton() {
            const btn = document.getElementById('startPracticeBtn');
            btn.disabled = !this.selectedScenario; // Only check for scenario
        }

        // Scenario recording
        document.getElementById('recordScenarioBtn').addEventListener('click', () => {
            this.startRecording('scenario');
        });

        document.getElementById('stopScenarioBtn').addEventListener('click', () => {
            this.stopRecording();
        });

        // Response recording
        document.getElementById('recordResponseBtn').addEventListener('click', () => {
            this.startRecording('response');
        });

        document.getElementById('stopResponseBtn').addEventListener('click', () => {
            this.stopRecording();
            this.handleUserResponse();
        });

        // Start practice
        document.getElementById('startPracticeBtn').addEventListener('click', () => {
            this.startPracticeSession();
        });

        // End session
        document.getElementById('endSessionBtn').addEventListener('click', () => {
            this.endSession();
        });

        // New session
        document.getElementById('newSessionBtn').addEventListener('click', () => {
            this.resetApp();
        });

        // Rating stars
        document.querySelectorAll('.stars').forEach(container => {
            container.addEventListener('click', (e) => {
                if (e.target.classList.contains('star')) {
                    const category = container.dataset.category;
                    const value = parseInt(e.target.dataset.value);
                    this.setRating(category, value);
                }
            });

            container.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('star')) {
                    const value = parseInt(e.target.dataset.value);
                    this.highlightStars(container, value);
                }
            });

            container.addEventListener('mouseout', () => {
                const category = container.dataset.category;
                this.highlightStars(container, this.ratings[category]);
            });
        });
    }

    updateStartButton() {
        const btn = document.getElementById('startPracticeBtn');
        btn.disabled = !(this.selectedScenario && this.elevenLabsKey && this.anthropicKey);
    }

    startRecording(type) {
        if (!this.recognition) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        this.isRecording = true;
        this.currentTranscriptFinal = '';

        if (type === 'scenario') {
            this.currentTranscriptElement = document.getElementById('scenarioTranscript');
            document.getElementById('recordScenarioBtn').style.display = 'none';
            document.getElementById('stopScenarioBtn').style.display = 'inline-block';
            document.getElementById('stopScenarioBtn').classList.add('recording');
        } else {
            this.currentTranscriptElement = null; // Will be set when adding message
            document.getElementById('recordResponseBtn').style.display = 'none';
            document.getElementById('stopResponseBtn').style.display = 'inline-block';
            document.getElementById('stopResponseBtn').classList.add('recording');
        }

        this.recognition.start();
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
            this.isRecording = false;

            // Update UI
            const scenarioBtn = document.getElementById('stopScenarioBtn');
            const responseBtn = document.getElementById('stopResponseBtn');

            if (scenarioBtn.style.display !== 'none') {
                scenarioBtn.style.display = 'none';
                scenarioBtn.classList.remove('recording');
                document.getElementById('recordScenarioBtn').style.display = 'inline-block';
                this.customScenarioDetails = this.currentTranscriptFinal.trim();
            }

            if (responseBtn.style.display !== 'none') {
                responseBtn.style.display = 'none';
                responseBtn.classList.remove('recording');
                document.getElementById('recordResponseBtn').style.display = 'inline-block';
            }
        }
    }

    async startPracticeSession() {
        // Hide setup, show practice
        document.querySelector('.setup-section').classList.remove('active');
        document.querySelector('.practice-section').classList.add('active');

        // Build character info
        const characterDiv = document.getElementById('characterInfo');
        characterDiv.innerHTML = `
            <h3>🎭 Practice Scenario: ${this.selectedScenario.name}</h3>
            <p>${this.selectedScenario.description}</p>
            ${this.customScenarioDetails ? `<p><strong>Custom Details:</strong> ${this.customScenarioDetails}</p>` : ''}
            <p><em>The AI will play the role of the prospect. Practice your script and handle their objections!</em></p>
        `;

        // Start conversation with AI greeting
        await this.getAIResponse(true);
    }

    async getAIResponse(isFirst = false) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            // Validate API key
            if (!this.anthropicKey || this.anthropicKey.length < 20) {
                throw new Error('Invalid Anthropic API key. Please check your key.');
            }

            // Build conversation context
            let systemPrompt = `You are role-playing as a prospect in a real estate scenario: ${this.selectedScenario.name}.

${this.selectedScenario.prompt}

${this.customScenarioDetails ? `Additional context: ${this.customScenarioDetails}` : ''}

Important guidelines:
- Stay in character throughout the conversation
- Be realistic - include common objections and concerns
- Don't make it too easy, but also don't be unreasonably difficult
- Respond naturally as the character would
- Keep responses conversational and relatively brief (2-4 sentences typically)
- ${isFirst ? 'Start the conversation as this character would naturally begin (e.g., answering the phone, greeting the agent, etc.)' : 'Continue the conversation based on what the agent just said'}
- Show personality and emotion appropriate to the scenario
- If the agent handles things well, you can gradually become more receptive
- End responses naturally without always asking questions`;

            const messages = [];
            
            // Add conversation history
            this.conversationHistory.forEach(msg => {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            });

            // Call proxy server instead of Anthropic directly
            const response = await fetch('/api/anthropic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
//                    apiKey: this.anthropicKey,
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1024,
                    system: systemPrompt,
                    messages: messages.length > 0 ? messages : [
                        { role: 'user', content: 'Begin the conversation.' }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
                throw new Error(`Anthropic API error: ${errorMsg}`);
            }

            const data = await response.json();
            const aiMessage = data.content[0].text;

            // Add to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: aiMessage
            });

            // Display message
            this.addMessage(aiMessage, 'ai');

            // Convert to speech with ElevenLabs
            await this.speakText(aiMessage);

        } catch (error) {
            console.error('Error getting AI response:', error);
            
            let errorMessage = error.message;
            if (error.message === 'Failed to fetch') {
                errorMessage = 'Cannot connect to server. Make sure you started the server with "npm start"';
            }
            
            this.addMessage(`❌ Error: ${errorMessage}`, 'ai');
        } finally {
            this.isProcessing = false;
        }
    }

    async speakText(text) {
        try {
            // Get available voices using proxy
            const voicesResponse = await fetch('/api/elevenlabs/voices', {
                headers: {
                    'x-api-key': this.elevenLabsKey
                }
            });

            if (!voicesResponse.ok) {
                throw new Error('Failed to fetch voices');
            }

            const voicesData = await voicesResponse.json();
            
            // Select a random voice
            const randomVoice = voicesData.voices[Math.floor(Math.random() * voicesData.voices.length)];

            // Generate speech using proxy
            const response = await fetch(`/api/elevenlabs/tts/${randomVoice.voice_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.elevenLabsKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_turbo_v2_5',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.status}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Play audio
            if (this.currentAudioElement) {
                this.currentAudioElement.pause();
            }

            this.currentAudioElement = new Audio(audioUrl);
            await this.currentAudioElement.play();

        } catch (error) {
            console.error('Error with text-to-speech:', error);
            // Continue without audio
        }
    }

    async handleUserResponse() {
        const userMessage = this.currentTranscriptFinal.trim();
        
        if (!userMessage) {
            alert('No speech detected. Please try again.');
            return;
        }

        // Add user message to conversation
        this.addMessage(userMessage, 'user');
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Reset transcript
        this.currentTranscriptFinal = '';

        // Get AI response
        await this.getAIResponse(false);
    }

    addMessage(text, sender) {
        const conversationArea = document.getElementById('conversationArea');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const speakerLabel = sender === 'user' ? 'You (Agent)' : 'Prospect';
        messageDiv.innerHTML = `
            <div class="speaker">${speakerLabel}</div>
            <div>${text}</div>
        `;

        conversationArea.appendChild(messageDiv);
        conversationArea.scrollTop = conversationArea.scrollHeight;
    }

    async endSession() {
        // Stop any ongoing audio
        if (this.currentAudioElement) {
            this.currentAudioElement.pause();
        }

        // Switch to results section
        document.querySelector('.practice-section').classList.remove('active');
        document.querySelector('.results-section').classList.add('active');

        // Get AI feedback
        await this.generateAIFeedback();
    }

    async generateAIFeedback() {
        try {
            const conversationText = this.conversationHistory
                .map(msg => `${msg.role === 'user' ? 'Agent' : 'Prospect'}: ${msg.content}`)
                .join('\n\n');

            const response = await fetch('/api/anthropic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //apiKey: this.anthropicKey,
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 2048,
                    messages: [{
                        role: 'user',
                        content: `Please analyze this real estate practice conversation for a ${this.selectedScenario.name} scenario and provide constructive feedback.

Conversation:
${conversationText}

Provide feedback in the following format:

**Strengths:**
- [List 2-3 things the agent did well]

**Areas for Improvement:**
- [List 2-3 specific areas to work on]

**Key Suggestions:**
- [Provide 2-3 actionable recommendations]

**Overall Assessment:**
[Brief summary of performance]

Be specific, constructive, and encouraging. Focus on real estate best practices.`
                    }]
                })
            });

            const data = await response.json();
            const feedback = data.content[0].text;

            document.getElementById('aiFeedback').innerHTML = 
                `<div style="text-align: left; white-space: pre-wrap;">${feedback}</div>`;

        } catch (error) {
            console.error('Error generating feedback:', error);
            document.getElementById('aiFeedback').innerHTML = 
                `<p>Unable to generate AI feedback. Please review the conversation manually.</p>`;
        }
    }

    setRating(category, value) {
        this.ratings[category] = value;
        const container = document.querySelector(`.stars[data-category="${category}"]`);
        this.highlightStars(container, value);
        this.calculateScore();
    }

    highlightStars(container, value) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    calculateScore() {
        const total = Object.values(this.ratings).reduce((sum, val) => sum + val, 0);
        const average = total / Object.keys(this.ratings).length;

        if (average > 0) {
            const scoreSummary = document.getElementById('scoreSummary');
            const percentage = (average / 5 * 100).toFixed(0);
            
            let message = '';
            if (percentage >= 90) message = 'Excellent! 🌟';
            else if (percentage >= 75) message = 'Great work! 👍';
            else if (percentage >= 60) message = 'Good effort! 💪';
            else message = 'Keep practicing! 📈';

            scoreSummary.innerHTML = `
                <h3>${percentage}%</h3>
                <p>${message}</p>
                <p>Average Rating: ${average.toFixed(1)} / 5.0 stars</p>
            `;
            scoreSummary.style.display = 'block';
        }
    }

    resetApp() {
        // Reset all state
        this.selectedScenario = null;
        this.customScenarioDetails = '';
        this.conversationHistory = [];
        this.currentTranscriptFinal = '';
        this.ratings = {
            confidence: 0,
            objections: 0,
            rapport: 0,
            overall: 0
        };

        // Reset UI
        document.querySelector('.results-section').classList.remove('active');
        document.querySelector('.setup-section').classList.add('active');
        
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.getElementById('scenarioTranscript').textContent = 
            'Your custom scenario details will appear here...';
        document.getElementById('conversationArea').innerHTML = '';
        document.getElementById('personalNotes').value = '';
        document.getElementById('scoreSummary').style.display = 'none';
        
        // Reset stars
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('filled');
        });

        // Stop any audio
        if (this.currentAudioElement) {
            this.currentAudioElement.pause();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RealEstatePracticeApp();
});
