This file explains how you configured the Python development environment. It records every command you executed on Day 1 and explains why each command was used.


# Environment Setup Guide

## Solar & Wind Deployment Intelligence Platform

This document explains how the Python development environment was configured for the Solar & Wind Deployment Intelligence Platform.

The objective is to ensure that every developer working on this project has the exact same environment and package versions.

---

# Table of Contents

1. Overview
2. Development Environment
3. Create Virtual Environment
4. Activate Virtual Environment
5. Upgrade pip
6. Install Dependencies
7. Verify Installation
8. Generate requirements.txt
9. Git Initialization
10. Rename Default Branch
11. Verify Git Repository
12. Best Practices
13. Common Errors
14. Troubleshooting
15. Summary

---

# Overview

A virtual environment is an isolated Python environment that contains only the packages required for this project.

Using virtual environments is considered a professional software development practice because it:

- Prevents dependency conflicts.
- Keeps projects independent.
- Makes collaboration easier.
- Ensures reproducible environments.

---

# Development Environment

Project Name

```
Solar & Wind Deployment Intelligence Platform
```

Programming Language

```
Python 3.14
```

Backend Framework

```
FastAPI
```

ASGI Server

```
Uvicorn
```

Package Manager

```
pip
```

Version Control

```
Git
```

---

# Step 1 — Create Virtual Environment

Command

```powershell
python -m venv .venv
```

Explanation

- python executes the Python interpreter.
- -m runs a Python module.
- venv creates a virtual environment.
- .venv is the name of the environment.

Result

A new directory is created:

```
.venv/
```

This folder contains:

- Python interpreter
- Package manager
- Installed libraries
- Activation scripts

---

# Step 2 — Activate Virtual Environment

PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

Expected Output

```text
(.venv)
```

Meaning

The project is now using its own isolated Python environment.

---

# Step 3 — Verify Active Python

Command

```powershell
python --version
```

Expected Output

```text
Python 3.14.x
```

Verify Python Location

```powershell
where.exe python
```

The first result should point to

```
project-folder/.venv/Scripts/python.exe
```

---

# Step 4 — Upgrade pip

Command

```powershell
python -m pip install --upgrade pip
```

Purpose

Updates the Python package manager to the latest version.

Benefits

- Better compatibility
- Security improvements
- Latest package support

---

# Step 5 — Install FastAPI

Command

```powershell
pip install fastapi
```

Purpose

Installs the FastAPI framework used for backend API development.

---

# Step 6 — Install Uvicorn

Command

```powershell
pip install uvicorn
```

Purpose

Installs the ASGI server used to run FastAPI applications.

---

# Alternative Installation

FastAPI and Uvicorn can also be installed together.

```powershell
pip install fastapi uvicorn
```

This command was used during the Day 1 setup.

---

# Step 7 — Verify Installed Packages

Check FastAPI

```powershell
pip show fastapi
```

Check Uvicorn

```powershell
pip show uvicorn
```

List All Packages

```powershell
pip list
```

These commands confirm that all required packages are installed correctly.

---

# Step 8 — Generate requirements.txt

Command

```powershell
pip freeze > requirements.txt
```

Purpose

Exports all installed Python packages and their versions into the `requirements.txt` file.

This allows other developers to recreate the same environment using:

```powershell
pip install -r requirements.txt
```

---

# Step 9 — Initialize Git Repository

Command

```powershell
git init
```

Purpose

Creates a new Git repository inside the project.

---

# Step 10 — Rename Default Branch

Command

```powershell
git branch -M main
```

Purpose

Renames the default Git branch to `main`.

---

# Step 11 — Verify Repository

Check Current Branch

```powershell
git branch
```

Check Repository Status

```powershell
git status
```

These commands confirm that Git is configured correctly.

---

# Package Summary

| Package | Purpose |
|----------|----------|
| FastAPI | Backend Framework |
| Uvicorn | ASGI Server |
| Starlette | Web Framework |
| Pydantic | Data Validation |
| AnyIO | Async Support |
| Click | Command Line Interface |
| H11 | HTTP Protocol |
| Typing Extensions | Type Hint Support |

---

# Best Practices

- Always activate the virtual environment before working.
- Never install packages globally for project development.
- Update `requirements.txt` whenever new packages are added.
- Commit `requirements.txt` to Git.
- Exclude `.venv` using `.gitignore`.

---

# Common Errors

## Package Not Found

```
WARNING: Package(s) not found
```

Solution

Install the package.

```powershell
pip install package-name
```

---

## Virtual Environment Not Activated

Symptom

Packages are installed globally.

Solution

Activate `.venv` before running any installation commands.

---

## Execution Policy Error

PowerShell may block activation scripts.

Solution

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Then activate the environment again.

---

# Environment Verification Checklist

| Item | Status |
|------|--------|
| Virtual Environment Created | ✅ |
| Virtual Environment Activated | ✅ |
| pip Updated | ✅ |
| FastAPI Installed | ✅ |
| Uvicorn Installed | ✅ |
| requirements.txt Generated | ✅ |
| Git Initialized | ✅ |
| Branch Renamed | ✅ |

---

# Summary

The Python development environment has been successfully configured.

The project is now ready for backend development using FastAPI.

All required dependencies have been installed and documented.

Following this guide ensures that every developer working on the project can reproduce the same development environment.

---

**Document Version:** v1.0

**Last Updated:** Day 1

**Project:** Solar & Wind Deployment Intelligence Platform

**Internship:** Infosys Springboard Virtual Internship