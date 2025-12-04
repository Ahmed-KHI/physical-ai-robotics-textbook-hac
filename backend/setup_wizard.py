"""
Interactive setup wizard to help get API keys
"""

import secrets
import string
import webbrowser
from time import sleep

def generate_jwt_secret(length=64):
    """Generate a secure random JWT secret key"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def main():
    print_header("🔑 API Keys Setup Wizard")
    
    print("\nThis wizard will help you get all required API keys.")
    print("Press Enter after completing each step...\n")
    
    # Step 1: JWT Secret
    print_header("1/3: JWT Secret Key")
    print("\n✨ Generating secure JWT secret key...")
    jwt_secret = generate_jwt_secret()
    print(f"\n✅ Generated JWT Secret Key:")
    print(f"\nJWT_SECRET_KEY={jwt_secret}")
    print("\n📋 Copy this to your .env file!")
    input("\nPress Enter to continue...")
    
    # Step 2: Qdrant Cloud
    print_header("2/3: Qdrant Cloud Setup")
    print("\n🗄️  Qdrant is your vector database (FREE TIER available)")
    print("\nSteps:")
    print("1. Opening https://cloud.qdrant.io/ in browser...")
    print("2. Sign up (GitHub/Google login available)")
    print("3. Click 'Create Cluster'")
    print("4. Choose FREE tier (1GB storage)")
    print("5. Select closest region")
    print("6. Copy the Cluster URL (looks like: https://xxx.cloud.qdrant.io)")
    print("7. Go to 'API Keys' tab")
    print("8. Create new API key and copy it")
    
    try:
        webbrowser.open("https://cloud.qdrant.io/")
    except:
        pass
    
    print("\n📋 You need to copy TWO values:")
    print("   QDRANT_URL=https://your-cluster-id.cloud.qdrant.io")
    print("   QDRANT_API_KEY=your-api-key-here")
    
    input("\nPress Enter after you have both Qdrant values...")
    
    # Step 3: Neon Postgres
    print_header("3/3: Neon Postgres Setup")
    print("\n🐘 Neon is serverless Postgres (FREE TIER available)")
    print("\nSteps:")
    print("1. Opening https://neon.tech/ in browser...")
    print("2. Sign up (GitHub/Google login available)")
    print("3. Click 'Create Project'")
    print("4. Name: physical-ai-robotics")
    print("5. Choose FREE tier (512MB storage)")
    print("6. Select closest region")
    print("7. After creation, go to 'Connection Details'")
    print("8. Copy the 'Connection string' (starts with postgresql://)")
    print("9. Make sure it includes '?sslmode=require' at the end")
    
    try:
        webbrowser.open("https://neon.tech/")
    except:
        pass
    
    print("\n📋 You need to copy ONE value:")
    print("   DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require")
    print("   (Also copy to NEON_DATABASE_URL)")
    
    input("\nPress Enter after you have the Neon connection string...")
    
    # Summary
    print_header("✅ Setup Complete!")
    print("\n📝 Your .env file should now have:")
    print("\n✅ OPENAI_API_KEY (you already have this)")
    print("✅ GEMINI_API_KEY (you already have this)")
    print(f"✅ JWT_SECRET_KEY={jwt_secret[:20]}...")
    print("✅ QDRANT_URL=https://your-cluster.cloud.qdrant.io")
    print("✅ QDRANT_API_KEY=your-qdrant-key")
    print("✅ DATABASE_URL=postgresql://...")
    print("✅ NEON_DATABASE_URL=postgresql://...")
    
    print("\n🚀 Next Steps:")
    print("1. Save your .env file")
    print("2. Run: python validate_env.py")
    print("3. Run: python index_content.py")
    print("4. Start backend: uvicorn main:app --reload")
    print("5. Start frontend: npm start")
    
    print("\n💡 Tip: Keep the browser tabs open - you can revisit them anytime!")

if __name__ == "__main__":
    main()
