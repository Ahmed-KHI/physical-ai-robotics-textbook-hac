#!/bin/bash
# Display feature specification

cat << 'EOF'
Reading feature specification from specs/feature-spec.md

This document contains:
- Problem statement
- Solution overview
- User stories
- Core features
- Technical architecture
- Success criteria
EOF

if [ -f "specs/feature-spec.md" ]; then
    cat specs/feature-spec.md
else
    echo "Feature specification not found. Please create specs/feature-spec.md"
    echo "Use: /speckit.specify to define what you want to build"
fi
