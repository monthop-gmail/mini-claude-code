import fs from 'fs/promises';
import path from 'path';

// === Skill Loader ===
//
// Skill = ไฟล์ .md ที่เก็บคำสั่งเฉพาะทาง
// เมื่อโหลดแล้ว จะถูก "ฉีด" เข้าไปใน system prompt
// ทำให้ Claude รู้วิธีทำงานเฉพาะทางนั้นๆ
//
// Flow:
//   1. อ่าน CLAUDE.md (ถ้ามี) → project-level skill
//   2. อ่าน skills/*.md → domain-specific skills
//   3. รวมทุกอย่าง → ต่อท้าย system prompt
//   4. Claude ได้รับ "ความรู้พิเศษ" ก่อนเริ่มคิด

export interface Skill {
  name: string;        // ชื่อ skill
  content: string;     // เนื้อหาทั้งหมด
  source: string;      // มาจากไฟล์ไหน
}

/**
 * โหลด CLAUDE.md จาก working directory
 * = ความจำระยะยาวของโปรเจกต์
 */
async function loadProjectMemory(): Promise<Skill | null> {
  const claudeMdPath = path.resolve('CLAUDE.md');

  try {
    const content = await fs.readFile(claudeMdPath, 'utf-8');
    console.log('  [Skill] Loaded CLAUDE.md (project memory)');
    return {
      name: 'Project Memory',
      content,
      source: claudeMdPath,
    };
  } catch {
    // ไม่มี CLAUDE.md ก็ไม่เป็นไร
    return null;
  }
}

/**
 * โหลด skill files ทั้งหมดจาก skills/ directory
 * แต่ละไฟล์ = ความรู้เฉพาะทาง 1 เรื่อง
 */
async function loadSkillFiles(): Promise<Skill[]> {
  const skillsDir = path.resolve('skills');
  const skills: Skill[] = [];

  try {
    const files = await fs.readdir(skillsDir);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    for (const file of mdFiles) {
      const filePath = path.join(skillsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const name = file.replace('.md', '');

      skills.push({ name, content, source: filePath });
      console.log(`  [Skill] Loaded: ${name}`);
    }
  } catch {
    // ไม่มี skills/ directory ก็ไม่เป็นไร
  }

  return skills;
}

/**
 * โหลดทุก skill แล้วรวมเป็น string เดียว
 * สำหรับต่อท้าย system prompt
 */
export async function loadAllSkills(): Promise<string> {
  const parts: string[] = [];

  // 1. โหลด CLAUDE.md (project memory)
  const memory = await loadProjectMemory();
  if (memory) {
    parts.push(`## Project Memory (CLAUDE.md)\n${memory.content}`);
  }

  // 2. โหลด skill files
  const skills = await loadSkillFiles();
  for (const skill of skills) {
    parts.push(`## Skill: ${skill.name}\n${skill.content}`);
  }

  if (parts.length === 0) {
    console.log('  [Skill] No skills loaded');
    return '';
  }

  // รวมทุกอย่างเป็น block เดียว
  return '\n\n# Loaded Skills & Context\n\n' + parts.join('\n\n---\n\n');
}
