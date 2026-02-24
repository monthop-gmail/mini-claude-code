// === Message Types ===

export interface TextBlock {
  type: 'text';
  text: string;
}

export interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
}

export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

export interface Message {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

// === Tool Types ===

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export type ToolExecutor = (input: Record<string, unknown>) => Promise<string>;

// === Claude API Response ===

export interface ClaudeResponse {
  content: ContentBlock[];
  stop_reason: 'end_turn' | 'tool_use' | 'max_tokens';
}
