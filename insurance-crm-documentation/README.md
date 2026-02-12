# Insurance & Mutual Fund CRM - Complete Documentation

Welcome to the comprehensive documentation for the Insurance & Mutual Fund CRM system.

## 📚 Documentation Overview

This documentation is organized into several sections to help you understand, install, use, and maintain the CRM system.

## 📖 Table of Contents

### 1. Getting Started
- [Installation Guide](./user-guide/01-installation.md)
- [Quick Start Tutorial](./user-guide/02-quick-start.md)
- [System Requirements](./user-guide/03-system-requirements.md)

### 2. User Guide
- [Dashboard Overview](./user-guide/04-dashboard.md)
- [Client Management](./user-guide/05-client-management.md)
- [Policy Management](./user-guide/06-policy-management.md)
- [Claims Processing](./user-guide/07-claims-processing.md)
- [Reminders & Notifications](./user-guide/08-reminders.md)
- [Target & Performance Tracking](./user-guide/09-targets.md)
- [Reports & Analytics](./user-guide/10-reports.md)

### 3. Technical Documentation
- [System Architecture](./technical/01-architecture.md)
- [Database Schema](./technical/02-database-schema.md)
- [Backend Structure](./technical/03-backend-structure.md)
- [Frontend Structure](./technical/04-frontend-structure.md)
- [Security Implementation](./technical/05-security.md)
- [Performance Optimization](./technical/06-performance.md)

### 4. API Documentation
- [API Overview](./api/01-overview.md)
- [Authentication](./api/02-authentication.md)
- [Clients API](./api/03-clients-api.md)
- [Policies API](./api/04-policies-api.md)
- [Claims API](./api/05-claims-api.md)
- [Reminders API](./api/06-reminders-api.md)
- [Targets API](./api/07-targets-api.md)
- [Reports API](./api/08-reports-api.md)
- [Error Handling](./api/09-error-handling.md)

### 5. Deployment Guide
- [Development Environment](./deployment/01-development.md)
- [Production Deployment](./deployment/02-production.md)
- [Docker Deployment](./deployment/03-docker.md)
- [Cloud Deployment (AWS/Azure/GCP)](./deployment/04-cloud.md)
- [Database Backup & Recovery](./deployment/05-backup.md)
- [Monitoring & Logging](./deployment/06-monitoring.md)

### 6. Appendix
- [FAQ](./user-guide/11-faq.md)
- [Troubleshooting](./user-guide/12-troubleshooting.md)
- [Glossary](./user-guide/13-glossary.md)
- [Changelog](./user-guide/14-changelog.md)

## 🎯 Quick Links

### For End Users
- **New to the system?** Start with [Quick Start Tutorial](./user-guide/02-quick-start.md)
- **Need help with a feature?** Check [User Guide](./user-guide/04-dashboard.md)
- **Having issues?** See [Troubleshooting](./user-guide/12-troubleshooting.md)

### For Developers
- **Want to understand the code?** Read [System Architecture](./technical/01-architecture.md)
- **Need API reference?** Check [API Documentation](./api/01-overview.md)
- **Deploying to production?** Follow [Deployment Guide](./deployment/02-production.md)

### For Administrators
- **Setting up the system?** Start with [Installation Guide](./user-guide/01-installation.md)
- **Need to backup data?** See [Backup & Recovery](./deployment/05-backup.md)
- **Monitoring performance?** Check [Monitoring Guide](./deployment/06-monitoring.md)

## 🚀 System Overview

The Insurance & Mutual Fund CRM is a comprehensive customer relationship management system designed specifically for insurance agents and brokers. It helps manage:

- **Clients** - Complete client database with contact information
- **Policies** - Life insurance, general insurance, and mutual fund policies
- **Claims** - End-to-end claims processing and tracking
- **Reminders** - Automated notifications for renewals and important dates
- **Targets** - Performance tracking and goal management
- **Reports** - Comprehensive analytics and exports

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** MongoDB 4.4+
- **ODM:** Mongoose
- **Authentication:** JWT
- **File Generation:** ExcelJS, PDFKit

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router 6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Database
- **Primary Database:** MongoDB
- **Hosting Options:** Local, MongoDB Atlas
- **Backup:** mongodump/mongorestore

## 📊 Key Features

### Client Management
- Complete client profiles with contact information
- Client categorization (Individual/Corporate)
- Priority levels and tags
- Client activity tracking
- Search and filtering

### Policy Management
- Multiple policy types (Life, General, Health, Motor, Travel, Mutual Funds)
- Premium tracking and payment status
- Renewal date management
- Nominee information
- Document storage

### Claims Processing
- Claim submission and tracking
- Status management workflow
- Document upload
- Settlement tracking
- Claims analytics

### Reminder System
- Automated renewal reminders
- Birthday and anniversary notifications
- Health checkup reminders
- Custom reminder creation
- Multi-channel notifications (Email, SMS)

### Target Management
- Agent-wise target setting
- Period-based targets (Monthly, Quarterly, Yearly)
- Real-time achievement tracking
- Bonus calculation
- Performance analytics

### Reports & Analytics
- Dashboard with key metrics
- Export to Excel and PDF
- Custom date range reports
- Policy reports
- Claim reports
- Renewal reports
- Target achievement reports

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin, Manager, Agent)
- API rate limiting
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 📞 Support

For questions or issues:

- **Technical Issues:** Check [Troubleshooting Guide](./user-guide/12-troubleshooting.md)
- **Feature Questions:** See [User Guide](./user-guide/04-dashboard.md)
- **API Questions:** Review [API Documentation](./api/01-overview.md)
- **Deployment Help:** Follow [Deployment Guide](./deployment/02-production.md)

## 📝 Contributing

This documentation is maintained to help users and developers work effectively with the Insurance CRM system. If you find any errors or have suggestions for improvement, please provide feedback.

## 📄 License

This software and documentation are provided under the ISC License.

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Documentation Version:** 1.0
