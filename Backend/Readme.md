**Backend API Documentation – Student Job Tracker Web Application**

---

### Overview
This backend supports a job tracking application with user authentication and CRUD operations for job entries.

## 📌 Developer Note
This documentation provides examples for each API route to avoid confusion during registration, login, or any job-related operation. You can modify the fields and behavior based on your project’s exact requirements.

### Base URL:
`http://localhost:8000`

---

## Authentication
All job-related routes are **protected** and require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Routes

### 1. **Create User Account**
**POST** `/create-account`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "error": false,
  "user": { ... },
  "accessToken": "<jwt-token>",
  "message": "Registration Successful"
}
```

---

### 2. **Login User**
**POST** `/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Login Successful",
  "email": "john@example.com",
  "accessToken": "<jwt-token>"
}
```

---

### 3. **Get User Info**
**GET** `/get-user`

**Headers:** JWT token required.

**Response:**
```json
{
  "user": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "_id": "...",
    "createdOn": "..."
  },
  "message": ""
}
```

---

### 4. **Add Job**
**POST** `/add-job`

**Request Body:**
```json
{
  "company": "Google",
  "role": "SDE",
  "status": "Applied",
  "deadline": "2024-04-12T12:00:00Z",
  "applicationLink": "https://jobs.google.com"
}
```

**Response:**
```json
{
  "error": false,
  "job": { ... },
  "message": "Job added successfully"
}
```

---

### 5. **Edit Job**
**PUT** `/edit-job/:jobId`

**Request Body (any of the below):**
```json
{
  "company": "Google",
  "role": "SDE 2",
  "status": "Interview",
  "deadline": "2024-04-15T12:00:00Z",
  "applicationLink": "https://jobs.google.com"
}
```

**Response:**
```json
{
  "error": false,
  "job": { ... },
  "message": "Job updated successfully"
}
```

---

### 6. **Get All Jobs**
**GET** `/get-all-jobs`

**Response:**
```json
{
  "error": false,
  "jobs": [ ... ],
  "message": "All notes retrieved successfully"
}
```

---

### 7. **Delete Job**
**DELETE** `/delete-note/:jobId`

**Response:**
```json
{
  "error": false,
  "message": "Job deleted successfully"
}
```

---

### 8. **Pin/Unpin Job**
**PUT** `/update-job-pinned/:jobId`

**Request Body:**
```json
{
  "isPinned": true
}
```

**Response:**
```json
{
  "error": false,
  "job": { ... },
  "message": "Job updated successfully"
}
```

---

### 9. **Search Jobs**
**GET** `/search-jobs?query=google`

**Response:**
```json
{
  "error": false,
  "jobs": [ ... ],
  "message": "Job matching the search query retried succefully!"
}
```

---

## Mongoose Models

### User Model
```js
fullName: String,
email: String,
password: String,
createdOn: Date (default: current timestamp)
```

### Job Model
```js
company: String,
role: String,
status: String,
isPinned: Boolean (optional),
userId: String,
createdOn: Date (default: current timestamp),
applicationLink: String
```

---

## JWT Authentication Middleware
Checks for valid JWT and attaches the user info to `req.user`.

---

## Server
Runs on port `8000` or `process.env.PORT`

