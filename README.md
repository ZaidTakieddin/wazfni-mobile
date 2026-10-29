# Wazfni — Job Portal Mobile App (React Native / Expo)

Cross-platform (iOS & Android) mobile client for **[Wazfni](https://wazfni.app)**, a job portal connecting job seekers with companies. Built with React Native, Expo Router and TypeScript.

> Companion repos: [wazfni-backend-express.js-main](https://github.com/ZaidTakieddin/wazfni-backend-express.js-main) (REST API) · [wazfni-dashboard](https://github.com/ZaidTakieddin/wazfni-dashboard) (admin dashboard)

## Features

**Job seekers**
- Browse and search jobs, filter, and view job details
- Apply to jobs, track applied jobs, bookmarks and recently viewed jobs
- Profile management: personal info, work experience, education & certificates, avatar and CV/document upload
- Search with category, city and filter bottom sheets
- Notifications

**Companies**
- Company profile
- Post, edit and manage job listings
- Review applicants
- Track pending / rejected listings

**Auth**
- Email registration with OTP verification, login, forgot / reset password
- Google Sign-In
- Onboarding flow, secure token storage

## Tech stack

| Area | Tools |
|---|---|
| Framework | React Native, Expo SDK, Expo Router (file-based routing, route groups) |
| Language | TypeScript |
| Data fetching | TanStack Query, Axios |
| Forms & validation | React Hook Form, Zod |
| UI | Reanimated, Gesture Handler, Gorhom Bottom Sheet, FlashList, Expo Image, skeleton loaders |
| Platform APIs | expo-notifications, expo-secure-store, expo-image-picker, expo-document-picker, expo-localization |
| Auth | Google Sign-In, OTP, secure token storage |
| Tooling | ESLint, Prettier, EAS Build (development / preview / production profiles) |

## Project structure

```
app/
  (auth)/        onboarding, login, register, OTP, forgot/reset password
  (app)/
    (main)/      home, all jobs, applied, bookmarks, viewed, profile (+ iOS-specific variants)
    (job)/       job details
    (company)/   company profile, add/edit job, pending/rejected jobs
    (search)/    search & filters
    (others)/    notifications and misc screens
components/      shared UI components
contexts/        app-wide React contexts (auth, etc.)
hooks/           custom hooks
services/        API layer
schemas/         Zod validation schemas
constants/       theme, URLs
config/          Google Sign-In config
```

## Getting started

```bash
bun install          # or npm install
npx expo start
```

To build native apps, use [EAS Build](https://docs.expo.dev/build/introduction/) (`eas build --profile development|preview|production`).

> Secrets are not included in this repository: add your own `.env`, `google-services.json` / `GoogleService-Info.plist`, and Google OAuth client IDs in `config/google-signin.ts`.

## Author

**Zaid Takieddin** — Senior Full-Stack Developer · [LinkedIn](https://www.linkedin.com/in/zaid-takieddin-7ab216244) · [GitHub](https://github.com/ZaidTakieddin)
