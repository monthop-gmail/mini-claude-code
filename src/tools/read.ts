import fs from 'fs/promises';
import path from 'path';

export async function readFileTool(filePath: string): Promise<string> {
  try {
    const resolved = path.resolve(filePath);
    const content = await fs.readFile(resolved, 'utf-8');

    // เพิ่ม line numbers เหมือน Claude Code จริง
    const lines = content.split('\n');
    const numbered = lines
      .map((line, i) => `${i + 1}: ${line}`)
      .join('\n');

    return numbered;
  } catch (e: any) {
    return `Error reading file: ${e.message}`;
  }
}
