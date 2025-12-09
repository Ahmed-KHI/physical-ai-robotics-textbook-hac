#!/bin/bash
# Display implementation plan

cat << 'EOF'
Reading implementation plan from specs/implementation-plan.md

This document contains:
- Tech stack selection with rationale
- Architecture decisions
- System architecture
- Implementation phases
- Data flows
- API endpoints
- Database schema
- Performance targets
- Security measures
EOF

if [ -f "specs/implementation-plan.md" ]; then
    cat specs/implementation-plan.md
else
    echo "Implementation plan not found. Please create specs/implementation-plan.md"
    echo "Use: /speckit.plan to create technical implementation plans"
fi
