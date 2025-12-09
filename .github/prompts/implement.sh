#!/bin/bash
# Execute implementation based on tasks

cat << 'EOF'
Starting implementation based on specifications...

This command will:
1. Review the constitution (.github/prompts/constitution.md)
2. Check feature specification (specs/feature-spec.md)
3. Follow implementation plan (specs/implementation-plan.md)
4. Execute tasks from task breakdown (specs/task-breakdown.md)
5. Build features according to the plan

Please ensure all specification files are up-to-date before proceeding.
EOF

echo ""
echo "=== CONSTITUTION REVIEW ==="
if [ -f ".github/prompts/constitution.md" ]; then
    head -n 20 .github/prompts/constitution.md
    echo "... (see full file for complete principles)"
else
    echo "⚠️  Constitution not found!"
fi

echo ""
echo "=== FEATURE SPECIFICATION ==="
if [ -f "specs/feature-spec.md" ]; then
    head -n 20 specs/feature-spec.md
    echo "... (see full file for complete specification)"
else
    echo "⚠️  Feature specification not found!"
fi

echo ""
echo "=== IMPLEMENTATION PLAN ==="
if [ -f "specs/implementation-plan.md" ]; then
    head -n 20 specs/implementation-plan.md
    echo "... (see full file for complete plan)"
else
    echo "⚠️  Implementation plan not found!"
fi

echo ""
echo "=== TASK BREAKDOWN ==="
if [ -f "specs/task-breakdown.md" ]; then
    grep -E "^### Task|^Status:" specs/task-breakdown.md | head -n 30
    echo "... (see full file for complete tasks)"
else
    echo "⚠️  Task breakdown not found!"
fi

echo ""
echo "Ready to implement. Please review all specs before proceeding with development."
