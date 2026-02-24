import { execSync } from 'child_process';

export async function grepTool(
  pattern: string,
  searchPath: string = '.'
): Promise<string> {
  try {
    // ใช้ grep -rn เพื่อค้นหา recursive + แสดง line number
    const output = execSync(
      `grep -rn --include="*.*" "${pattern}" "${searchPath}" | head -50`,
      {
        encoding: 'utf-8',
        timeout: 10_000,
      }
    );

    return output || `No matches found for "${pattern}"`;
  } catch (e: any) {
    if (e.status === 1) {
      return `No matches found for "${pattern}"`;
    }
    return `Error: ${e.message}`;
  }
}
