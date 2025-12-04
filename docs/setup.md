---
sidebar_position: 3
---

# Software Setup Guide

Complete Installation Instructions for Physical AI Development

## 🎯 Overview

This guide will walk you through setting up your complete development environment for Physical AI and Humanoid Robotics. The setup is done in layers, from operating system to specialized tools.

## 📋 Setup Checklist

- [ ] Ubuntu 22.04 LTS installed
- [ ] ROS 2 Humble installed
- [ ] Python 3.10+ configured
- [ ] NVIDIA drivers installed
- [ ] Gazebo simulator installed
- [ ] NVIDIA Isaac Sim setup
- [ ] VS Code with extensions
- [ ] Git configured

**Estimated Time**: 3-4 hours

## 🐧 Step 1: Ubuntu 22.04 LTS Installation

### Option A: Dual Boot (Recommended)

1. **Download Ubuntu 22.04 LTS**
   ```
   https://ubuntu.com/download/desktop
   ```

2. **Create bootable USB** (Windows):
   - Download Rufus: https://rufus.ie/
   - Select Ubuntu ISO
   - Write to USB drive (8GB+)

3. **Install Ubuntu**:
   - Reboot with USB
   - Choose "Install Ubuntu alongside Windows"
   - Allocate at least 200GB for Ubuntu
   - Follow installation wizard

### Option B: Clean Install

If dedicating entire machine to Ubuntu:
- Same process but choose "Erase disk and install Ubuntu"
- Recommended for maximum performance

### Option C: WSL2 (Limited Support)

⚠️ **Not recommended** for this course, but possible:
```bash
# Windows PowerShell (Admin)
wsl --install -d Ubuntu-22.04
```

**Limitations**: No GPU acceleration in Isaac Sim, degraded performance

## 🔧 Step 2: System Updates and Essential Tools

```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install essential build tools
sudo apt install -y build-essential cmake git wget curl

# Install Python 3.10 and pip
sudo apt install -y python3.10 python3-pip python3-venv

# Install development tools
sudo apt install -y vim nano htop tmux
```

## 🎮 Step 3: NVIDIA Drivers Installation

### Check Your GPU

```bash
lspci | grep -i nvidia
```

### Install Drivers

```bash
# Add NVIDIA PPA
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update

# Install recommended driver
sudo ubuntu-drivers autoinstall

# Reboot
sudo reboot
```

### Verify Installation

```bash
nvidia-smi
```

Expected output: GPU info, driver version, CUDA version

### Install CUDA Toolkit

```bash
# CUDA 12.x
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update
sudo apt install -y cuda-toolkit-12-3

# Add to PATH
echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc
```

## 🤖 Step 4: ROS 2 Humble Installation

### Set Locale

```bash
sudo apt install -y locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

### Add ROS 2 Repository

```bash
# Setup sources
sudo apt install -y software-properties-common
sudo add-apt-repository universe

# Add ROS 2 GPG key
sudo apt update && sudo apt install -y curl
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

# Add repository to sources list
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

### Install ROS 2 Humble

```bash
# Update package list
sudo apt update
sudo apt upgrade -y

# Install ROS 2 Desktop (full version)
sudo apt install -y ros-humble-desktop

# Install development tools
sudo apt install -y ros-dev-tools
sudo apt install -y python3-colcon-common-extensions
```

### Setup ROS 2 Environment

```bash
# Source ROS 2 setup
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Verify installation
ros2 --help
```

### Test ROS 2

Terminal 1:
```bash
ros2 run demo_nodes_cpp talker
```

Terminal 2:
```bash
ros2 run demo_nodes_py listener
```

You should see messages being passed!

## 🎮 Step 5: Gazebo Installation

### Install Gazebo Classic 11

```bash
# Install Gazebo 11
sudo apt install -y gazebo11 libgazebo11-dev

# Install ROS 2 Gazebo bridge
sudo apt install -y ros-humble-gazebo-ros-pkgs
```

### Install Gazebo Fortress (Optional, for advanced users)

```bash
# Add Gazebo repository
sudo sh -c 'echo "deb http://packages.osrfoundation.org/gazebo/ubuntu-stable `lsb_release -cs` main" > /etc/apt/sources.list.d/gazebo-stable.list'
wget https://packages.osrfoundation.org/gazebo.key -O - | sudo apt-key add -
sudo apt update

# Install Gazebo Fortress
sudo apt install -y gz-fortress
```

### Test Gazebo

```bash
gazebo --version
gazebo
```

A 3D simulation window should open.

## 🚀 Step 6: NVIDIA Isaac Sim Installation

### Prerequisites

Verify:
- ✅ NVIDIA GPU (RTX series)
- ✅ CUDA installed
- ✅ Ubuntu 22.04

### Download Isaac Sim

1. **Create NVIDIA Account**: https://developer.nvidia.com/
2. **Download Omniverse Launcher**:
   ```bash
   wget https://install.launcher.omniverse.nvidia.com/installers/omniverse-launcher-linux.AppImage
   chmod +x omniverse-launcher-linux.AppImage
   ./omniverse-launcher-linux.AppImage
   ```

3. **Install Isaac Sim**:
   - Open Omniverse Launcher
   - Go to "Exchange" tab
   - Find "Isaac Sim"
   - Click "Install"
   - Choose version 2023.1.1 or later

### Setup Isaac Sim Python Environment

```bash
# Navigate to Isaac Sim directory
cd ~/.local/share/ov/pkg/isaac_sim-*/

# Setup Python environment
./python.sh -m pip install --upgrade pip
```

### Test Isaac Sim

```bash
# Launch Isaac Sim
~/.local/share/ov/pkg/isaac_sim-*/isaac-sim.sh
```

## 🐍 Step 7: Python Environment Setup

### Create Virtual Environment

```bash
# Create project directory
mkdir -p ~/physical_ai_projects
cd ~/physical_ai_projects

# Create virtual environment
python3 -m venv venv

# Activate
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip
```

### Install Essential Python Packages

```bash
pip install numpy scipy matplotlib
pip install opencv-python opencv-contrib-python
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install transformers openai anthropic
pip install rclpy  # ROS 2 Python client library
```

## 💻 Step 8: VS Code Setup

### Install VS Code

```bash
# Download and install
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'

sudo apt update
sudo apt install -y code
```

### Install Extensions

```bash
# Essential extensions
code --install-extension ms-python.python
code --install-extension ms-vscode.cpptools
code --install-extension ms-iot.vscode-ros
code --install-extension github.copilot
```

## 🔐 Step 9: Git Configuration

```bash
# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy and add to GitHub: Settings > SSH Keys
```

## 📦 Step 10: Install Additional Tools

### Intel RealSense SDK (if you have camera)

```bash
# Add repository
sudo mkdir -p /etc/apt/keyrings
curl -sSf https://librealsense.intel.com/Debian/librealsense.pgp | sudo tee /etc/apt/keyrings/librealsense.pgp > /dev/null

echo "deb [signed-by=/etc/apt/keyrings/librealsense.pgp] https://librealsense.intel.com/Debian/apt-repo `lsb_release -cs` main" | \
sudo tee /etc/apt/sources.list.d/librealsense.list

# Install
sudo apt update
sudo apt install -y librealsense2-dkms librealsense2-utils
```

### Docker (for containerized workflows)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt update
sudo apt install -y nvidia-container-toolkit
sudo systemctl restart docker
```

## ✅ Verification Checklist

Run these commands to verify your setup:

```bash
# Ubuntu version
lsb_release -a  # Should show 22.04

# NVIDIA driver
nvidia-smi  # Should show GPU info

# ROS 2
ros2 --version  # Should show Humble

# Python
python3 --version  # Should show 3.10+

# Gazebo
gazebo --version  # Should show 11.x

# Git
git --version
```

## 🎯 Quick Setup Script

Save time with this automated script:

```bash
#!/bin/bash
# save as setup_physical_ai.sh

echo "Setting up Physical AI Development Environment..."

# System update
sudo apt update && sudo apt upgrade -y

# Essential tools
sudo apt install -y build-essential cmake git wget curl python3-pip

# NVIDIA drivers
sudo ubuntu-drivers autoinstall

# ROS 2 (abbreviated)
sudo apt install -y software-properties-common
sudo add-apt-repository universe -y
# ... (continue with ROS 2 setup)

echo "Setup complete! Please reboot your system."
```

## 🆘 Troubleshooting

### NVIDIA Driver Issues

```bash
# Remove old drivers
sudo apt purge nvidia-*
sudo apt autoremove

# Reinstall
sudo ubuntu-drivers autoinstall
sudo reboot
```

### ROS 2 Not Found

```bash
# Source manually
source /opt/ros/humble/setup.bash

# Check installation
which ros2
```

### Gazebo Won't Start

```bash
# Check GPU
glxinfo | grep OpenGL

# Kill existing instances
killall gzserver gzclient
```

## 🚀 Next Steps

Now that your environment is set up:

1. **Test Your Setup**: Run through verification checklist
2. **Start Module 1**: Begin with ROS 2 fundamentals
3. **Join Community**: Connect with other students

📖 [Start Module 1: ROS 2 →](/docs/module-1/intro)

---

**Need help with setup?** Ask the AI Assistant! Describe your error message for instant troubleshooting.
