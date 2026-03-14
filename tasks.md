````markdown
# 🚀 SecureCodeAI — Team Task Board
**Project:** LLM-Based Secure Code Review & Vulnerability Explanation System  
**Format:** Full Project Development  
**Team:** 2 Developers — Frontend (FE) + Backend (BE)

---

## 🗺️ High-Level Timeline

| Phase | Duration | FE Focus | BE Focus |
|-------|----------|----------|----------|
| **Phase 1 — Setup** | Day 1 | Next.js + Tailwind + ShadCN init | FastAPI + LLM service init |
| **Phase 2 — Core Build** | Day 2–4 | Code editor, dashboard, vulnerability UI | Vulnerability detection agents + API endpoints |
| **Phase 3 — Polish + Integrate** | Day 5–6 | Connect FE to BE, loading states, errors | CORS, validation, response tuning |
| **Phase 4 — Advanced Features** | Day 7–8 | Scan history UI, admin dashboard | Database integration, report generation |
| **Phase 5 — Testing & Demo Prep** | Day 9–10 | UI polish, responsiveness | API testing, deployment |

---

## 👤 PERSON 1 — Frontend Developer

> **Stack:** Next.js 14 (App Router), Tailwind CSS, ShadCN UI, Axios, Monaco Editor

---

### ✅ PHASE 1 — Setup

- [ ] **T1.1** — Bootstrap Next.js 14 project with App Router
  ```bash
  npx create-next-app@latest frontend --typescript --tailwind --app
````

* [ ] **T1.2** — Install ShadCN UI and initialize

  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card input label textarea badge progress table
  ```

* [ ] **T1.3** — Install Axios and Monaco Editor

  ```bash
  npm install axios
  npm install @monaco-editor/react
  ```

* [ ] **T1.4** — Create `services/api.ts` — base Axios instance pointing to `http://localhost:8000`

* [ ] **T1.5** — Set up `globals.css` with project theme colors

* [ ] **T1.6** — Create folder structure:

  ```
  app/
    page.tsx
    scan/page.tsx
    dashboard/page.tsx
    reports/page.tsx
    admin/page.tsx

  components/
    Navbar.tsx
    CodeEditor.tsx
    ScanForm.tsx
    VulnerabilityTable.tsx
    ReportViewer.tsx

  services/
    api.ts
  ```

---

### ✅ PHASE 2 — Core UI Build

#### 🧩 T2.1 — `CodeEditor.tsx` (Priority: CRITICAL)

* [ ] Monaco code editor
* [ ] Language selector:

  * Python
  * JavaScript
  * Java
  * PHP
* [ ] Copy/paste code input
* [ ] Optional file upload

---

#### 🔍 T2.2 — `ScanForm.tsx`

* [ ] Code editor
* [ ] Language dropdown
* [ ] "Analyze Code" button

On submit → call:

```
POST /api/scan/analyze
```

---

#### ⚠️ T2.3 — `VulnerabilityTable.tsx`

Display vulnerabilities in table format

Columns:

* Vulnerability Type
* Severity
* Explanation
* Fix Suggestion

Severity colors:

* Low → Green
* Medium → Yellow
* High → Red
* Critical → Dark Red

---

#### 📊 T2.4 — Dashboard (`dashboard/page.tsx`)

Sections:

* Latest scan results
* Vulnerability summary
* Severity distribution
* Scan history

---

#### 📄 T2.5 — `ReportViewer.tsx`

* Display generated security report
* "Download PDF" button

API:

```
GET /api/report/{report_id}
```

---

#### 👤 T2.6 — Admin Panel (`admin/page.tsx`)

Admin dashboard showing:

* Total scans
* Active users
* Most common vulnerabilities

---

### ✅ PHASE 3 — Integration & Polish

* [ ] Add loading spinners for API calls
* [ ] Add error toast notifications
* [ ] Connect all pages end‑to‑end

Flow:

```
Code Input → Analyze → Vulnerability Results → Report Download
```

* [ ] Mobile responsiveness check
* [ ] Add Navbar with logo "SecureCodeAI"

Navbar links:

* Home
* Scan Code
* Dashboard
* Reports

---

### ✅ PHASE 4 — Demo Prep

* [ ] Pre‑fill sample vulnerable code

Example:

```
query = "SELECT * FROM users WHERE id=" + user_input
```

* [ ] Run full demo flow once
* [ ] Capture screenshots / demo video

---

## 👤 PERSON 2 — Backend Developer

> **Stack:** FastAPI, Python 3.10+, Uvicorn, Gemini/OpenAI API, SQLAlchemy, ReportLab

---

### ✅ PHASE 1 — Setup

* [ ] **T1.1** — Create Python venv and install dependencies:

```bash
python -m venv venv
pip install fastapi uvicorn sqlalchemy pymysql python-dotenv
pip install google-generativeai
pip install reportlab
pip install python-multipart
```

* [ ] **T1.2** — Create `.env` file:

```
LLM_API_KEY=your_key_here
DATABASE_URL=mysql://user:password@localhost/securecodeai
```

* [ ] **T1.3** — Create `main.py` — FastAPI app with CORS middleware (allow `http://localhost:3000`)

* [ ] **T1.4** — Create folder structure:

```
backend/
  main.py

  routes/
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
    scan_schema.py
    report_schema.py

  database/
    connection.py

  utils/
    prompt_templates.py
```

---

### ✅ PHASE 2 — AI Agents + API Endpoints

#### 🤖 T2.1 — `services/llm_service.py` (Priority: CRITICAL)

Functions:

```
analyze_code_vulnerabilities(code, language)
generate_fix_recommendations(vulnerabilities)
explain_vulnerability(issue)
```

Model:

```
gemini-1.5-flash or GPT-4
```

---

#### 🔎 T2.2 — `routes/scan.py` — `POST /api/scan/analyze`

Accept request:

```
{
  "code": "...",
  "language": "python"
}
```

Steps:

1. Send code to LLM
2. Detect vulnerabilities
3. Format response

Return:

```
{
  "scan_id": 101,
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "severity": "High",
      "explanation": "...",
      "fix": "Use parameterized queries"
    }
  ]
}
```

---

#### 📄 T2.3 — `routes/report.py`

Endpoint:

```
POST /api/report/generate
```

Generate:

* PDF security report

Library:

```
reportlab
```

---

#### 📜 T2.4 — Scan History

Endpoint:

```
GET /api/history
```

Returns previous scans.

---

#### 👤 T2.5 — Admin APIs

```
GET /api/admin/users
POST /api/admin/suspend
GET /api/admin/analytics
```

---

### ✅ PHASE 3 — Integration & Polish

* [ ] Enable CORS in `main.py`

```
http://localhost:3000
```

* [ ] Add Pydantic validation
* [ ] Add try/except around LLM calls
* [ ] Test endpoints using Swagger

```
http://localhost:8000/docs
```

---

## 🔗 Integration Sync Points

| Sync Point          | When                | Action                           |
| ------------------- | ------------------- | -------------------------------- |
| **API Contract**    | After setup         | Agree on request/response format |
| **CORS Check**      | After enabling CORS | FE makes first API call          |
| **Scan Results**    | During integration  | Verify vulnerability JSON        |
| **Report Download** | During testing      | Ensure PDF downloads correctly   |

---

## 📦 Shared Decisions

| Decision      | Choice                    |
| ------------- | ------------------------- |
| Base URL      | `http://localhost:8000`   |
| AI Model      | Gemini / OpenAI           |
| Auth          | Optional (future version) |
| Database      | MySQL                     |
| Code Storage  | Hash only                 |
| Report Format | PDF                       |

---

## 🏆 Definition of Done

* [ ] User can paste or upload code
* [ ] System detects vulnerabilities automatically
* [ ] AI explains vulnerabilities clearly
* [ ] Secure fix suggestions provided
* [ ] Security report downloadable
* [ ] Admin dashboard functional
* [ ] Scan history available
* [ ] All API endpoints working
* [ ] UI polished and responsive
* [ ] End‑to‑end demo works without errors

```
```