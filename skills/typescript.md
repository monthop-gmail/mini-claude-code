# TypeScript Conventions

When writing TypeScript code, follow these rules:

- Use `type` for simple types, `interface` for objects that may be extended
- Always use explicit return types on exported functions
- Prefer `const` over `let`, never use `var`
- Use template literals instead of string concatenation
- Handle errors with try/catch, never ignore errors silently
- Use `async/await` instead of `.then()` chains
