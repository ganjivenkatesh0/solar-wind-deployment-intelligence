from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {
        "message": "Welcome to the Solar & Wind Deployment Intelligence Platform"
    }

@router.get("/health")
def health():
    return {
        "status": "Running"
    }

@router.get("/about")
def about():
    return {
        "project": "Solar & Wind Deployment Intelligence Platform",
        "framework": "FastAPI",
        "version": "0.1.0"
    }
