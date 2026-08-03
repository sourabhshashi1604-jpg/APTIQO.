# APTIQO – Authentication Design v1.0

This document defines authentication, roles, and session strategy for APTIQO.  
It aligns with Features.md, Architecture.md, Database.md, and Wireframes.md.

---

## 1. Auth Roles & User Model

### 1.1 Roles (fixed, auth-level)

- `admin` – Platform management  
- `recruiter` – Company hiring & candidate management  
- `candidate` – All job seekers (students, freshers, experienced, technical/non-technical)

**Key idea:**  
A user’s **role never changes** after creation (except admin actions). Career evolution is handled in the **profile**, not by changing the role.

### 1.2 User Document (MongoDB `users` collection)

Authentication-only. No resume, no skills, no career data here.

```js
{
  _id: ObjectId,

  // Core auth
  email: String,                 // unique, indexed
  passwordHash: String,          // bcrypt; null for OAuth-only
  role: String,                  // "admin" | "recruiter" | "candidate"

  // Account status
  isEmailVerified: Boolean,
  isActive: Boolean,             // soft delete / deactivation
  isBlocked: Boolean,            // for abuse/spam

  // OAuth
  authProvider: String,          // "email" | "google"
  googleId: String,              // if Google OAuth
  googleEmail: String,           // mirror email for OAuth users

  // Sessions / tokens
  refreshTokenHash: String,      // optional, for refresh token rotation
  lastLoginAt: Date,

  // Audit
  createdAt: Date,
  updatedAt: Date,
  lastPasswordChangedAt: Date
}
```

**Indexes:**

- `{ email: 1 }` – unique  
- `{ role: 1, isActive: 1 }` – for admin listings  
- `{ googleId: 1 }` – unique, sparse (only for Google users)  

---

## 2. Profile Separation (Candidate Attributes)

All career-related data lives in `profiles`, not in `users`.

### 2.1 Profile Document (for candidates)

One profile per user (`user_id` unique).

```js
{
  _id: ObjectId,
  user_id: ObjectId,             // unique, indexed → users._id

  // Candidate-specific attributes
  userType: String,              // "student" | "fresher" | "experienced"
  domain: String,                // "technical" | "non-technical"
  employmentStatus: String,      // "student" | "internship" | "full-time" | "freelance" | "seeking"

  // Identity
  fullName: String,
  headline: String,
  location: String,
  bio: String,
  profilePhotoUrl: String,

  // Career data
  education: [ ... ],
  experience: [ ... ],
  skills: [ ... ],
  projects: [ ... ],
  resumes: [ ... ],
  careerPreferences: { ... },

  // Career Execution System (CES)
  opportunityReadiness: {
    overallScore: Number,        // 0–100
    lastUpdated: Date
  },
  weeklyMission: {
    weekStart: Date,
    tasks: [ ... ],
    completedCount: Number,
    rewardScore: Number
  },
  careerTimeline: [ ... ],       // milestones, achievements

  // Audit
  createdAt: Date,
  updatedAt: Date
}
```

**Key point:**  
When a student becomes an experienced engineer, you only update:

```js
profile.userType = "experienced"
profile.employmentStatus = "full-time" // or "seeking"
```

The `users.role` stays `"candidate"` forever.

---

## 3. Authentication Flows

### 3.1 Email/Password Signup

**Endpoint:** `POST /auth/signup`

**Request:**

```json
{
  "email": "shashi@example.com",
  "password": "StrongPass123!",
  "role": "candidate",
  "fullName": "Shashi"
}
```

**Flow:**

1. Validate input (email format, password strength, allowed role).  
2. Check if email already exists.  
3. Hash password (bcrypt).  
4. Create `users` document:
   - `email`, `passwordHash`, `role`  
   - `isEmailVerified = false`  
   - `isActive = true`  
5. Create minimal `profiles` document (can be mostly empty, to be filled in onboarding).  
6. Send verification email (with token).  
7. Issue JWT (access + optional refresh).  

**JWT payload (access token):**

```json
{
  "sub": "<user_id>",
  "email": "shashi@example.com",
  "role": "candidate",
  "iat": 1733000000,
  "exp": 1733003600
}
```

---

### 3.2 Login (Email/Password)

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "email": "shashi@example.com",
  "password": "StrongPass123!"
}
```

**Flow:**

1. Find user by email.  
2. Ensure:
   - `isActive === true`  
   - `isBlocked === false`  
3. Compare password with `passwordHash`.  
4. If valid:
   - Update `lastLoginAt`.  
   - Issue new JWT (access + optional refresh).  

**Response:**

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<random_token>", // if using refresh flow
  "user": {
    "id": "...",
    "email": "shashi@example.com",
    "role": "candidate"
  }
}
```

---

### 3.3 Google OAuth (Candidate & Recruiter)

**Endpoint:** `POST /auth/google`

**Request:**

```json
{
  "idToken": "<google_id_token>"
}
```

**Flow:**

1. Verify Google ID token on backend.  
2. Extract:
   - `googleId`  
   - `email`  
   - `name`  
3. Find user by `googleId` or `email`.  
4. If not found:
   - Create new `users` document:
     - `authProvider = "google"`  
     - `googleId`, `googleEmail`  
     - `role` (from request or default to `"candidate"`).  
   - Create minimal `profiles` document.  
5. If found:
   - Ensure `isActive === true`.  
6. Update `lastLoginAt`.  
7. Issue JWT as usual.

This supports both **candidate** and **recruiter** Google signups; role can be chosen during onboarding if needed.

---

## 4. JWT & Session Strategy

### 4.1 Access Token

- Short-lived (e.g., 15–60 minutes).  
- Contains:
  - `sub` (user_id)  
  - `email`  
  - `role`  
- Sent in `Authorization: Bearer <token>`.

### 4.2 Refresh Token (optional but recommended)

- Longer-lived (days/weeks).  
- Stored hashed in `users.refreshTokenHash`.  
- Endpoint: `POST /auth/refresh`

**Flow:**

1. Client sends `refreshToken`.  
2. Backend verifies and matches hash.  
3. Issues new access + new refresh token (rotation).  
4. Updates `refreshTokenHash`.

---

## 5. Role-Based Access Control (RBAC)

Use middleware to protect routes by role.

Examples:

- Candidate-only:
  - `GET /career/digital-twin`  
  - `POST /resume/upload`  
  - `GET /jobs/recommended`  

- Recruiter-only:
  - `GET /admin/candidates`  
  - `POST /jobs`  
  - `GET /pipeline`  

- Admin-only:
  - `GET /admin/users`  
  - `PUT /admin/users/:id/block`  
  - `GET /admin/reports`  

Middleware pattern (Express-style):

```js
function requireAuth() { ... }         // validates JWT
function requireRole(...roles) { ... } // checks user.role
```

Usage:

```js
router.get('/career/digital-twin',
  requireAuth(),
  requireRole('candidate'),
  getCareerDigitalTwin
);
```

---

## 6. Security Checklist (Auth-Specific)

- **Password hashing:** bcrypt with appropriate cost.  
- **Email verification:** required before critical actions (apply, post jobs).  
- **Rate limiting:** on `/auth/login`, `/auth/signup`, `/auth/forgot-password`.  
- **Account lockout / throttling:** after N failed logins.  
- **Secure cookies (if used):** `httpOnly`, `secure`, `sameSite`.  
- **CORS:** restrict origins to your frontend domain(s).  
- **Input validation:** Zod/Joi on all auth inputs.  
- **Audit logging:** login attempts, password changes, role changes (in `audit_logs`).

---

## 7. How This Fits Your Career Execution System (CES)

Because `role` is stable (`candidate`), all CES logic lives in **profile + AI services**, not in auth:

- **AI Mentor** → uses `profile` + `career_digital_twins`.  
- **Weekly Mission** → stored/updated in `profile.weeklyMission`.  
- **Opportunity Readiness Tracker** → uses `profile.opportunityReadiness` + `career_digital_twins`.  
- **Success Probability Engine** → uses profile, assessments, applications, and AI models.

Auth just answers:  
> “Who is this, and what high-level role do they have?”

Everything else (“student vs experienced”, “technical vs non-technical”, “readiness score”, “missions”) is profile + AI.