# TourPH Admin Dashboard

A comprehensive admin dashboard for managing the TourPH application, built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard Overview**: Analytics and key metrics visualization
- **User Management**: View and manage user registrations and active users
- **Ad Management**: Upload, approve, reject, and manage advertisements
- **Content Management**: Create and manage app content (articles, guides, announcements)
- **Complaints & Suggestions**: Handle user feedback and support requests
- **Wallet & Revenue**: Track transactions, commissions, and revenue analytics
- **Authentication**: Secure admin login system

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the admin dashboard directory:
   ```bash
   cd admin-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3001`

### Default Login Credentials

For demo purposes, use these credentials:
- **Email**: admin@tourph.com
- **Password**: admin123

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Layout.tsx       # Main layout component
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── AdsPage.tsx
│   │   ├── ContentPage.tsx
│   │   ├── ComplaintsPage.tsx
│   │   ├── WalletPage.tsx
│   │   └── LoginPage.tsx
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Dashboard
- Key metrics and statistics
- Revenue charts and analytics
- User growth tracking
- Recent activity feed

### User Management
- View all registered users
- Filter by status (active, inactive, suspended)
- Search functionality
- User action controls (suspend/activate)

### Ad Management
- Upload new advertisements
- Approve/reject pending ads
- Edit existing ads
- Category and status filtering
- Performance metrics

### Content Management
- Create articles, guides, and announcements
- Content status management (draft, published, archived)
- Category organization
- View analytics

### Complaints & Suggestions
- Handle user feedback
- Priority and status management
- Response system
- Filter and search capabilities

### Wallet & Revenue
- Transaction tracking
- Commission calculations
- Revenue analytics
- Export functionality

## Customization

### Styling
The dashboard uses Tailwind CSS for styling. You can customize the theme by modifying `tailwind.config.js`.

### Authentication
Currently uses a simple demo authentication system. For production, integrate with your backend authentication API by modifying `src/contexts/AuthContext.tsx`.

### Data Integration
Replace mock data in page components with actual API calls to your backend services.

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the TourPH application suite.