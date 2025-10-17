# # --- START: PASTE THIS ENTIRE BLOCK INTO backend/server.py ---

# from fastapi import FastAPI, APIRouter, HTTPException, Request
# from dotenv import load_dotenv
# from starlette.middleware.cors import CORSMiddleware
# from motor.motor_asyncio import AsyncIOMotorClient
# import os
# import logging
# from pathlib import Path
# from pydantic import BaseModel, Field, ConfigDict
# from typing import List, Optional, Dict, Any
# import uuid
# from datetime import datetime, timezone
# from groq import Groq
# from contextlib import asynccontextmanager
# from pymongo.errors import DuplicateKeyError

# # --- CORRECT FastAPI Lifespan for Database Connection ---
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # This code runs on startup.
#     mongo_url = os.environ.get("MONGO_URL")
#     db_name = os.environ.get("DB_NAME")

#     if not mongo_url or not db_name:
#         logging.error("FATAL ERROR: MONGO_URL and DB_NAME must be set.")
#         app.state.mongodb_client = None
#         app.state.mongodb = None
#     else:
#         print("Connecting to the database...")
#         app.state.mongodb_client = AsyncIOMotorClient(mongo_url)
#         app.state.mongodb = app.state.mongodb_client[db_name]
#         print("Successfully connected to the database.")
    
#     yield
    
#     # This code runs on shutdown.
#     if hasattr(app.state, 'mongodb_client') and app.state.mongodb_client:
#         print("Closing database connection.")
#         app.state.mongodb_client.close()

# # --- Main App Initialization ---
# ROOT_DIR = Path(__file__).parent
# load_dotenv(ROOT_DIR / '.env')

# app = FastAPI(
#     title="Dental Quest API",
#     description="Interactive Dental Education Platform",
#     lifespan=lifespan
# )

# groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
# api_router = APIRouter(prefix="/api")


# # --- Define Models ---
# class User(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     username: str
#     email: str
#     level: int = Field(default=1)
#     total_score: int = Field(default=0)
#     achievements: List[str] = Field(default_factory=list)
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
#     last_active: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# class UserCreate(BaseModel):
#     username: str
#     email: str

# class UserProgress(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     user_id: str
#     lesson_id: str
#     completed: bool = False
#     score: Optional[int] = None
#     completed_at: Optional[datetime] = None

# class Lesson(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     title: str
#     description: str
#     level: int
#     content: Dict[str, Any]
#     quiz_questions: List[Dict[str, Any]] = Field(default_factory=list)
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# class QuizSubmission(BaseModel):
#     user_id: str
#     lesson_id: str
#     answers: List[Dict[str, Any]]

# class AIQuery(BaseModel):
#     question: str
#     context: Optional[str] = None
#     user_id: Optional[str] = None

# class AIResponse(BaseModel):
#     response: str
#     confidence: float
#     suggestions: List[str] = Field(default_factory=list)


# # --- API Routes (Updated to use request.app.state.mongodb) ---
# def get_database(request: Request):
#     if not hasattr(request.app.state, 'mongodb') or request.app.state.mongodb is None:
#         raise HTTPException(status_code=500, detail="Database connection is not available.")
#     return request.app.state.mongodb

# @api_router.get("/")
# async def root():
#     return {"message": "Welcome to Dental Quest API!"}

# @api_router.post("/users", response_model=User)
# async def create_user(user_data: UserCreate, request: Request):
#     db = get_database(request)
#     try:
#         user_dict = user_data.model_dump()
#         existing_user = await db.users.find_one({"email": user_dict["email"]}, {"_id": 0})
#         if existing_user:
#             if isinstance(existing_user.get('created_at'), str):
#                 existing_user['created_at'] = datetime.fromisoformat(existing_user['created_at'])
#             if isinstance(existing_user.get('last_active'), str):
#                 existing_user['last_active'] = datetime.fromisoformat(existing_user['last_active'])
#             return User(**existing_user)
#         user_obj = User(**user_dict)
#         doc = user_obj.model_dump()
#         doc['created_at'] = doc['created_at'].isoformat()
#         doc['last_active'] = doc['last_active'].isoformat()
#         await db.users.insert_one(doc)
#         return user_obj
#     except Exception as e:
#         logging.error(f"Error in create_user: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error in create_user: {str(e)}")

# @api_router.get("/users/{user_id}", response_model=User)
# async def get_user(user_id: str, request: Request):
#     db = get_database(request)
#     user = await db.users.find_one({"id": user_id}, {"_id": 0})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     if isinstance(user.get('created_at'), str):
#         user['created_at'] = datetime.fromisoformat(user['created_at'])
#     if isinstance(user.get('last_active'), str):
#         user['last_active'] = datetime.fromisoformat(user['last_active'])
#     return user

# @api_router.get("/lessons", response_model=List[Lesson])
# async def get_lessons(request: Request, level: Optional[int] = None):
#     db = get_database(request)
#     query = {}
#     if level:
#         query["level"] = level
#     lessons = await db.lessons.find(query, {"_id": 0}).to_list(1000)
#     for lesson in lessons:
#         if isinstance(lesson.get('created_at'), str):
#             lesson['created_at'] = datetime.fromisoformat(lesson['created_at'])
#     return lessons

# @api_router.get("/lessons/{lesson_id}", response_model=Lesson)
# async def get_lesson(lesson_id: str, request: Request):
#     db = get_database(request)
#     lesson = await db.lessons.find_one({"id": lesson_id}, {"_id": 0})
#     if not lesson:
#         raise HTTPException(status_code=404, detail="Lesson not found")
#     if isinstance(lesson.get('created_at'), str):
#         lesson['created_at'] = datetime.fromisoformat(lesson['created_at'])
#     return lesson

# @api_router.post("/quiz/submit")
# async def submit_quiz(submission: QuizSubmission, request: Request):
#     db = get_database(request)
#     lesson = await db.lessons.find_one({"id": submission.lesson_id}, {"_id": 0})
#     if not lesson:
#         raise HTTPException(status_code=404, detail="Lesson not found")
#     correct_answers = sum(1 for i, answer in enumerate(submission.answers) if i < len(lesson.get('quiz_questions', [])) and lesson['quiz_questions'][i].get('correct_answer') == answer.get('selected_option'))
#     total_questions = len(lesson.get('quiz_questions', []))
#     score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
#     progress = UserProgress(user_id=submission.user_id, lesson_id=submission.lesson_id, completed=True, score=score, completed_at=datetime.now(timezone.utc))
#     doc = progress.model_dump()
#     doc['completed_at'] = doc['completed_at'].isoformat()
#     await db.user_progress.insert_one(doc)
#     await db.users.update_one({"id": submission.user_id}, {"$inc": {"total_score": score}, "$set": {"last_active": datetime.now(timezone.utc).isoformat()}})
#     return {"score": score, "correct_answers": correct_answers, "total_questions": total_questions, "passed": score >= 70}

# @api_router.post("/ai/ask", response_model=AIResponse)
# async def ask_ai_tutor(query: AIQuery):
#     try:
#         system_prompt = """You are Dr. Rabbit...""" # Truncated for brevity
#         chat_completion = groq_client.chat.completions.create(messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": query.question}], model="openai/gpt-oss-20b", temperature=0.7, max_tokens=300)
#         response_text = chat_completion.choices[0].message.content
#         suggestions = ["Ask about tooth brushing techniques", "Learn about healthy foods for teeth"]
#         return AIResponse(response=response_text, confidence=0.9, suggestions=suggestions)
#     except Exception as e:
#         logging.error(f"AI query error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"An AI error occurred: {str(e)}")

# @api_router.get("/users/{user_id}/progress")
# async def get_user_progress(user_id: str, request: Request):
#     db = get_database(request)
#     progress = await db.user_progress.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
#     for p in progress:
#         if p.get('completed_at') and isinstance(p['completed_at'], str):
#             p['completed_at'] = datetime.fromisoformat(p['completed_at'])
#     return progress

# @api_router.post("/initialize-data")
# async def initialize_sample_data(request: Request):
#     db = get_database(request)
#     try:
#         sample_lessons = [
#             {"id": str(uuid.uuid4()), "title": "Tooth Brushing Basics", "description": "Learn the proper way to brush your teeth", "level": 1, "content": {"key_points": ["Brush for 2 minutes", "Use fluoride toothpaste"]}, "quiz_questions": [{"question": "How long?", "options": ["1 min", "2 mins"], "correct_answer": "2 mins"}], "created_at": datetime.now(timezone.utc).isoformat()},
#             {"id": str(uuid.uuid4()), "title": "Healthy Foods", "description": "Discover foods for strong teeth", "level": 1, "content": {"key_points": ["Calcium is key", "Avoid sugar"]}, "quiz_questions": [{"question": "Best nutrient?", "options": ["Vitamin C", "Calcium"], "correct_answer": "Calcium"}], "created_at": datetime.now(timezone.utc).isoformat()}
#         ]
#         await db.lessons.delete_many({})
#         if sample_lessons:
#             await db.lessons.insert_many(sample_lessons)
#         return {"message": "Sample data initialized successfully"}
#     except Exception as e:
#         logging.error(f"DATABASE ERROR during data initialization: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to initialize data: {str(e)}")

# # --- Final App Configuration ---
# app.include_router(api_router)
# allowed_origin_regex = r"https?://(localhost:3000|.*\.vercel\.app)"
# app.add_middleware(CORSMiddleware, allow_origin_regex=allowed_origin_regex, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# # --- END OF REPLACEMENT ---







# --- START: PASTE THIS ENTIRE BLOCK INTO backend/server.py ---

from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from groq import Groq
from contextlib import asynccontextmanager
from pymongo.errors import DuplicateKeyError

# --- CORRECT FastAPI Lifespan for Database Connection ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This code runs on startup.
    mongo_url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME")
    logging.info(f"LIFESPAN START: MONGO_URL_IS_SET: {mongo_url is not None}, DB_NAME_IS_SET: {db_name is not None}")

    if not mongo_url or not db_name:
        logging.error("LIFESPAN ERROR: MONGO_URL and/or DB_NAME are NOT SET in Vercel environment variables.")
        app.state.mongodb_client = None
        app.state.mongodb = None
    else:
        try:
            logging.info("LIFESPAN: Connecting to the database...")
            app.state.mongodb_client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
            await app.state.mongodb_client.admin.command('ismaster')
            app.state.mongodb = app.state.mongodb_client[db_name]
            logging.info("LIFESPAN: Successfully connected to the database.")
        except Exception as e:
            logging.error(f"LIFESPAN ERROR: Could not connect to MongoDB. Error: {e}", exc_info=True)
            app.state.mongodb_client = None
            app.state.mongodb = None
    
    yield
    
    # This code runs on shutdown.
    if hasattr(app.state, 'mongodb_client') and app.state.mongodb_client:
        logging.info("LIFESPAN: Closing database connection.")
        app.state.mongodb_client.close()

# --- Main App Initialization ---
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI(
    title="Dental Quest API",
    description="Interactive Dental Education Platform",
    lifespan=lifespan
)

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
api_router = APIRouter(prefix="/api")


# --- Define Models (No changes needed here) ---
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    level: int = Field(default=1)
    total_score: int = Field(default=0)
    achievements: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_active: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    email: str

class UserProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    lesson_id: str
    completed: bool = False
    score: Optional[int] = None
    completed_at: Optional[datetime] = None

class Lesson(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    level: int
    content: Dict[str, Any]
    quiz_questions: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuizSubmission(BaseModel):
    user_id: str
    lesson_id: str
    answers: List[Dict[str, Any]]

class AIQuery(BaseModel):
    question: str
    context: Optional[str] = None
    user_id: Optional[str] = None

class AIResponse(BaseModel):
    response: str
    confidence: float
    suggestions: List[str] = Field(default_factory=list)


# --- API Routes (Updated with more logging) ---
def get_database(request: Request):
    if not hasattr(request.app.state, 'mongodb') or request.app.state.mongodb is None:
        logging.error("get_database call failed because db connection is not available.")
        raise HTTPException(status_code=500, detail="Database connection is not available.")
    return request.app.state.mongodb

# --- !!! THIS IS THE DIAGNOSTIC ENDPOINT !!! ---
@api_router.get("/")
async def root(request: Request):
    mongo_url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME")
    groq_key = os.environ.get("GROQ_API_KEY")
    
    db_connection_state = "Connected" if hasattr(request.app.state, 'mongodb') and request.app.state.mongodb is not None else "NOT CONNECTED"

    return {
        "message": "Welcome to Dental Quest API - DIAGNOSTIC CHECK",
        "environment_variables_status": {
            "MONGO_URL_IS_SET": mongo_url is not None,
            "DB_NAME_IS_SET": db_name is not None,
            "GROQ_API_KEY_IS_SET": groq_key is not None,
        },
        "database_connection_state": db_connection_state
    }

@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate, request: Request):
    db = get_database(request)
    try:
        user_dict = user_data.model_dump()
        existing_user = await db.users.find_one({"email": user_dict["email"]}, {"_id": 0})
        if existing_user:
            if isinstance(existing_user.get('created_at'), str):
                existing_user['created_at'] = datetime.fromisoformat(existing_user['created_at'])
            if isinstance(existing_user.get('last_active'), str):
                existing_user['last_active'] = datetime.fromisoformat(existing_user['last_active'])
            return User(**existing_user)
        user_obj = User(**user_dict)
        doc = user_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['last_active'] = doc['last_active'].isoformat()
        await db.users.insert_one(doc)
        return user_obj
    except Exception as e:
        logging.error(f"Error in create_user: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error in create_user: {str(e)}")

# (The rest of the functions are the same as before)
@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str, request: Request):
    db = get_database(request)
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if isinstance(user.get('created_at'), str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    if isinstance(user.get('last_active'), str):
        user['last_active'] = datetime.fromisoformat(user['last_active'])
    return user

@api_router.get("/lessons", response_model=List[Lesson])
async def get_lessons(request: Request, level: Optional[int] = None):
    db = get_database(request)
    query = {}
    if level:
        query["level"] = level
    lessons = await db.lessons.find(query, {"_id": 0}).to_list(1000)
    for lesson in lessons:
        if isinstance(lesson.get('created_at'), str):
            lesson['created_at'] = datetime.fromisoformat(lesson['created_at'])
    return lessons

@api_router.get("/lessons/{lesson_id}", response_model=Lesson)
async def get_lesson(lesson_id: str, request: Request):
    db = get_database(request)
    lesson = await db.lessons.find_one({"id": lesson_id}, {"_id": 0})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    if isinstance(lesson.get('created_at'), str):
        lesson['created_at'] = datetime.fromisoformat(lesson['created_at'])
    return lesson

@api_router.post("/quiz/submit")
async def submit_quiz(submission: QuizSubmission, request: Request):
    db = get_database(request)
    lesson = await db.lessons.find_one({"id": submission.lesson_id}, {"_id": 0})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    correct_answers = sum(1 for i, answer in enumerate(submission.answers) if i < len(lesson.get('quiz_questions', [])) and lesson['quiz_questions'][i].get('correct_answer') == answer.get('selected_option'))
    total_questions = len(lesson.get('quiz_questions', []))
    score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
    progress = UserProgress(user_id=submission.user_id, lesson_id=submission.lesson_id, completed=True, score=score, completed_at=datetime.now(timezone.utc))
    doc = progress.model_dump()
    doc['completed_at'] = doc['completed_at'].isoformat()
    await db.user_progress.insert_one(doc)
    await db.users.update_one({"id": submission.user_id}, {"$inc": {"total_score": score}, "$set": {"last_active": datetime.now(timezone.utc).isoformat()}})
    return {"score": score, "correct_answers": correct_answers, "total_questions": total_questions, "passed": score >= 70}

@api_router.post("/ai/ask", response_model=AIResponse)
async def ask_ai_tutor(query: AIQuery):
    try:
        system_prompt = """You are Dr. Rabbit...""" # Truncated for brevity
        chat_completion = groq_client.chat.completions.create(messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": query.question}], model="openai/gpt-oss-20b", temperature=0.7, max_tokens=300)
        response_text = chat_completion.choices[0].message.content
        suggestions = ["Ask about tooth brushing techniques", "Learn about healthy foods for teeth"]
        return AIResponse(response=response_text, confidence=0.9, suggestions=suggestions)
    except Exception as e:
        logging.error(f"AI query error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An AI error occurred: {str(e)}")

@api_router.get("/users/{user_id}/progress")
async def get_user_progress(user_id: str, request: Request):
    db = get_database(request)
    progress = await db.user_progress.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    for p in progress:
        if p.get('completed_at') and isinstance(p['completed_at'], str):
            p['completed_at'] = datetime.fromisoformat(p['completed_at'])
    return progress

@api_router.post("/initialize-data")
async def initialize_sample_data(request: Request):
    logging.info("Entered initialize_sample_data function.")
    try:
        db = get_database(request)
        logging.info("Successfully got database instance.")
        
        sample_lessons = [
            {"id": str(uuid.uuid4()), "title": "Tooth Brushing Basics", "description": "Learn the proper way to brush your teeth", "level": 1, "content": {"key_points": ["Brush for 2 minutes", "Use fluoride toothpaste"]}, "quiz_questions": [{"question": "How long?", "options": ["1 min", "2 mins"], "correct_answer": "2 mins"}], "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Healthy Foods", "description": "Discover foods for strong teeth", "level": 1, "content": {"key_points": ["Calcium is key", "Avoid sugar"]}, "quiz_questions": [{"question": "Best nutrient?", "options": ["Vitamin C", "Calcium"], "correct_answer": "Calcium"}], "created_at": datetime.now(timezone.utc).isoformat()}
        ]
        
        logging.info("Attempting to delete existing lessons.")
        await db.lessons.delete_many({})
        logging.info("Successfully deleted lessons. Attempting to insert new lessons.")
        
        if sample_lessons:
            await db.lessons.insert_many(sample_lessons)
            
        logging.info("Successfully inserted new sample lessons.")
        return {"message": "Sample data initialized successfully"}
    except Exception as e:
        logging.error(f"CRASH in initialize_sample_data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to initialize data: {str(e)}")


# --- Final App Configuration ---
app.include_router(api_router)
allowed_origin_regex = r"https?://(localhost:3000|.*\.vercel\.app)"
app.add_middleware(CORSMiddleware, allow_origin_regex=allowed_origin_regex, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- END OF REPLACEMENT ---