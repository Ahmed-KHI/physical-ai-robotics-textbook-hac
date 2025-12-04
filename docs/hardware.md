---
sidebar_position: 2
---

# Hardware Requirements

Understanding Your Setup Options for Physical AI

## 🎯 Overview

This course is technically demanding. It sits at the intersection of three heavy computational loads:
- **Physics Simulation** (Isaac Sim/Gazebo)
- **Visual Perception** (SLAM/Computer Vision)
- **Generative AI** (LLMs/VLA)

Because the capstone involves a "Simulated Humanoid," your primary investment must be in **High-Performance Workstations**. However, to fulfill the "Physical AI" promise, you may also want **Edge Computing Kits** or specific robot hardware.

## 💻 Option 1: The "Digital Twin" Workstation (Required)

This is the **most critical component**. NVIDIA Isaac Sim requires RTX (Ray Tracing) capabilities. Standard laptops (MacBooks or non-RTX Windows machines) **will not work**.

### Minimum Specifications

| Component | Minimum | Recommended | Why? |
|-----------|---------|-------------|------|
| **GPU** | NVIDIA RTX 4070 Ti (12GB) | RTX 4090 (24GB) | High VRAM needed for USD assets + VLA models |
| **CPU** | Intel i7 13th Gen | AMD Ryzen 9 7950X | Physics calculations (Rigid Body Dynamics) |
| **RAM** | 32GB DDR5 | 64GB DDR5 | Complex scene rendering |
| **Storage** | 512GB NVMe SSD | 1TB NVMe SSD | Fast data access |
| **OS** | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS | ROS 2 native environment |

### 🎮 GPU Requirements Explained

**Why NVIDIA RTX?**
- Isaac Sim is an Omniverse application requiring RTX ray tracing
- CUDA cores for parallel processing
- Tensor cores for AI inference

**VRAM Breakdown:**
- Robot model (URDF/USD): 2-4GB
- Environment assets: 2-3GB
- Physics simulation: 1-2GB
- VLA models running simultaneously: 4-6GB
- **Total**: 12GB minimum, 24GB ideal

### 💾 Storage Requirements

- Isaac Sim installation: ~50GB
- ROS 2 + dependencies: ~20GB
- Project files + datasets: ~100GB
- **Total**: 200GB minimum

### 🐧 Operating System

**Ubuntu 22.04 LTS is mandatory because:**
- ROS 2 (Humble/Iron) is native to Linux
- Isaac Sim performs better on Linux
- Most robotics tools are Linux-first

**Windows Users:**
- Dual-boot recommended
- WSL2 possible but has limitations
- Virtual machines too slow for simulation

## 🤖 Option 2: The "Physical AI" Edge Kit (Optional)

Since a full humanoid robot is expensive, you can learn "Physical AI" by setting up the nervous system on a desk before deploying to a robot.

### Economy Edge Kit (~$700)

| Component | Model | Price | Purpose |
|-----------|-------|-------|---------|
| **Brain** | NVIDIA Jetson Orin Nano Super (8GB) | $249 | Edge AI inference |
| **Eyes** | Intel RealSense D435i | $349 | RGB + Depth + IMU |
| **Ears** | ReSpeaker USB Mic Array v2.0 | $69 | Far-field voice commands |
| **Storage** | 128GB microSD (high-endurance) | $30 | OS + data |
| **Misc** | Cables, power supply | $50 | Connectivity |
| **TOTAL** | | **~$747** | |

### Premium Edge Kit (~$1,500)

Upgrade to:
- **Jetson Orin NX (16GB)**: $599
- **Intel RealSense L515 (LiDAR)**: $349
- Better thermal management and casing

## 🦾 Option 3: Physical Robots (Optional)

For the "Physical" part of the course, you have three tiers:

### Budget: The "Proxy" Approach ($1,800-$3,000)

**Recommended: Unitree Go2 Edu**
- ✅ Highly durable quadruped
- ✅ Excellent ROS 2 support
- ✅ Affordable for multiple units
- ⚠️ Not a biped (humanoid)
- **Software principles transfer 90%** to humanoids

### Mid-Range: Table-Top Humanoids ($600-$12,000)

**Budget Option: Hiwonder TonyPi Pro** (~$600)
- Small table-top humanoid
- Runs on Raspberry Pi
- ⚠️ Cannot run NVIDIA Isaac ROS efficiently
- Good for kinematics learning only

**Professional Option: Robotis OP3** (~$12,000)
- Stable, well-documented
- Full ROS support
- Good for research labs

### Premium: Full Humanoid ($16,000+)

**Unitree G1 Humanoid** (~$16,000)
- One of few commercially available humanoids
- Can actually walk dynamically
- SDK open enough for custom ROS 2 controllers
- Ideal for capstone "Sim-to-Real" deployment

## ☁️ Option 4: Cloud-Native "Ether" Lab

Best for: Rapid deployment, or students with weak laptops.

### Cloud Workstation Setup

**AWS g5.2xlarge** or **g6e.xlarge**
- GPU: A10G (24GB VRAM)
- Software: NVIDIA Isaac Sim on Omniverse Cloud
- Cost: ~$1.50/hour

**Semester Cost Calculation:**
- 10 hours/week × 13 weeks = 130 hours
- Storage (EBS): ~$25
- **Total**: ~$220 per semester

### ⚠️ The Latency Trap

**Problem**: Simulating in cloud works well, but controlling a real robot from cloud has dangerous latency.

**Solution**: 
1. Train in the cloud
2. Download model weights
3. Flash to local Jetson kit for physical deployment

You still need edge hardware for physical deployment!

## 🎓 Recommended Setup by Student Type

### For Simulation-Only Students

```
✅ High-end workstation (RTX 4080+)
✅ Ubuntu 22.04 dual-boot
❌ No edge kit needed
❌ No physical robot needed
```

**Cost**: $2,000-3,500 (if building PC)

### For Complete Experience

```
✅ High-end workstation (RTX 4080+)
✅ Jetson Orin Nano kit ($700)
✅ Unitree Go2 (shared/lab access)
```

**Cost**: $2,700-4,200 + robot access

### For Budget-Conscious Students

```
✅ Cloud instances (AWS/Azure)
✅ Jetson Orin Nano kit
❌ Use simulation only for robot
```

**Cost**: $950 (Jetson + cloud)

## 🛠️ Software Requirements

All free/open-source:
- ✅ Ubuntu 22.04 LTS
- ✅ ROS 2 Humble
- ✅ Gazebo 11 / Gazebo Fortress
- ✅ NVIDIA Isaac Sim (free)
- ✅ Python 3.10+
- ✅ PyTorch / TensorFlow
- ✅ OpenCV

📖 [Full Software Setup Guide →](/docs/setup)

## 📊 Quick Decision Matrix

| Your Situation | Recommended Hardware | Estimated Cost |
|----------------|---------------------|----------------|
| Have gaming PC (RTX 3070+) | Ubuntu dual-boot | $0 |
| Need new workstation | Build PC: RTX 4080, 64GB RAM | $2,500 |
| Limited budget | Cloud + Jetson kit | $950 |
| Want full experience | Workstation + Jetson + Robot access | $3,500+ |
| Research lab setup | 5× workstations + 2× Humanoids | $50,000+ |

## 🎯 Minimum to Get Started

**The absolute minimum to start this course:**

1. **Computer with:**
   - NVIDIA RTX GPU (3060 Ti or better)
   - 32GB RAM
   - Ubuntu 22.04 (dual-boot is fine)

2. **Internet connection** for:
   - Downloading tools and datasets
   - Cloud services (Qdrant, APIs)

3. **Time commitment:**
   - 10-15 hours per week
   - For 13 weeks

## 💡 Money-Saving Tips

1. **Use University Resources**: Many universities have GPU clusters
2. **Cloud Credits**: AWS Educate, Google Cloud Education
3. **Shared Robot Access**: Join a robotics lab or makerspace
4. **Used Hardware**: Previous-gen RTX cards (3090) still excellent
5. **Start with Simulation**: Add physical hardware later

## ⚠️ What Won't Work

❌ MacBook (Apple Silicon or Intel)  
❌ Laptops without NVIDIA GPU  
❌ Windows without dual-boot  
❌ AMD GPUs (no CUDA support)  
❌ Virtual machines (too slow)  
❌ Raspberry Pi as main workstation  

## 🚀 Ready to Setup?

Once you've secured your hardware, proceed to:

📖 [Software Setup Guide →](/docs/setup)

---

**Questions about hardware?** Ask the AI Assistant! Highlight any specification and ask "Is this enough for the course?"
