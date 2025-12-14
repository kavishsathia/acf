<div align="center">
  <img src="logo.png" alt="Unsloppify Logo" width="200"/>

  # Unsloppify

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

  A reference implementation of the Agentic Contract Framework for building observable, verifiable AI coding agents.
</div>

## The Problem

AI coding agents fail silently. They generate code that passes tests, returns 200 OK, and ships to production - while violating design systems, ignoring architectural patterns, and hardcoding values that should use configuration.

Your monitoring shows green. Your codebase is degrading.

This project demonstrates a methodology for catching these silent failures before they compound into technical debt.

## The Framework

### Three Layers

**1. Contract**
Before writing code, the agent commits to specific implementation details:
```
CONTRACT:
- Use Card component from @design-system/core
- Use theme.spacing tokens for padding
- Import validation utilities from utils/validation
- Follow authentication pattern in auth/index.ts
```

**2. Verify**
A separate verifier agent checks the actual code against the contract:
```
VERIFICATION:
✓ Card component imported and used
✓ Theme tokens used (no hardcoded spacing)
✓ Validation utilities imported
✓ Auth pattern followed

RESULT: Contract verified. Compliance 100%
```

**3. Tighten**
When violations are caught, contract guidance becomes stricter:
```
Iteration 1: "Specify your approach"
→ Agent produces slop
→ Verifier catches violations

Iteration 2: "Must specify design system components"
→ Agent specifies components but hardcodes values
→ Verifier catches violations

Iteration 3: "Must specify components AND token usage"
→ Agent follows contract
→ No violations
```

The system learns its own vulnerability surface.

## This Project

This repository implements a coding agent that follows the Agentic Contract Framework. The codebase demonstrates:

- Contract-based agent architecture
- Verification logic using a smaller model
- Progressive tightening of specifications
- Observable agent behavior with audit trails

Explore the code to see how contracts are generated, verified, and tightened in response to violations.

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- Prisma for database modeling
- Supabase for backend
- Cloudflare Sandbox for agent execution

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys and database connection

# Run database migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

Visit http://localhost:3000 to see the landing page explaining the framework.

## Project Structure

```
/app              # Next.js pages and API routes
/components       # React components
  /ui            # Reusable UI components
/lib             # Core logic and utilities
/prisma          # Database schema
```

## Core Concepts

### Contract Generation

The agent analyzes the task and codebase, then generates a contract specifying:
- Which existing components/utilities will be used
- Which patterns will be followed
- Whether new code will be written or existing code modified

### Verification

A smaller model receives:
- The contract commitments
- The actual code output
- Access to the same tools the agent had

It verifies each commitment was fulfilled.

### Progressive Tightening

Each violation updates the contract guidance. The specification becomes more detailed over time, shifting detection from expensive auditing to cheap verification.

## When to Use This Pattern

Use contract-based verification when:
- Agents execute complex, multi-step tasks
- Silent failures are costly (production code, data operations)
- You need audit trails for compliance
- Agents have room to misinterpret intent or take shortcuts

Don't use it when:
- Tasks are simple and deterministic
- Failures are obvious
- The overhead outweighs the safety benefit

## Philosophy

Agents will try to game the system. By observing how they game it, we learn how to tighten the specification.

The goal isn't perfect agents. It's progressively less sloppy agents in a system that learns from its own failures.

Stop hoping. Start verifying.

## License

MIT

## Contributing

This project demonstrates a pattern, not a product. Fork it, adapt it, improve it. Open issues for architectural questions or PRs for improvements to the reference implementation.
