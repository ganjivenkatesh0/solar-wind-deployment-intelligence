from fastapi import FastAPI

app = FastAPI(
    title="Solar & Wind Deployment Intelligence Platform",
    version="0.1.0"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to the Solar & Wind Deployment Intelligence Platform"
    }