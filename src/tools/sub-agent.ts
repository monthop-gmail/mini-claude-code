// === Sub-agent Tool ===
//
// Sub-agent = เรียก agentLoop อีกรอบ แต่แยก context ใหม่
//
// ทำไมต้องแยก?
//   Parent context: "ผู้ใช้ถาม X" + tool results ทั้งหมด → เต็มเร็ว
//   Sub-agent:      ทำงานใน context ใหม่ → ส่งแค่ "สรุป" กลับมา
//
// เปรียบเทียบ:
//   Parent = หัวหน้า สั่งงาน
//   Sub-agent = ลูกน้อง ไปทำแล้วกลับมารายงาน 2 บรรทัด
//
// ภาพ:
//   Parent context: [.......ข้อมูลเยอะ........]
//     |
//     +--> sub-agent("สำรวจโครงสร้าง codebase")
//     |      |
//     |      +--> [context ใหม่: อ่าน 20 ไฟล์, grep 5 ครั้ง]
//     |      +--> สรุป: "เป็น Next.js, มี 3 modules"
//     |      +--> context ถูกทิ้ง (ไม่กลับมาที่ parent)
//     |
//     +--> parent ได้แค่: "เป็น Next.js, มี 3 modules" (~50 tokens)
//          แทนที่จะเก็บข้อมูลดิบ 20 ไฟล์ (~10,000 tokens)

// ใช้ dynamic import เพื่อหลีกเลี่ยง circular dependency
// (agent.ts import tools → tools import agent.ts)
export async function subAgentTool(task: string): Promise<string> {
  // โหลด agentLoop แบบ dynamic
  const { agentLoop } = await import('../agent.js');

  console.log(`\n  [Sub-agent] Starting: "${task.substring(0, 60)}..."`);
  console.log(`  [Sub-agent] (new context created)`);

  try {
    // เรียก agentLoop ใหม่ = context ใหม่ทั้งหมด
    const result = await agentLoop(task);

    console.log(`  [Sub-agent] Done. Result: ${result.length} chars`);
    console.log(`  [Sub-agent] (context discarded)\n`);

    // ส่งแค่คำตอบสรุปกลับ parent
    return result;
  } catch (e: any) {
    return `Sub-agent error: ${e.message}`;
  }
}
