#!/bin/bash
# Display project constitution

cat << 'EOF'
Reading project constitution from .github/prompts/constitution.md

This will display the project's governing principles and development guidelines.
EOF

if [ -f ".github/prompts/constitution.md" ]; then
    cat .github/prompts/constitution.md
else
    echo "Constitution file not found. Please create .github/prompts/constitution.md"
    echo "Use: /speckit.constitution to create your project principles"
fi
