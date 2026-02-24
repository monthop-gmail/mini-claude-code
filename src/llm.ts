import Anthropic from '@anthropic-ai/sdk';
import { toolDefinitions } from './tools/index.js';
import type { Message, ClaudeResponse, ContentBlock } from './types.js';

const client = new Anthropic();

const SYSTEM_PROMPT = `คุณเป็น coding assistant ที่ช่วยผู้ใช้เขียนโค้ดและจัดการไฟล์
ใช้ tools ที่มีเพื่อช่วยผู้ใช้ คิดเป็นขั้นตอน
ตอบเป็นภาษาไทยเป็นหลัก ยกเว้น code/technical terms`;

export async function callClaude(messages: Message[]): Promise<ClaudeResponse> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: messages as Anthropic.MessageParam[],
    tools: toolDefinitions as Anthropic.Tool[],
  });

  return {
    content: response.content as ContentBlock[],
    stop_reason: response.stop_reason as ClaudeResponse['stop_reason'],
  };
}
