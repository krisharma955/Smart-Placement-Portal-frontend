# 🎓 Smart Placement Portal

![Placement Portal UI Preview](./preview.png)

A comprehensive, full-stack Placement Management System designed to streamline the recruitment process. It serves as a unified platform connecting students with prospective employers, facilitating job postings, application tracking, and profile management with a modern, responsive, and highly polished user interface.

## 🌟 Key Features

### For Students:
- **Detailed Profiles**: Manage personal information, skills, and upload resumes (with real-time file previews).
- **Interactive Job Board**: Discover open roles, view comprehensive job details, and one-click apply functionality.
- **Application Tracking**: Monitor real-time status updates (Applied, Under Review, Shortlisted, Hired, Rejected) on an intuitive dashboard.

### For Companies:
- **Company Profiles**: Highlight company culture, website, location, and industry details.
- **Job Management**: Create, edit, and organize job postings with detailed criteria (salary, location, application deadlines).
- **Applicant Tracking System (ATS)**: Review student applications, download resumes, and instantly update candidate statuses.

## 🛠️ Technology Stack

### Frontend (User Interface)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- **State Management & Data Fetching**: [React Query (TanStack)](https://tanstack.com/query/latest) & Zustand
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **HTTP Client**: [Axios](https://axios-http.com/) (with JWT interceptors)

### Backend (API Server)
- **Framework**: [Spring Boot 3.x](https://spring.io/projects/spring-boot) (Java 17+)
- **Security**: Spring Security & JWT (JSON Web Tokens)
- **Database Access**: Spring Data JPA
- **Database**: SQL (MySQL/PostgreSQL)
- **Utilities**: Lombok, Spring Validation

## 📁 Project Structure

```
├── app/
│   ├── (auth)/       # Login and Signup pages
│   ├── student/      # Student Dashboard, Profile, Resume, and Jobs board
│   ├── company/      # Company Dashboard, Profile, Job creation, and Applicant view
│   ├── layout.tsx    # Root layout with Theme and Query Providers
│   └── page.tsx      # Landing page
├── components/       # Reusable UI components (shadcn buttons, inputs, dialogs, etc.)
├── lib/
│   ├── api/          # Axios client, interceptors, and API routes
│   └── utils.ts      # Tailwind merge and utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- A running instance of the Spring Boot backend (`http://localhost:8080`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krisharma955/Smart-Placement-Portal-frontend.git
   cd Smart-Placement-Portal-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 🔒 Authentication Flow
The application utilizes JWT (JSON Web Tokens) for security. 
- Upon successful login, the backend issues an access token.
- The frontend securely stores this token in `localStorage` and automatically attaches it to the `Authorization` header of every API request using an Axios interceptor.
- Unauthenticated users attempting to access protected routes (`/student/*` or `/company/*`) are automatically redirected to the `/login` page.

## ✨ Upcoming Features & Roadmap
- [ ] Email Notifications for application status changes.
- [ ] Advanced Job Filtering (by Salary, Location, Remote/On-site).
- [ ] Interview scheduling integrations.
- [ ] Admin Dashboard for college placement officers.

---
*Developed by Krish Sharma*
