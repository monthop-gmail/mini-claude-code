import fs from 'fs/promises';
import path from 'path';

export async function editFileTool(
  filePath: string,
  oldString: string,
  newString: string
): Promise<string> {
  try {
    const resolved = path.resolve(filePath);
    const content = await fs.readFile(resolved, 'utf-8');

    // ต้องเจอ oldString ในไฟล์
    if (!content.includes(oldString)) {
      return `Error: oldString not found in ${resolved}`;
    }

    // เช็คว่าเจอกี่ที่
    const count = content.split(oldString).length - 1;
    if (count > 1) {
      return `Error: Found ${count} matches. Provide more context to make it unique.`;
    }

    // แทนที่
    const newContent = content.replace(oldString, newString);
    await fs.writeFile(resolved, newContent, 'utf-8');

    return `Successfully edited ${resolved}`;
  } catch (e: any) {
    return `Error editing file: ${e.message}`;
  }
}
