============================================
  CALL ANALYSIS TOOL — Setup Instructions
============================================

REQUIREMENTS: Node.js installed on your computer
Download Node.js from: https://nodejs.org (LTS version)

--------------------------------------------
FIRST TIME SETUP (only once):
--------------------------------------------

1. Open Terminal / Command Prompt
2. Go to this folder:
      cd path/to/call-analysis-tool

3. Install dependencies:
      npm install

--------------------------------------------
EVERY TIME YOU WANT TO USE THE TOOL:
--------------------------------------------

1. Open Terminal / Command Prompt
2. Go to this folder:
      cd path/to/call-analysis-tool

3. Start the server:
      npm start

4. Open your browser and go to:
      http://localhost:3000

5. To stop: press Ctrl+C in the terminal

--------------------------------------------
API KEYS NEEDED:
--------------------------------------------

AssemblyAI (for transcription):
  - Free account at: https://assemblyai.com
  - ~100 hours free per month
  - Copy your API key from the dashboard

Anthropic Claude (for analysis):
  - Get key from: https://console.anthropic.com
  - Pay-per-use (~$0.01-0.03 per call analysis)

============================================
