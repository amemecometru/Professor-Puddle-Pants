const axios = require('axios');
const { spawn } = require('child_process');

// 1. Vibe-Check with Llama 3.2 1B
async function vibeCheck(command) {
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "llama3.2:1b",
            prompt: `Audit this intent for risk (HIGH/MEDIUM/LOW): "${command}". If it writes files or runs shell, it is MEDIUM.`,
            stream: false
        });
        return response.data.response.includes("MEDIUM") || response.data.response.includes("HIGH") ? "SANDBOX" : "NATIVE";
    } catch (err) {
        console.error("Ollama connection failed. Ensure 'ollama serve' is running.");
        return "SANDBOX"; // Default to safety
    }
}

// 2. The Watcher: Monitor Vite Dev Server
function startViteWatcher() {
    console.log("🚀 Starting Vite Watcher...");
    const vite = spawn('npx', ['vite'], { cwd: './agent-zero/work_dir' });
    
    vite.on('exit', () => {
        console.log("⚠️ Vite crashed. Auto-restarting for 'Unnoticeable' experience...");
        setTimeout(startViteWatcher, 500);
    });
}

console.log("✅ Harmony Bridge Active - Standing on Business.");
