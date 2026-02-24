import { execSync } from 'child_process';

// คำสั่งอันตรายที่ห้ามรัน
const BLOCKED_COMMANDS = ['rm -rf /', 'mkfs', 'dd if=', ':(){:|:&};:'];

export async function bashTool(command: string): Promise<string> {
  // Safety check
  for (const blocked of BLOCKED_COMMANDS) {
    if (command.includes(blocked)) {
      return `Blocked: "${command}" is not allowed for safety reasons`;
    }
  }

  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      timeout: 30_000, // 30 seconds timeout
      maxBuffer: 1024 * 1024, // 1MB max output
    });

    return output || '(command completed with no output)';
  } catch (e: any) {
    // รวม stderr ด้วย เพื่อให้ Claude เห็น error
    const stderr = e.stderr || '';
    const stdout = e.stdout || '';
    return `Exit code: ${e.status}\nstdout: ${stdout}\nstderr: ${stderr}`;
  }
}
