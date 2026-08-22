# Flow ML

A production-ready visual machine learning platform that enables users to build, train, and deploy ML models through an intuitive node-based interface. Perfect for students, educators, and ML practitioners who want to understand machine learning workflows visually.

## 🚀 Features

### Core Capabilities

- **Visual Pipeline Builder**: Drag-and-drop node-based ML pipeline creation using React Flow
- **Multiple ML Algorithms**: Linear Regression, Logistic Regression, Decision Trees, Random Forest
- **AI-Powered Mentor**: Integrated AI assistant using OpenAI, Anthropic, and Google Gemini for guidance
- **Real-time Collaboration**: Share projects with unique tokens for collaboration
- **Advanced Data Processing**: Complete preprocessing pipeline with encoding, scaling, and feature selection
- **Interactive Visualizations**: Chart.js integration for data exploration and model evaluation
- **Project Management**: Save, load, and manage multiple ML projects
- **Admin Dashboard**: Monitor users and system analytics

### ML Pipeline Components

- Data Upload & Preview
- Missing Value Handling
- Data Cleaning & Transformation
- Feature Encoding (Label, One-Hot, Target)
- Feature Scaling (Standard, MinMax, Robust)
- Feature Selection
- Train/Test Split
- Model Training (Linear/Logistic Regression, Decision Trees, Random Forest)
- Predictions & Evaluation
- Confusion Matrix & Metrics Visualization

## 🏗️ Architecture

### Frontend (`/client`)

**Tech Stack:**

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v7
- **UI/Styling**: Tailwind CSS v4
- **Visualizations**: Chart.js, React Flow (@xyflow/react)
- **Animations**: Framer Motion
- **Authentication**: Google OAuth 2.0

**Key Features:**

- Code-split lazy loading for optimal performance
- Protected routes for student and admin access
- Real-time toast notifications
- Responsive design
- ESLint + Husky for code quality

### Backend (`/server`)

**Tech Stack:**

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic
- **Authentication**: JWT with Google OAuth
- **Caching**: Redis
- **Background Tasks**: Celery
- **Storage**: AWS S3
- **ML Libraries**: scikit-learn, pandas, numpy
- **AI Integration**: OpenAI, Anthropic, Google Gemini (via DynaRoute)
- **Logging**: Loguru

**API Structure:**

- `auth_student.py` - Student authentication & registration
- `projects.py` - Project CRUD operations
- `datasets.py` - Dataset upload and management
- `pipelines.py` - ML pipeline execution (traditional)
- `genai_pipelines.py` - AI-powered pipeline execution
- `genai.py` - AI chatbot integration
- `tasks.py` - Background task management
- `sharing.py` - Project sharing functionality
- `knowledge_base.py` - RAG-based knowledge system
- `secrets.py` - Secure secrets management
- `mentor/` - AI Mentor system with personalized guidance

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.10+
- PostgreSQL 14+
- Redis (for caching and background tasks)
- AWS account (optional, for S3 storage)

### Run on a VM with Docker

1. Install Docker Engine and the Docker Compose plugin on the VM, then clone this repository.
2. Create the server environment file and set the production values, especially `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_ORIGINS`, and any required API keys:

```bash
cp server/.env.example server/.env
chmod 600 server/.env
```

3. Start Flow ML from the repository root:

```bash
docker compose up -d --build
```

The web application is available on port `80`; the API is exposed only on the VM loopback interface at port `3003`. Check service status with `docker compose ps` and logs with `docker compose logs -f`.

### Client Setup

```bash
cd client
npm install
npm run dev
```

The client will run on `http://localhost:5173`

### Server Setup

1. **Install Python dependencies:**

```bash
cd server
uv sync
```

2. **Set up environment variables:**
   Create a `.env` file in the `/server` directory with:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/flow_ml

# Security
SECRET_KEY=your-secret-key-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3 (optional)
USE_S3=true
S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# AI APIs
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_API_KEY=your-gemini-key
```

3. **Run database migrations:**

```bash
alembic upgrade head
```

4. **Start the server:**

```bash
uvicorn main:app --reload
```

The server will run on `http://localhost:8000`

API documentation available at `http://localhost:8000/docs`

### Background Workers (Optional)

For background task processing:

```bash
celery -A app.workers.celery_app worker --loglevel=info
celery -A app.workers.celery_app beat --loglevel=info
```

## 🗂️ Project Structure

```
Flow-ML/
├── client/                    # React frontend
│   ├── src/
│   │   ├── app/              # Main app component & routing
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (Auth, Dashboard, Playground)
│   │   ├── features/         # Feature-specific components
│   │   ├── store/            # Zustand state management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── config/           # Configuration files
│   │   ├── utils/            # Utility functions
│   │   └── types/            # TypeScript type definitions
│   ├── public/               # Static assets
│   └── package.json
│
├── server/                   # FastAPI backend
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── core/            # Core configuration & security
│   │   ├── db/              # Database configuration
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic services
│   │   ├── ml/              # ML pipeline engine & nodes
│   │   │   ├── algorithms/  # ML algorithm implementations
│   │   │   ├── nodes/       # Pipeline node definitions
│   │   │   ├── providers/   # AI provider integrations
│   │   │   ├── engine.py    # Pipeline execution engine
│   │   │   └── genai_engine.py  # AI-powered pipeline engine
│   │   ├── mentor/          # AI Mentor system
│   │   ├── tasks/           # Celery background tasks
│   │   ├── utils/           # Utility functions
│   │   └── workers/         # Celery worker configuration
│   ├── models/              # Trained model artifacts
│   ├── uploads/             # Uploaded datasets
│   ├── alembic/             # Database migrations
│   ├── main.py              # FastAPI application entry
│   └── pyproject.toml
│
└── readme.md                # This file
```

## 🎯 Usage

### For Students

1. **Sign Up/Sign In**: Create an account or use Google OAuth
2. **Create Project**: Start a new ML project from the dashboard
3. **Upload Data**: Upload your CSV dataset
4. **Build Pipeline**: Use the visual node editor to:
   - Preview and clean data
   - Handle missing values
   - Encode categorical features
   - Scale numerical features
   - Split train/test data
   - Train ML models
   - Evaluate results
5. **Get AI Help**: Use the AI Mentor for guidance and explanations
6. **Share Projects**: Generate share links for collaboration

### For Administrators

1. **Admin Login**: Access at `/admin/login`
2. **Monitor Users**: View student analytics and activity
3. **System Overview**: Monitor platform usage and performance

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Google OAuth 2.0 integration
- Password hashing with Argon2
- CORS protection
- Request validation with Pydantic
- Rate limiting (configurable)
- Secure secrets management
- Environment-based configuration

## 🚀 Production Deployment

### Frontend

- Pre-configured for Vercel deployment
- Build: `npm run build`
- Preview: `npm run preview`

### Backend

- WSGI server: Uvicorn with workers
- Database: PostgreSQL with connection pooling
- Caching: Redis for performance
- Storage: AWS S3 for scalability
- Environment: Set `ENVIRONMENT=production`

**Recommended Stack:**

- Frontend: Vercel
- Backend: Railway, Render, or AWS
- Database: Neon, Supabase, or AWS RDS
- Cache/Queue: Redis Cloud or AWS ElastiCache
- Storage: AWS S3

## 📊 Key Technologies

| Layer        | Technologies                                               |
| ------------ | ---------------------------------------------------------- |
| **Frontend** | React, TypeScript, Vite, TailwindCSS, React Query, Zustand |
| **Backend**  | FastAPI, SQLAlchemy, Pydantic, Celery                      |
| **Database** | PostgreSQL, Redis                                          |
| **ML/AI**    | scikit-learn, pandas, numpy, OpenAI, Anthropic, Gemini     |
| **DevOps**   | Alembic, Uvicorn, Docker-ready                             |
| **Storage**  | AWS S3, Local filesystem                                   |
