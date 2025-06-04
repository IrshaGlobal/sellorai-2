# sellor.ai - AI-Powered E-commerce Platform

sellor.ai is a multi-vendor SaaS e-commerce platform with AI-assisted product creation as its key differentiator. This repository contains the MVP implementation of the platform.

## Key Features

- AI-assisted product creation from a single image
- Multi-vendor SaaS platform
- Custom storefronts for each vendor
- Secure payments via Stripe Connect
- Custom domain support

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express/NestJS
- **Database**: PostgreSQL
- **AI Integration**: OpenAI GPT-4 Vision API
- **Payment Processing**: Stripe Connect
- **Email Service**: SendGrid
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key (for production)
- Stripe account (for production)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sellorai.git
   cd sellorai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/sellorai
   
   # Auth
   JWT_SECRET=your_jwt_secret
   
   # OpenAI (for production)
   OPENAI_API_KEY=your_openai_api_key
   
   # Stripe (for production)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── src/
│   ├── pages/             # Next.js pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Vendor dashboard pages
│   │   └── [store]/       # Dynamic store routes
│   ├── components/        # React components
│   ├── lib/               # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── prisma/                # Database schema and migrations
└── scripts/               # Utility scripts
```

## Database Schema

The database schema is defined in `prisma/schema.prisma`. The main tables are:

- `stores` - Store information
- `users` - User accounts (admin and vendors)
- `products` - Product information
- `orders` - Order information
- `order_items` - Items in an order

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Deployment

The application is deployed on Vercel. The `main` branch is automatically deployed to production.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any questions or inquiries, please contact [your-email@example.com](mailto:your-email@example.com).