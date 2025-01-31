# Insurance Plan Assistant Chatbot

## Overview
An intelligent chatbot system that helps users find the perfect insurance plan based on their personal needs, family size, and healthcare requirements. The chatbot uses AI to provide personalized recommendations and detailed plan summaries.

![Insurance Chatbot Demo](demo-screenshot.png)

## Features

### 1. Interactive Questionnaire
- Personal information collection
- Healthcare needs assessment
- Family size evaluation
- Coverage preferences
- Budget considerations

### 2. Smart Plan Recommendations
The system analyzes user responses to recommend insurance plans based on:
- Family composition
- Healthcare requirements
- Preferred hospital networks
- Additional service needs
- Budget constraints

### 3. Personalized Plan Analysis
Each recommendation includes:
- Match score calculation
- Cost breakdown
- Coverage details
- Benefit comparisons

### 4. Available Insurance Plans

#### AmeriHealth Platinum
- Premium plan with zero deductibles
- Comprehensive coverage
- Low copays
- Full maternity coverage
[View Details](https://drive.google.com/file/d/15abfYJxr25RcHdQTDK4qU5iKKG-3Dfrr/view?usp=sharing)

#### AmeriHealth Gold
- Balanced coverage
- Moderate deductibles
- Affordable copays
[View Details](https://drive.google.com/file/d/1SkVyCJHk7UBgJweV1gV4gaHSSEuFEskD/view?usp=sharing)

#### AmeriHealth Silver
- Budget-friendly option
- Higher deductibles
- Essential coverage
[View Details](https://drive.google.com/file/d/1FbOjIXk3q3otIxzy9Q_Ri29sLKIf03RW/view?usp=sharing)

#### Horizon Blue
- Specialized family plan
- Zero diagnostic test copays
- Full maternity coverage
[View Details](https://drive.google.com/file/d/1fGl7f1M1YtsmbkYJTzeE9DNHkNGR4Ktq/view?usp=sharing)

#### UnitedHealthcare Oxford
- Premium coverage
- Zero deductibles
- Low prescription copays
[View Details](https://drive.google.com/file/d/1cS3TMeoxnIlDW8MmUiGGJKPAEE--jIAX/view?usp=sharing)

## Technical Stack

### Frontend
- Next.js
- React
- TypeScript
- Framer Motion (animations)
- TailwindCSS (styling)

### Backend
- Next.js API Routes
- Google's Generative AI (Gemini)
- UUID for session management

### Key Components
- Chatbot Interface (`/src/components/Chatbot/index.tsx`)
- API Route (`/src/app/api/chatbot/route.ts`)
- Insurance Plans Data
- Questionnaire Logic

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/insurance-chatbot.git
