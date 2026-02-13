// Sample Data for Insurance CRM Database
// Run this script using: mongosh < insert-sample-data.js

use insurancecrm;

print("Inserting sample data...");

// Clear existing data (optional)
// db.clients.deleteMany({});
// db.policies.deleteMany({});
// db.claims.deleteMany({});
// db.reminders.deleteMany({});
// db.targets.deleteMany({});
// db.agents.deleteMany({});

// Insert sample agents
const agents = db.agents.insertMany([
  {
    name: "Vivek Kumar",
    email: "vivek@insurancecrm.com",
    password: "$2a$10$rZ8qN7X5XvYJYGXZQY7Kp.3wZGqYvYZQY7Kp3wZGqYvYZQY7Kp3w", // hashed: password123
    phone: "+919876543210",
    role: "Agent",
    licenseNumber: "LIC-001",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Priti Sharma",
    email: "priti@insurancecrm.com",
    password: "$2a$10$rZ8qN7X5XvYJYGXZQY7Kp.3wZGqYvYZQY7Kp3wZGqYvYZQY7Kp3w",
    phone: "+919876543211",
    role: "Agent",
    licenseNumber: "LIC-002",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

const agentIds = agents.insertedIds;

// Insert sample clients
const clients = db.clients.insertMany([
  {
    name: "Ajay Verma",
    email: "ajay.verma@example.com",
    phone: "+919876543210",
    dateOfBirth: new Date("1990-05-15"),
    address: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India"
    },
    clientType: "Individual",
    priority: "High",
    tags: ["Premium", "VIP"],
    isNewProspect: false,
    assignedAgent: agentIds[0],
    totalPolicies: 5,
    totalPremium: 250000,
    status: "Active",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date()
  },
  {
    name: "Pooja Gupta",
    email: "pooja.gupta@example.com",
    phone: "+919876556780",
    dateOfBirth: new Date("1988-08-22"),
    address: {
      street: "456 Park Street",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      country: "India"
    },
    clientType: "Individual",
    priority: "Medium",
    tags: ["Regular"],
    isNewProspect: false,
    assignedAgent: agentIds[1],
    totalPolicies: 4,
    totalPremium: 180000,
    status: "Active",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date()
  },
  {
    name: "Ravi Menon",
    email: "ravi.menon@example.com",
    phone: "+919876567690",
    dateOfBirth: new Date("1985-12-10"),
    address: {
      street: "789 Lake View",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India"
    },
    clientType: "Individual",
    priority: "Medium",
    isNewProspect: false,
    assignedAgent: agentIds[0],
    totalPolicies: 2,
    totalPremium: 120000,
    status: "Active",
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date()
  }
]);

const clientIds = clients.insertedIds;

// Insert sample policies
const policies = db.policies.insertMany([
  {
    client: clientIds[0],
    policyNumber: "LIC-2024-001",
    policyType: "Life Insurance",
    company: "LIC",
    planName: "Jeevan Anand",
    premiumAmount: 50000,
    premiumFrequency: "Yearly",
    sumAssured: 1000000,
    policyTerm: 20,
    startDate: new Date("2024-01-01"),
    maturityDate: new Date("2044-01-01"),
    renewalDate: new Date("2025-01-01"),
    nextPremiumDue: new Date("2025-01-01"),
    status: "Active",
    paymentStatus: "Paid",
    nominees: [
      {
        name: "Sunita Verma",
        relationship: "Spouse",
        dateOfBirth: new Date("1992-03-20"),
        share: 100
      }
    ],
    assignedAgent: agentIds[0],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date()
  },
  {
    client: clientIds[1],
    policyNumber: "HDFC-2024-001",
    policyType: "Health",
    company: "HDFC",
    planName: "Health Suraksha",
    premiumAmount: 25000,
    premiumFrequency: "Yearly",
    sumAssured: 500000,
    policyTerm: 1,
    startDate: new Date("2024-03-01"),
    maturityDate: new Date("2025-03-01"),
    renewalDate: new Date("2025-03-01"),
    nextPremiumDue: new Date("2025-03-01"),
    status: "Active",
    paymentStatus: "Pending",
    assignedAgent: agentIds[1],
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date()
  }
]);

const policyIds = policies.insertedIds;

// Insert sample claims
db.claims.insertMany([
  {
    client: clientIds[0],
    policy: policyIds[0],
    claimNumber: "CLM-000001",
    claimType: "Medical",
    claimAmount: 50000,
    approvedAmount: 45000,
    claimDate: new Date("2024-06-15"),
    incidentDate: new Date("2024-06-10"),
    status: "Approved",
    priority: "High",
    description: "Medical treatment for illness",
    statusHistory: [
      {
        status: "Pending",
        date: new Date("2024-06-15"),
        note: "Claim submitted"
      },
      {
        status: "Under Review",
        date: new Date("2024-06-18"),
        note: "Documents verified"
      },
      {
        status: "Approved",
        date: new Date("2024-06-20"),
        note: "Claim approved"
      }
    ],
    settlementDate: new Date("2024-06-25"),
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date()
  }
]);

// Insert sample reminders
db.reminders.insertMany([
  {
    client: clientIds[0],
    policy: policyIds[0],
    reminderType: "Renewal",
    title: "LIC Policy Renewal Due",
    description: "Annual premium payment due for Jeevan Anand policy",
    dueDate: new Date("2025-01-01"),
    priority: "High",
    status: "Pending",
    frequency: "Yearly",
    notificationChannels: ["Email", "SMS"],
    notificationSchedule: [
      { daysBeforeDue: 30, sent: false },
      { daysBeforeDue: 7, sent: false },
      { daysBeforeDue: 1, sent: false }
    ],
    amount: 50000,
    assignedAgent: agentIds[0],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    client: clientIds[1],
    reminderType: "Birthday",
    title: "Client Birthday - Pooja Gupta",
    description: "Send birthday wishes",
    dueDate: new Date("2025-08-22"),
    priority: "Medium",
    status: "Pending",
    frequency: "Yearly",
    notificationChannels: ["Email"],
    assignedAgent: agentIds[1],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample targets
db.targets.insertMany([
  {
    agent: agentIds[0],
    targetPeriod: "Quarterly",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-03-31"),
    productType: "Life",
    targetAmount: 5000000,
    achievedAmount: 3500000,
    targetPolicies: 50,
    achievedPolicies: 35,
    status: "Active",
    achievementPercentage: 70,
    bonus: {
      threshold: 100,
      amount: 50000,
      status: "Not Applicable"
    },
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date()
  },
  {
    agent: agentIds[1],
    targetPeriod: "Quarterly",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-03-31"),
    productType: "General",
    targetAmount: 3000000,
    achievedAmount: 1800000,
    targetPolicies: 40,
    achievedPolicies: 24,
    status: "Active",
    achievementPercentage: 60,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date()
  }
]);

print("Sample data inserted successfully!");
print("- " + Object.keys(agentIds).length + " agents");
print("- " + Object.keys(clientIds).length + " clients");
print("- " + Object.keys(policyIds).length + " policies");
print("- 1 claim");
print("- 2 reminders");
print("- 2 targets");
