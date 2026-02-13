# Quick Start Tutorial

Get up and running with the Insurance CRM in 15 minutes!

## 🎯 What You'll Learn

By the end of this tutorial, you'll be able to:
- Access the CRM dashboard
- Add a new client
- Create a policy for a client
- Set up a reminder
- Generate a basic report

## ✅ Prerequisites

Before starting, make sure you've completed:
- [Installation Guide](./01-installation.md)
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- Sample data loaded (optional but recommended)

## 📱 Step 1: Access the Dashboard (2 minutes)

1. **Open Your Browser**
   - Navigate to: http://localhost:3000
   
2. **Explore the Dashboard**
   
   You should see four main statistics cards:
   - **Total Clients** - Number of clients in system
   - **Total Policies** - Active and total policies
   - **Total Premium** - Sum of all premiums
   - **Upcoming Reminders** - Reminders in next 7 days

3. **Understanding the Layout**
   
   **Top Navigation Bar:**
   - Dashboard
   - Clients
   - Policies
   - Claims
   - Reminders
   - Targets
   - Reports

   **Dashboard Sections:**
   - Business overview (top cards)
   - Claims overview (status breakdown)
   - Monthly activity (new additions)
   - Upcoming reminders (next tasks)

## 👤 Step 2: Add Your First Client (3 minutes)

1. **Navigate to Clients**
   - Click "Clients" in the top navigation

2. **Click "Add Client" Button**
   - Located in the top-right corner

3. **Fill in Client Details**
   ```
   Name:         Rahul Sharma
   Email:        rahul.sharma@example.com
   Phone:        +919876543210
   Date of Birth: 1985-06-15
   Client Type:  Individual
   Priority:     Medium
   Status:       Prospect
   
   Address:
   Street:       45 Brigade Road
   City:         Bangalore
   State:        Karnataka
   Pincode:      560001
   Country:      India
   ```

4. **Click "Save" or "Create Client"**

5. **Verify Creation**
   - Client should appear in the list
   - You should see a success notification

**💡 Tip:** Use the search box to quickly find clients by name, email, or phone number.

## 📋 Step 3: Create a Policy (4 minutes)

1. **From Client Details**
   - Click on "Rahul Sharma" in the clients list
   - Click "Add Policy" button

   **OR**

   **From Policies Page:**
   - Click "Policies" in navigation
   - Click "Add Policy" button

2. **Select Client**
   - If from policies page, select "Rahul Sharma"

3. **Fill in Policy Details**
   ```
   Policy Type:    Life Insurance
   Company:        LIC
   Policy Number:  LIC-2026-001
   Plan Name:      Jeevan Anand Plus
   
   Premium Details:
   Premium Amount: 75000
   Frequency:      Yearly
   Sum Assured:    1500000
   Policy Term:    25 years
   
   Dates:
   Start Date:     2026-02-12
   Maturity Date:  2051-02-12
   Renewal Date:   2027-02-12
   
   Nominee:
   Name:           Priya Sharma
   Relationship:   Spouse
   Share:          100%
   ```

4. **Click "Save Policy"**

5. **Verify Creation**
   - Policy appears in client's policy list
   - Total premium updated
   - Success notification appears

**💡 Tip:** Keep policy numbers unique to avoid confusion. Format: COMPANY-YEAR-NUMBER

## 🔔 Step 4: Set Up a Reminder (3 minutes)

1. **Navigate to Reminders**
   - Click "Reminders" in navigation

2. **Click "Add Reminder"**

3. **Create Renewal Reminder**
   ```
   Reminder Type:  Renewal
   Title:          LIC Policy Renewal - Rahul Sharma
   Client:         Rahul Sharma
   Policy:         LIC-2026-001
   
   Due Date:       2027-02-12
   Priority:       High
   
   Description:    First year premium due for Jeevan Anand Plus policy
   Amount:         ₹75,000
   
   Notifications:
   ☑ Email
   ☑ SMS
   
   Schedule:
   ☑ 30 days before
   ☑ 7 days before
   ☑ 1 day before
   ```

4. **Click "Save Reminder"**

5. **Verify Creation**
   - Reminder appears in list
   - Shows as "Pending" status
   - Due date is visible

**💡 Tip:** Set multiple reminders for important events to ensure follow-up.

## 📊 Step 5: Generate Your First Report (3 minutes)

1. **Navigate to Reports**
   - Click "Reports" in navigation

2. **View Dashboard Statistics**
   - Click "Dashboard Stats" or similar
   - See overview of entire system

3. **Generate Policy Report**
   - Select "Policy Report"
   - Choose date range (optional)
   - Select format: Excel or PDF
   - Click "Generate"

4. **Download Report**
   - File will download automatically
   - Open in Excel/PDF viewer

**Report Contents:**
- Policy number
- Client name
- Policy type
- Company
- Premium amount
- Status
- Dates

**💡 Tip:** Export reports regularly for backup and analysis.

## 🎉 Congratulations!

You've successfully:
- ✅ Navigated the dashboard
- ✅ Created a new client
- ✅ Added a policy
- ✅ Set up a reminder
- ✅ Generated a report

## 🚀 Next Steps

### Explore More Features

1. **Claims Management**
   - Submit a test claim
   - Track claim status
   - Update claim progress

2. **Target Setting**
   - Set monthly/quarterly targets
   - Track achievement
   - Monitor performance

3. **Advanced Filtering**
   - Filter clients by status
   - Search policies by company
   - Sort by different criteria

4. **Bulk Operations**
   - Export multiple records
   - Generate batch reports
   - Update multiple items

### Learn the System

1. **Read User Guides**
   - [Client Management](./05-client-management.md)
   - [Policy Management](./06-policy-management.md)
   - [Claims Processing](./07-claims-processing.md)

2. **Understand Workflows**
   - Policy renewal process
   - Claims submission process
   - Target achievement tracking

3. **Master Reports**
   - Different report types
   - Custom date ranges
   - Export options

## 💡 Pro Tips

### For Daily Use

1. **Start Your Day**
   - Check dashboard for overview
   - Review upcoming reminders
   - Check pending claims

2. **Client Meetings**
   - Pull client profile beforehand
   - Review all policies
   - Check payment history

3. **End of Day**
   - Mark completed reminders
   - Update claim statuses
   - Add notes to client files

### Keyboard Shortcuts (Future Feature)

```
Ctrl/Cmd + K    - Quick search
Ctrl/Cmd + N    - New client
Ctrl/Cmd + P    - New policy
Ctrl/Cmd + R    - New reminder
Ctrl/Cmd + D    - Dashboard
```

### Best Practices

1. **Data Entry**
   - Always fill required fields
   - Use consistent naming
   - Add notes for context

2. **Client Management**
   - Update contact info regularly
   - Tag important clients
   - Set appropriate priorities

3. **Policy Tracking**
   - Set renewal reminders
   - Upload policy documents
   - Track payment status

4. **Regular Maintenance**
   - Archive old policies
   - Clean up completed reminders
   - Review inactive clients

## 🐛 Common Issues

### Can't See Dashboard Stats
**Solution:** Make sure backend is running and sample data is loaded.

### Client Not Saving
**Solution:** Check all required fields are filled. Look for validation errors.

### Policy Creation Fails
**Solution:** Ensure client exists first. Verify all dates are valid.

### Reminders Not Showing
**Solution:** Check date range filter. Ensure status is not set to "Completed".

## 📚 Additional Resources

- [User Guide](./04-dashboard.md) - Detailed feature explanations
- [API Documentation](../api/01-overview.md) - For developers
- [FAQ](./11-faq.md) - Common questions
- [Troubleshooting](./12-troubleshooting.md) - Problem solving

## 🆘 Need Help?

- **Technical Issues:** Check [Troubleshooting Guide](./12-troubleshooting.md)
- **Feature Questions:** Review [User Guide](./04-dashboard.md)
- **Data Questions:** See [FAQ](./11-faq.md)

## ✅ Quick Reference Card

### Navigation Shortcuts
```
Dashboard     → Overview & statistics
Clients       → Client database
Policies      → Policy management
Claims        → Claims processing
Reminders     → Notifications & tasks
Targets       → Performance tracking
Reports       → Analytics & exports
```

### Common Actions
```
Add Client    → Clients → Add Client button
Add Policy    → Policies → Add Policy button
Create Claim  → Claims → Add Claim button
Set Reminder  → Reminders → Add Reminder button
View Report   → Reports → Select report type
```

### Status Indicators
```
🟢 Active      - Currently active
🔵 Prospect    - Potential client
🟡 Pending     - Awaiting action
🔴 Rejected    - Declined
⚪ Inactive    - Not active
```

---

**Ready to dive deeper?** Check out the [Complete User Guide](./04-dashboard.md) for detailed feature documentation!
