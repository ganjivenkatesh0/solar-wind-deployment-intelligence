This file is your personal internship diary. It records everything you learned, every command you executed, the problems you encountered, and how you solved them. When interviewers ask, "Tell me about your internship," these notes will help you answer confidently.


# Infosys Springboard Virtual Internship

# Day 01 – Development Environment Setup & Project Initialization

---

## Internship Information

**Internship Name**

Infosys Springboard Virtual Internship

**Project Name**

Solar & Wind Deployment Intelligence Platform

**Date**

07 July 2026

---

# Session Objective

The objective of Day 1 was to prepare a complete professional development environment for building the Solar & Wind Deployment Intelligence Platform.

Instead of writing application code, the focus was on establishing a strong foundation by installing software, configuring the development environment, organizing the project structure, and preparing the backend technology stack.

---

# Learning Objectives

By the end of Day 1, I should be able to:

- Understand the purpose of the project.
- Install the required software.
- Configure Python.
- Configure Git.
- Use Visual Studio Code.
- Create a professional project structure.
- Create a Python virtual environment.
- Install FastAPI.
- Install Uvicorn.
- Generate requirements.txt.
- Initialize Git.
- Prepare the project for GitHub.

---

# Concepts Learned

## Python

Python is the primary programming language used for backend development, data analysis, machine learning, and AI.

---

## Git

Git is a Version Control System that tracks project changes and enables collaboration.

---

## GitHub

GitHub is a cloud platform used to host Git repositories and maintain project history.

---

## Virtual Environment

A virtual environment is an isolated Python environment that stores project-specific dependencies.

Benefits:

- Prevents package conflicts
- Keeps projects independent
- Simplifies collaboration

---

## FastAPI

FastAPI is a modern, high-performance Python framework used to build REST APIs.

---

## Uvicorn

Uvicorn is an ASGI server responsible for running FastAPI applications.

---

# Tasks Completed

## 1. Installed Python

Verified installation.

```powershell
python --version
```

---

## 2. Installed Git

Verified installation.

```powershell
git --version
```

---

## 3. Installed Visual Studio Code

Used VS Code as the primary development environment.

---

## 4. Created Project Folder

```
solar-wind-deployment-intelligence
```

---

## 5. Created Project Structure

Created folders:

- backend
- frontend
- datasets
- docs
- docker
- notebooks
- reports
- models
- assets

Created project files:

- README.md
- CHANGELOG.md
- LICENSE
- requirements.txt
- docker-compose.yml
- .gitignore

---

## 6. Created Backend Structure

Created:

```
backend/

app/

api/

auth/

database/

models/

schemas/

services/

utils/

main.py
```

---

## 7. Created Frontend Structure

Created:

```
frontend/

public/

src/

assets/

components/

pages/

services/
```

---

## 8. Created Documentation Structure

Created:

```
docs/

api_docs/

architecture/

database_design/

setup/

weekly_notes/
```

---

## 9. Initialized Git

Command

```powershell
git init
```

Purpose

Initialize a new Git repository.

---

## 10. Renamed Branch

Command

```powershell
git branch -M main
```

Purpose

Rename the default Git branch to **main**.

---

## 11. Created Virtual Environment

Command

```powershell
python -m venv .venv
```

Purpose

Create an isolated Python environment for the project.

---

## 12. Activated Virtual Environment

Command

```powershell
.\.venv\Scripts\Activate.ps1
```

Expected Output

```text
(.venv)
```

---

## 13. Upgraded pip

Command

```powershell
python -m pip install --upgrade pip
```

Purpose

Upgrade the Python package manager.

---

## 14. Installed FastAPI

Command

```powershell
pip install fastapi
```

Purpose

Install the FastAPI backend framework.

---

## 15. Installed Uvicorn

Command

```powershell
pip install uvicorn
```

Alternative command used:

```powershell
pip install fastapi uvicorn
```

---

## 16. Verified Installation

Commands

```powershell
pip show fastapi
```

```powershell
pip show uvicorn
```

```powershell
pip list
```

---

## 17. Generated requirements.txt

Command

```powershell
pip freeze > requirements.txt
```

Purpose

Store all installed package versions.

---

# Commands Used

```powershell
python --version

git --version

git init

git status

git branch -M main

python -m venv .venv

.\.venv\Scripts\Activate.ps1

python -m pip install --upgrade pip

pip install fastapi uvicorn

pip show fastapi

pip show uvicorn

pip list

pip freeze > requirements.txt
```

---

# Folder Structure Created

```
backend/

frontend/

datasets/

docs/

docker/

models/

reports/

notebooks/

assets/
```

---

# Problem Encountered

## Issue

I accidentally executed:

```powershell
python -m venv .venv
```

again after the virtual environment had already been created.

Result:

```
Unable to copy ...
```

---

## Solution

A virtual environment only needs to be created once.

After that, simply activate it.

Correct command:

```powershell
.\.venv\Scripts\Activate.ps1
```

---

# Skills Gained

- Python environment setup
- Git basics
- GitHub preparation
- Virtual environment management
- Package management
- FastAPI installation
- Professional project organization
- Documentation practices

---

# Lessons Learned

- Always use a virtual environment.
- Keep project dependencies in `requirements.txt`.
- Organize the project before writing code.
- Use meaningful Git commit messages.
- Verify installations before proceeding.

---

# Interview Questions

### What is Git?

Git is a distributed version control system used to track changes in source code.

---

### Why do we use virtual environments?

To isolate project dependencies and avoid conflicts between projects.

---

### What is FastAPI?

FastAPI is a modern Python web framework used for building high-performance APIs.

---

### What is Uvicorn?

Uvicorn is an ASGI server used to run FastAPI applications.

---

### Why do we generate requirements.txt?

It records all project dependencies so that anyone can recreate the same environment using:

```powershell
pip install -r requirements.txt
```

---

# Day 1 Summary

Day 1 focused on preparing the development environment and organizing the project.

No application code was written. Instead, a professional project foundation was established by:

- Installing required software.
- Creating the project structure.
- Configuring Git.
- Setting up a virtual environment.
- Installing backend dependencies.
- Preparing documentation.

This foundation will support all future development during the internship.

---

# Next Day Plan

Day 2 will focus on:

- Project folder structure
- Dataset analysis
- Backend architecture
- Understanding renewable energy datasets

---

# Progress

| Task | Status |
|------|--------|
| Development Environment | ✅ Completed |
| Project Structure | ✅ Completed |
| Backend Setup | ✅ Completed |
| Frontend Setup | ✅ Completed |
| Documentation Setup | ✅ Completed |
| FastAPI Installation | ✅ Completed |
| Git Configuration | ✅ Completed |
| Ready for GitHub | ✅ Yes |

---

# Mentor Notes

A strong software project begins with a well-organized development environment and clear documentation.

Day 1 was dedicated to building that foundation. Completing these setup tasks before writing application code helps reduce future errors, improves maintainability, and makes collaboration easier.

The project is now ready to move into implementation starting with Day 2.

---

**Document Version:** v1.0

**Prepared By:** Ganji Venkatesh

**Internship:** Infosys Springboard Virtual Internship

**Project:** Solar & Wind Deployment Intelligence Platform