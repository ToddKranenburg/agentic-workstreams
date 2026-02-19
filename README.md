# Agentic Workstreams MVP (Simplified)

This MVP is intentionally minimal and focused on one thing: simple workstream execution.

## What it does

- Show workstreams with horizontal task backlogs.
- Add workstreams from an inline `+ Add workstream` button that opens a modal.
- Edit workstream names inline (Jira-style quick edit).
- Add tasks with a modal that includes only `name` and `description`.
- Drag-and-drop reorder tasks horizontally inside a workstream.
- Mark a single task as `In Progress` per workstream (starting one clears previous in-progress task).
- Prevent dragging the active `In Progress` task.
- Mark tasks as `Done`.
- Persist everything locally with `localStorage`.

## Run locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.
