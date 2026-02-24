import Anthropic from '@anthropic-ai/sdk';
import { toolDefinitions } from './tools/index.js';
import type { Message, ClaudeResponse, ContentBlock } from './types.js';

const client = new Anthropic();

// System prompt พื้นฐาน (ใช้เสมอ)
const BASE_SYSTEM_PROMPT = `คุณเป็น coding assistant ที่ช่วยผู้ใช้เขียนโค้ดและจัดการไฟล์
ใช้ tools ที่มีเพื่อช่วยผู้ใช้ คิดเป็นขั้นตอน
ตอบเป็นภาษาไทยเป็นหลัก ยกเว้น code/technical terms`;

/**
 * เรียก Claude API
 * @param messages - conversation history
 * @param skillContext - ข้อมูลจาก skills ที่โหลดมา (ต่อท้าย system prompt)
 *
 * Flow ของ system prompt:
 *   BASE_SYSTEM_PROMPT + skillContext → Claude ได้รับทั้งคู่
 *   = Claude รู้ทั้ง "วิธีทำงานทั่วไป" + "กฎเฉพาะของโปรเจกต์"
 */
export async function callClaude(
  messages: Message[],
  skillContext: string = ''
): Promise<ClaudeResponse> {
  // รวม base prompt + skills เข้าด้วยกัน
  const systemPrompt = BASE_SYSTEM_PROMPT + skillContext;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages as Anthropic.MessageParam[],
    tools: toolDefinitions as Anthropic.Tool[],
  });

  return {
    content: response.content as ContentBlock[],
    stop_reason: response.stop_reason as ClaudeResponse['stop_reason'],
  };
}
