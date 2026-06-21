# Raw Notes: The Anatomy of Agentic Coding

These are rough notes for building a 5-slide educational presentation about how AI coding agents work.

## Topic Overview
Traditional autocomplete AI models (like basic Copilot) suggest code line-by-line. Agentic coding models (like Antigravity or Claude Code) are actual agents that operate in a feedback loop.

## Core Concepts
1. **The Prompt Loop (Read-Evaluate-Print-Loop equivalent for agents)**:
   - The agent takes user input, reads codebase context, creates a plan, calls tools, observes outputs, and loops until the task is complete.
2. **Tool Usage (Orchestration)**:
   - Agents aren't just LLMs; they have tools: `read_file`, `write_to_file`, `run_command`, `grep_search`, etc.
   - Using tools allows the agent to edit files, run test suites, and compile code.
3. **Human-in-the-loop (HITL)**:
   - For high-stakes decisions (like running commands or writing to files), the agent requests approval or asks clarifying questions.
   - Balance autonomous execution with safe gates.
4. **The Future (Multi-Agent Systems)**:
   - Splitting tasks between specialists (research subagents, database debuggers, code reviewers).

## Reference Stats (SWE-bench)
- Standard LLMs solve less than 5% of SWE-bench Lite issues directly without tools.
- Modern agentic loops solve 30%+ of issues by iteratively editing, testing, and debugging.
