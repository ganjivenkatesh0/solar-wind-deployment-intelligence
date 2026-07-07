This file explains how to install and verify the development environment. It is meant for anyone who clones your project and wants to set it up.


# Installation Guide

## Solar & Wind Deployment Intelligence Platform

This document explains how to install and configure the development environment required to run the **Solar & Wind Deployment Intelligence Platform**.

---

# Table of Contents

1. Introduction
2. System Requirements
3. Install Python
4. Install Git
5. Install Visual Studio Code
6. Verify Installations
7. Create Project Directory
8. Open Project in VS Code
9. Install Python Extension
10. Verify Everything
11. Common Errors & Solutions
12. Next Steps

---

# Introduction

Before starting development, make sure all required software is installed correctly.

The following tools are used throughout this project.

- Python
- Git
- Visual Studio Code
- PowerShell
- GitHub

---

# System Requirements

## Operating System

- Windows 10 or later

## Hardware

Minimum

- 8 GB RAM
- Dual Core Processor
- 10 GB Free Disk Space

Recommended

- 16 GB RAM
- SSD Storage

---

# Install Python

Python is the primary programming language used in this project.

## Download

Official Website

https://www.python.org/downloads/

Download the latest stable version of Python 3.

---

## Installation Steps

1. Run the installer.
2. Enable:

```
✅ Add Python to PATH
```

3. Click

```
Install Now
```

4. Wait until installation completes.

---

# Verify Python Installation

Open PowerShell.

Run

```powershell
python --version
```

Expected Output

```text
Python 3.14.x
```

---

# Verify pip

Run

```powershell
pip --version
```

Expected Output

```text
pip 26.x.x
```

---

# Install Git

Git is used for version control.

Official Website

https://git-scm.com/downloads

---

## Installation

Keep the default installation options.

Click

```
Next

Next

Next

Install
```

---

# Verify Git

Run

```powershell
git --version
```

Expected Output

```text
git version 2.51.x
```

---

# Install Visual Studio Code

Official Website

https://code.visualstudio.com/

Install using default settings.

---

# Open the Project

Create the project folder.

Example

```text
Documents/

└── solar-wind-deployment-intelligence
```

Open the folder in VS Code.

```
File

↓

Open Folder
```

Select the project folder.

---

# Install VS Code Extensions

Install the following extensions.

- Python
- Pylance
- GitHub Pull Requests and Issues
- Docker (Later)

---

# Verify Installation

Run the following commands.

```powershell
python --version
```

```powershell
pip --version
```

```powershell
git --version
```

Everything should return the installed version.

---

# Common Errors

## Python Not Found

Error

```
python is not recognized
```

Solution

Reinstall Python and enable

```
Add Python to PATH
```

---

## Git Not Found

Error

```
git is not recognized
```

Solution

Reinstall Git using default settings.

---

## VS Code Not Opening

Restart the computer and reinstall VS Code if necessary.

---

# Installation Checklist

| Task | Status |
|------|--------|
| Install Python | ✅ |
| Verify Python | ✅ |
| Install pip | ✅ |
| Install Git | ✅ |
| Verify Git | ✅ |
| Install VS Code | ✅ |
| Install Extensions | ✅ |
| Create Project Folder | ✅ |

---

# Next Step

After completing the installation:

1. Create the project structure.
2. Initialize Git.
3. Create a Python virtual environment.
4. Install project dependencies.
5. Start backend development.

---

# References

Python

https://www.python.org/

Git

https://git-scm.com/

Visual Studio Code

https://code.visualstudio.com/

FastAPI

https://fastapi.tiangolo.com/

---

**Document Version:** v1.0

**Last Updated:** Day 1

**Project:** Solar & Wind Deployment Intelligence Platform

**Internship:** Infosys Springboard Virtual Internship


