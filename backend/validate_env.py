"""
Validate environment configuration before running the application.
"""

import os
import sys
from pathlib import Path


def check_env_file():
    """Check if .env file exists and has required variables"""
    env_path = Path(__file__).parent / '.env'
    
    if not env_path.exists():
        print("❌ ERROR: .env file not found!")
        print("Run: cp .env.example .env")
        return False
    
    print("✓ .env file exists")
    return True


def check_api_keys():
    """Validate API keys are configured"""
    from dotenv import load_dotenv
    load_dotenv()
    
    required_keys = {
        'OPENAI_API_KEY': 'OpenAI API key (https://platform.openai.com/api-keys)',
        'QDRANT_URL': 'Qdrant Cloud URL (https://cloud.qdrant.io/)',
        'QDRANT_API_KEY': 'Qdrant API key',
        'DATABASE_URL': 'Neon Postgres URL (https://neon.tech/)'
    }
    
    missing = []
    placeholder = []
    
    for key, description in required_keys.items():
        value = os.getenv(key)
        
        if not value:
            missing.append(f"  ✗ {key}: Not set")
        elif value.startswith('your') or 'example' in value.lower():
            placeholder.append(f"  ⚠ {key}: Still has placeholder value")
        else:
            print(f"  ✓ {key}: Configured")
    
    if missing or placeholder:
        print("\n❌ Configuration Issues:")
        for msg in missing + placeholder:
            print(msg)
        print("\nPlease edit backend/.env with actual API keys.")
        return False
    
    return True


def check_dependencies():
    """Check if required Python packages are installed"""
    required = [
        'openai',
        'qdrant_client',
        'fastapi',
        'sqlalchemy',
        'langchain_openai',
        'langchain_qdrant',
        'dotenv'
    ]
    
    missing = []
    
    for package in required:
        try:
            __import__(package.replace('-', '_'))
            print(f"  ✓ {package}")
        except ImportError:
            missing.append(package)
            print(f"  ✗ {package}: Not installed")
    
    if missing:
        print("\n❌ Missing packages!")
        print("Run: pip install -r requirements.txt")
        return False
    
    return True


def check_docs_content():
    """Check if documentation files exist"""
    docs_path = Path(__file__).parent.parent / 'docs'
    
    if not docs_path.exists():
        print("❌ docs/ directory not found!")
        return False
    
    md_files = list(docs_path.rglob('*.md'))
    print(f"  ✓ Found {len(md_files)} markdown files")
    
    if len(md_files) < 10:
        print("  ⚠ Warning: Expected more documentation files")
    
    return True


def main():
    print("=" * 60)
    print("🔍 Environment Validation")
    print("=" * 60)
    
    checks = [
        ("Environment File", check_env_file),
        ("Python Dependencies", check_dependencies),
        ("API Keys", check_api_keys),
        ("Documentation Content", check_docs_content),
    ]
    
    all_passed = True
    
    for name, check_func in checks:
        print(f"\n[{name}]")
        try:
            if not check_func():
                all_passed = False
        except Exception as e:
            print(f"  ✗ Error: {e}")
            all_passed = False
    
    print("\n" + "=" * 60)
    
    if all_passed:
        print("✅ All checks passed!")
        print("\nNext steps:")
        print("1. Index content: python index_content.py")
        print("2. Start backend: uvicorn main:app --reload")
        print("3. Start frontend: npm start")
        return 0
    else:
        print("❌ Some checks failed!")
        print("\nPlease fix the issues above before continuing.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
