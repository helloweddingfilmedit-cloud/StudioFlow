# StudioFlow

A comprehensive CRM system for video editing teams supporting up to 50 users with complete invoice, client, expense, and payment management capabilities.

## Features

- **User Management**: Support for up to 50 users with role-based access control (admin, manager, editor, user)
- **Client Management**: Complete client database with contact information and relationships
- **Invoice Management**: Create, track, and manage invoices with multiple statuses
- **Expense Tracking**: Record and manage team expenses with approval workflows
- **Payment Processing**: Track received payments and automatically update invoice statuses
- **Authentication**: Secure JWT-based authentication system
- **RESTful API**: Well-documented API endpoints for all operations

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs for password hashing

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/helloweddingfilmedit-cloud/StudioFlow.git
cd StudioFlow
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

Comprehensive API documentation is available in [API_DOCS.md](./API_DOCS.md)

### Quick API Overview

- **Base URL**: `http://localhost:3000/api`
- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **Users**: `/api/users`
- **Clients**: `/api/clients`
- **Invoices**: `/api/invoices`
- **Expenses**: `/api/expenses`
- **Payments**: `/api/payments`

## Database Schema

The system includes the following models:

### User Model
- User authentication and profile information
- Role-based access (admin, manager, editor, user)
- Support for up to 50 users

### Client Model
- Client contact information
- Company details
- Address information
- Client status tracking

### Invoice Model
- Invoice number and details
- Project information
- Financial calculations (subtotal, tax, discount, total)
- Payment tracking
- Multiple status options (draft, sent, paid, partially_paid, overdue, cancelled)
- Line items stored as JSON

### Expense Model
- Expense tracking linked to users
- Category and description
- Payment method tracking
- Approval workflow (pending, approved, rejected)
- Receipt URL storage

### ReceivedPayment Model
- Payment tracking linked to invoices
- Multiple payment methods
- Transaction ID storage
- Automatic invoice status updates

## Usage Example

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "secure123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

### 2. Create a Client
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "company": "Acme Corp",
    "status": "active"
  }'
```

### 3. Create an Invoice
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "invoiceNumber": "INV-001",
    "clientId": 1,
    "projectName": "Wedding Video",
    "issueDate": "2024-01-01",
    "dueDate": "2024-01-31",
    "subtotal": 1000,
    "total": 1000,
    "status": "draft"
  }'
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permission levels for different user roles
- **User Limit**: Maximum 50 users to maintain system integrity
- **Soft Delete**: Users are deactivated rather than deleted for data integrity

## Project Structure

```
StudioFlow/
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── User.js              # User model
│   ├── Client.js            # Client model
│   ├── Invoice.js           # Invoice model
│   ├── Expense.js           # Expense model
│   ├── ReceivedPayment.js   # Payment model
│   └── index.js             # Model relationships
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── clients.js           # Client management routes
│   ├── invoices.js          # Invoice management routes
│   ├── expenses.js          # Expense management routes
│   └── payments.js          # Payment management routes
├── middleware/
│   └── auth.js              # Authentication middleware
├── server.js                # Main application file
├── package.json             # Project dependencies
├── .env.example             # Environment variables template
└── API_DOCS.md              # Detailed API documentation
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

### Testing the API

You can test the API using:
- cURL (see examples above)
- Postman
- Thunder Client (VS Code extension)
- Any HTTP client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.