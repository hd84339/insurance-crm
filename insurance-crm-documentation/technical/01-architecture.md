# System Architecture

This document describes the technical architecture of the Insurance & Mutual Fund CRM system.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Browser    │  │  Mobile App  │  │  API Client  │     │
│  │  (React UI)  │  │   (Future)   │  │   (Future)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS / REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Application Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Express.js Server (Node.js)                 │  │
│  │  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │  │
│  │  │ Routes  │→ │Controller│→ │  Business Logic   │  │  │
│  │  └─────────┘  └──────────┘  └───────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐│  │
│  │  │         Middleware Layer                         ││  │
│  │  │  • Authentication  • Validation                  ││  │
│  │  │  • Error Handling  • Rate Limiting               ││  │
│  │  │  • CORS           • Logging                      ││  │
│  │  └─────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ Mongoose ODM
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MongoDB Database                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ Clients  │  │ Policies │  │  Claims  │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │Reminders │  │ Targets  │  │  Agents  │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Architecture

### Frontend Architecture (React)

```
┌─────────────────────────────────────────────┐
│              React Application               │
├─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │         App Component (Router)        │  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │     Layout Component            │  │  │
│  │  │  ┌─────────────────────────┐   │  │  │
│  │  │  │   Page Components       │   │  │  │
│  │  │  │  • Dashboard            │   │  │  │
│  │  │  │  • Clients              │   │  │  │
│  │  │  │  • Policies             │   │  │  │
│  │  │  │  • Claims               │   │  │  │
│  │  │  │  • Reminders            │   │  │  │
│  │  │  │  • Targets              │   │  │  │
│  │  │  │  • Reports              │   │  │  │
│  │  │  └─────────────────────────┘   │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │       Reusable Components             │  │
│  │  • Forms   • Tables   • Modals       │  │
│  │  • Cards   • Buttons  • Inputs       │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │         Services Layer                │  │
│  │  • API Client (Axios)                 │  │
│  │  • API Endpoints                      │  │
│  │  • Authentication                     │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Backend Architecture (Node.js/Express)

```
┌─────────────────────────────────────────────┐
│           Express Application                │
├─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │         Routes Layer                  │  │
│  │  • Client Routes                      │  │
│  │  • Policy Routes                      │  │
│  │  • Claim Routes                       │  │
│  │  • Reminder Routes                    │  │
│  │  • Target Routes                      │  │
│  │  • Report Routes                      │  │
│  └────────┬─────────────────────────────┘  │
│           │                                  │
│  ┌────────▼─────────────────────────────┐  │
│  │      Controllers Layer                │  │
│  │  • Business Logic                     │  │
│  │  • Request Validation                 │  │
│  │  • Response Formatting                │  │
│  └────────┬─────────────────────────────┘  │
│           │                                  │
│  ┌────────▼─────────────────────────────┐  │
│  │       Models Layer (Mongoose)         │  │
│  │  • Schema Definitions                 │  │
│  │  • Validation Rules                   │  │
│  │  • Virtual Properties                 │  │
│  │  • Middleware Hooks                   │  │
│  └────────┬─────────────────────────────┘  │
│           │                                  │
│  ┌────────▼─────────────────────────────┐  │
│  │       Database Layer (MongoDB)        │  │
│  │  • Collections                        │  │
│  │  • Indexes                            │  │
│  │  • Aggregations                       │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## 🗄️ Database Schema Design

### Entity Relationship

```
┌──────────┐         ┌──────────┐
│  Agent   │         │  Client  │
│          │         │          │
│  _id     │◄───┐    │  _id     │
│  name    │    │    │  name    │
│  email   │    │    │  phone   │
└──────────┘    │    └────┬─────┘
                │         │
                │         │ 1:N
                │         │
           ┌────┴─────────▼─────┐
           │                     │
      ┌────▼────┐           ┌───▼────┐
      │ Policy  │           │Reminder│
      │         │           │        │
      │  _id    │           │  _id   │
      │ client  │           │ client │
      │  agent  │           └────────┘
      └────┬────┘
           │
           │ 1:N
           │
      ┌────▼────┐
      │  Claim  │
      │         │
      │  _id    │
      │ policy  │
      │ client  │
      └─────────┘

      ┌─────────┐
      │ Target  │
      │         │
      │  _id    │
      │  agent  │
      └─────────┘
```

### Collections Structure

**1. Clients Collection**
- Stores client information
- References: assignedAgent
- Indexes: name, email, phone (text), status

**2. Policies Collection**
- Stores policy details
- References: client, assignedAgent
- Indexes: policyNumber (unique), renewalDate, client

**3. Claims Collection**
- Stores claim information
- References: client, policy, assignedTo
- Indexes: claimNumber (unique), status, client

**4. Reminders Collection**
- Stores reminder/notification data
- References: client, policy, assignedAgent
- Indexes: dueDate, status, client

**5. Targets Collection**
- Stores agent targets
- References: agent
- Indexes: agent, targetPeriod, status

**6. Agents Collection**
- Stores user/agent data
- Indexes: email (unique), licenseNumber (unique)

## 🔄 Data Flow

### 1. Client Creation Flow

```
User Action (Frontend)
    │
    ▼
React Component
    │
    ▼
API Service (Axios)
    │
    ▼ HTTP POST /api/clients
    │
Express Route Handler
    │
    ▼
Client Controller
    │
    ├─► Validate Input
    │
    ├─► Create Client Model
    │
    ▼
MongoDB (via Mongoose)
    │
    ├─► Save Document
    │
    ├─► Trigger Middleware
    │
    ▼
Return Response
    │
    ▼
Frontend Updates UI
```

### 2. Policy Creation with Target Update

```
Create Policy Request
    │
    ▼
Policy Controller
    │
    ├─► Validate Client Exists
    │
    ├─► Create Policy
    │
    ├─► Update Client Statistics
    │       (via Mongoose post-save hook)
    │
    └─► Update Agent Targets
        (via Target.updateFromPolicy)
    │
    ▼
Return Policy
```

### 3. Claim Status Update

```
Update Claim Status
    │
    ▼
Claim Controller
    │
    ├─► Find Claim
    │
    ├─► Validate Status Transition
    │
    ├─► Update Status
    │
    ├─► Add to Status History
    │       (via pre-save hook)
    │
    ├─► Send Notification (if configured)
    │
    ▼
Return Updated Claim
```

## 🔐 Security Architecture

### Authentication Flow

```
1. User Login
   │
   ▼
2. Validate Credentials
   │
   ▼
3. Generate JWT Token
   │
   ▼
4. Return Token to Client
   │
   ▼
5. Client Stores Token (localStorage)
   │
   ▼
6. Include Token in Requests
   │   (Authorization: Bearer <token>)
   ▼
7. Verify Token (Middleware)
   │
   ▼
8. Process Request
```

### Security Layers

1. **Transport Security**
   - HTTPS in production
   - SSL/TLS certificates

2. **Authentication**
   - JWT tokens
   - Password hashing (bcrypt)
   - Token expiration

3. **Authorization**
   - Role-based access control
   - Resource ownership validation

4. **Input Validation**
   - Mongoose schema validation
   - express-validator middleware
   - Sanitization

5. **API Security**
   - CORS configuration
   - Rate limiting
   - Helmet security headers

6. **Database Security**
   - MongoDB authentication
   - Network access control
   - Encrypted connections

## 📊 Performance Optimization

### Caching Strategy

```
Request
  │
  ├─► Check Cache
  │     │
  │     ├─► Cache Hit → Return Cached Data
  │     │
  │     └─► Cache Miss
  │           │
  │           ▼
  │        Database Query
  │           │
  │           ▼
  │        Store in Cache
  │           │
  │           ▼
  │        Return Data
  │
  └─► Update/Delete → Invalidate Cache
```

**Cacheable Resources:**
- Client lists (short TTL)
- Policy statistics (medium TTL)
- Report data (longer TTL)
- Reference data (long TTL)

### Database Optimization

**Indexes:**
- Text indexes for search
- Compound indexes for filters
- Single field indexes for sorting
- Unique indexes for constraints

**Query Optimization:**
- Pagination to limit results
- Projection to select fields
- Aggregation pipelines for complex queries
- Populate only required fields

**Connection Pooling:**
- Mongoose manages connection pool
- Reuses connections efficiently
- Configurable pool size

## 🔄 Scalability Considerations

### Horizontal Scaling

```
┌─────────────┐
│ Load        │
│ Balancer    │
└──────┬──────┘
       │
   ┌───┴───┬───────┬────────┐
   │       │       │        │
┌──▼──┐ ┌──▼──┐ ┌──▼──┐  ┌──▼──┐
│API  │ │API  │ │API  │  │API  │
│Node1│ │Node2│ │Node3│  │Node4│
└──┬──┘ └──┬──┘ └──┬──┘  └──┬──┘
   │       │       │        │
   └───┬───┴───────┴────────┘
       │
┌──────▼──────┐
│  MongoDB    │
│  Replica    │
│  Set        │
└─────────────┘
```

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Use faster storage (SSD)
- Optimize queries and indexes
- Implement caching

### Database Scaling

**MongoDB Replica Set:**
- Primary for writes
- Secondaries for reads
- Automatic failover
- Data redundancy

**Sharding (Future):**
- Distribute data across servers
- Scale beyond single server capacity

## 🔌 Integration Points

### External Services (Future)

```
CRM System
    │
    ├─► Email Service (SMTP)
    │   └─► Notifications, Reminders
    │
    ├─► SMS Gateway
    │   └─► SMS Notifications
    │
    ├─► WhatsApp Business API
    │   └─► WhatsApp Messages
    │
    ├─► Payment Gateway
    │   └─► Premium Payments
    │
    ├─► Document Storage (S3)
    │   └─► Policy Documents
    │
    └─► Analytics Service
        └─► Business Intelligence
```

## 📁 File Structure

### Backend Structure
```
insurance-crm-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Client.js
│   │   ├── Policy.js
│   │   └── ...
│   ├── controllers/
│   │   ├── clientController.js
│   │   └── ...
│   ├── routes/
│   │   ├── clientRoutes.js
│   │   └── ...
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── package.json
└── .env
```

### Frontend Structure
```
insurance-crm-frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Clients.jsx
│   │   └── ...
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── .env
```

## 🚀 Deployment Architecture

### Production Setup

```
┌──────────────────────────────────────┐
│         CDN (Static Assets)           │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│      Reverse Proxy (Nginx)            │
│      • SSL Termination                │
│      • Load Balancing                 │
└──────────────┬───────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐   ┌─────▼──────┐
│   Frontend  │   │   Backend  │
│   (Static)  │   │   (Node.js)│
└─────────────┘   └──────┬─────┘
                         │
                  ┌──────▼──────┐
                  │   MongoDB   │
                  │   (Replica) │
                  └─────────────┘
```

## 💡 Best Practices Implemented

1. **Separation of Concerns**
   - Routes, Controllers, Models separated
   - Business logic in controllers
   - Data access through models

2. **Error Handling**
   - Global error handler
   - Async error catching
   - Proper HTTP status codes

3. **Security**
   - Input validation
   - Authentication/Authorization
   - Rate limiting
   - CORS protection

4. **Code Organization**
   - Modular structure
   - Reusable components
   - Clear naming conventions

5. **Database Design**
   - Normalized data
   - Proper indexing
   - Efficient queries

6. **API Design**
   - RESTful principles
   - Consistent responses
   - Proper HTTP methods

---

**Next Steps:**
- Review [Database Schema](./02-database-schema.md)
- Understand [Backend Structure](./03-backend-structure.md)
- Learn about [Security Implementation](./05-security.md)
