// MongoDB Database Setup Script for Insurance CRM
// Run this script using: mongosh < setup-database.js

// Connect to MongoDB and create database
use insurancecrm;

// Create collections with validation
db.createCollection("clients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "phone"],
      properties: {
        name: {
          bsonType: "string",
          description: "Client name is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        phone: {
          bsonType: "string",
          description: "Phone number is required"
        },
        clientType: {
          enum: ["Individual", "Corporate"]
        },
        status: {
          enum: ["Active", "Inactive", "Prospect"]
        }
      }
    }
  }
});

db.createCollection("policies");
db.createCollection("claims");
db.createCollection("reminders");
db.createCollection("targets");
db.createCollection("agents");

// Create indexes for better performance
print("Creating indexes...");

// Client indexes
db.clients.createIndex({ name: "text", email: "text", phone: "text" });
db.clients.createIndex({ assignedAgent: 1, status: 1 });
db.clients.createIndex({ createdAt: -1 });
db.clients.createIndex({ email: 1 }, { sparse: true });

// Policy indexes
db.policies.createIndex({ client: 1, status: 1 });
db.policies.createIndex({ policyNumber: 1 }, { unique: true });
db.policies.createIndex({ renewalDate: 1, status: 1 });
db.policies.createIndex({ nextPremiumDue: 1, paymentStatus: 1 });
db.policies.createIndex({ policyType: 1, company: 1 });
db.policies.createIndex({ assignedAgent: 1 });

// Claim indexes
db.claims.createIndex({ client: 1, status: 1 });
db.claims.createIndex({ policy: 1 });
db.claims.createIndex({ claimNumber: 1 }, { unique: true });
db.claims.createIndex({ status: 1, priority: 1 });
db.claims.createIndex({ claimDate: -1 });

// Reminder indexes
db.reminders.createIndex({ client: 1, status: 1 });
db.reminders.createIndex({ dueDate: 1, status: 1 });
db.reminders.createIndex({ reminderType: 1, status: 1 });
db.reminders.createIndex({ assignedAgent: 1, status: 1 });

// Target indexes
db.targets.createIndex({ agent: 1, targetPeriod: 1, startDate: -1 });
db.targets.createIndex({ status: 1, endDate: 1 });

// Agent indexes
db.agents.createIndex({ email: 1 }, { unique: true });
db.agents.createIndex({ licenseNumber: 1 }, { unique: true, sparse: true });

print("Database setup completed successfully!");
print("Collections created: clients, policies, claims, reminders, targets, agents");
print("Indexes created for optimal performance");
