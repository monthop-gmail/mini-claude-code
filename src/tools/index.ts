import type { ToolDefinition } from '../types.js';
import { readFileTool } from './read.js';
import { writeFileTool } from './write.js';
import { editFileTool } from './edit.js';
import { bashTool } from './bash.js';
import { grepTool } from './grep.js';
import { subAgentTool } from './sub-agent.js';

// === Tool Definitions ===
// บอก Claude ว่ามี tools อะไรบ้าง ทำอะไรได้

export const toolDefinitions: ToolDefinition[] = [
  {
    name: 'read_file',
    description: 'Read a file and return its contents with line numbers',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Absolute or relative file path to read',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_file',
    description: 'Write content to a file (creates directories if needed)',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'File path to write to',
        },
        content: {
          type: 'string',
          description: 'Content to write',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'edit_file',
    description: 'Edit a file by replacing oldString with newString',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'File path to edit',
        },
        old_string: {
          type: 'string',
          description: 'Exact string to find and replace',
        },
        new_string: {
          type: 'string',
          description: 'Replacement string',
        },
      },
      required: ['path', 'old_string', 'new_string'],
    },
  },
  {
    name: 'bash',
    description: 'Execute a bash command and return the output',
    input_schema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Bash command to execute',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'grep',
    description: 'Search for a pattern in files recursively',
    input_schema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Search pattern (regex supported)',
        },
        path: {
          type: 'string',
          description: 'Directory to search in (default: current directory)',
        },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'sub_agent',
    description: 'Launch a sub-agent to handle a complex subtask. The sub-agent runs in a separate context and returns only the summary. Use this for tasks that require reading many files or doing extensive research, to save your own context.',
    input_schema: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'Detailed description of what the sub-agent should do and what to return',
        },
      },
      required: ['task'],
    },
  },
];

// === Tool Executor ===
// รัน tool จริง ตาม name ที่ Claude เลือก

export async function executeTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'read_file':
      return readFileTool(input.path as string);

    case 'write_file':
      return writeFileTool(input.path as string, input.content as string);

    case 'edit_file':
      return editFileTool(
        input.path as string,
        input.old_string as string,
        input.new_string as string
      );

    case 'bash':
      return bashTool(input.command as string);

    case 'grep':
      return grepTool(input.pattern as string, input.path as string | undefined);

    case 'sub_agent':
      return subAgentTool(input.task as string);

    default:
      return `Unknown tool: ${name}`;
  }
}
