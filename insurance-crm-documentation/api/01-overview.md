# API Documentation Overview

Complete REST API reference for the Insurance & Mutual Fund CRM system.

## 📡 API Base Information

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Content Type
All requests and responses use JSON format:
```
Content-Type: application/json
```

### Response Format
All API responses follow this standard structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "count": 10,
  "total": 100,
  "currentPage": 1,
  "totalPages": 10
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🔐 Authentication

### JWT Token Authentication

The API uses JWT (JSON Web Token) for authentication.

**Get Token:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "role": "Agent"
  }
}
```

**Using Token:**
```http
GET /api/clients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📚 API Resources

### 1. Clients API
Manage client information and profiles.

**Base Path:** `/api/clients`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients` | List all clients |
| GET | `/clients/:id` | Get single client |
| POST | `/clients` | Create new client |
| PUT | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |
| GET | `/clients/stats/overview` | Get client statistics |
| GET | `/clients/:id/policies` | Get client's policies |

[Detailed Documentation](./03-clients-api.md)

### 2. Policies API
Manage insurance and mutual fund policies.

**Base Path:** `/api/policies`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/policies` | List all policies |
| GET | `/policies/:id` | Get single policy |
| POST | `/policies` | Create new policy |
| PUT | `/policies/:id` | Update policy |
| DELETE | `/policies/:id` | Delete policy |
| GET | `/policies/stats/overview` | Get policy statistics |
| GET | `/policies/renewal/upcoming` | Get upcoming renewals |
| GET | `/policies/maturity/list` | Get matured policies |

[Detailed Documentation](./04-policies-api.md)

### 3. Claims API
Process and track insurance claims.

**Base Path:** `/api/claims`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/claims` | List all claims |
| GET | `/claims/:id` | Get single claim |
| POST | `/claims` | Create new claim |
| PUT | `/claims/:id` | Update claim |
| PATCH | `/claims/:id/status` | Update claim status |
| DELETE | `/claims/:id` | Delete claim |
| GET | `/claims/stats/overview` | Get claim statistics |
| GET | `/claims/pending/list` | Get pending claims |

[Detailed Documentation](./05-claims-api.md)

### 4. Reminders API
Manage reminders and notifications.

**Base Path:** `/api/reminders`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reminders` | List all reminders |
| GET | `/reminders/:id` | Get single reminder |
| POST | `/reminders` | Create new reminder |
| PUT | `/reminders/:id` | Update reminder |
| PATCH | `/reminders/:id/complete` | Mark as complete |
| PATCH | `/reminders/:id/snooze` | Snooze reminder |
| DELETE | `/reminders/:id` | Delete reminder |
| GET | `/reminders/stats/overview` | Get reminder statistics |
| GET | `/reminders/upcoming/:days` | Get upcoming reminders |
| GET | `/reminders/overdue/list` | Get overdue reminders |

[Detailed Documentation](./06-reminders-api.md)

### 5. Targets API
Track agent performance and targets.

**Base Path:** `/api/targets`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/targets` | List all targets |
| GET | `/targets/:id` | Get single target |
| POST | `/targets` | Create new target |
| PUT | `/targets/:id` | Update target |
| DELETE | `/targets/:id` | Delete target |
| GET | `/targets/stats/overview` | Get target statistics |
| GET | `/targets/agent/:agentId/active` | Get agent's active targets |
| GET | `/targets/agent/:agentId/performance` | Get agent performance |

[Detailed Documentation](./07-targets-api.md)

### 6. Reports API
Generate reports and analytics.

**Base Path:** `/api/reports`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/dashboard` | Get dashboard statistics |
| GET | `/reports/policies` | Generate policy report |
| GET | `/reports/claims` | Generate claim report |
| GET | `/reports/renewals` | Generate renewal report |
| GET | `/reports/targets` | Generate target report |
| GET | `/reports/client-activity` | Get client activity |

[Detailed Documentation](./08-reports-api.md)

## 🔢 HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## 📄 Pagination

All list endpoints support pagination using query parameters:

```http
GET /api/clients?page=1&limit=10
```

**Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 243,
  "currentPage": 1,
  "totalPages": 25,
  "data": [...]
}
```

## 🔍 Filtering & Sorting

### Filtering
Use query parameters to filter results:

```http
GET /api/clients?status=Active&clientType=Individual
GET /api/policies?company=LIC&status=Active
GET /api/claims?status=Pending&priority=High
```

### Sorting
Use `sortBy` parameter:

```http
GET /api/clients?sortBy=-createdAt  # Descending
GET /api/clients?sortBy=name        # Ascending
```

### Search
Use `search` parameter for text search:

```http
GET /api/clients?search=john
GET /api/policies?search=LIC-2024
```

## 🔐 Rate Limiting

API requests are rate-limited to prevent abuse:

**Limits:**
- 100 requests per 15 minutes per IP
- Header included in response:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time until reset

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## 📝 Request Examples

### Using cURL

```bash
# List clients
curl http://localhost:5000/api/clients

# Create client
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210"
  }'

# Update client
curl -X PUT http://localhost:5000/api/clients/123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Active"
  }'

# Delete client
curl -X DELETE http://localhost:5000/api/clients/123
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// List clients
const clients = await api.get('/clients', {
  params: { page: 1, limit: 10 }
});

// Create client
const newClient = await api.post('/clients', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+919876543210'
});

// Update client
const updated = await api.put('/clients/123', {
  status: 'Active'
});

// Delete client
await api.delete('/clients/123');
```

### Using Python (Requests)

```python
import requests

base_url = 'http://localhost:5000/api'

# List clients
response = requests.get(f'{base_url}/clients')
clients = response.json()

# Create client
data = {
    'name': 'John Doe',
    'email': 'john@example.com',
    'phone': '+919876543210'
}
response = requests.post(f'{base_url}/clients', json=data)
new_client = response.json()

# Update client
data = {'status': 'Active'}
response = requests.put(f'{base_url}/clients/123', json=data)

# Delete client
response = requests.delete(f'{base_url}/clients/123')
```

## 🧪 Testing with Postman

A Postman collection is included with the backend:
- File: `Insurance-CRM-API.postman_collection.json`
- Location: `insurance-crm-backend/`

**Import to Postman:**
1. Open Postman
2. Click "Import"
3. Select the JSON file
4. All API endpoints will be available

**Set Environment Variable:**
- Create variable: `baseUrl`
- Set value: `http://localhost:5000`

## 🌐 CORS Configuration

CORS is configured to allow requests from the frontend:

**Allowed Origins:**
- `http://localhost:3000` (Development)
- Your production domain (Production)

**Allowed Methods:**
- GET, POST, PUT, PATCH, DELETE

**Allowed Headers:**
- Content-Type
- Authorization

## 📊 Data Validation

All POST and PUT requests validate data:

**Validation Rules:**
- Required fields must be present
- Email must be valid format
- Phone numbers must match pattern
- Dates must be valid ISO format
- Enums must match allowed values
- Numbers must be positive where applicable

**Validation Error Response:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": "Please provide a valid email",
    "phone": "Phone number is required"
  }
}
```

## 🔄 API Versioning

Current API version: **v1**

The API is not currently versioned in the URL. Future versions may use:
```
/api/v1/clients
/api/v2/clients
```

## 📚 Additional Resources

- [Clients API Details](./03-clients-api.md)
- [Policies API Details](./04-policies-api.md)
- [Claims API Details](./05-claims-api.md)
- [Reminders API Details](./06-reminders-api.md)
- [Targets API Details](./07-targets-api.md)
- [Reports API Details](./08-reports-api.md)
- [Authentication Guide](./02-authentication.md)
- [Error Handling](./09-error-handling.md)

## 💡 Best Practices

1. **Always use HTTPS in production**
2. **Store JWT tokens securely**
3. **Handle errors gracefully**
4. **Implement retry logic for failed requests**
5. **Use pagination for large datasets**
6. **Cache responses where appropriate**
7. **Monitor API rate limits**
8. **Log all API interactions**

---

**Need Help?** Check the detailed documentation for each API endpoint or refer to the examples provided.
