# sellor.ai MVP Technical Specification

## Overview
sellor.ai is a multi-vendor SaaS e-commerce platform with AI-assisted product creation as its key differentiator. This document outlines the technical specifications for the MVP launch.

## Technology Stack
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express/NestJS
- **Database**: PostgreSQL (shared database, shared schema with tenant_id)
- **AI Integration**: OpenAI GPT-4 Vision API
- **Payment Processing**: Stripe Connect
- **Email Service**: SendGrid
- **Deployment**: Vercel

## System Architecture

### Multi-Tenancy Model
- **Database**: Shared database, shared schema with `store_id` on all relevant tables
- **Subdomains**: Wildcard DNS (`*.sellor.ai`) pointing to the Next.js application
- **Custom Domains**: CNAME records pointing to a central endpoint with Let's Encrypt SSL

### Core Components
1. **SaaS Landing Page** (`sellor.ai`)
2. **Platform Super Admin Panel**
3. **Vendor Onboarding & Dashboard**
4. **AI-Assisted Product Management**
5. **Vendor Storefront (Customer-Facing)**
6. **Order Management System**
7. **Email Notification System**

## Database Schema

### Core Tables

#### `stores`
```sql
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subdomain VARCHAR(100) NOT NULL UNIQUE,
  custom_domain VARCHAR(255) UNIQUE,
  logo_url VARCHAR(255),
  primary_color VARCHAR(7),
  description TEXT,
  contact_email VARCHAR(255) NOT NULL,
  stripe_account_id VARCHAR(255),
  shipping_rate DECIMAL(10,2) DEFAULT 5.00,
  free_shipping_threshold DECIMAL(10,2),
  refund_policy TEXT,
  privacy_policy TEXT,
  terms_of_service TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'vendor', -- 'admin', 'vendor'
  store_id INTEGER REFERENCES stores(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `products`
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sku VARCHAR(100),
  inventory_quantity INTEGER DEFAULT 1,
  image_url VARCHAR(255),
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
  tags TEXT[], -- Array of tags/keywords
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `orders`
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed'
  order_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  tracking_number VARCHAR(100),
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `order_items`
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Detailed Component Specifications

### I. Platform Owner - SaaS Landing Page & Core Admin

#### 1. SaaS Platform Landing Page (Public Facing - `sellor.ai`)

**Page Structure:**
- Hero Section
- How It Works
- Key Features
- Pricing Section
- FAQ Section
- Footer

**Implementation Details:**
- Create a responsive Next.js page with Tailwind CSS
- Implement SEO optimization with proper meta tags
- Add analytics tracking (Google Analytics)

**Routes:**
- `/` - Landing page
- `/pricing` - Detailed pricing (optional for MVP)
- `/faq` - Frequently asked questions
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/login` - Vendor login
- `/signup` - Vendor registration

#### 2. Platform Super Admin Panel

**Routes:**
- `/admin` - Admin dashboard (login required)
- `/admin/vendors` - Vendor management
- `/admin/subscriptions` - Subscription management

**Implementation Details:**
- Protected routes with admin authentication
- Simple dashboard with vendor statistics
- Ability to activate/deactivate vendor accounts

### II. Vendor Onboarding & Store Setup

#### 1. Vendor Registration

**Routes:**
- `/signup` - Registration form
- `/login` - Login form
- `/dashboard` - Vendor dashboard (after login)

**Implementation Details:**
- Form validation with error handling
- Automatic subdomain creation
- Welcome email via SendGrid
- Secure password storage with bcrypt

#### 2. Vendor Dashboard

**Routes:**
- `/dashboard` - Overview
- `/dashboard/products` - Product management
- `/dashboard/orders` - Order management
- `/dashboard/settings` - Store settings

**Implementation Details:**
- Responsive sidebar navigation
- Dashboard with key metrics
- Quick action buttons

### III. Vendor Product Management (AI Focus)

#### 1. Add New Product - AI Assisted Workflow

**Routes:**
- `/dashboard/products/new` - Add new product

**Implementation Details:**
- Image upload with preview
- API integration with OpenAI GPT-4 Vision
- Form with AI-generated fields (editable)
- Save as draft or publish functionality

**AI Integration:**
```javascript
// Example AI integration pseudocode
async function analyzeProductImage(imageUrl) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "You are an e-commerce product specialist. Based on this image, generate a compelling product title (max 60 chars), a descriptive product description (approx 50 words), 3-5 relevant SEO keywords/tags, and suggest the most appropriate category from this list: Apparel, Accessories, Home & Decor, Electronics, Beauty & Health, Toys & Games, Books, Other." },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      }
    ],
    max_tokens: 500
  });
  
  return parseAIResponse(response.choices[0].message.content);
}
```

#### 2. Product List View

**Implementation Details:**
- Responsive table/grid view
- Pagination
- Search and filter functionality
- Quick actions (edit, delete)

### IV. Vendor Storefront Customization & Management

#### 1. Theme (MVP - One Default Theme)

**Implementation Details:**
- Create a responsive, mobile-first theme
- Use CSS variables for customization
- Implement dynamic color scheme based on vendor settings

#### 2. Store Settings Page

**Routes:**
- `/dashboard/settings` - Store settings

**Implementation Details:**
- Form for store details
- Logo upload with image optimization
- Color picker for primary accent color
- Custom domain configuration
- Stripe Connect integration
- Shipping rate configuration
- Policy templates

### V. End-Customer Storefront Experience

**Routes:**
- `[storename].sellor.ai/` - Store homepage
- `[storename].sellor.ai/products` - All products
- `[storename].sellor.ai/products/[product-slug]` - Product detail
- `[storename].sellor.ai/cart` - Shopping cart
- `[storename].sellor.ai/checkout` - Checkout
- `[storename].sellor.ai/order-confirmation` - Order confirmation

**Implementation Details:**
- Server-side rendering for SEO
- Dynamic routing based on subdomain/custom domain
- Responsive design for mobile and desktop
- Shopping cart with local storage
- Stripe Elements integration for payments
- Order confirmation with email notification

### VI. Order Management

**Routes:**
- `/dashboard/orders` - Order list
- `/dashboard/orders/[order-id]` - Order detail

**Implementation Details:**
- Filterable order list
- Detailed order view
- Status update functionality
- Tracking number input
- Email notification triggers

### VII. Email Notifications

**Implementation Details:**
- SendGrid integration
- Email templates for:
  - Vendor welcome
  - New order notification (to vendor)
  - Order confirmation (to customer)
  - Shipping confirmation (to customer)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new vendor
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Stores
- `GET /api/stores/[subdomain]` - Get store by subdomain
- `PUT /api/stores/[id]` - Update store settings
- `POST /api/stores/[id]/logo` - Upload store logo
- `POST /api/stores/[id]/domain` - Set custom domain
- `POST /api/stores/[id]/stripe` - Connect Stripe account

### Products
- `GET /api/stores/[store_id]/products` - List products
- `POST /api/stores/[store_id]/products` - Create product
- `GET /api/stores/[store_id]/products/[id]` - Get product
- `PUT /api/stores/[store_id]/products/[id]` - Update product
- `DELETE /api/stores/[store_id]/products/[id]` - Delete product
- `POST /api/ai/analyze-image` - Analyze product image with AI

### Orders
- `GET /api/stores/[store_id]/orders` - List orders
- `GET /api/stores/[store_id]/orders/[id]` - Get order
- `PUT /api/stores/[store_id]/orders/[id]` - Update order status
- `POST /api/stores/[store_id]/orders` - Create order (checkout)

## Security Considerations

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - CSRF protection

2. **Data Protection**
   - Input validation
   - Parameterized queries
   - XSS prevention

3. **Payment Security**
   - PCI compliance via Stripe
   - Secure handling of payment information

4. **Infrastructure Security**
   - HTTPS everywhere
   - Secure cookie settings
   - Rate limiting on API endpoints

## Deployment Strategy

1. **Development Environment**
   - Local development with Docker
   - Environment variables for configuration

2. **Staging Environment**
   - Vercel preview deployments
   - Test database

3. **Production Environment**
   - Vercel production deployment
   - Production database
   - Monitoring and logging

## MVP Launch Checklist

1. **Pre-Launch**
   - Complete all core functionality
   - Test on multiple devices and browsers
   - Set up monitoring and error tracking
   - Configure SSL certificates

2. **Launch**
   - Deploy to production
   - Verify DNS configuration
   - Test end-to-end user flows
   - Monitor for errors

3. **Post-Launch**
   - Gather initial feedback
   - Address critical issues
   - Monitor performance
   - Plan for next iteration

## Future Enhancements (Post-MVP)

1. **Platform Features**
   - Multiple theme options
   - Advanced analytics
   - Bulk product import/export
   - Multiple staff accounts

2. **AI Enhancements**
   - Multiple image analysis
   - Product recommendation engine
   - AI-generated marketing content
   - Automated SEO optimization

3. **E-commerce Features**
   - Discount codes
   - Product variants
   - Advanced shipping options
   - Customer accounts