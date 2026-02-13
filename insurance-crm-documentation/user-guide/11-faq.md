# Frequently Asked Questions (FAQ)

Common questions and answers about the Insurance & Mutual Fund CRM system.

## 📚 General Questions

### What is the Insurance & Mutual Fund CRM?
A comprehensive customer relationship management system designed specifically for insurance agents and brokers to manage clients, policies, claims, reminders, and performance targets.

### Who is this system for?
- Insurance agents and brokers
- Insurance agencies
- Mutual fund distributors
- Financial advisors handling insurance products

### What types of insurance does it support?
- Life Insurance
- General Insurance (Property, Vehicle, etc.)
- Health Insurance
- Motor Insurance
- Travel Insurance
- Mutual Funds

### Is this system free?
Yes, the system is open-source and free to use for personal and commercial purposes under the ISC license.

### Can I customize it for my business?
Yes! The system is fully customizable. You can modify the code to add features or adapt it to your specific needs.

## 🔐 Security & Access

### Is my data secure?
Yes. The system implements:
- Password encryption (bcrypt)
- JWT authentication
- HTTPS support for production
- Input validation and sanitization
- Database access controls

### Who can access the system?
Access is controlled by user roles:
- **Admin** - Full system access
- **Manager** - Team management and reports
- **Agent** - Personal clients and policies

### How do I reset my password?
Currently, password reset requires database access. Contact your administrator or:
```bash
# Use MongoDB shell to reset password
mongosh insurancecrm
db.agents.updateOne(
  { email: "your@email.com" },
  { $set: { password: "new-hashed-password" } }
)
```

### Can multiple users use the system simultaneously?
Yes, the system supports multiple concurrent users without conflicts.

## 💾 Data Management

### How is data stored?
Data is stored in MongoDB, a NoSQL database that provides:
- Flexible schema
- High performance
- Scalability
- Reliability

### Can I backup my data?
Yes! Regular backups are recommended:
```bash
# Backup entire database
mongodump --db insurancecrm --out /backup/location

# Restore from backup
mongorestore --db insurancecrm /backup/location/insurancecrm
```

### How do I export data?
Multiple export options:
- **Excel** - Most reports can be exported to Excel
- **PDF** - Generate PDF reports
- **JSON** - API returns JSON data
- **CSV** - Export from MongoDB or Excel

### What happens if I delete a client?
- Cannot delete clients with active policies
- System prevents accidental deletions
- Consider marking as "Inactive" instead

### Can I import existing data?
Yes, you can import data:
1. Format data according to schema
2. Use MongoDB import tools
3. Or use the API to create records programmatically

## 👥 Client Management

### How many clients can I manage?
No hard limit. The system can handle thousands of clients with proper server resources.

### Can I have duplicate client names?
Yes, clients are identified by unique IDs, not names. However, duplicate phone/email will show warnings.

### How do I search for clients?
Use the search box to search by:
- Name
- Email
- Phone number
Text search is instant and case-insensitive.

### Can I add custom fields for clients?
Yes, by modifying the Client model schema in the backend code and updating the frontend forms.

### What's the difference between Prospect and Active status?
- **Prospect** - Potential client, no policies yet
- **Active** - Has at least one active policy
- **Inactive** - Previously active, no current policies

## 📋 Policy Management

### What policy types are supported?
- Life Insurance
- General Insurance
- Health Insurance
- Motor Insurance
- Travel Insurance
- Mutual Fund

### Can one client have multiple policies?
Yes, clients can have unlimited policies across different types and companies.

### How are renewal dates tracked?
- System stores renewal date for each policy
- Automatic reminders can be configured
- Upcoming renewals dashboard widget
- Reports show policies due for renewal

### What happens when a policy matures?
- Update status to "Matured"
- System stops renewal reminders
- Policy remains in database for records
- Can generate maturity reports

### Can I upload policy documents?
The schema supports document storage. Implementation requires:
- File upload functionality in frontend
- Cloud storage integration (AWS S3, etc.)
- Or local file system storage

## 💰 Claims Processing

### How do I submit a claim?
1. Navigate to Claims
2. Click "Add Claim"
3. Select policy
4. Enter claim details
5. Upload supporting documents (if configured)
6. Submit

### What are the claim statuses?
- **Pending** - Initial submission
- **Under Review** - Being processed
- **Approved** - Claim approved
- **Rejected** - Claim denied
- **Settled** - Payment completed
- **Shortfall** - Additional info needed

### Can I track claim history?
Yes, each claim maintains:
- Status history with timestamps
- Notes and comments
- Assigned personnel
- Processing timeline

### How long does claim processing take?
Processing time depends on:
- Claim type
- Documentation completeness
- Insurance company policies
Average shown in reports based on historical data.

## 🔔 Reminders & Notifications

### What types of reminders are available?
- **Renewal** - Policy renewals
- **Premium Due** - Payment reminders
- **Maturity** - Policy maturity dates
- **Birthday** - Client birthdays
- **Anniversary** - Client anniversaries
- **Health Checkup** - Annual checkups
- **Follow-up** - General follow-ups
- **Custom** - Any other reminders

### How do notifications work?
Currently supports:
- In-app reminders
- Email notifications (if SMTP configured)
- SMS (requires SMS gateway integration)
- WhatsApp (requires API integration)

### Can I snooze reminders?
Yes, reminders can be snoozed for a specified number of days.

### Do reminders repeat automatically?
Yes, based on frequency:
- One-Time
- Daily
- Weekly
- Monthly
- Yearly

### How far in advance should I set reminders?
Recommended schedule for renewals:
- 30 days before
- 7 days before
- 1 day before
- Day of renewal

## 🎯 Targets & Performance

### How do targets work?
- Set period-based targets (Monthly/Quarterly/Yearly)
- Track achievement in real-time
- Automatic updates when policies are created
- Visual progress indicators

### Can I set different targets for different products?
Yes, targets can be:
- Product-specific (Life, General, etc.)
- Or "All" products combined

### What if I exceed my target?
- Achievement percentage can go above 100%
- Bonus triggers (if configured)
- Performance reports show over-achievement

### Are targets team-based or individual?
Currently individual per agent. Team targets require custom implementation.

## 📊 Reports & Analytics

### What reports are available?
- **Dashboard** - Overview statistics
- **Policy Report** - All policy details
- **Claim Report** - Claims analysis
- **Renewal Report** - Upcoming renewals
- **Target Report** - Performance tracking
- **Client Activity** - Client additions and changes

### Can I customize report date ranges?
Yes, most reports support custom date range filters.

### What export formats are supported?
- **Excel** (.xlsx) - Spreadsheet format
- **PDF** (planned) - Document format
- **JSON** - Raw data via API

### How often should I generate reports?
Recommended frequency:
- **Daily** - Check dashboard
- **Weekly** - Renewal reports
- **Monthly** - Performance and targets
- **Quarterly** - Comprehensive analysis
- **Yearly** - Annual reviews

## 🔧 Technical Questions

### What technology is used?
**Backend:**
- Node.js - Runtime
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM

**Frontend:**
- React - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client

### What are the system requirements?
**Minimum:**
- 4GB RAM
- Dual-core processor
- 2GB free storage

**Recommended:**
- 8GB+ RAM
- Quad-core processor
- 5GB+ storage

### Can I run this on shared hosting?
Not recommended. Best options:
- VPS (Digital Ocean, Linode)
- Cloud (AWS, Azure, GCP)
- Platform as a Service (Heroku, Render)

### Does it work offline?
No, requires internet connection to access database. Future: PWA with offline support.

### Is it mobile-responsive?
Yes, the UI is designed to work on:
- Desktop computers
- Tablets
- Mobile phones

### Can I create a mobile app?
Yes, you can:
- Use the same API
- Build React Native app
- Or use Progressive Web App (PWA)

## 🚀 Deployment & Production

### How do I deploy to production?
See [Production Deployment Guide](../deployment/02-production.md)

Key steps:
1. Set up production server
2. Configure environment variables
3. Use HTTPS
4. Set up MongoDB (Atlas recommended)
5. Configure domain and SSL

### What hosting do you recommend?
**Backend:**
- Digital Ocean Droplet
- AWS EC2
- Heroku
- Render

**Database:**
- MongoDB Atlas (easiest)
- Self-hosted MongoDB

**Frontend:**
- Vercel (free tier available)
- Netlify (free tier available)
- AWS S3 + CloudFront

### How do I update the system?
1. Backup database
2. Test updates in development
3. Stop production server
4. Pull/copy new code
5. Run migrations (if any)
6. Restart server
7. Verify functionality

### What about database migrations?
- Mongoose handles schema changes
- For major changes, write migration scripts
- Always backup before migrations

## 🐛 Troubleshooting

### Why can't I connect to the database?
Check:
- MongoDB is running
- Connection string is correct
- Network access (firewall, IP whitelist)
- Authentication credentials

### The frontend shows blank page
Check:
- Backend is running
- API URL is correct in .env
- Browser console for errors
- Network tab for failed requests

### API returns 404 errors
Verify:
- Backend server is running
- Route paths are correct
- Check backend logs for errors

### Performance is slow
Consider:
- Add database indexes
- Implement caching
- Optimize queries
- Increase server resources
- Use CDN for static files

### How do I view logs?
**Backend logs:**
```bash
# Development
npm run dev  # Logs show in terminal

# Production with PM2
pm2 logs insurance-crm-api
```

**Database logs:**
```bash
# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

## 💡 Best Practices

### Data Entry
- Always fill required fields
- Use consistent formatting
- Add notes for context
- Double-check important data

### Regular Maintenance
- Backup data weekly
- Review inactive clients monthly
- Archive old records yearly
- Update system regularly

### Security
- Use strong passwords
- Change JWT secret in production
- Enable HTTPS
- Regular security updates
- Limit user access appropriately

### Performance
- Keep database size reasonable
- Archive old data
- Use proper indexes
- Monitor system resources

## 📞 Getting More Help

### Where can I find more documentation?
- [Installation Guide](./01-installation.md)
- [Quick Start](./02-quick-start.md)
- [User Guide](./04-dashboard.md)
- [API Documentation](../api/01-overview.md)
- [Technical Docs](../technical/01-architecture.md)

### How do I report bugs?
- Check [Troubleshooting Guide](./12-troubleshooting.md)
- Verify with logs
- Document steps to reproduce
- Include error messages
- Note system configuration

### Can I request new features?
Yes! Consider:
- Is it generally useful?
- Can you implement it yourself?
- Would others benefit?
- Is it aligned with system goals?

### How do I contribute?
1. Understand the codebase
2. Follow coding standards
3. Write tests
4. Document changes
5. Submit improvements

---

**Still have questions?** Check the [Troubleshooting Guide](./12-troubleshooting.md) or review the [Complete Documentation](../README.md).
