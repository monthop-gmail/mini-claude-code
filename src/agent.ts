import { callClaude } from './llm.js';
import { executeTool } from './tools/index.js';
import { loadAllSkills } from './skills/loader.js';
import type { Message, ContentBlock, ToolUseBlock, TextBlock } from './types.js';

const MAX_ITERATIONS = 20; // ป้องกัน infinite loop

export async function agentLoop(userMessage: string): Promise<string> {
  // === Step 0: โหลด Skills ===
  // อ่าน CLAUDE.md + skills/*.md แล้วรวมเป็น string
  // จะถูก "ฉีด" เข้า system prompt ให้ Claude รู้กฎเฉพาะทาง
  const skillContext = await loadAllSkills();

  // Conversation history - เก็บบทสนทนาทั้งหมด
  const messages: Message[] = [
    { role: 'user', content: userMessage },
  ];

  let iteration = 0;

  // === Agent Loop ===
  // วนจนกว่า Claude จะหยุดเรียก tool (= คิดเสร็จ)
  while (iteration < MAX_ITERATIONS) {
    iteration++;
    console.log(`\n  [Loop ${iteration}] Calling Claude...`);

    // 1. ส่งให้ Claude "คิด" (พร้อม skill context)
    const response = await callClaude(messages, skillContext);

    // 2. เก็บ response เข้า conversation history
    messages.push({ role: 'assistant', content: response.content });

    // 3. แยก text blocks กับ tool_use blocks
    const textBlocks = response.content.filter(
      (block): block is TextBlock => block.type === 'text'
    );
    const toolUseBlocks = response.content.filter(
      (block): block is ToolUseBlock => block.type === 'tool_use'
    );

    // แสดง text ที่ Claude พูด (ถ้ามี)
    for (const block of textBlocks) {
      if (block.text.trim()) {
        console.log(`  [Claude] ${block.text.substring(0, 100)}...`);
      }
    }

    // 4. ถ้า stop_reason ไม่ใช่ tool_use = จบ loop
    if (response.stop_reason !== 'tool_use' || toolUseBlocks.length === 0) {
      // รวม text ทั้งหมดเป็นคำตอบ
      return textBlocks.map((b) => b.text).join('\n');
    }

    // 5. รัน tools ที่ Claude เลือก
    const toolResults: ContentBlock[] = [];

    for (const toolUse of toolUseBlocks) {
      console.log(`  [Tool] ${toolUse.name}(${JSON.stringify(toolUse.input).substring(0, 80)})`);

      const result = await executeTool(
        toolUse.name,
        toolUse.input as Record<string, unknown>
      );

      // แสดง preview ของ result
      console.log(`  [Result] ${result.substring(0, 100)}${result.length > 100 ? '...' : ''}`);

      toolResults.push({
        type: 'tool_result' as const,
        tool_use_id: toolUse.id,
        content: result,
      });
    }

    // 6. ส่งผลลัพธ์ tool กลับเข้า conversation → วนลูปใหม่
    messages.push({ role: 'user', content: toolResults });

    // Claude จะเห็นผลลัพธ์ → คิดต่อ → เลือกใช้ tool อีก หรือ ตอบกลับ
  }

  return '(Reached maximum iterations. Please try a simpler request.)';
}
