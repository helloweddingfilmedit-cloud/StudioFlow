# StudioFlow CRM API Documentation

A comprehensive CRM system for video editing teams supporting up to 50 users with invoice, client, expense, and payment management.

## Table of Contents
- [Setup](#setup)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth Routes](#auth-routes)
  - [User Routes](#user-routes)
  - [Client Routes](#client-routes)
  - [Invoice Routes](#invoice-routes)
  - [Expense Routes](#expense-routes)
  - [Payment Routes](#payment-routes)

## Setup

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## Authentication

Most endpoints require authentication via JWT token. After logging in, include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Auth Routes

#### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

**Roles:** `admin`, `manager`, `editor`, `user`

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Note:** System supports maximum 50 users.

#### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

### User Routes

#### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

**Required Role:** `admin` or `manager`

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Current User
```http
GET /api/users/me
Authorization: Bearer {token}
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer {token}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer {token}
```

**Required Role:** `admin`

**Body:**
```json
{
  "firstName": "Jane",
  "role": "manager"
}
```

#### Deactivate User
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

**Required Role:** `admin`

### Client Routes

#### Get All Clients
```http
GET /api/clients
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "notes": "Important client",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Client by ID
```http
GET /api/clients/:id
Authorization: Bearer {token}
```

**Response includes related invoices and payments**

#### Create Client
```http
POST /api/clients
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "notes": "Important client",
  "status": "active"
}
```

#### Update Client
```http
PUT /api/clients/:id
Authorization: Bearer {token}
```

#### Delete Client
```http
DELETE /api/clients/:id
Authorization: Bearer {token}
```

### Invoice Routes

#### Get All Invoices
```http
GET /api/invoices
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "invoiceNumber": "INV-001",
    "clientId": 1,
    "projectName": "Wedding Video Edit",
    "description": "Video editing services",
    "issueDate": "2024-01-01",
    "dueDate": "2024-01-31",
    "subtotal": "1000.00",
    "tax": "100.00",
    "discount": "0.00",
    "total": "1100.00",
    "paidAmount": "500.00",
    "status": "partially_paid",
    "items": [
      {
        "description": "Video Editing",
        "quantity": 10,
        "rate": 100,
        "amount": 1000
      }
    ],
    "notes": "Payment due in 30 days",
    "client": { ... },
    "payments": [ ... ]
  }
]
```

**Invoice Status:** `draft`, `sent`, `paid`, `partially_paid`, `overdue`, `cancelled`

#### Get Invoice by ID
```http
GET /api/invoices/:id
Authorization: Bearer {token}
```

#### Create Invoice
```http
POST /api/invoices
Authorization: Bearer {token}
```

**Body:**
```json
{
  "invoiceNumber": "INV-001",
  "clientId": 1,
  "projectName": "Wedding Video Edit",
  "description": "Video editing services",
  "issueDate": "2024-01-01",
  "dueDate": "2024-01-31",
  "subtotal": 1000.00,
  "tax": 100.00,
  "discount": 0.00,
  "total": 1100.00,
  "status": "draft",
  "items": [
    {
      "description": "Video Editing",
      "quantity": 10,
      "rate": 100,
      "amount": 1000
    }
  ],
  "notes": "Payment due in 30 days"
}
```

#### Update Invoice
```http
PUT /api/invoices/:id
Authorization: Bearer {token}
```

#### Delete Invoice
```http
DELETE /api/invoices/:id
Authorization: Bearer {token}
```

### Expense Routes

#### Get All Expenses
```http
GET /api/expenses
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "category": "Equipment",
    "description": "New camera lens",
    "amount": "500.00",
    "expenseDate": "2024-01-15",
    "vendor": "Camera Store",
    "paymentMethod": "credit_card",
    "receiptUrl": "https://example.com/receipt.pdf",
    "status": "approved",
    "notes": "For project XYZ",
    "user": { ... }
  }
]
```

**Payment Methods:** `cash`, `credit_card`, `debit_card`, `bank_transfer`, `other`

**Status:** `pending`, `approved`, `rejected`

#### Get Expense by ID
```http
GET /api/expenses/:id
Authorization: Bearer {token}
```

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer {token}
```

**Body:**
```json
{
  "category": "Equipment",
  "description": "New camera lens",
  "amount": 500.00,
  "expenseDate": "2024-01-15",
  "vendor": "Camera Store",
  "paymentMethod": "credit_card",
  "receiptUrl": "https://example.com/receipt.pdf",
  "status": "pending",
  "notes": "For project XYZ"
}
```

**Note:** userId is automatically set to the authenticated user.

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer {token}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer {token}
```

### Payment Routes

#### Get All Received Payments
```http
GET /api/payments
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "invoiceId": 1,
    "clientId": 1,
    "amount": "500.00",
    "paymentDate": "2024-01-15",
    "paymentMethod": "bank_transfer",
    "transactionId": "TXN123456",
    "notes": "First installment",
    "status": "completed",
    "invoice": { ... },
    "client": { ... }
  }
]
```

**Payment Methods:** `cash`, `credit_card`, `debit_card`, `bank_transfer`, `paypal`, `other`

**Status:** `completed`, `pending`, `failed`, `refunded`

#### Get Payment by ID
```http
GET /api/payments/:id
Authorization: Bearer {token}
```

#### Create Payment
```http
POST /api/payments
Authorization: Bearer {token}
```

**Body:**
```json
{
  "invoiceId": 1,
  "clientId": 1,
  "amount": 500.00,
  "paymentDate": "2024-01-15",
  "paymentMethod": "bank_transfer",
  "transactionId": "TXN123456",
  "notes": "First installment",
  "status": "completed"
}
```

**Note:** Creating a payment automatically updates the invoice's `paidAmount` and `status`.

#### Update Payment
```http
PUT /api/payments/:id
Authorization: Bearer {token}
```

#### Delete Payment
```http
DELETE /api/payments/:id
Authorization: Bearer {token}
```

**Note:** Deleting a payment automatically updates the invoice's `paidAmount` and `status`.

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## User Limit

The system enforces a maximum of 50 users. Attempting to register more users will return:

```json
{
  "error": "Maximum user limit (50) reached"
}
```

## Database

The system uses SQLite for data storage. The database file is created automatically at the location specified in the `.env` file (default: `./database.sqlite`).

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Role-based access control for sensitive operations
- User deactivation instead of deletion for data integrity
