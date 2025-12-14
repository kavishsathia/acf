# Development Guidelines

This document outlines code quality standards and architectural patterns for this project. Follow these guidelines when contributing code or reviewing changes.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS v4
- Prisma (Database ORM)
- Supabase (Backend)
- Cloudflare Sandbox (Compute)
- Framer Motion (Animations)

## Project Structure

```
/app                 # Next.js App Router pages and layouts
/components          # React components
  /ui               # Reusable UI primitives
/lib                # Utility functions and shared logic
/prisma             # Database schema and migrations
```

## Code Quality Standards

### TypeScript

- Use explicit types for function parameters and return values
- Avoid `any`. Use `unknown` if type is truly dynamic
- Define interfaces for component props
- Use type inference for obvious cases (variable assignments)

```typescript
// Good
interface UserCardProps {
  name: string;
  email: string;
  onUpdate: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ name, email, onUpdate }) => {
  // Implementation
};

// Bad
export const UserCard = (props: any) => {
  // Implementation
};
```

### Component Patterns

- One component per file
- Co-locate component-specific utilities in the same file
- Export component as named export, not default
- Keep components under 150 lines. Extract sub-components if exceeding this

```typescript
// Good structure
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <motion.div className="border border-swiss-black p-6">
      <h3 className="font-display text-2xl">{title}</h3>
      {children}
    </motion.div>
  );
};
```

### Styling

- Use Tailwind utility classes
- Reference theme colors via CSS variables: `swiss-bg`, `swiss-black`, `swiss-red`, `swiss-blue`, `swiss-gray`
- Use theme fonts: `font-sans` (Inter), `font-mono` (JetBrains Mono), `font-display` (Oswald)
- No inline styles or style objects except for dynamic values
- Group related utilities: layout, then spacing, then colors, then typography

```typescript
// Good
<div className="flex items-center gap-4 p-6 bg-swiss-bg border border-swiss-black font-sans">

// Bad - inline styles for static values
<div style={{ padding: '24px', background: '#F4F4F0' }}>
```

### State Management

- Use React state for component-local state
- Lift state only when multiple components need it
- Keep state as close to where it's used as possible
- Use `useEffect` sparingly. Prefer derived state

```typescript
// Good - derived state
const isValid = email.includes('@') && password.length >= 8;

// Bad - unnecessary effect
const [isValid, setIsValid] = useState(false);
useEffect(() => {
  setIsValid(email.includes('@') && password.length >= 8);
}, [email, password]);
```

### Database (Prisma)

- Define clear, normalized schemas
- Use descriptive model and field names
- Include created/updated timestamps on all models
- Use enums for fixed sets of values
- Add indexes for frequently queried fields

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole @default(MEMBER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

enum UserRole {
  ADMIN
  MEMBER
}
```

### API Routes

- Validate input before processing
- Return consistent error formats
- Use appropriate HTTP status codes
- Handle errors explicitly

```typescript
// Good
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.name) {
      return Response.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({ data: body });
    return Response.json({ user }, { status: 201 });

  } catch (error) {
    console.error('User creation failed:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### File Organization

- Group imports: React, third-party, local components, utilities
- Order exports: types first, then component
- Separate concerns: data fetching, business logic, presentation

```typescript
// Import order
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { validateEmail } from '@/lib/validators';
```

### Naming Conventions

- Components: PascalCase (`UserCard`, `SectionHeader`)
- Utilities: camelCase (`validateEmail`, `formatDate`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_URL`)
- Files: Match export name (`UserCard.tsx`, `validators.ts`)
- CSS classes: kebab-case for custom classes, Tailwind utilities as-is

### Error Handling

- Handle errors at the appropriate level
- Provide actionable error messages
- Log errors with sufficient context
- Don't suppress errors silently

```typescript
// Good
try {
  const data = await fetchUser(id);
  return data;
} catch (error) {
  console.error('Failed to fetch user:', { id, error });
  throw new Error('Unable to load user data');
}

// Bad - silent failure
try {
  const data = await fetchUser(id);
  return data;
} catch {
  return null;
}
```

### Performance

- Use `React.memo` only when profiling shows benefit
- Avoid premature optimization
- Use `next/image` for images
- Code split heavy dependencies with dynamic imports
- Minimize client-side JavaScript

### Testing

- Write tests for business logic and utilities
- Test user interactions, not implementation details
- Keep tests simple and readable
- One assertion per test when possible

## Code Review Standards

When reviewing code:

1. Check TypeScript types are explicit and correct
2. Verify Tailwind classes follow theme system
3. Ensure error handling is present and appropriate
4. Confirm components are under 150 lines
5. Check for unused imports or variables
6. Verify consistent naming conventions
7. Ensure no hardcoded values that should be constants

## Common Pitfalls

### Avoid

- Creating new color values instead of using theme colors
- Duplicating utility functions across files
- Using `any` type
- Ignoring TypeScript errors
- Adding dependencies without justification
- Creating deeply nested component hierarchies
- Hardcoding configuration values

### Prefer

- Extracting repeated patterns into shared components
- Using existing UI components before creating new ones
- Type-safe function signatures
- Explicit error handling
- Descriptive variable names over comments
- Pure functions over stateful logic

## Git Workflow

- Write clear, imperative commit messages
- Keep commits focused on a single change
- Reference issue numbers in commit messages
- Ensure code builds before committing
- Run type checks and linting before pushing

## Questions?

If architectural decisions are unclear, check existing code for patterns. Consistency with existing code takes precedence over these guidelines when conflicts arise.
