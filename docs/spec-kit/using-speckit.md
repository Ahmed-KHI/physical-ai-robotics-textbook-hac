---
sidebar_position: 2
title: Using Spec-Kit
description: How to use Spec-Kit in development
---

# Using Spec-Kit

This guide shows how to use Spec-Kit for structured development in this project.

## Installation

### Global Installation
```bash
npm install -g @letuscode/spec-kit
```

### Quick Start
```bash
# Navigate to project
cd physical-ai-robotics-hackathon

# Spec-Kit is already configured!
# All specification files are in place
```

## Project Structure

```
physical-ai-robotics-hackathon/
├── .github/
│   └── prompts/              # Slash command scripts
│       ├── constitution.md   # Project principles
│       ├── constitution.sh   # Display constitution
│       ├── specify.sh        # Display specs
│       ├── plan.sh          # Display plan
│       ├── tasks.sh         # Display tasks
│       └── implement.sh     # Execute implementation
├── .specify/                 # Spec-Kit metadata
├── specs/                    # All specifications
│   ├── feature-spec.md      # What we're building
│   ├── implementation-plan.md # How we're building it
│   └── task-breakdown.md    # Development tasks
└── docs/
    └── spec-kit/            # This documentation
```

## Slash Commands (GitHub Copilot)

### `/speckit.constitution`
**Purpose**: View project governing principles

**What it shows**:
- Core principles (educational excellence, technical standards)
- UX guidelines
- AI integration standards
- Development workflow
- Quality checklist

**When to use**:
- Starting new features
- Making architectural decisions
- Code reviews
- Onboarding new developers

**Example**:
```
You: /speckit.constitution
Copilot: [Displays full constitution with all principles]
```

---

### `/speckit.specify`
**Purpose**: View feature specifications

**What it shows**:
- Problem statement
- User stories
- Core features
- Technical architecture
- Success criteria
- Dependencies

**When to use**:
- Understanding project scope
- Clarifying requirements
- Planning new features
- Evaluating completeness

**Example**:
```
You: /speckit.specify
Copilot: [Displays feature-spec.md with all specifications]
```

---

### `/speckit.plan`
**Purpose**: View technical implementation plan

**What it shows**:
- Tech stack with rationale
- Architecture decisions
- System diagrams
- Implementation phases
- Data flows
- API endpoints
- Database schema
- Performance targets

**When to use**:
- Starting implementation
- Reviewing tech decisions
- Understanding data flows
- Planning integrations

**Example**:
```
You: /speckit.plan
Copilot: [Displays implementation-plan.md with all technical details]
```

---

### `/speckit.tasks`
**Purpose**: View task breakdown and progress

**What it shows**:
- All implementation tasks
- Task status (complete/in-progress/not-started)
- Priority levels
- Estimated time
- Validation criteria
- Progress summary

**When to use**:
- Daily standup/planning
- Tracking progress
- Identifying next steps
- Reviewing completion status

**Example**:
```
You: /speckit.tasks
Copilot: [Displays task-breakdown.md with current status]
```

---

### `/speckit.implement`
**Purpose**: Execute implementation based on specs

**What it shows**:
- Summary of all specifications
- Quick reference to constitution
- Current tasks to implement
- Implementation guidelines

**When to use**:
- Starting development session
- Before writing code
- Ensuring alignment with specs

**Example**:
```
You: /speckit.implement
Copilot: [Reviews all specs and starts implementation]
```

## Development Workflow

### 1. Review Constitution
```bash
# View project principles
/speckit.constitution
```

**Check**:
- Are you following educational excellence standards?
- Does your code meet technical standards?
- Is UX aligned with guidelines?

### 2. Understand Specifications
```bash
# View what we're building
/speckit.specify
```

**Check**:
- What problem are we solving?
- What are the user stories?
- What are the success criteria?

### 3. Review Technical Plan
```bash
# View implementation details
/speckit.plan
```

**Check**:
- What tech stack to use?
- How should data flow?
- What APIs to call?

### 4. Check Tasks
```bash
# View current tasks
/speckit.tasks
```

**Check**:
- What's completed?
- What's in progress?
- What's next?

### 5. Implement
```bash
# Start coding
/speckit.implement
```

**Follow**:
- Constitution principles
- Feature specifications
- Implementation plan
- Task checklist

## Example: Adding a New Feature

Let's say you want to add **Voice Input** for the chatbot:

### Step 1: Check Constitution
```bash
/speckit.constitution
```
✅ Verify it aligns with:
- Educational excellence (helps accessibility)
- UX guidelines (intuitive voice button)
- Technical standards (browser API support)

### Step 2: Update Specification
Edit `specs/feature-spec.md`:
```markdown
### 7. Voice Input (New)
**Tech Stack**: Web Speech API

**Features**:
- Voice-to-text button in chatbot
- Real-time transcription
- Visual feedback during recording
- Fallback to text input
```

### Step 3: Add to Implementation Plan
Edit `specs/implementation-plan.md`:
```markdown
### Phase 8: Voice Input
- [ ] Research Web Speech API
- [ ] Add voice button UI
- [ ] Implement recording logic
- [ ] Handle transcription
- [ ] Test across browsers
```

### Step 4: Create Tasks
Edit `specs/task-breakdown.md`:
```markdown
### Task 13: Voice Input for Chatbot
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 3 hours

**Subtasks**:
- [ ] Add microphone button to Chatbot.tsx
- [ ] Implement Web Speech API integration
- [ ] Add recording animation
- [ ] Handle transcription errors
- [ ] Test on Chrome, Firefox, Safari
```

### Step 5: Implement
```bash
/speckit.implement
```
Now code following your updated specs!

## Best Practices

### ✅ Do
- **Review specs before coding**: Understand requirements first
- **Update specs when plans change**: Keep documentation current
- **Follow constitution principles**: Maintain project standards
- **Mark tasks complete**: Track progress accurately
- **Reference specs in PRs**: Link to relevant sections

### ❌ Don't
- **Skip specification**: Don't code without understanding
- **Ignore constitution**: Don't violate principles
- **Let specs get stale**: Update when requirements change
- **Forget task tracking**: Mark progress regularly

## Tips for Hackathon/Academic Projects

### For Bonus Points
Spec-Kit demonstrates:
- **Professional workflow** (+20 pts)
- **Clear documentation** (+15 pts)
- **Structured planning** (+15 pts)
- **Quality standards** (+10 pts)

### For Teachers/Reviewers
Point them to:
1. **Constitution**: Shows project standards
2. **Specifications**: Shows complete planning
3. **Implementation Plan**: Shows technical depth
4. **Task Breakdown**: Shows progress tracking

### For Team Projects
- Everyone follows same principles
- Clear ownership of tasks
- Easy progress tracking
- Consistent code quality

## Troubleshooting

### Slash Commands Not Working?
1. Ensure you're using **GitHub Copilot**
2. Check `.github/prompts/` files exist
3. Make sure shell scripts have execute permissions:
   ```bash
   chmod +x .github/prompts/*.sh
   ```

### Specs Out of Date?
1. Review recent changes
2. Update relevant spec files
3. Mark tasks as complete
4. Commit updated specs

### Need to Add New Feature?
1. Update `feature-spec.md`
2. Update `implementation-plan.md`
3. Add tasks to `task-breakdown.md`
4. Follow implementation workflow

## Resources

- **Official Spec-Kit**: [github.com/github/spec-kit](https://github.com/github/spec-kit)
- **Node Version**: [@letuscode/spec-kit](https://www.npmjs.com/package/@letuscode/spec-kit)
- **Our Constitution**: [View File](https://github.com/Ahmed-KHI/physical-ai-robotics-textbook/blob/main/.github/prompts/constitution.md)
- **Our Specs**: [View Folder](https://github.com/Ahmed-KHI/physical-ai-robotics-textbook/tree/main/specs)

## Next Steps

- [View Project Constitution](./constitution)
- [View Feature Specifications](./specifications)
- [View Implementation Plan](./implementation-plan)
