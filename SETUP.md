# Quick Setup Guide

Follow these steps to get your environment configured:

## 1. Copy Environment Template

```bash
cd backend
cp .env.example .env
```

## 2. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste into `.env` as `OPENAI_API_KEY`

## 3. Setup Qdrant Cloud (Free)

1. Go to https://cloud.qdrant.io/
2. Sign up (free tier: 1GB storage)
3. Create cluster
4. Copy **Cluster URL** → `QDRANT_URL` in `.env`
5. Copy **API Key** → `QDRANT_API_KEY` in `.env`

## 4. Setup Neon Postgres (Free)

1. Go to https://neon.tech/
2. Sign up (free tier: 512MB storage)
3. Create project
4. Copy **Connection String** → `DATABASE_URL` in `.env`

## 5. Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ..
npm install
```

## 6. Index Book Content

```bash
cd backend
python index_content.py
```

This will:
- Read all markdown files from `docs/`
- Chunk content into ~1000 character segments
- Generate embeddings with OpenAI
- Store in Qdrant vector database

Expected output:
```
📚 Physical AI & Robotics Book - Content Indexer
✓ Read: intro.md
✓ Read: hardware.md
...
📊 Statistics:
  Documents: 20
  Total chunks: 450
✓ Successfully indexed 450 chunks!
✅ SUCCESS! All content indexed.
```

## 7. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## 8. Verify Everything Works

1. Open http://localhost:3000
2. Click chatbot icon (bottom-right)
3. Ask: "What is ROS 2?"
4. Should get accurate answer from book content

## Troubleshooting

### "Module not found" errors
```bash
pip install -r requirements.txt
```

### Qdrant connection failed
- Check `QDRANT_URL` includes `https://`
- Verify API key is correct
- Ensure cluster is running (free tier doesn't auto-sleep)

### OpenAI API errors
- Check API key is valid
- Verify you have credits ($5+ recommended)
- Check usage limits

### Database connection failed
- Verify Neon connection string format
- Ensure `?sslmode=require` is appended
- Check project isn't suspended (free tier)

## Next Steps

After setup complete:
- [ ] Test chatbot with various questions
- [ ] Implement authentication
- [ ] Add personalization features
- [ ] Add Urdu translation
- [ ] Deploy to GitHub Pages
