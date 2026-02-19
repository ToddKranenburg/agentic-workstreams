# PM × Codex Prototype Planner

## Product framing
This app is a **multi-workstream execution interface** for Product Managers acting as builder-operators.
The goal is to maximize the amount of meaningful prototype work a single PM can ship per week with Codex agents.

## Scope adjustments (current phase)
- **No automatic suggestion** of workstreams or dependencies during roadmap planning.
- Roadmap planning focuses on explicit PM-authored outcomes, milestones, and prototype goals.
- Security/compliance hardening is deferred; we optimize first for speed and autonomous execution in a non-production prototype context.

## Workstream model
A workstream is a self-contained delivery lane, similar to a single-agent kanban board:
- One backlog per workstream.
- One Codex agent actively executing tasks from that backlog.
- Work items are prioritized and sequenced inside the workstream.
- Cross-workstream dependencies should be near zero by design.

### Why this matters
If workstreams are independent, the PM can parallelize execution safely:
- blocked work in one lane should not stall progress in others,
- each lane can run continuously,
- PM attention shifts from coding to orchestration and review.

## Clarifying “agent profiles” vs “workstream definition”
Agent profiles are optional defaults, not mandatory complexity.

- **Workstream definition** = *what* needs to be built.
  - Product intent
  - backlog scope
  - acceptance criteria
  - constraints specific to that initiative

- **Agent profile** = *how* the agent tends to execute.
  - coding style defaults
  - verbosity of planning/comments
  - test/documentation bias
  - preferred workflow behaviors

### Recommendation for now
Start with a single default profile for all workstreams.
Only introduce multiple profiles if repeated patterns emerge (e.g., rapid UI prototyping lane vs API-heavy lane).

## Autonomy-first agent lifecycle (lightweight)
Keep lifecycle minimal to preserve autonomy:

1. PM creates/refines a work item in a workstream backlog.
2. Agent pulls next ready task.
3. Agent creates branch for task.
4. Agent implements changes and self-validates (tests/checks as available).
5. Agent commits and opens PR with summary + open questions.
6. PM reviews, requests iteration or merges.

Notes:
- avoid over-prescriptive stage gates,
- keep loop fast,
- prefer short feedback cycles over heavyweight controls.

## Branching and PR conventions
- Branch per task: `ws/<workstream-slug>/<task-id>-<task-slug>`
- PR must link back to roadmap item and workstream card.
- PR template includes:
  - change summary,
  - how to run/validate,
  - known limitations,
  - readiness for user-testing.

## MVP capabilities aligned to your constraints
1. Roadmap outcomes + milestones (manual planning).
2. Workstream kanban boards (independent lanes).
3. Task sequencing inside each lane.
4. Agent assignment per workstream (single default profile initially).
5. Automated branch/commit/PR workflow.
6. PM review console across all active workstreams.

## Authentication model for Codex access
For now, design this as a **single-user app** (you as the only user).

Recommended phased approach:

### Phase 1 (now): single-user owner mode
- You log into your app with a single local/app account.
- You configure one OpenAI API credential in app settings.
- The backend uses that credential for all Codex agent runs.
- No user roles, team permissions, or multi-tenant complexity yet.

### Phase 2: self-serve individual usage
- Any new user can sign up and connect their own OpenAI account/credential.
- Each user gets isolated projects, usage tracking, and limits.
- Still no team roles required.

### Phase 3 (later): collaborative/team mode
- Add team workspaces and role-based access only when there is a real collaboration need.
- Introduce shared billing/admin controls at that stage.

Why this sequence fits your goal:
- fastest path to prototype velocity,
- minimal auth/permissions surface area in v1,
- easy migration path toward broader adoption later.

## Success metric framework (impact-focused)
Primary metric: **PM Weekly Prototype Impact**

Proposed composite score (v1):

`Impact = Ready_Prototypes × Quality_Factor × Learning_Factor`

Where:
- `Ready_Prototypes` = count of prototypes shipped to user testing this week.
- `Quality_Factor` = % of prototypes meeting predefined readiness checklist.
- `Learning_Factor` = % of shipped prototypes that produced actionable user feedback.

Supporting operational metrics:
- backlog item → PR lead time,
- PR cycle time (open → merge),
- parallel active workstreams per PM,
- % agent-completed tasks needing no major rework.

## Definition of prototype-ready for user testing (v1)
A prototype is considered ready when it has:
- a runnable flow for the core user journey,
- stable enough behavior for test sessions,
- clear known limitations,
- instrumentation or structured capture for user feedback,
- a short handoff brief for later production implementation.

## 30-60 day implementation sequence
### Days 1-15
- Build roadmap outcomes + workstream kanban data model and UI.
- Add task states: `Todo`, `In Progress`, `In Review`, `Done`.
- Add single-agent assignment per workstream.

### Days 16-30
- Implement branch-per-task automation and PR creation.
- Add unified PM review inbox (all workstream PRs).
- Add lightweight run logs and failure surfacing.

### Days 31-60
- Add impact dashboard centered on weekly prototype throughput and readiness.
- Add user-testing outcome capture to close the learning loop.
- Refine prompts and defaults from real usage before adding governance complexity.
