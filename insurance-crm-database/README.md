# Insurance CRM Database Setup

MongoDB database setup and configuration for the Insurance & Mutual Fund CRM system.

## 📋 Prerequisites

- MongoDB 4.4 or higher
- mongosh (MongoDB Shell)

## 🚀 Quick Setup

### Option 1: Local MongoDB Installation

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb-org
   
   # macOS
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB Service**
   ```bash
   # Linux
   sudo systemctl start mongod
   
   # macOS
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   ```

3. **Run Setup Scripts**
   ```bash
   # Navigate to database folder
   cd insurance-crm-database/scripts
   
   # Create database and collections
   mongosh < setup-database.js
   
   # Insert sample data (optional)
   mongosh < insert-sample-data.js
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier
   - Select your region
   - Click "Create"

3. **Setup Database Access**
   - Database Access → Add New Database User
   - Choose password authentication
   - Save username and password

4. **Setup Network Access**
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update Backend .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insurancecrm?retryWrites=true&w=majority
   ```

7. **Run Setup from Backend**
   ```bash
   # The backend will automatically create collections on first run
   # Or use MongoDB Compass to import the scripts
   ```

## 📊 Database Schema

### Collections

1. **clients** - Client information
2. **policies** - Insurance and mutual fund policies
3. **claims** - Insurance claims
4. **reminders** - Renewal and event reminders
5. **targets** - Agent performance targets
6. **agents** - System users and agents

### Indexes

Performance indexes are automatically created on:
- Text search fields (name, email, phone)
- Relationship fields (client, policy, agent references)
- Date fields (renewal dates, due dates)
- Status and type fields

## 🔧 Database Management

### Connect to Database

```bash
# Local MongoDB
mongosh

# MongoDB Atlas
mongosh "mongodb+srv://cluster.mongodb.net/insurancecrm" --username your-username
```

### View Collections

```javascript
use insurancecrm;
show collections;
```

### Query Examples

```javascript
// Find all active clients
db.clients.find({ status: "Active" });

// Find policies due for renewal in next 30 days
const today = new Date();
const futureDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
db.policies.find({
  renewalDate: { $gte: today, $lte: futureDate },
  status: "Active"
});

// Count claims by status
db.claims.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);

// Find top performing agents
db.targets.aggregate([
  { $match: { status: "Active" } },
  { $sort: { achievementPercentage: -1 } },
  { $limit: 5 }
]);
```

### Backup Database

```bash
# Backup entire database
mongodump --db insurancecrm --out /path/to/backup

# Restore from backup
mongorestore --db insurancecrm /path/to/backup/insurancecrm
```

### Export/Import Collections

```bash
# Export collection to JSON
mongoexport --db insurancecrm --collection clients --out clients.json

# Import collection from JSON
mongoimport --db insurancecrm --collection clients --file clients.json
```

## 📈 Sample Data

The `insert-sample-data.js` script creates:
- 2 sample agents
- 3 sample clients
- 2 sample policies
- 1 sample claim
- 2 sample reminders
- 2 sample targets

This data helps you:
- Test the application immediately
- Understand the data structure
- Demo the system to stakeholders

## 🔒 Security Best Practices

### Production Setup

1. **Enable Authentication**
   ```yaml
   # /etc/mongod.conf
   security:
     authorization: enabled
   ```

2. **Create Admin User**
   ```javascript
   use admin;
   db.createUser({
     user: "admin",
     pwd: "secure-password",
     roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
   });
   ```

3. **Create Application User**
   ```javascript
   use insurancecrm;
   db.createUser({
     user: "crm_app",
     pwd: "app-password",
     roles: [{ role: "readWrite", db: "insurancecrm" }]
   });
   ```

4. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols

5. **Restrict Network Access**
   - Use firewall rules
   - MongoDB Atlas: Whitelist specific IPs only

6. **Enable SSL/TLS**
   - Always use SSL for connections
   - MongoDB Atlas: SSL enabled by default

## 🛠️ Maintenance

### Monitor Database Size

```javascript
use insurancecrm;
db.stats();
```

### Check Index Usage

```javascript
db.clients.aggregate([{ $indexStats: {} }]);
```

### Optimize Queries

```javascript
// Use explain to analyze query performance
db.clients.find({ status: "Active" }).explain("executionStats");
```

### Clean Old Data

```javascript
// Remove completed reminders older than 1 year
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

db.reminders.deleteMany({
  status: "Completed",
  completedAt: { $lt: oneYearAgo }
});
```

## 📞 Connection Strings

### Local MongoDB
```
mongodb://localhost:27017/insurancecrm
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/insurancecrm?retryWrites=true&w=majority
```

### With Authentication (Local)
```
mongodb://username:password@localhost:27017/insurancecrm?authSource=admin
```

## 🆘 Troubleshooting

### Cannot Connect to MongoDB

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Authentication Failed

- Verify username and password
- Check database name in connection string
- Ensure user has correct permissions

### Performance Issues

- Check indexes are created
- Monitor query execution with `.explain()`
- Consider adding compound indexes for frequent queries
- Use aggregation pipeline for complex queries

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## 📝 Notes

- Default database name: `insurancecrm`
- All dates stored in UTC
- ObjectId used for all `_id` fields
- Relationships use ObjectId references
- Validation rules applied at application level (Mongoose)
