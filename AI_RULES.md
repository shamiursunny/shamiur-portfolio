# 🤖 AI Development Rules & Guidelines

This document outlines the development rules and technology choices for the Shamiur Portfolio application.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router - Use for all page routing and server-side rendering
- **Language**: TypeScript 5 - All code must be typed with strict type checking enabled
- **Styling**: Tailwind CSS 4 + shadcn/ui - Use Tailwind for utility classes and shadcn/ui for pre-built components
- **Database**: Prisma ORM with PostgreSQL/SQLite - Use Prisma for all database operations and schema management
- **Authentication**: NextAuth.js v4 - Use for all authentication flows and session management
- **State Management**: React Context + Zustand - Use Context for auth state, Zustand for complex UI state
- **Forms**: React Hook Form + Zod - Use for form validation and management
- **Icons**: Lucide React - Use exclusively for all iconography
- **Animations**: Framer Motion - Use for all animations and transitions
- **Email**: Nodemailer with Gmail SMTP - Use for all email notifications and communications

## 📋 Development Rules

### Frontend Components
- **UI Components**: Always use shadcn/ui components as the base, then customize with Tailwind
- **Custom Components**: Create reusable components in `src/components/` following atomic design principles
- **Styling**: Use Tailwind CSS exclusively - no custom CSS files allowed
- **Responsive Design**: All components must be mobile-first and responsive
- **Accessibility**: All interactive elements must be keyboard accessible and screen reader friendly

### Backend APIs
- **Route Handlers**: Use Next.js App Router API routes (`src/app/api/`) for all server endpoints
- **Database Access**: Always use Prisma client (`src/lib/db.ts`) - never direct SQL queries
- **Authentication**: Protect all admin routes with NextAuth.js session validation
- **Input Validation**: Use Zod schemas for all request validation
- **Error Handling**: Return proper HTTP status codes and user-friendly error messages

### Database & Data
- **Schema Management**: Use Prisma schema (`prisma/schema.prisma`) for all database definitions
- **Migrations**: Run `npm run db:migrate` for production changes, `npm run db:push` for development
- **Data Access**: Always use the singleton Prisma client instance
- **Relations**: Define proper foreign key relationships in the schema
- **Seeding**: Use TypeScript scripts in `scripts/` for data seeding

### Authentication & Security
- **NextAuth Providers**: Use credentials provider with bcrypt password hashing
- **Session Management**: Use JWT strategy with proper secret keys
- **Password Security**: Always hash passwords with bcrypt (min 12 rounds)
- **Environment Variables**: Store all secrets in `.env` files - never commit them
- **Input Sanitization**: Sanitize all user inputs to prevent XSS attacks
- **Rate Limiting**: Implement rate limiting on all public endpoints

### Email System
- **SMTP Provider**: Use Gmail SMTP as primary email service
- **Templates**: Create professional HTML email templates using inline CSS
- **Services**: Use the email service in `src/lib/email.ts` for all email functionality
- **Notifications**: Send admin notifications and auto-replies for contact form submissions
- **Testing**: Use the test endpoint `/api/test-email` for email configuration testing

### State Management
- **Global State**: Use React Context for authentication state only
- **Local State**: Use React useState for component-level state
- **Complex State**: Use Zustand for complex UI state management
- **Persistence**: Use localStorage for user preferences and settings

### Forms & Validation
- **Form Library**: Always use React Hook Form for form management
- **Validation**: Use Zod schemas for all form validation
- **Error Messages**: Provide clear, user-friendly validation error messages
- **Accessibility**: All forms must be accessible with proper labels and ARIA attributes

### Styling & Design
- **Design System**: Follow the established color palette and spacing scale
- **Component Variants**: Use consistent variants for buttons, inputs, and other UI elements
- **Responsive Breakpoints**: Use Tailwind's responsive classes for mobile-first design
- **Dark Mode**: Support both light and dark themes using CSS custom properties
- **Animations**: Use Framer Motion for smooth, performant animations

### Performance & SEO
- **Image Optimization**: Use Next.js Image component for all images
- **Code Splitting**: Leverage Next.js automatic code splitting
- **Bundle Size**: Keep bundle size minimal by importing only what you need
- **Meta Tags**: Add proper Open Graph and meta tags for SEO
- **Loading States**: Always provide loading states for async operations

### Development Workflow
- **TypeScript**: Enable strict mode and fix all type errors
- **Linting**: Use ESLint with the provided configuration
- **Environment**: Use separate environment variables for development and production
- **Database**: Use SQLite for development, PostgreSQL for production
- **Version Control**: Commit `.env.example` but never `.env` files

### Testing & Quality
- **Manual Testing**: Test all features manually before deployment
- **Email Testing**: Use the demo tester for email functionality
- **Form Validation**: Test all form validation scenarios
- **Authentication**: Test login/logout flows
- **Responsive Design**: Test on multiple screen sizes

### Deployment
- **Environment Variables**: Configure all required environment variables in deployment platform
- **Database**: Set up production database connection
- **Email**: Configure production email service
- **Build**: Use `npm run build` and `npm start` for production deployment
- **Monitoring**: Monitor application performance and errors in production

## 🚫 Prohibited Libraries/Approaches

- **CSS Frameworks**: No Bootstrap, Material-UI, or other CSS frameworks
- **State Libraries**: No Redux, MobX, or other complex state management
- **Form Libraries**: No Formik or other form libraries besides React Hook Form
- **Direct DOM**: No direct DOM manipulation - use React patterns
- **Inline Styles**: No inline style attributes - use Tailwind classes
- **Console Logs**: No console.log in production code
- **Any CSS**: No CSS files - use Tailwind exclusively

## ✅ Required Libraries (Already Installed)

- `next`, `react`, `react-dom` - Core framework
- `typescript` - Type checking
- `tailwindcss`, `clsx`, `tailwind-merge` - Styling
- `@radix-ui/react-*` - Base components for shadcn/ui
- `lucide-react` - Icons
- `framer-motion` - Animations
- `@hookform/resolvers`, `react-hook-form`, `zod` - Forms
- `@prisma/client`, `prisma` - Database
- `next-auth` - Authentication
- `bcryptjs` - Password hashing
- `nodemailer` - Email sending
- `sonner` - Toast notifications
- `zustand` - State management

Follow these rules to maintain consistency, security, and performance across the application.