# Mastra AI Recruiter Workflow

## Overview
This project implements an AI recruiter workflow using Mastra that parses candidate resumes and generates tailored interview questions based on whether the candidate is technical or non-technical.

## Project Structure
- `/home/user/ai-recruiter/` - Main project directory
  - `package.json` - Project dependencies
  - `run.js` - Main workflow script
  - `output.json` - Results from workflow execution

## Workflow Components

### Agent
- **recruiterAgent**: An expert recruiter agent using `openai/gpt-4o-mini` model

### Steps

#### 1. gatherCandidateInfo
- Parses resume text to extract:
  - `candidateName`: The candidate's name
  - `isTechnical`: Boolean indicating if the role is technical
  - `specialty`: The candidate's area of expertise

#### 2. askAboutSpecialty (Technical Candidates)
- Generates a technical interview question relevant to the candidate's specialty
- Used when `isTechnical` is `true`

#### 3. askAboutRole (Non-Technical Candidates)
- Generates a question about the candidate's interest in the role
- Used when `isTechnical` is `false`

### Workflow Structure
```
Input: { resumeText: string }
  ↓
gatherCandidateInfo
  ↓
  ├─→ isTechnical === true → askAboutSpecialty
  └─→ isTechnical === false → askAboutRole
  ↓
Output: { candidateName, isTechnical, specialty, question }
```

## Test Results

### Candidate 1: Alice (Technical)
- **Name**: Alice
- **Role**: Software Engineer
- **Type**: Technical
- **Generated Question**: "Can you explain the differences between synchronous and asynchronous programming in JavaScript, and provide an example of when you would use each approach?"

### Candidate 2: Bob (Non-Technical)
- **Name**: Bob
- **Role**: Marketing Manager
- **Type**: Non-Technical
- **Generated Question**: "What aspects of this role excite you the most, and how do you see your experience as a Marketing Manager contributing to our team's success?"

## Execution Summary
Both candidates were successfully processed:
1. Alice was correctly identified as technical and received a JavaScript programming question
2. Bob was correctly identified as non-technical and received a role-interest question

The workflow successfully demonstrates conditional branching based on candidate type.