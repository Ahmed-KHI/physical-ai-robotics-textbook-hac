---
sidebar_position: 15
---

# FAQ

Frequently Asked Questions

## 💻 Hardware Questions

### Q: Do I need to buy all the hardware?

**A:** No! You have options:

1. **Cloud-Only** (~$50/month)
   - Use cloud GPU instances
   - Simulation-only development
   - No physical hardware needed

2. **Development Kit** (~$1,500)
   - Jetson Orin Nano
   - Small mobile base
   - Sufficient for learning

3. **Full System** (~$8,000+)
   - Workstation + Robot
   - Professional development
   - Production-ready

### Q: Can I use my laptop?

**A:** It depends:
- **Minimum**: Intel i5, 16GB RAM (simulation only, slow)
- **Recommended**: Gaming laptop with RTX 4060+ (acceptable)
- **Optimal**: Desktop with RTX 4070 Ti+ (smooth experience)

### Q: Which robot should I buy?

**Popular Options:**

| Robot | Price | Best For |
|-------|-------|----------|
| TurtleBot 4 | $1,495 | Navigation, SLAM |
| Unitree Go2 | $2,700 | Quadruped, outdoor |
| Franka Emika | $25,000 | Manipulation, research |
| Custom Build | $500-2,000 | Learning, tinkering |

**Recommendation**: Start with simulation, buy hardware after Module 2.

## 🔧 Software Questions

### Q: Why Ubuntu? Can I use Windows?

**A:** ROS 2 officially supports:
- ✅ Ubuntu 22.04 (best support)
- ⚠️ Windows 11 (limited, experimental)
- ⚠️ macOS (not supported)

**Windows Users**: Use WSL2 (Windows Subsystem for Linux)

### Q: OpenAI vs Gemini for this course?

**A:** For hackathon submission:
- ✅ **OpenAI**: Required by hackathon rules
- ❌ **Gemini**: Not allowed (but you can use for learning)

### Q: How much does OpenAI API cost?

**Estimated Costs** (during course):
- Whisper: ~$0.10/hour of audio
- GPT-4: ~$20-50 total
- Embeddings: ~$1-2 total

**Total**: ~$25-60 for entire course

## 📚 Course Questions

### Q: How long does the course take?

**Self-Paced:**
- **Fast**: 8 weeks (20 hours/week)
- **Normal**: 13 weeks (10 hours/week)
- **Relaxed**: 6 months (5 hours/week)

**Hackathon Deadline**: 4 days (Dec 8, 2025)

### Q: What if I get stuck?

**Resources:**
1. **Course Chatbot** (AI assistant, instant answers)
2. **ROS 2 Forums** (community support)
3. **Discord** (student community - link in README)
4. **Office Hours** (if available for your cohort)

### Q: Do I need robotics experience?

**No!** Prerequisites:
- ✅ Basic Python
- ✅ Command line familiarity
- ✅ Willingness to learn

**Nice to have** (but not required):
- Computer vision basics
- ROS experience
- Machine learning knowledge

## 🎓 Learning Questions

### Q: Can I skip modules?

**Not recommended.** Each module builds on previous:
- Module 1 (ROS 2) → Foundation for everything
- Module 2 (Simulation) → Required for testing
- Module 3 (Isaac) → Advanced perception/training
- Module 4 (VLA) → Integrates everything

**Exception**: If you already know ROS 2, skim Module 1.

### Q: Are solutions provided?

**Yes!**
- Example code in every lesson
- Full project implementations
- Video walkthroughs (coming soon)

### Q: Can I use this for my thesis?

**Absolutely!** Students have built:
- Master's thesis projects
- PhD research prototypes
- Startup MVPs
- Hackathon winners

## 🏆 Hackathon Questions

### Q: What's required for submission?

**Mandatory:**
1. ✅ Public GitHub repository
2. ✅ Deployed Docusaurus site
3. ✅ 90-second demo video
4. ✅ Working chatbot (RAG + OpenAI)

**Bonus Features** (+200 points):
- Authentication (+50)
- Personalization (+50)
- Urdu translation (+50)
- Extra features (+50)

### Q: How is it scored?

**Scoring Breakdown:**
- **Base** (100 points): Book + chatbot working
- **Bonus** (200 points): Extra features
- **Judges' Choice** (up to 300): Innovation, polish, impact

**Maximum**: 300 points

### Q: Can I work in a team?

**A:** Check hackathon rules. Typically:
- Individual projects preferred
- Teams of 2-3 allowed
- Credit must be clear

### Q: What if I don't finish in time?

**A:** Submit what you have!
- Partial submissions still score
- Judges appreciate ambition
- You can complete it after for learning

## 🐛 Troubleshooting

### Q: Isaac Sim won't start

**Common fixes:**
1. Check NVIDIA drivers: `nvidia-smi`
2. Update GPU drivers
3. Verify CUDA: `nvcc --version`
4. Allocate more VRAM (Settings → Memory)

### Q: ROS 2 commands not found

```bash
# Source ROS 2
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Verify
ros2 --version
```

### Q: Python package conflicts

```bash
# Use virtual environment
python3 -m venv ~/robot_env
source ~/robot_env/bin/activate
pip install -r requirements.txt
```

### Q: Chatbot not responding

**Checklist:**
1. OpenAI API key set? `echo $OPENAI_API_KEY`
2. Qdrant running? Check logs
3. Content indexed? Run index script
4. Check browser console for errors

## 💡 Best Practices

### Q: How to structure my time?

**Suggested Weekly Schedule:**

**Weekdays** (2 hours/day):
- Read lessons (30 min)
- Coding exercises (1 hour)
- Review/debug (30 min)

**Weekend** (5 hours/day):
- Weekly project (3 hours)
- Experimentation (2 hours)

### Q: How to debug effectively?

**Debugging Workflow:**
1. **Read error message** (fully, carefully)
2. **Check logs**: `ros2 topic echo /rosout`
3. **Visualize**: Use RViz2, Plotjuggler
4. **Isolate**: Test components individually
5. **Ask chatbot**: Paste error + code

### Q: How to learn faster?

**Accelerated Learning Tips:**
1. **Type code** (don't copy-paste)
2. **Break things** (learn by fixing)
3. **Teach others** (best learning method)
4. **Build projects** (apply immediately)
5. **Join community** (learn from peers)

## 🌍 Career Questions

### Q: Job prospects in robotics?

**Growing Field:**
- 23% annual growth (2023-2030)
- $70k-$150k salaries (US)
- Remote opportunities increasing

**Top Hiring Companies:**
- Boston Dynamics, Tesla
- Amazon Robotics, NVIDIA
- Waymo, Cruise
- Countless startups

### Q: What roles can I apply for?

After this course:
- **Entry**: Robotics Engineer
- **Mid**: Autonomous Systems Developer
- **Senior**: Robotics AI Specialist

**Skills Employers Want:**
1. ROS 2 (✅ Module 1)
2. Computer Vision (✅ Module 3)
3. ML/AI Integration (✅ Module 4)
4. Simulation (✅ Module 2)

### Q: Should I do a master's degree?

**Not necessarily!** Alternatives:
- **This course** + portfolio projects
- **Kaggle competitions** (robotics)
- **Open-source contributions** (ROS)
- **Internships** (hands-on experience)

**Master's helpful for:**
- Research positions
- PhD prerequisite
- Visa requirements (some countries)

## 📞 Contact & Support

### Q: How to get help?

**Priority Order:**
1. **Search this FAQ**
2. **Ask course chatbot** (AI assistant)
3. **Check ROS 2 docs**
4. **Post in Discord** (community support)
5. **Email instructor** (24-48hr response)

### Q: Found a bug in course?

**Report it:**
- GitHub Issues (preferred)
- Discord #bugs channel
- Email with [BUG] tag

**Reward:** First to report gets acknowledgment + bonus points

### Q: Want to contribute?

**We'd love help with:**
- Fixing typos/errors
- Adding examples
- Translating content
- Creating video tutorials

See `CONTRIBUTING.md` in repo.

---

## Still have questions?

- 💬 **Discord**: [Join community](#)
- 📧 **Email**: support@example.com
- 🤖 **AI Chatbot**: Click bottom-right corner
- 📖 **Documentation**: Check relevant module

[Back to Course Home](/)
