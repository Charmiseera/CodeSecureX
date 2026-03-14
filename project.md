````markdown
# 🚀 SecureCodeAI — Team Development Task Board
**Project:** LLM-Based Secure Code Review & Vulnerability Explanation System  
**Architecture:** Next.js Frontend + FastAPI Backend + LLM API  
**Development Type:** Full Project (not a hackathon sprint)  
**Team:** 2 Developers — Frontend (FE) + Backend (BE)

---

# 🗺️ High-Level Development Timeline

| Phase | Duration | FE Focus | BE Focus |
|------|----------|----------|----------|
| Phase 1 — Project Setup | Day 1 | Next.js + Tailwind + UI setup | FastAPI + LLM service setup |
| Phase 2 — Core Development | Day 2–4 | Code editor UI + scan dashboard | Vulnerability detection APIs |
| Phase 3 — Integration | Day 5–6 | Connect APIs + UI polish | Validation + error handling |
| Phase 4 — Advanced Features | Day 7–8 | Scan history UI + admin panel | Database + report generation |
| Phase 5 — Testing & Deployment | Day 9–10 | Responsive UI + demo prep | API testing + Docker deployment |

---

# 👤 PERSON 1 — Frontend Developer

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, ShadCN UI, Axios, Monaco Editor

---

# ✅ PHASE 1 — Setup

### T1.1 Initialize Next.js project

```bash
npx create-next-app@latest frontend --typescript --tailwind --app
````

### T1.2 Install dependencies

```bash
npm install axios
npm install @monaco-editor/react
```

### T1.3 Install ShadCN UI

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input textarea badge table progress
```

### T1.4 Create Axios API service

Create:

frontend/services/api.ts

Base URL:

[http://localhost:8000](http://localhost:8000)

### T1.5 Frontend Folder Structure

```
frontend/
  app/
    page.tsx
    dashboard/page.tsx
    scan/page.tsx
    reports/page.tsx
    admin/page.tsx

  components/
    CodeEditor.tsx
    ScanForm.tsx
    VulnerabilityTable.tsx
    ReportViewer.tsx
    Navbar.tsx

  services/
    api.ts

  hooks/
    useAuth.ts

  styles/
    globals.css
```

---

# ✅ PHASE 2 — Core UI Development

## T2.1 Landing Page

File:

app/page.tsx

Features:

* Project introduction
* CTA button **Start Code Analysis**
* Redirect to `/scan`

---

## T2.2 Code Editor

File:

components/CodeEditor.tsx

Features:

* Monaco Editor
* Language selector:

Python
JavaScript
Java
PHP

* Code paste / upload

---

## T2.3 Scan Form

File:

components/ScanForm.tsx

Fields:

* Code editor
* Language selector
* Analyze button

API call:

POST /api/scan/analyze

---

## T2.4 Vulnerability Table

File:

components/VulnerabilityTable.tsx

Columns:

Type
Severity
Explanation
Suggested Fix

Severity colors:

Low → Green
Medium → Yellow
High → Red
Critical → Dark Red

---

## T2.5 Dashboard

File:

app/dashboard/page.tsx

Sections:

* Latest scan
* Vulnerability summary
* Severity statistics
* Scan history

---

## T2.6 Report Viewer

File:

components/ReportViewer.tsx

Features:

* Display analysis report
* Download PDF

API call:

GET /api/report/{report_id}

---

## T2.7 Admin Panel

File:

app/admin/page.tsx

Features:

* Total scans
* Active users
* Most common vulnerabilities

---

# ✅ PHASE 3 — Integration

Tasks:

* Connect frontend API calls
* Add loading spinners
* Implement error notifications
* Verify complete flow:

Code Input → Analyze → Vulnerabilities → Download Report

* Mobile responsive layout

---

# 👤 PERSON 2 — Backend Developer

**Stack:** Python, FastAPI, SQLAlchemy, MySQL, OpenAI/Gemini API

---

# ✅ PHASE 1 — Backend Setup

### T1.1 Create virtual environment

```bash
python -m venv venv
```

Activate:

Linux/Mac

```bash
source venv/bin/activate
```

Windows

```bash
venv\\Scripts\\activate
```

---

### T1.2 Install dependencies

```bash
pip install fastapi uvicorn sqlalchemy pymysql python-dotenv
pip install google-generativeai
pip install reportlab
pip install python-multipart
```

---

### T1.3 Backend Folder Structure

```
backend/
  main.py

  routes/
    auth.py
    scan.py
    report.py
    admin.py

  services/
    llm_service.py
    vulnerability_service.py
    report_service.py

  models/
    user_model.py
    scan_model.py
    report_model.py

  schemas/
    user_schema.py
    scan_schema.py
    report_schema.py

  database/
    connection.py

  utils/
    prompt_templates.py
    security.py
```

---

### T1.4 Environment Variables

Create:

backend/.env

```
LLM_API_KEY=your_api_key
DATABASE_URL=mysql://user:password@localhost/securecodeai
```

---

# ✅ PHASE 2 — Core API Development

## T2.1 LLM Service

File:

services/llm_service.py

Functions:

```
analyze_code_vulnerabilities(code, language)
generate_fix_recommendations(vulnerabilities)
explain_vulnerability(issue)
```

---

## T2.2 Code Scan API

Endpoint:

POST /api/scan/analyze

Request

```
{
  "code": "...",
  "language": "python"
}
```

Response

```
{
  "scan_id": 101,
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "severity": "High",
      "explanation": "User input used directly in SQL query",
      "fix": "Use parameterized queries"
    }
  ]
}
```

---

## T2.3 Report Generation

Endpoint

POST /api/report/generate

Output:

PDF security report

Library:

reportlab

---

## T2.4 Scan History

Endpoint

GET /api/history

Returns previous scans.

---

## T2.5 Admin APIs

Endpoints

GET /api/admin/users
POST /api/admin/suspend
GET /api/admin/analytics

---

# ✅ PHASE 3 — Integration & Validation

Tasks:

* Enable CORS for frontend

[http://localhost:3000](http://localhost:3000)

* Add Pydantic validation
* Implement try/except error handling
* Test APIs via Swagger

[http://localhost:8000/docs](http://localhost:8000/docs)

---

# 🔗 Integration Sync Points

| Sync Point        | Action                          |
| ----------------- | ------------------------------- |
| API Contract      | Define request/response formats |
| CORS Test         | FE sends first API request      |
| Scan Results      | Validate vulnerability JSON     |
| Report Generation | Verify PDF download             |

---

# 📦 Shared Decisions

| Decision      | Choice          |
| ------------- | --------------- |
| Frontend      | Next.js         |
| Backend       | FastAPI         |
| Database      | MySQL           |
| AI Model      | Gemini / OpenAI |
| Code Storage  | Hash only       |
| Report Format | PDF             |

---

# 🏆 Definition of Done

* User can paste or upload code
* System detects vulnerabilities
* AI explains security issues
* Fix suggestions generated
* Security report downloadable
* Admin dashboard works
* Scan history available
* Frontend + backend fully integrated
* UI responsive and polished

```
```