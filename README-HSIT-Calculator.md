# HSIT Preparedness Calculator

A comprehensive Hospitalisation and Surgical Insurance/Takaful (HSIT) Preparedness Calculator built with Next.js 15, TypeScript, and shadcn/ui components.

## Features

### 🎯 Core Functionality
- **Age-based risk assessment** with personalized guidance messages
- **Gender-specific calculations** for insurance premiums
- **HSIT plan analysis** for users with existing coverage
- **Copayment feature analysis** (deductibles and co-insurance)
- **Critical Illness coverage evaluation**
- **Future premium projections** with low/high inflation scenarios
- **Out-of-pocket exposure calculations**
- **Savings recommendations** with growth projections

### 📊 Visual Analytics
- **Interactive charts** showing premium projections to age 75
- **Savings breakdown visualization** 
- **Responsive design** for all device sizes
- **Real-time form validation** with immediate feedback

### 🧮 Advanced Calculations
- **Age factor curves** for premium escalation
- **Utilization and severity factors** based on age demographics
- **Compound inflation calculations** (5% and 8% scenarios)
- **Savings growth projections** with 4% conservative growth rate
- **Expected OOP exposure** with deductible and co-insurance modeling

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: Prisma ORM with SQLite
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── calculate/
│   │       └── route.ts          # Backend calculation logic
│   ├── page.tsx                  # Main application page
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── hsit-calculator.tsx       # Main calculator component
│   └── results-charts.tsx        # Chart components
├── lib/
│   ├── db.ts                     # Prisma database client
│   └── utils.ts                  # Utility functions
└── hooks/
    └── use-toast.ts              # Toast notifications
```

## Calculation Methodology

### Future Premium Projections
- **Age Factors**: Based on actuarial data showing premium increases with age
- **Inflation Scenarios**: Low (5%) and high (8%) claims inflation rates
- **Compound Growth**: Mathematical projection to age 75

### Out-of-Pocket Exposure
- **Utilization Factors**: Age-based healthcare utilization patterns
- **Severity Factors**: Claim severity increases with age
- **Deductible/Co-insurance**: User-specific copayment structures
- **Claims Inflation**: 5% annual increase in healthcare costs

### Savings Recommendations
- **Minimum Buffer**: RM 100 per month minimum recommendation
- **Premium Buffer**: 20% of projected future premiums
- **OOP Buffer**: Amortized out-of-pocket exposure
- **Growth Projection**: 4% conservative investment growth rate

## User Scenarios & Guidance

### No HSIT Plan
- Educational guidance on insurance importance
- Emergency fund recommendations
- Affordable plan exploration guidance

### With Copayment Features
- Savings buffer requirements for deductibles
- Accessible fund recommendations
- Risk sharing explanations

### Critical Illness Coverage
- Income protection guidance
- CI plan suitability assessment
- Lifestyle sustainability considerations

### Age-Specific Guidance
- **Under 30**: Early protection benefits
- **30-40**: Coverage adequacy reviews
- **40-50**: Dependent considerations
- **50+**: Enhanced risk awareness

## Database Schema

### HSITCalculatorInput
- User demographics and current coverage details
- Optional fields for comprehensive analysis
- Timestamp tracking for data integrity

### HSITCalculatorResult
- Calculated recommendations and projections
- Guidance messages in JSON format
- Relational linking to input data

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- SQLite (included with Prisma)

### Setup
```bash
npm install
npm run db:push
npm run dev
```

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - ESLint code quality check
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client

## Features Highlights

### 🎨 User Experience
- **Progressive disclosure**: Show relevant fields based on user responses
- **Real-time validation**: Immediate feedback on form inputs
- **Conditional logic**: Dynamic form behavior based on user selections
- **Accessibility**: WCAG compliant with semantic HTML and ARIA support

### 📱 Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Touch-friendly**: 44px minimum touch targets
- **Adaptive layouts**: Responsive grid systems
- **Progressive enhancement**: Core functionality works everywhere

### 🔒 Data Validation
- **TypeScript**: Compile-time type safety
- **Zod schemas**: Runtime validation
- **Input sanitization**: Protection against invalid data
- **Error handling**: Graceful degradation on errors

## Future Enhancements

- **EPF integration**: Connect to actual EPF balances
- **Plan comparison**: Compare multiple HSIT plans
- **Risk assessment**: Health risk questionnaire
- **Family planning**: Dependent coverage calculations
- **Investment options**: Integrated investment recommendations
- **Export functionality**: PDF reports and data export

## License

This project is proprietary and confidential.