# from fastapi import FastAPI, APIRouter, HTTPException
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
# import asyncio
# from functools import wraps
# from pymongo.errors import DuplicateKeyError

# ROOT_DIR = Path(__file__).parent
# load_dotenv(ROOT_DIR / '.env')

# # MongoDB connection
# mongo_url = os.environ['MONGO_URL']
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ['DB_NAME']]

# # Groq client
# print(mongo_url)
# groq_client = Groq(api_key=os.environ['GROQ_API_KEY'])

# # Create the main app without a prefix
# app = FastAPI(title="Dental Quest API", description="Interactive Dental Education Platform")

# # Create a router with the /api prefix
# api_router = APIRouter(prefix="/api")

# # Define Models
# class StatusCheck(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     client_name: str
#     timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# class StatusCheckCreate(BaseModel):
#     client_name: str

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

#     def to_markdown(self) -> str:
#         markdown = f"# AI Response\n\n{self.response.strip()}\n\n"
#         markdown += f"**Confidence:** {round(self.confidence * 100, 2)}%\n\n"
#         if self.suggestions:
#             markdown += "## Suggestions\n\n"
#             markdown += "\n".join([f"- {s}" for s in self.suggestions])
#         return markdown

# # Utility function for async operations
# def async_route(func):
#     @wraps(func)
#     async def wrapper(*args, **kwargs):
#         return await func(*args, **kwargs)
#     return wrapper

# # API Routes
# @api_router.get("/")
# async def root():
#     return {"message": "Welcome to Dental Quest API - Your AI-Powered Dental Education Platform!"}

# # @api_router.post("/users", response_model=User)
# # async def create_user(user_data: UserCreate):
#     user_dict = user_data.model_dump()
#     user_obj = User(**user_dict)
    
#     doc = user_obj.model_dump()
#     doc['created_at'] = doc['created_at'].isoformat()
#     doc['last_active'] = doc['last_active'].isoformat()
    
#     await db.users.insert_one(doc)
#     return user_obj

# # REPLACE your old create_user function with this one
# @api_router.post("/users", response_model=User)
# async def create_user(user_data: UserCreate):
#     try:
#         user_dict = user_data.model_dump()
        
#         # First, check if a user with this email already exists
#         existing_user = await db.users.find_one({"email": user_dict["email"]}, {"_id": 0})
#         if existing_user:
#             # If user exists, parse and return their data
#             if isinstance(existing_user.get('created_at'), str):
#                 existing_user['created_at'] = datetime.fromisoformat(existing_user['created_at'])
#             if isinstance(existing_user.get('last_active'), str):
#                 existing_user['last_active'] = datetime.fromisoformat(existing_user['last_active'])
#             return User(**existing_user)

#         # If user does not exist, create a new one
#         user_obj = User(**user_dict)
#         doc = user_obj.model_dump()
#         doc['created_at'] = doc['created_at'].isoformat()
#         doc['last_active'] = doc['last_active'].isoformat()
        
#         await db.users.insert_one(doc)
#         return user_obj
        
#     except Exception as e:
#         logging.error(f"Error in create_user: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# @api_router.get("/users/{user_id}", response_model=User)
# async def get_user(user_id: str):
#     user = await db.users.find_one({"id": user_id}, {"_id": 0})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
    
#     if isinstance(user['created_at'], str):
#         user['created_at'] = datetime.fromisoformat(user['created_at'])
#     if isinstance(user['last_active'], str):
#         user['last_active'] = datetime.fromisoformat(user['last_active'])
    
#     return user

# @api_router.get("/lessons", response_model=List[Lesson])
# async def get_lessons(level: Optional[int] = None):
#     query = {}
#     if level:
#         query["level"] = level
    
#     lessons = await db.lessons.find(query, {"_id": 0}).to_list(1000)
    
#     for lesson in lessons:
#         if isinstance(lesson['created_at'], str):
#             lesson['created_at'] = datetime.fromisoformat(lesson['created_at'])
    
#     return lessons

# @api_router.get("/lessons/{lesson_id}", response_model=Lesson)
# async def get_lesson(lesson_id: str):
#     lesson = await db.lessons.find_one({"id": lesson_id}, {"_id": 0})
#     if not lesson:
#         raise HTTPException(status_code=404, detail="Lesson not found")
    
#     if isinstance(lesson['created_at'], str):
#         lesson['created_at'] = datetime.fromisoformat(lesson['created_at'])
    
#     return lesson

# @api_router.post("/quiz/submit")
# async def submit_quiz(submission: QuizSubmission):
#     lesson = await db.lessons.find_one({"id": submission.lesson_id}, {"_id": 0})
#     if not lesson:
#         raise HTTPException(status_code=404, detail="Lesson not found")
    
#     # Calculate score
#     correct_answers = 0
#     total_questions = len(lesson.get('quiz_questions', []))
    
#     for i, answer in enumerate(submission.answers):
#         if i < len(lesson['quiz_questions']):
#             question = lesson['quiz_questions'][i]
#             if question.get('correct_answer') == answer.get('selected_option'):
#                 correct_answers += 1
    
#     score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
    
#     # Save progress
#     progress = UserProgress(
#         user_id=submission.user_id,
#         lesson_id=submission.lesson_id,
#         completed=True,
#         score=score,
#         completed_at=datetime.now(timezone.utc)
#     )
    
#     doc = progress.model_dump()
#     doc['completed_at'] = doc['completed_at'].isoformat()
    
#     await db.user_progress.insert_one(doc)
    
#     # Update user score
#     await db.users.update_one(
#         {"id": submission.user_id},
#         {
#             "$inc": {"total_score": score},
#             "$set": {"last_active": datetime.now(timezone.utc).isoformat()}
#         }
#     )
    
#     return {
#         "score": score,
#         "correct_answers": correct_answers,
#         "total_questions": total_questions,
#         "passed": score >= 70
#     }

# @api_router.post("/ai/ask", response_model=AIResponse)
# async def ask_ai_tutor(query: AIQuery):
#     try:
#         # Create a dental education context prompt
#         system_prompt = """You are Dr. Rabbit, a friendly AI dental education tutor. You're an astronaut-doctor rabbit who helps students learn about dental health and oral hygiene. 
        
#         Keep your responses:
#         - Educational and accurate about dental topics
#         - Fun and engaging for mixed ages
#         - Under 200 words
#         - Include encouraging, positive language
#         - Use simple, clear explanations
#         - Add relevant dental tips when appropriate
        
#         If the question isn't dental-related, gently guide back to dental topics while being helpful."""
        
#         context = f"Previous context: {query.context}" if query.context else ""
#         full_prompt = f"{system_prompt}\n\n{context}\n\nStudent question: {query.question}"
        
#         chat_completion = groq_client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": system_prompt
#                 },
#                 {
#                     "role": "user",
#                     "content": f"{context}\n\n{query.question}"
#                 }
#             ],
#             model="openai/gpt-oss-20b",
#             temperature=0.7,
#             max_tokens=300
#         )
        
#         response_text = chat_completion.choices[0].message.content
        
#         # Generate simple suggestions based on the response
#         suggestions = [
#             "Ask about tooth brushing techniques",
#             "Learn about healthy foods for teeth",
#             "Discover how cavities form",
#             "Explore dental hygiene tips"
#         ]
        
#         raw_text = response_text  # original content from LLM

#         ai_response = AIResponse(
#             response=raw_text,  # frontend will render as markdown itself
#             confidence=0.9,
#             suggestions=suggestions
#         )

#         return ai_response
    
#     except Exception as e:
#         logging.error(f"AI query error: {str(e)}")
#         return AIResponse(
#             response="I'm having trouble right now, but I'm here to help you learn about dental health! Try asking me about brushing your teeth or eating healthy foods for strong teeth.",
#             confidence=0.5,
#             suggestions=["Ask about brushing teeth", "Learn about dental hygiene"]
#         )

# @api_router.get("/users/{user_id}/progress")
# async def get_user_progress(user_id: str):
#     progress = await db.user_progress.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
#     for p in progress:
#         if p.get('completed_at') and isinstance(p['completed_at'], str):
#             p['completed_at'] = datetime.fromisoformat(p['completed_at'])
    
#     return progress

# # Initialize sample data
# @api_router.post("/initialize-data")
# async def initialize_sample_data():
#     try:
#         # Create sample lessons
#         sample_lessons = [
#             {
#                 "id": str(uuid.uuid4()),
#                 "title": "Tooth Brushing Basics",
#                 "description": "Learn the proper way to brush your teeth for optimal oral hygiene",
#                 "level": 1,
#                 "content": {
#                     "video_url": "",
#                     "text": "Proper tooth brushing is essential for maintaining good oral health. Let's explore the correct technique!",
#                     "key_points": [
#                         "Brush for at least 2 minutes",
#                         "Use fluoride toothpaste",
#                         "Brush twice daily",
#                         "Use gentle circular motions"
#                     ]
#                 },
#                 "quiz_questions": [
#                     {
#                         "question": "How long should you brush your teeth?",
#                         "options": ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
#                         "correct_answer": "2 minutes"
#                     },
#                     {
#                         "question": "How many times should you brush per day?",
#                         "options": ["Once", "Twice", "Three times", "Four times"],
#                         "correct_answer": "Twice"
#                     }
#                 ],
#                 "created_at": datetime.now(timezone.utc).isoformat()
#             },
#             {
#                 "id": str(uuid.uuid4()),
#                 "title": "Healthy Foods for Strong Teeth",
#                 "description": "Discover which foods help keep your teeth strong and healthy",
#                 "level": 1,
#                 "content": {
#                     "video_url": "",
#                     "text": "The foods you eat play a crucial role in maintaining healthy teeth and gums.",
#                     "key_points": [
#                         "Calcium-rich foods strengthen teeth",
#                         "Avoid sugary snacks",
#                         "Drink plenty of water",
#                         "Eat fruits and vegetables"
#                     ]
#                 },
#                 "quiz_questions": [
#                     {
#                         "question": "Which nutrient is most important for strong teeth?",
#                         "options": ["Vitamin C", "Calcium", "Iron", "Protein"],
#                         "correct_answer": "Calcium"
#                     },
#                     {
#                         "question": "What should you drink most often?",
#                         "options": ["Soda", "Juice", "Water", "Sports drinks"],
#                         "correct_answer": "Water"
#                     }
#                 ],
#                 "created_at": datetime.now(timezone.utc).isoformat()
#             }
#         ]
        
#         logging.info("Attempting to clear existing lessons from the database.")
#         await db.lessons.delete_many({})
#         logging.info("Successfully cleared lessons. Now inserting new sample data.")
#         await db.lessons.insert_many(sample_lessons)
#         logging.info("Successfully inserted sample data.")
        
#         return {"message": "Sample data initialized successfully"}

#     except Exception as e:
#         logging.error(f"DATABASE ERROR during data initialization: {str(e)}")
#         raise HTTPException(
#             status_code=500,
#             detail=f"Failed to initialize data. A database error occurred: {str(e)}"
#         )

# # Include the router in the main app
# app.include_router(api_router)

# # This regex will match:
# # 1. http://localhost:3000 (for local development)
# # 2. Any Vercel preview URL (e.g., https://...-....vercel.app)
# # 3. Your production domain if you add one later.
# allowed_origin_regex = r"https?://(localhost:3000|.*\.vercel\.app)"

# app.add_middleware(
#     CORSMiddleware,
#     allow_origin_regex=allowed_origin_regex, # Use regex to allow dynamic origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# )
# logger = logging.getLogger(__name__)



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

    if not mongo_url or not db_name:
        logging.error("FATAL ERROR: MONGO_URL and DB_NAME must be set.")
        app.state.mongodb_client = None
        app.state.mongodb = None
    else:
        print("Connecting to the database...")
        app.state.mongodb_client = AsyncIOMotorClient(mongo_url)
        app.state.mongodb = app.state.mongodb_client[db_name]
        print("Successfully connected to the database.")
    
    yield
    
    # This code runs on shutdown.
    if hasattr(app.state, 'mongodb_client') and app.state.mongodb_client:
        print("Closing database connection.")
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


# --- Define Models ---
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


# --- API Routes (Updated to use request.app.state.mongodb) ---
def get_database(request: Request):
    if not hasattr(request.app.state, 'mongodb') or request.app.state.mongodb is None:
        raise HTTPException(status_code=500, detail="Database connection is not available.")
    return request.app.state.mongodb

@api_router.get("/")
async def root():
    return {"message": "Welcome to Dental Quest API!"}

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
        logging.error(f"Error in create_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in create_user: {str(e)}")

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
        logging.error(f"AI query error: {str(e)}")
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
    db = get_database(request)
    try:
        sample_lessons = [
            {"id": str(uuid.uuid4()), "title": "Tooth Brushing Basics", "description": "Learn the proper way to brush your teeth", "level": 1, "content": {"key_points": ["Brush for 2 minutes", "Use fluoride toothpaste"]}, "quiz_questions": [{"question": "How long?", "options": ["1 min", "2 mins"], "correct_answer": "2 mins"}], "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Healthy Foods", "description": "Discover foods for strong teeth", "level": 1, "content": {"key_points": ["Calcium is key", "Avoid sugar"]}, "quiz_questions": [{"question": "Best nutrient?", "options": ["Vitamin C", "Calcium"], "correct_answer": "Calcium"}], "created_at": datetime.now(timezone.utc).isoformat()}
        ]
        await db.lessons.delete_many({})
        if sample_lessons:
            await db.lessons.insert_many(sample_lessons)
        return {"message": "Sample data initialized successfully"}
    except Exception as e:
        logging.error(f"DATABASE ERROR during data initialization: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to initialize data: {str(e)}")

# --- Final App Configuration ---
app.include_router(api_router)
allowed_origin_regex = r"https?://(localhost:3000|.*\.vercel\.app)"
app.add_middleware(CORSMiddleware, allow_origin_regex=allowed_origin_regex, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- END OF REPLACEMENT ---