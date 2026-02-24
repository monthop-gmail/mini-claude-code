import fs from 'fs/promises';
import path from 'path';

export async function writeFileTool(
  filePath: string,
  content: string
): Promise<string> {
  try {
    const resolved = path.resolve(filePath);

    // สร้าง directory ถ้ายังไม่มี
    await fs.mkdir(path.dirname(resolved), { recursive: true });
    await fs.writeFile(resolved, content, 'utf-8');

    return `Successfully wrote to ${resolved}`;
  } catch (e: any) {
    return `Error writing file: ${e.message}`;
  }
}
