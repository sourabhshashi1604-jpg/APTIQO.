
# APTIQO – Technology Stack

This document defines the technologies, libraries, and services used to build APTIQO. All choices are made to:

- Support the features in **Features.md**  
- Align with the architecture in **Architecture.md**  
- Work with the data model in **Database.md**  
- Enable the API design in **API.md**  
- Remain **cost-effective** (free tiers where possible) during development and early launch  

***

## 1. Frontend

**Purpose:** Single-page web application for all user roles (job seekers, professionals, recruiters, admins).

- **Framework**: React  
- **Build Tool**: Vite  
- **Language**: TypeScript  
- **Styling**: Tailwind CSS (aligned with APTIQO Design System)  
- **Routing**: React Router  
- **HTTP Client**: Axios  
- **Server State**: TanStack Query (React Query)  
- **Forms**: React Hook Form  
- **Validation**: Zod (shared with backend where possible)  
- **Animations**: Framer Motion (for micro-interactions and smooth transitions)  

**Rationale:**

- React + Vite + TypeScript provides a fast, modern, and type-safe frontend.  
- Tailwind CSS enables rapid, consistent UI development aligned with the design system.  
- TanStack Query simplifies data fetching, caching, and background refetching.  
- React Hook Form + Zod gives robust form handling with clear validation rules.  

**Cost:**

- All listed frontend tools are **open-source and free**.

***

## 2. Backend

**Purpose:** Central REST API handling authentication, business logic, and orchestration between frontend, database, ML service, and storage.

- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Language**: TypeScript  
- **Authentication**:  
  - JWT-based session management  
  - Google OAuth (via official libraries or well-maintained OSS packages)  
- **Security Middleware**:  
  - Helmet (security headers)  
  - CORS (cross-origin control)  
  - Express rate limiting  
- **Validation**: Zod or Joi (consistent with frontend schemas where feasible)  

**Rationale:**

- Node.js + Express is lightweight, widely supported, and easy to deploy on free/low-cost platforms.  
- TypeScript improves maintainability and reduces runtime errors.  
- JWT + Google OAuth balances simplicity and security for an MVP.  

**Cost:**

- All backend tools and libraries are **open-source and free**.  
- Hosting can start on free tiers (Render, Railway, etc.) and scale as needed.

***

## 3. Database

**Purpose:** Primary datastore for all application entities (users, profiles, opportunities, assessments,Career Digital Twins, etc.).

- **Database**: MongoDB Atlas (managed MongoDB)  
- **ODM**: Mongoose  

**Rationale:**

- MongoDB’s flexible schema aligns with evolving features and complex nested data (e.g., profiles, career data).  
- Atlas provides a free tier suitable for development and early usage, with built-in backups and monitoring.  
- Mongoose simplifies schema definition, validation, and queries while keeping MongoDB’s flexibility.  

**Cost:**

- MongoDB Atlas **free tier** (shared cluster) is sufficient for early development and initial users.

***

## 4. AI / ML Service

**Purpose:** Provide AI-driven career intelligence (resume analysis, scoring, recommendations, predictions).

- **Language**: Python  
- **Framework**: FastAPI  
- **Core Libraries**:  
  - NumPy  
  - Pandas  
  - Scikit-learn  
- **Optional (future)**:  
  - Transformer-based models via Hugging Face (free models, self-hosted)  
  - Lightweight LLM orchestration if needed  

**Rationale:**

- Python is the de facto standard for ML and data processing.  
- FastAPI offers high performance, automatic OpenAPI docs, and easy integration with Node.js backend.  
- NumPy, Pandas, and Scikit-learn cover most classical ML and data transformation needs without cost.  

**Deployment (initial):**

- Deploy as a separate service on a free/low-cost platform (Render, Railway, or similar).  
- Communicate with backend via internal or public HTTPS endpoints.  

**Cost:**

- All listed libraries are **open-source and free**.  
- Hosting can start on free tiers; GPU not required for initial models.

***

## 5. File Storage

**Purpose:** Store user-uploaded files such as profile images, resumes, and portfolio assets.

- **Images (profile photos, small media)**: Cloudinary  
- **Resumes & Documents**: AWS S3 (or Cloudinary as a simpler alternative if preferred)  

**Rationale:**

- Cloudinary offers:
  - Free tier with generous limits.  
  - Built-in image optimization, transformations, and CDN.  
- AWS S3 offers:
  - Low-cost, durable object storage for larger files (resumes, documents).  
  - Free tier for the first 12 months (5 GB standard storage).  

**Implementation notes:**

- Frontend never uploads directly to storage.  
- Backend handles:
  - Receiving file from frontend.  
  - Uploading to Cloudinary / S3.  
  - Storing file URL/metadata in MongoDB (`profiles`, etc.).  

**Cost:**

- Cloudinary **free tier** is sufficient for early-stage image storage.  
- AWS S3 free tier + low ongoing costs for documents.

***

## 6. Security

**Goals:** Protect user data, secure APIs, and follow best practices from day one.

- **Authentication**:  
  - JWT for session management  
  - Google OAuth for social login  
- **Password Hashing**: bcrypt  
- **HTTP Security**:  
  - Helmet (security headers)  
  - CORS configuration  
- **Rate Limiting**: express-rate-limit or equivalent  
- **Input Validation**: Zod / Joi on all API inputs  
- **Environment Secrets**:  
  - Use environment variables (e.g., `.env` locally, secrets in hosting platform).  
  - Never commit secrets to Git.  

**Cost:**

- All listed security tools/libraries are **open-source and free**.

***

## 7. Development Tools

- **Version Control**: Git  
- **Repository Hosting**: GitHub  
- **Code Editor**: VS Code  
- **API Testing**: Postman (or Insomnia / HTTP clients in VS Code)  
- **Containerization (future)**: Docker  
- **Package Management**:  
  - Frontend: npm or pnpm  
  - Backend: npm or pnpm  
  - ML: pip + virtualenv or poetry  

**Cost:**

- All tools are **free** for individual and small-team use.

***

## 8. Testing

**Goals:** Ensure reliability of critical flows (auth, profile, career analysis, assessments, jobs, network).

### Backend

- **Test Framework**: Jest  
- **HTTP Testing**: Supertest  
- **Focus Areas**:  
  - Authentication endpoints  
  - Profile CRUD  
  - Career analysis orchestration  
  - Assessments  
  - Opportunities  

### Frontend

- **Test Framework**: Jest + React Testing Library  
- **Focus Areas**:  
  - Critical components (forms, career views, job cards)  
  - Key user flows (signup, profile completion, resume upload, assessment flow)  

**Cost:**

- All testing tools are **open-source and free**.

***

## 9. Deployment

### Frontend

- **Platform**: Vercel (or Netlify)  
- **Reasons**:  
  - Free tier for static sites and SPAs.  
  - Simple CI/CD from GitHub.  
  - Global CDN and automatic HTTPS.  

### Backend

- **Platform**: Render or Railway  
- **Reasons**:  
  - Free/low-cost tiers for Node.js services.  
  - Easy GitHub integration.  
  - Built-in environment variable management.  

### Database

- **Platform**: MongoDB Atlas  
- **Plan**: Start with free shared cluster.  
- **Reasons**:  
  - Managed service with backups, monitoring, and easy scaling.  

### ML Service

- **Platform**: Render (or similar)  
- **Reasons**:  
  - Supports Python/FastAPI services.  
  - Free/low-cost tiers for small workloads.  

### File Storage

- **Images**: Cloudinary (free tier)  
- **Resumes & Documents**: AWS S3 (free tier for first 12 months, then low cost)  

**Cost:**

- Entire initial stack can run on **free tiers** with minimal cost until significant traffic.

***

## 10. CI/CD (Future)

- **CI/CD Platform**: GitHub Actions  
- **Containerization**: Docker  
- **Orchestration (far future)**: Kubernetes (only when scale truly requires it)  

**Goals:**

- Automated tests on every push.  
- Automated deployments to staging/production.  
- Consistent environments via Docker.  

**Cost:**

- GitHub Actions has a generous free tier for small projects.

***

## 11. Monitoring & Observability (Future)

- **Error Tracking**: Sentry (free tier for small projects)  
- **Metrics & Monitoring**:  
  - Prometheus + Grafana (self-hosted, open-source)  
- **Logging**:  
  - Start with platform logs (Render, Vercel, Atlas).  
  - Add structured logging as the system grows.  

**Cost:**

- Initial monitoring can rely on **free tiers** and built-in platform logs.

***

## 12. API Standards

- **Style**: REST  
- **Data Format**: JSON  
- **Versioning**: URL-based versioning (`/v1/...`)  
- **Documentation**:  
  - OpenAPI/Swagger (auto-generated for ML service via FastAPI).  
  - Manual but structured API.md for Node.js backend.  

**Goals:**

- Clear, consistent contracts between frontend, backend, and ML service.  
- Easy to evolve APIs without breaking existing clients.

***

## 13. Architecture Patterns

- **Overall Pattern**: Client–Server  
- **Frontend**: Component-based architecture (React)  
- **Backend**: RESTful, modular service structure  
- **ML Service**: Service-oriented, exposed via HTTP APIs  
- **Folder Structure**: Modular and domain-driven (e.g., `auth`, `users`, `career`, `opportunities`, `assessments`, `network`)  

**Alignment:**

- Directly supports the architecture defined in **Architecture.md**.  
- Enables clean separation between:
  - Frontend (UI + client state)  
  - Backend (business logic + orchestration)  
  - ML service (AI/ML logic)  
  - Database (persistent state)  

***

## 14. Cost & Sustainability Summary

- **Frontend**: 100% open-source, free tools.  
- **Backend**: 100% open-source, free tools.  
- **Database**: MongoDB Atlas free tier initially.  
- **ML Service**: Open-source Python stack; free-tier hosting.  
- **Storage**: Cloudinary free tier + AWS S3 free tier (first 12 months).  
- **Deployment**: Vercel + Render/Railway free tiers.  
- **Testing & Dev Tools**: All open-source and free.  

This stack is designed to:

- Let you build and launch an MVP with **minimal or zero cost**.  
- Scale incrementally as usage grows, without major re-architecture.  
- Stay aligned with your existing design, data, and API plans.

