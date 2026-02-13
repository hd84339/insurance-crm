# Insurance & Mutual Fund CRM - Backend API

A comprehensive REST API for managing insurance and mutual fund CRM operations built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Client Management** - CRUD operations for client data
- **Policy Management** - Handle life, general, and mutual fund policies
- **Claims Processing** - Track and manage insurance claims
- **Reminder System** - Automated reminders for renewals, birthdays, and follow-ups
- **Target Tracking** - Monitor agent performance against targets
- **Report Generation** - Export reports in JSON, Excel, and PDF formats

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd insurance-crm-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/insurance-crm
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

5. **Run the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "count": 10,
  "total": 100,
  "currentPage": 1,
  "totalPages": 10
}
```

---

## 👥 Clients API

### Get All Clients
```http
GET /api/clients
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `search` (string) - Search by name, email, or phone
- `status` (string) - Filter by status: Active, Inactive, Prospect
- `clientType` (string) - Individual, Corporate
- `priority` (string) - Low, Medium, High
- `assignedAgent` (ObjectId) - Filter by agent
- `sortBy` (string) - Sort field (default: -createdAt)

**Example:**
```bash
GET /api/clients?page=1&limit=10&status=Active&search=john
```

### Get Single Client
```http
GET /api/clients/:id
```

### Create Client
```http
POST /api/clients
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "dateOfBirth": "1990-01-01",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "clientType": "Individual",
  "priority": "Medium",
  "tags": ["Premium", "VIP"],
  "assignedAgent": "agent_id_here"
}
```

### Update Client
```http
PUT /api/clients/:id
```

### Delete Client
```http
DELETE /api/clients/:id
```

### Get Client Statistics
```http
GET /api/clients/stats/overview
```

### Get Client Policies
```http
GET /api/clients/:id/policies
```

---

## 📋 Policies API

### Get All Policies
```http
GET /api/policies
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `search` - Search by policy number or plan name
- `policyType` - Life Insurance, General Insurance, Mutual Fund, Health, Motor, Travel
- `company` - LIC, Bajaj, HDFC, ICICI, TATA AIA, etc.
- `status` - Active, Lapsed, Matured, Surrendered, Pending
- `paymentStatus` - Paid, Pending, Overdue
- `client` - Filter by client ID
- `assignedAgent` - Filter by agent ID

### Get Single Policy
```http
GET /api/policies/:id
```

### Create Policy
```http
POST /api/policies
```

**Request Body:**
```json
{
  "client": "client_id_here",
  "policyNumber": "LIC-2024-001",
  "policyType": "Life Insurance",
  "company": "LIC",
  "planName": "Jeevan Anand",
  "premiumAmount": 50000,
  "premiumFrequency": "Yearly",
  "sumAssured": 1000000,
  "policyTerm": 20,
  "startDate": "2024-01-01",
  "maturityDate": "2044-01-01",
  "renewalDate": "2025-01-01",
  "nominees": [
    {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "dateOfBirth": "1992-05-15",
      "share": 100
    }
  ],
  "assignedAgent": "agent_id_here"
}
```

### Update Policy
```http
PUT /api/policies/:id
```

### Delete Policy
```http
DELETE /api/policies/:id
```

### Get Policy Statistics
```http
GET /api/policies/stats/overview
```

### Get Upcoming Renewals
```http
GET /api/policies/renewal/upcoming?days=30
```

### Get Matured Policies
```http
GET /api/policies/maturity/list
```

---

## 🏥 Claims API

### Get All Claims
```http
GET /api/claims
```

**Query Parameters:**
- `status` - Pending, Under Review, Approved, Rejected, Settled, Shortfall
- `claimType` - Death, Maturity, Accident, Medical, Surrender, Partial Withdrawal
- `priority` - Low, Medium, High, Urgent
- `client`, `policy`, `assignedTo`

### Get Single Claim
```http
GET /api/claims/:id
```

### Create Claim
```http
POST /api/claims
```

**Request Body:**
```json
{
  "policy": "policy_id_here",
  "claimType": "Medical",
  "claimAmount": 100000,
  "incidentDate": "2024-01-15",
  "description": "Medical treatment for illness",
  "priority": "High",
  "documents": [
    {
      "name": "Medical Report",
      "type": "pdf",
      "url": "https://example.com/doc.pdf"
    }
  ]
}
```

### Update Claim
```http
PUT /api/claims/:id
```

### Update Claim Status
```http
PATCH /api/claims/:id/status
```

**Request Body:**
```json
{
  "status": "Approved",
  "note": "All documents verified",
  "updatedBy": "agent_id_here"
}
```

### Delete Claim
```http
DELETE /api/claims/:id
```

### Get Claim Statistics
```http
GET /api/claims/stats/overview
```

### Get Pending Claims
```http
GET /api/claims/pending/list
```

---

## 🔔 Reminders API

### Get All Reminders
```http
GET /api/reminders
```

**Query Parameters:**
- `reminderType` - Renewal, Premium Due, Maturity, Birthday, Anniversary, Health Checkup, Follow-up, Custom
- `status` - Pending, Completed, Cancelled, Snoozed
- `priority` - Low, Medium, High
- `upcoming` - Number of days (e.g., `upcoming=7`)
- `overdue` - true/false

### Get Single Reminder
```http
GET /api/reminders/:id
```

### Create Reminder
```http
POST /api/reminders
```

**Request Body:**
```json
{
  "client": "client_id_here",
  "policy": "policy_id_here",
  "reminderType": "Renewal",
  "title": "LIC Policy Renewal Due",
  "description": "Annual premium payment due",
  "dueDate": "2024-03-01",
  "priority": "High",
  "frequency": "Yearly",
  "notificationChannels": ["Email", "SMS"],
  "notificationSchedule": [
    { "daysBeforeDue": 7 },
    { "daysBeforeDue": 3 },
    { "daysBeforeDue": 1 }
  ],
  "amount": 50000
}
```

### Update Reminder
```http
PUT /api/reminders/:id
```

### Complete Reminder
```http
PATCH /api/reminders/:id/complete
```

**Request Body:**
```json
{
  "agentId": "agent_id_here"
}
```

### Snooze Reminder
```http
PATCH /api/reminders/:id/snooze
```

**Request Body:**
```json
{
  "days": 3
}
```

### Delete Reminder
```http
DELETE /api/reminders/:id
```

### Get Reminder Statistics
```http
GET /api/reminders/stats/overview
```

### Get Upcoming Reminders
```http
GET /api/reminders/upcoming/7
```

### Get Overdue Reminders
```http
GET /api/reminders/overdue/list
```

---

## 🎯 Targets API

### Get All Targets
```http
GET /api/targets
```

**Query Parameters:**
- `agent` - Filter by agent ID
- `targetPeriod` - Monthly, Quarterly, Half-Yearly, Yearly
- `productType` - Life, General, Mutual Fund, Health, Motor, All
- `status` - Active, Completed, Expired, Cancelled

### Get Single Target
```http
GET /api/targets/:id
```

### Create Target
```http
POST /api/targets
```

**Request Body:**
```json
{
  "agent": "agent_id_here",
  "targetPeriod": "Quarterly",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "productType": "Life",
  "targetAmount": 5000000,
  "targetPolicies": 50,
  "bonus": {
    "threshold": 100,
    "amount": 50000
  }
}
```

### Update Target
```http
PUT /api/targets/:id
```

### Delete Target
```http
DELETE /api/targets/:id
```

### Get Target Statistics
```http
GET /api/targets/stats/overview
```

### Get Agent Active Targets
```http
GET /api/targets/agent/:agentId/active
```

### Get Agent Performance
```http
GET /api/targets/agent/:agentId/performance?period=Monthly
```

---

## 📊 Reports API

### Generate Policy Report
```http
GET /api/reports/policies?format=json
```

**Query Parameters:**
- `startDate`, `endDate` - Date range
- `policyType`, `company`, `status` - Filters
- `format` - json, excel, pdf

**Example:**
```bash
GET /api/reports/policies?startDate=2024-01-01&endDate=2024-12-31&format=excel
```

### Generate Claim Report
```http
GET /api/reports/claims?format=json
```

**Query Parameters:**
- `startDate`, `endDate`
- `status`, `claimType`
- `format` - json, excel

### Generate Renewal Report
```http
GET /api/reports/renewals?days=30&format=excel
```

### Generate Target Report
```http
GET /api/reports/targets?period=Quarterly&format=excel
```

### Generate Client Activity Report
```http
GET /api/reports/client-activity?startDate=2024-01-01&endDate=2024-01-31
```

### Get Dashboard Statistics
```http
GET /api/reports/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalClients": 243,
      "totalPolicies": 1631,
      "activePolicies": 1450,
      "totalPremium": 23400000,
      "totalSumAssured": 234000000
    },
    "claims": [
      { "_id": "Approved", "count": 164, "amount": 17500000 },
      { "_id": "Pending", "count": 120, "amount": 5200000 }
    ],
    "monthlyActivity": {
      "newClients": 12,
      "newPolicies": 45,
      "newClaims": 8
    },
    "upcomingReminders": 34
  }
}
```

---

## 🔒 Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 📦 Project Structure

```
insurance-crm-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Client.js
│   │   ├── Policy.js
│   │   ├── Claim.js
│   │   ├── Reminder.js
│   │   ├── Target.js
│   │   └── Agent.js
│   ├── controllers/
│   │   ├── clientController.js
│   │   ├── policyController.js
│   │   ├── claimController.js
│   │   ├── reminderController.js
│   │   ├── targetController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── clientRoutes.js
│   │   ├── policyRoutes.js
│   │   ├── claimRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── targetRoutes.js
│   │   └── reportRoutes.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name insurance-crm-api
pm2 save
pm2 startup
```

### Using Docker
```bash
docker build -t insurance-crm-api .
docker run -p 5000:5000 insurance-crm-api
```

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/insurance-crm |
| `JWT_SECRET` | JWT secret key | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Insurance CRM Development Team

---

## 📞 Support

For support, email support@insurancecrm.com or open an issue on GitHub.
