from fastapi import FastAPI

app = FastAPI(
    title="Solar & Wind Deployment Intelligence Platform",
    version="0.1.0",
    description="Backend APIs for Solar & Wind Deployment Intelligence Platform"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Solar & Wind Deployment Intelligence Platform"
    }


@app.get("/health")
def health():
    return {
        "status": "Running"
    }


@app.get("/about")
def about():
    return {
        "project": "Solar & Wind Deployment Intelligence Platform",
        "framework": "FastAPI",
        "version": "0.1.0"
    }