# 🏠 Real Estate Script Practice Tool

A professional training application for real estate agents to practice their sales scripts with AI-powered role-play scenarios.

## ✨ Features

### Core Functionality
- **6 Pre-built Practice Scenarios:**
  - FSBO (For Sale By Owner)
  - Expired Listing
  - Circle Prospecting
  - Listing Presentation
  - Buyer Consultation
  - Price Reduction Discussion

- **Voice-Powered Interaction:**
  - Speech-to-text for your responses
  - Text-to-speech for AI prospect responses
  - Random voice selection from ElevenLabs for varied practice

- **AI-Powered Conversations:**
  - Realistic prospect responses using Claude AI
  - Dynamic objection handling
  - Contextual conversation flow

- **Performance Feedback:**
  - Self-assessment rating system
  - AI-generated constructive feedback
  - Performance scoring

## 🚀 Getting Started

### Prerequisites
1. **Web Browser:** Chrome or Edge (for speech recognition support)
2. **API Keys:**
   - **ElevenLabs API Key:** Sign up at [elevenlabs.io](https://elevenlabs.io)
   - **Anthropic API Key:** Sign up at [console.anthropic.com](https://console.anthropic.com)

### Installation

**Prerequisites:**
- Node.js installed (Download from https://nodejs.org - get the LTS version)
- Chrome or Edge browser (for speech recognition)

**Setup Steps:**

1. **Extract the Files:**
   - Unzip `real-estate-practice-tool.zip` to a folder

2. **Install Dependencies:**
   ```bash
   cd path/to/your/folder
   npm install
   ```
   This installs Express, CORS, and other required packages.

3. **Start the Server:**
   ```bash
   npm start
   ```
   You should see:
   ```
   ╔════════════════════════════════════════════════╗
   ║  🏠 Real Estate Practice Tool Server Running  ║
   ║  ✅ Server: http://localhost:3000              ║
   ╚════════════════════════════════════════════════╝
   ```

4. **Open in Browser:**
   - Go to http://localhost:3000
   - The app will load automatically

5. **Get API Keys:**
   - **Anthropic:** https://console.anthropic.com ($5 free credits!)
   - **ElevenLabs:** https://elevenlabs.io

6. **Enter Keys & Practice:**
   - Enter both API keys in the app
   - Select a scenario and start practicing!

**To Stop the Server:**
- Press `Ctrl+C` in the terminal

### Usage

1. **Select a Scenario:**
   - Click on one of the 6 practice scenarios

2. **Add Custom Details (Optional):**
   - Click "Start Recording" to add specific scenario details
   - Example: "The homeowner is in their 60s, downsizing, needs to close quickly"
   - Click "Stop Recording" when finished

3. **Start Practice:**
   - Click "Start Practice Session"
   - The AI will initiate the conversation as the prospect
   - You'll hear the AI's response via text-to-speech

4. **Respond:**
   - Click "Start Talking" when ready to respond
   - Speak your response clearly
   - Click "Done Talking" when finished
   - The AI will respond based on your input

5. **End Session:**
   - Click "End Session & Get Feedback" when ready
   - Rate your performance in 4 categories
   - Review AI-generated feedback
   - Add personal notes

6. **Start Over:**
   - Click "Start New Practice Session" to practice again

## 🎯 Best Practices

### For Effective Practice:
1. **Treat it like a real call** - Use your actual scripts and approach
2. **Practice regularly** - Consistency improves performance
3. **Review feedback** - Pay attention to AI suggestions
4. **Try different scenarios** - Build versatility
5. **Record notes** - Track your progress and learnings

### Voice Recognition Tips:
- Speak clearly and at a normal pace
- Use a quiet environment
- Allow microphone access when prompted
- Wait for the AI to finish speaking before responding

## 🔧 Technical Details

### Technologies Used:
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js + Express (proxy server to handle CORS)
- **Speech Recognition:** Web Speech API (Chrome/Edge)
- **AI Conversation:** Anthropic Claude API
- **Text-to-Speech:** ElevenLabs API

### Architecture:
```
Browser (localhost:3000)
    ↓
Node.js Express Server (proxy)
    ↓
External APIs (Anthropic + ElevenLabs)
```

**Why the proxy server?**
Anthropic and ElevenLabs APIs don't allow direct browser calls due to CORS security restrictions. The Node.js server acts as a middleman.

### Files:
- `real-estate-practice.html` - Frontend UI
- `app.js` - Frontend JavaScript logic
- `server.js` - Node.js proxy server
- `package.json` - Node.js dependencies
- `README.md` - This file

### Browser Compatibility:
- ✅ Chrome (recommended)
- ✅ Edge
- ❌ Firefox (speech recognition not supported)
- ❌ Safari (speech recognition not supported)

### API Usage:
- **Anthropic API:** ~1,000-2,000 tokens per conversation turn
- **ElevenLabs API:** One speech generation per AI response
- Both APIs charge based on usage - monitor your account

## 💡 Additional Suggestions & Enhancements

### Suggested Future Features:

1. **Session Recording & Playback:**
   - Save conversation transcripts
   - Export to PDF for review
   - Audio recording of full sessions

2. **Advanced Analytics:**
   - Track performance over time
   - Identify trending weaknesses
   - Compare scenarios

3. **Custom Scenarios:**
   - Build your own role-play scenarios
   - Share scenarios with team members
   - Import/export scenario templates

4. **Team Features:**
   - Manager review of agent sessions
   - Team leaderboards
   - Shared best practices library

5. **Integration Options:**
   - CRM integration for real prospect data
   - Calendar scheduling for practice sessions
   - Mobile app version

6. **Enhanced Feedback:**
   - Video recording for body language analysis
   - Tone analysis (confidence, urgency, empathy)
   - Comparison to top performers

7. **Gamification:**
   - Achievement badges
   - Practice streaks
   - Challenges and competitions

8. **Training Content:**
   - Video tutorials on each scenario
   - Script libraries
   - Objection handling guides

## 🛠️ Customization

### Adding New Scenarios:
Edit the `scenarios` array in `app.js`:

```javascript
{
    id: 'your-scenario-id',
    name: 'Your Scenario Name',
    description: 'Brief description for the UI',
    prompt: 'Detailed instructions for the AI on how to play this role...'
}
```

### Adjusting AI Behavior:
Modify the `systemPrompt` in the `getAIResponse()` method to change:
- Difficulty level
- Objection types
- Response length
- Personality traits

### Styling:
All styles are in the `<style>` section of the HTML file. Customize:
- Colors (gradient backgrounds)
- Fonts
- Layout
- Button styles

## 🐛 Troubleshooting

### "Cannot connect to server" Error ⚠️
**Problem:** The Node.js server isn't running
**Solution:** 
1. Open terminal/command prompt
2. Navigate to the project folder: `cd path/to/folder`
3. Run: `npm start`
4. Look for the success message with the server URL
5. Go to http://localhost:3000 in your browser

### "npm: command not found" Error
**Problem:** Node.js is not installed
**Solution:** 
1. Download Node.js from https://nodejs.org (LTS version)
2. Install it
3. Restart your terminal/command prompt
4. Run `npm install` then `npm start`

### "Failed to fetch" or Network Errors
**Solutions:**
- Make sure the server is running (you should see the server message in terminal)
- Check that you're accessing http://localhost:3000 (not file://)
- Try restarting the server (Ctrl+C, then `npm start` again)

### "Speech recognition not supported"
**Solution:** Use Chrome or Edge browser (Firefox/Safari don't support it)

### API Key Errors
**Solutions:**
- Verify your API keys are correct (copy-paste carefully)
- Anthropic keys start with "sk-ant-"
- Check you have credits remaining in your API accounts
- No extra spaces before/after the key

### Voice/Microphone Issues
**Solutions:**
- Allow microphone permission when prompted
- Check microphone isn't muted
- Test microphone in browser settings
- Try a different microphone

### Port 3000 Already in Use
**Solution:** 
- Another app is using port 3000
- Either stop that app, or edit `server.js` and change `PORT = 3000` to `PORT = 3001`

## 📝 License

This is a training tool. Modify and use as needed for your real estate team.

## 🤝 Support

For questions or issues:
- Review the code comments
- Check browser console for errors
- Verify API keys and credits

---

**Built for Real Estate Professionals** | Practice Makes Perfect! 🏡
