# Mini Claude Code

A minimal AI coding agent built with TypeScript for **learning how Agent Loop works**.

## Architecture

```
User Input
  |
  v
Agent Loop (agent.ts)
  |
  +--> Call Claude API (llm.ts)
  |       |
  |       v
  |    Claude "thinks" and picks tools
  |       |
  |       v
  +--> Execute Tools (tools/)
  |       - read_file   : read a file with line numbers
  |       - write_file  : create/overwrite a file
  |       - edit_file   : find & replace in a file
  |       - bash        : run shell commands
  |       - grep        : search content in files
  |       |
  |       v
  +--> Feed results back to Claude
  |       |
  |       v
  +--> Loop until Claude stops calling tools
  |
  v
Final Answer --> User
```

## Quick Start

```bash
# 1. Clone
git clone https://github.com/monthop-gmail/mini-claude-code.git
cd mini-claude-code

# 2. Install
npm install

# 3. Set API key
export ANTHROPIC_API_KEY=sk-ant-xxxxx

# 4. Run
npm run dev
```

## Usage

```
> read the package.json and tell me what dependencies we have

  [Loop 1] Calling Claude...
  [Tool] read_file({"path":"package.json"})
  [Result] 1: { 2:   "name": "mini-claude-code"...

  [Loop 2] Calling Claude...

This project has the following dependencies:
- @anthropic-ai/sdk: Claude API client
...
```

## Project Structure

```
src/
  index.ts          # CLI entry point (readline)
  agent.ts          # Agent Loop - the core logic
  llm.ts            # Claude API client
  types.ts          # TypeScript type definitions
  tools/
    index.ts        # Tool registry & executor
    read.ts         # Read file tool
    write.ts        # Write file tool
    edit.ts         # Edit file tool
    bash.ts         # Bash command tool
    grep.ts         # Grep search tool
```

## Key Concepts

### Agent Loop (`agent.ts`)
The heart of the system. A `while` loop that:
1. Sends messages to Claude
2. Checks if Claude wants to use a tool
3. Executes the tool
4. Feeds results back to Claude
5. Repeats until Claude gives a final text answer

### Tool System (`tools/`)
Each tool has:
- **Definition**: JSON schema telling Claude what the tool does and its parameters
- **Executor**: Actual function that runs when Claude calls the tool

### LLM Client (`llm.ts`)
Thin wrapper around the Anthropic SDK. Sends conversation history + tool definitions to Claude.

## Learning Path

1. **Level 1**: Read `agent.ts` - understand the loop
2. **Level 2**: Add a new tool (e.g., `list_files`)
3. **Level 3**: Add streaming support
4. **Level 4**: Add CLAUDE.md memory system
5. **Level 5**: Add sub-agent (Task) support
6. **Level 6**: Add MCP protocol support

## License

MIT
