import * as readline from 'readline';
import { agentLoop } from './agent.js';

// === Mini Claude Code CLI ===

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('');
console.log('  Mini Claude Code v0.1.0');
console.log('  -----------------------');
console.log('  A minimal AI coding agent for learning');
console.log('  Type "exit" to quit');
console.log('');

// เก็บ conversation context (ง่ายๆ ยังไม่ persist)
let isRunning = false;

function prompt() {
  rl.question('> ', async (input) => {
    const trimmed = input.trim();

    // exit
    if (trimmed === 'exit' || trimmed === 'quit') {
      console.log('\nBye!\n');
      rl.close();
      process.exit(0);
    }

    // ข้ามถ้าว่าง
    if (!trimmed) {
      prompt();
      return;
    }

    // ป้องกัน concurrent runs
    if (isRunning) {
      console.log('  (Still processing previous request...)');
      prompt();
      return;
    }

    isRunning = true;

    try {
      // เข้า Agent Loop
      const result = await agentLoop(trimmed);
      console.log(`\n${result}\n`);
    } catch (e: any) {
      console.error(`\n  Error: ${e.message}\n`);

      // แสดง hint ถ้าเป็น API key error
      if (e.message.includes('API') || e.message.includes('auth')) {
        console.log('  Hint: export ANTHROPIC_API_KEY=sk-ant-xxxxx\n');
      }
    }

    isRunning = false;
    prompt();
  });
}

// Check API key on startup
if (!process.env.ANTHROPIC_API_KEY) {
  console.log('  WARNING: ANTHROPIC_API_KEY not set!');
  console.log('  Run: export ANTHROPIC_API_KEY=sk-ant-xxxxx');
  console.log('');
}

prompt();
