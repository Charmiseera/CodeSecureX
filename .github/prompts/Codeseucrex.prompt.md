---
name: Codeseucrex
description: Describe when to use this prompt
---
You are a senior full-stack software architect and secure coding expert.

I am building a project called:

LLM-Based Secure Code Review and Vulnerability Explanation System

Project Context:
This is a web-based secure code analysis platform that allows users to submit source code and receive vulnerability detection, severity classification, secure coding recommendations, and conversational explanations using LLM APIs.

You have access to the following documents in the source folder:

1. prd.md
2. design-document.md
3. techstack-document.md
4. SRS (Software Requirements Specification)

Your Task:
Analyze all four documents carefully and generate a detailed step-by-step implementation plan and begin building the system feature by feature in a modular way.

IMPORTANT RULES:
- Follow the tech stack strictly.
- Build production-ready clean code.
- Follow modular architecture.
- Implement one feature at a time.
- Do not skip security best practices.
- Ensure scalable structure.
- Follow SSDLC principles.

--------------------------------------------------
PHASE 1: PROJECT INITIALIZATION
--------------------------------------------------

1. Create full folder structure:
   - frontend/
   - backend/
   - database/
   - docs/
   - docker/

2. Initialize:
   - React + TypeScript frontend
   - Flask backend
   - MySQL database connection
   - Environment variable configuration

3. Setup:
   - JWT authentication base
   - Database models (User, Scan, Report)
   - Basic routing

--------------------------------------------------
PHASE 2: AUTHENTICATION MODULE
--------------------------------------------------

Implement:
- User registration
- Login
- Password hashing using bcrypt
- JWT token generation
- Role-based access control (User / Admin)
- Middleware protection for protected routes

Security:
- Input validation
- Rate limiting
- Secure error handling

--------------------------------------------------
PHASE 3: CODE SUBMISSION MODULE
--------------------------------------------------

Frontend:
- Monaco Editor integration
- Language selection dropdown
- Upload file option
- Analyze button

Backend:
- Code validation
- Temporary secure handling
- Language metadata handling

Do NOT store raw code permanently.
Store only hashed reference.

--------------------------------------------------
PHASE 4: LLM INTEGRATION
--------------------------------------------------

Implement:
- LLM API integration
- Secure API key loading from environment variables
- Structured prompt template for vulnerability detection

LLM Output Format (JSON Required):
{
  vulnerabilities: [
    {
      issue: "",
      explanation: "",
      severity: "",
      fix: ""
    }
  ]
}

Implement:
- Timeout handling
- Fallback response
- API failure handling

--------------------------------------------------
PHASE 5: RESULTS & EXPLANATION ENGINE
--------------------------------------------------

Frontend:
- Vulnerability table
- Severity badges (Low / Medium / High)
- Explanation cards
- Chat follow-up interface

Backend:
- Conversational follow-up endpoint
- Context handling

--------------------------------------------------
PHASE 6: REPORT GENERATION
--------------------------------------------------

Implement:
- PDF report generation
- Include:
  - Timestamp
  - Language
  - Vulnerability summary
  - Severity distribution
  - Recommendations

--------------------------------------------------
PHASE 7: ADMIN PANEL
--------------------------------------------------

Implement:
- User management dashboard
- View logs
- Suspend users
- View system metrics

--------------------------------------------------
PHASE 8: NON-FUNCTIONAL REQUIREMENTS
--------------------------------------------------

Ensure:
- Response time < 30 seconds
- HTTPS ready configuration
- Modular backend structure
- Proper logging
- Graceful error handling
- Scalable architecture

--------------------------------------------------
PHASE 9: TESTING
--------------------------------------------------

Write:
- Unit tests (backend)
- API tests
- Basic frontend component tests

--------------------------------------------------
PHASE 10: FINAL CHECK
--------------------------------------------------

Before completion:
- Review for security gaps
- Check for exposed secrets
- Ensure no raw code is stored
- Validate RBAC implementation
- Validate API rate limiting

--------------------------------------------------

Execution Strategy:
- Build phase by phase.
- After each phase, summarize what was implemented.
- Wait for confirmation before moving to next phase.

Begin with PHASE 1.