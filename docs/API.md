
# APTIQO – API Documentation

This document defines the REST API for APTIQO. It describes how the **frontend**, **backend**, and **ML service** exchange data to power features defined in **Features.md**, using the data model from **Database.md** and the architecture from **Architecture.md**.

***

## 1. General Conventions

### 1.1 Base URL

All API calls are made to:

```text
https://api.aptiqo.com/v1
```

(Adjust domain and versioning as needed.)

***

### 1.2 Authentication

- Most endpoints require authentication via **JWT**.
- JWT is sent in the `Authorization` header:

```http
Authorization: Bearer <jwt_token>
```

- Public endpoints (e.g., `/auth/login`, `/auth/signup`) explicitly state “Authentication: Not required”.

***

### 1.3 Response Format

All responses use JSON.

**Success example:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message"
}
```

**Error example:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
```

***

### 1.4 Pagination

List endpoints use query parameters:

- `page` (default: 1)  
- `limit` (default: 20, max: 100)  

Response includes:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

***

### 1.5 Status Codes

Common HTTP status codes:

- `200 OK` – Successful GET/PUT/PATCH.  
- `201 Created` – Successful POST creating a resource.  
- `204 No Content` – Successful DELETE (no body).  
- `400 Bad Request` – Invalid input.  
- `401 Unauthorized` – Missing or invalid JWT.  
- `403 Forbidden` – Authenticated but not allowed.  
- `404 Not Found` – Resource not found.  
- `409 Conflict` – Duplicate resource (e.g., email already exists).  
- `500 Internal Server Error` – Server-side error.

***

## 2. Endpoint Template

For every endpoint, document:

```md
## METHOD /path

### Purpose
One-sentence description.

### Authentication
Required / Not required

### Request
- **Headers**
- **Path Parameters**
- **Query Parameters**
- **Body** (JSON schema / example)

### Success Response
- **Status Code**
- **Body** (JSON schema / example)

### Error Response
- Example error responses and codes.

### Status Codes
List of possible HTTP status codes for this endpoint.

### Database Collections
Which MongoDB collections are read/written.

### Used By
Which frontend modules / features use this endpoint.

### Related Features
Links to sections in Features.md.
```

Below is the full endpoint list, organized by module. You can expand each using the template above.

***

## 3. Authentication

### POST /auth/signup

**Purpose:** Register a new user account.  
**Authentication:** Not required  

- **Collections:** `users`, `profiles` (optional initial profile)  
- **Used By:** Auth module, onboarding flow  
- **Related Features:** Authentication

***

### POST /auth/login

**Purpose:** Authenticate user and issue JWT.  
**Authentication:** Not required  

- **Collections:** `users`  
- **Used By:** Login screen  
- **Related Features:** Authentication

***

### POST /auth/google

**Purpose:** Authenticate via Google OAuth and issue JWT.  
**Authentication:** Not required  

- **Collections:** `users`  
- **Used By:** Google sign-in button  
- **Related Features:** Authentication

***

### POST /auth/logout

**Purpose:** Invalidate current session / token (server-side blacklist if used).  
**Authentication:** Required  

- **Collections:** `users` (optionally sessions table if added later)  
- **Used By:** Logout action  
- **Related Features:** Authentication

***

### POST /auth/forgot-password

**Purpose:** Request password reset email.  
**Authentication:** Not required  

- **Collections:** `users`  
- **Used By:** “Forgot password” flow  
- **Related Features:** Authentication

***

### POST /auth/reset-password

**Purpose:** Reset password using token.  
**Authentication:** Not required  

- **Collections:** `users`  
- **Used By:** Password reset page  
- **Related Features:** Authentication

***

### GET /auth/me

**Purpose:** Get current authenticated user’s basic info.  
**Authentication:** Required  

- **Collections:** `users`, `profiles` (optional join)  
- **Used By:** Navbar, profile dropdown, route guards  
- **Related Features:** Authentication, User Profile

***

## 4. User Profile

### GET /users/profile

**Purpose:** Get current user’s full profile.  
**Authentication:** Required  

- **Collections:** `profiles`, `users`  
- **Used By:** Profile page, onboarding  
- **Related Features:** User Profile

***

### PUT /users/profile

**Purpose:** Update current user’s profile.  
**Authentication:** Required  

- **Collections:** `profiles`  
- **Used By:** Profile editor  
- **Related Features:** User Profile

***

### DELETE /users/profile

**Purpose:** Soft-delete or anonymize user profile (may also deactivate account).  
**Authentication:** Required  

- **Collections:** `profiles`, `users`  
- **Used By:** Account settings  
- **Related Features:** User Profile, Data & Privacy

***

### POST /users/profile/image

**Purpose:** Upload/update profile photo.  
**Authentication:** Required  

- **Collections:** `profiles`, cloud storage  
- **Used By:** Profile photo uploader  
- **Related Features:** User Profile

***

### GET /users/:id

**Purpose:** Get public profile of another user (by ID).  
**Authentication:** Required (or optional, depending on privacy rules)  

- **Collections:** `profiles`, `users`  
- **Used By:** Network profiles, people search  
- **Related Features:** Professional Network, Community

***

## 5. Resume Management

### POST /resume/upload

**Purpose:** Upload a resume file (PDF/DOCX).  
**Authentication:** Required  

- **Collections:** `profiles`, cloud storage  
- **Used By:** Resume upload UI  
- **Related Features:** User Profile, AI Career Intelligence

***

### GET /resume

**Purpose:** Get current user’s resume metadata (and download URLs).  
**Authentication:** Required  

- **Collections:** `profiles`, cloud storage  
- **Used By:** Resume section in profile  
- **Related Features:** User Profile

***

### DELETE /resume

**Purpose:** Delete a specific resume.  
**Authentication:** Required  

- **Collections:** `profiles`, cloud storage  
- **Used By:** Resume management UI  
- **Related Features:** User Profile

***

### POST /resume/analyze

**Purpose:** Trigger AI resume analysis (calls ML service).  
**Authentication:** Required  

- **Collections:** `profiles`, `career_digital_twins`, ML service  
- **Used By:** “Analyze my resume” action  
- **Related Features:** AI Career Intelligence Engine

***

## 6. AI Career Intelligence Engine

### POST /career/analyze

**Purpose:** Run full career analysis (resume + profile + skills + assessments) to update Career Digital Twin.  
**Authentication:** Required  

- **Collections:** `profiles`, `career_digital_twins`, `assessments`, `skills`, ML service  
- **Used By:** Career Intelligence dashboard  
- **Related Features:** AI Career Intelligence Engine

***

### GET /career/digital-twin

**Purpose:** Get current user’s Career Digital Twin data.  
**Authentication:** Required  

- **Collections:** `career_digital_twins`, `profiles`  
- **Used By:** Career DNA, readiness, growth views  
- **Related Features:** AI Career Intelligence Engine

***

### GET /career/readiness-score

**Purpose:** Get Opportunity Readiness Score and dimension breakdown.  
**Authentication:** Required  

- **Collections:** `career_digital_twins`  
- **Used By:** Dashboard, Career Intelligence views  
- **Related Features:** AI Career Intelligence Engine

***

### GET /career/career-dna

**Purpose:** Get Career DNA (strengths, interests, work style, potential paths).  
**Authentication:** Required  

- **Collections:** `career_digital_twins`  
- **Used By:** Career DNA view  
- **Related Features:** AI Career Intelligence Engine

***

### GET /career/skill-gap

**Purpose:** Get skill gap analysis for target roles.  
**Authentication:** Required  

- **Collections:** `career_digital_twins`, `skills`, `profiles`  
- **Used By:** Skill gap view, Learning Hub  
- **Related Features:** AI Career Intelligence Engine, Learning Hub

***

### GET /career/growth-prediction

**Purpose:** Get predicted career paths and growth timeline.  
**Authentication:** Required  

- **Collections:** `career_digital_twins`  
- **Used By:** Career growth view  
- **Related Features:** AI Career Intelligence Engine

***

### GET /career/recommendations

**Purpose:** Get personalized recommendations (jobs, learning, connections).  
**Authentication:** Required  

- **Collections:** `recommendations`, `opportunities`, `users`, `companies`  
- **Used By:** Dashboard, recommendation carousels  
- **Related Features:** AI Career Intelligence Engine, Opportunity Explorer, Learning Hub, Professional Network

***

## 7. Skill Assessment

### GET /assessments

**Purpose:** List assessments (available and/or taken by user).  
**Authentication:** Required  

- **Collections:** `assessments`, `skills`  
- **Used By:** Assessments page  
- **Related Features:** Skill Verification

***

### POST /assessments/start

**Purpose:** Start a new assessment attempt.  
**Authentication:** Required  

- **Collections:** `assessments`  
- **Used By:** Assessment flow  
- **Related Features:** Skill Verification

***

### POST /assessments/submit

**Purpose:** Submit assessment answers and get score.  
**Authentication:** Required  

- **Collections:** `assessments`, `skills`, optionally ML service for scoring  
- **Used By:** Assessment completion  
- **Related Features:** Skill Verification

***

### GET /assessments/result

**Purpose:** Get result of a specific assessment attempt.  
**Authentication:** Required  

- **Collections:** `assessments`  
- **Used By:** Assessment results view  
- **Related Features:** Skill Verification

***

## 8. Jobs & Opportunities

### GET /jobs

**Purpose:** List opportunities with filters (role, location, work mode, etc.).  
**Authentication:** Required (or optional for public browsing)  

- **Collections:** `opportunities`, `companies`, `skills`  
- **Used By:** Opportunity Explorer  
- **Related Features:** Opportunity Explorer

***

### GET /jobs/:id

**Purpose:** Get details of a specific opportunity.  
**Authentication:** Required (or optional)  

- **Collections:** `opportunities`, `companies`  
- **Used By:** Job detail page  
- **Related Features:** Opportunity Explorer

***

### GET /jobs/recommended

**Purpose:** Get job recommendations for current user.  
**Authentication:** Required  

- **Collections:** `recommendations`, `opportunities`, `companies`  
- **Used By:** “Recommended for you” section  
- **Related Features:** AI Career Intelligence Engine, Opportunity Explorer

***

### POST /jobs/apply

**Purpose:** Apply to a job (record application, optionally redirect to external URL).  
**Authentication:** Required  

- **Collections:** `opportunities`, optionally a future `applications` collection  
- **Used By:** Job apply button  
- **Related Features:** Opportunity Explorer

***

## 9. Companies

### GET /companies

**Purpose:** List companies with filters (industry, size, location).  
**Authentication:** Required (or optional)  

- **Collections:** `companies`  
- **Used By:** Company explorer  
- **Related Features:** Opportunity Explorer

***

### GET /companies/:id

**Purpose:** Get details of a specific company.  
**Authentication:** Required (or optional)  

- **Collections:** `companies`, `opportunities` (for openings)  
- **Used By:** Company profile page  
- **Related Features:** Opportunity Explorer

***

### GET /companies/reviews

**Purpose:** Get reviews/ratings for a company (if implemented).  
**Authentication:** Required (or optional)  

- **Collections:** (future `reviews` collection)  
- **Used By:** Company profile  
- **Related Features:** Opportunity Explorer (future)

***

### GET /companies/openings

**Purpose:** Get open opportunities for a company.  
**Authentication:** Required (or optional)  

- **Collections:** `opportunities`, `companies`  
- **Used By:** Company profile → “Open positions”  
- **Related Features:** Opportunity Explorer

***

## 10. Learning Hub

### GET /learning/path

**Purpose:** Get personalized learning roadmap.  
**Authentication:** Required  

- **Collections:** `career_digital_twins`, (future `learning_resources`)  
- **Used By:** Learning Hub roadmap view  
- **Related Features:** Learning Hub

***

### GET /learning/recommendations

**Purpose:** Get recommended courses, certifications, projects.  
**Authentication:** Required  

- **Collections:** `recommendations`, (future `learning_resources`)  
- **Used By:** Learning Hub recommendations  
- **Related Features:** Learning Hub, AI Career Intelligence Engine

***

### POST /learning/progress

**Purpose:** Record learning progress (course completed, project done, etc.).  
**Authentication:** Required  

- **Collections:** (future `learning_progress` or similar), `profiles` (optional update)  
- **Used By:** Learning Hub progress tracking  
- **Related Features:** Learning Hub

***

### GET /learning/progress

**Purpose:** Get user’s learning progress summary.  
**Authentication:** Required  

- **Collections:** (future `learning_progress`), `career_digital_twins` (optional)  
- **Used By:** Learning Hub progress view, Dashboard  
- **Related Features:** Learning Hub, Dashboard

***

## 11. Dashboard

### GET /dashboard

**Purpose:** Get consolidated dashboard data (summary cards, quick stats).  
**Authentication:** Required  

- **Collections:** `profiles`, `career_digital_twins`, `recommendations`, `notifications`  
- **Used By:** Main dashboard page  
- **Related Features:** Dashboard, AI Career Intelligence Engine

***

### GET /dashboard/analytics

**Purpose:** Get detailed career analytics (charts, trends).  
**Authentication:** Required  

- **Collections:** `career_digital_twins`, `assessments`, (future `learning_progress`)  
- **Used By:** Analytics tab in dashboard  
- **Related Features:** Dashboard

***

### GET /dashboard/activity

**Purpose:** Get activity timeline (applications, assessments, learning, profile updates).  
**Authentication:** Required  

- **Collections:** (future `activities` or aggregated from other collections)  
- **Used By:** Activity timeline in dashboard  
- **Related Features:** Dashboard

***

## 12. Networking

### GET /connections

**Purpose:** List current user’s connections and pending requests.  
**Authentication:** Required  

- **Collections:** `connections`, `users`, `profiles`  
- **Used By:** Network page  
- **Related Features:** Professional Network

***

### POST /connections/request

**Purpose:** Send a connection request to another user.  
**Authentication:** Required  

- **Collections:** `connections`  
- **Used By:** “Connect” button on profiles  
- **Related Features:** Professional Network

***

### PUT /connections/accept

**Purpose:** Accept a pending connection request.  
**Authentication:** Required  

- **Collections:** `connections`  
- **Used By:** Connection request UI  
- **Related Features:** Professional Network

***

### DELETE /connections/remove

**Purpose:** Remove a connection or cancel a request.  
**Authentication:** Required  

- **Collections:** `connections`  
- **Used By:** Connection management UI  
- **Related Features:** Professional Network

***

## 13. Notifications

### GET /notifications

**Purpose:** List notifications for current user.  
**Authentication:** Required  

- **Collections:** `notifications`  
- **Used By:** Notification panel  
- **Related Features:** Notifications & Communication

***

### PUT /notifications/read

**Purpose:** Mark one or more notifications as read.  
**Authentication:** Required  

- **Collections:** `notifications`  
- **Used By:** Notification interactions  
- **Related Features:** Notifications & Communication

***

### DELETE /notifications/:id

**Purpose:** Delete a specific notification.  
**Authentication:** Required  

- **Collections:** `notifications`  
- **Used By:** Notification management  
- **Related Features:** Notifications & Communication

***

## 14. Search

### GET /search/users

**Purpose:** Search users by name, skills, location, etc.  
**Authentication:** Required  

- **Collections:** `users`, `profiles`, `skills`  
- **Used By:** People discovery in network  
- **Related Features:** Professional Network

***

### GET /search/jobs

**Purpose:** Search jobs with advanced filters.  
**Authentication:** Required (or optional)  

- **Collections:** `opportunities`, `companies`, `skills`  
- **Used By:** Job search UI  
- **Related Features:** Opportunity Explorer

***

### GET /search/companies

**Purpose:** Search companies by name, industry, location.  
**Authentication:** Required (or optional)  

- **Collections:** `companies`  
- **Used By:** Company search UI  
- **Related Features:** Opportunity Explorer

***

### GET /search/skills

**Purpose:** Search skills (for autocomplete, tagging, etc.).  
**Authentication:** Required (or optional)  

- **Collections:** `skills`  
- **Used By:** Skill selectors across the app  
- **Related Features:** Multiple (Profile, Assessments, Opportunities)

