#!/bin/bash
# Display task breakdown

cat << 'EOF'
Reading task breakdown from specs/task-breakdown.md

This document contains:
- All implementation tasks
- Task status and priority
- Estimated time for each task
- Validation criteria
- Progress summary
EOF

if [ -f "specs/task-breakdown.md" ]; then
    cat specs/task-breakdown.md
else
    echo "Task breakdown not found. Please create specs/task-breakdown.md"
    echo "Use: /speckit.tasks to generate actionable task lists"
fi
