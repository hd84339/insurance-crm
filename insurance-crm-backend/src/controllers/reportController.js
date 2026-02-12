const Client = require('../models/Client');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Reminder = require('../models/Reminder');
const Target = require('../models/Target');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// @desc    Generate policy report
// @route   GET /api/reports/policies
// @access  Private
exports.generatePolicyReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      policyType,
      company,
      status,
      format = 'json'
    } = req.query;

    // Build query
    const query = {};
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (policyType) query.policyType = policyType;
    if (company) query.company = company;
    if (status) query.status = status;

    const policies = await Policy.find(query)
      .populate('client', 'name email phone')
      .populate('assignedAgent', 'name')
      .lean();

    const summary = {
      totalPolicies: policies.length,
      totalPremium: policies.reduce((sum, p) => sum + p.premiumAmount, 0),
      totalSumAssured: policies.reduce((sum, p) => sum + p.sumAssured, 0),
      activePolicies: policies.filter(p => p.status === 'Active').length
    };

    // Return based on format
    if (format === 'excel') {
      return exports.generatePolicyExcel(policies, summary, res);
    } else if (format === 'pdf') {
      return exports.generatePolicyPDF(policies, summary, res);
    }

    res.status(200).json({
      success: true,
      summary,
      count: policies.length,
      data: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating policy report',
      error: error.message
    });
  }
};

// @desc    Generate claim report
// @route   GET /api/reports/claims
// @access  Private
exports.generateClaimReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      status,
      claimType,
      format = 'json'
    } = req.query;

    // Build query
    const query = {};
    
    if (startDate || endDate) {
      query.claimDate = {};
      if (startDate) query.claimDate.$gte = new Date(startDate);
      if (endDate) query.claimDate.$lte = new Date(endDate);
    }
    
    if (status) query.status = status;
    if (claimType) query.claimType = claimType;

    const claims = await Claim.find(query)
      .populate('client', 'name phone')
      .populate('policy', 'policyNumber company')
      .lean();

    const summary = {
      totalClaims: claims.length,
      totalClaimAmount: claims.reduce((sum, c) => sum + c.claimAmount, 0),
      approvedClaims: claims.filter(c => c.status === 'Approved').length,
      rejectedClaims: claims.filter(c => c.status === 'Rejected').length,
      pendingClaims: claims.filter(c => c.status === 'Pending').length,
      settledClaims: claims.filter(c => c.status === 'Settled').length,
      totalApprovedAmount: claims
        .filter(c => c.status === 'Approved' || c.status === 'Settled')
        .reduce((sum, c) => sum + (c.approvedAmount || c.claimAmount), 0)
    };

    if (format === 'excel') {
      return exports.generateClaimExcel(claims, summary, res);
    }

    res.status(200).json({
      success: true,
      summary,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating claim report',
      error: error.message
    });
  }
};

// @desc    Generate renewal due report
// @route   GET /api/reports/renewals
// @access  Private
exports.generateRenewalReport = async (req, res) => {
  try {
    const { days = 30, format = 'json' } = req.query;
    
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const policies = await Policy.find({
      status: 'Active',
      renewalDate: {
        $gte: today,
        $lte: futureDate
      }
    })
      .populate('client', 'name email phone')
      .sort('renewalDate')
      .lean();

    const summary = {
      totalRenewals: policies.length,
      totalPremium: policies.reduce((sum, p) => sum + p.premiumAmount, 0),
      dueThisWeek: policies.filter(p => {
        const weekFromNow = new Date();
        weekFromNow.setDate(today.getDate() + 7);
        return new Date(p.renewalDate) <= weekFromNow;
      }).length
    };

    if (format === 'excel') {
      return exports.generateRenewalExcel(policies, summary, res);
    }

    res.status(200).json({
      success: true,
      summary,
      count: policies.length,
      data: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating renewal report',
      error: error.message
    });
  }
};

// @desc    Generate target achievement report
// @route   GET /api/reports/targets
// @access  Private
exports.generateTargetReport = async (req, res) => {
  try {
    const { period, startDate, endDate, format = 'json' } = req.query;

    const query = {};
    
    if (period) query.targetPeriod = period;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const targets = await Target.find(query)
      .populate('agent', 'name email phone')
      .lean();

    const summary = {
      totalTargets: targets.length,
      totalTargetAmount: targets.reduce((sum, t) => sum + t.targetAmount, 0),
      totalAchievedAmount: targets.reduce((sum, t) => sum + t.achievedAmount, 0),
      achievedTargets: targets.filter(t => t.achievementPercentage >= 100).length,
      averageAchievement: targets.length > 0
        ? targets.reduce((sum, t) => sum + t.achievementPercentage, 0) / targets.length
        : 0
    };

    if (format === 'excel') {
      return exports.generateTargetExcel(targets, summary, res);
    }

    res.status(200).json({
      success: true,
      summary,
      count: targets.length,
      data: targets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating target report',
      error: error.message
    });
  }
};

// @desc    Generate client activity report
// @route   GET /api/reports/client-activity
// @access  Private
exports.generateClientActivityReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    const newClients = await Client.countDocuments(dateQuery);
    const newPolicies = await Policy.countDocuments(dateQuery);
    const newClaims = await Claim.countDocuments(dateQuery);

    const clients = await Client.find(dateQuery)
      .populate('assignedAgent', 'name')
      .lean();

    res.status(200).json({
      success: true,
      summary: {
        newClients,
        newPolicies,
        newClaims,
        totalRevenue: clients.reduce((sum, c) => sum + (c.totalPremium || 0), 0)
      },
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating client activity report',
      error: error.message
    });
  }
};

// @desc    Generate dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Overall stats
    const totalClients = await Client.countDocuments();
    const totalPolicies = await Policy.countDocuments();
    const activePolicies = await Policy.countDocuments({ status: 'Active' });
    
    // Premium stats
    const premiumStats = await Policy.aggregate([
      {
        $group: {
          _id: null,
          totalPremium: { $sum: '$premiumAmount' },
          totalSumAssured: { $sum: '$sumAssured' }
        }
      }
    ]);

    // Claims stats
    const claimStats = await Claim.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$claimAmount' }
        }
      }
    ]);

    // This month's activity
    const monthlyActivity = {
      newClients: await Client.countDocuments({ createdAt: { $gte: thisMonth } }),
      newPolicies: await Policy.countDocuments({ createdAt: { $gte: thisMonth } }),
      newClaims: await Claim.countDocuments({ createdAt: { $gte: thisMonth } })
    };

    // Upcoming reminders
    const upcomingReminders = await Reminder.countDocuments({
      status: 'Pending',
      dueDate: {
        $gte: today,
        $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalClients,
          totalPolicies,
          activePolicies,
          totalPremium: premiumStats[0]?.totalPremium || 0,
          totalSumAssured: premiumStats[0]?.totalSumAssured || 0
        },
        claims: claimStats,
        monthlyActivity,
        upcomingReminders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Helper: Generate Excel for policies
exports.generatePolicyExcel = async (policies, summary, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Policy Report');

  worksheet.columns = [
    { header: 'Policy Number', key: 'policyNumber', width: 20 },
    { header: 'Client Name', key: 'clientName', width: 25 },
    { header: 'Policy Type', key: 'policyType', width: 20 },
    { header: 'Company', key: 'company', width: 15 },
    { header: 'Premium', key: 'premium', width: 15 },
    { header: 'Sum Assured', key: 'sumAssured', width: 15 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Start Date', key: 'startDate', width: 15 }
  ];

  policies.forEach(policy => {
    worksheet.addRow({
      policyNumber: policy.policyNumber,
      clientName: policy.client?.name || 'N/A',
      policyType: policy.policyType,
      company: policy.company,
      premium: policy.premiumAmount,
      sumAssured: policy.sumAssured,
      status: policy.status,
      startDate: new Date(policy.startDate).toLocaleDateString()
    });
  });

  // Add summary
  worksheet.addRow({});
  worksheet.addRow({
    policyNumber: 'SUMMARY',
    clientName: `Total Policies: ${summary.totalPolicies}`,
    premium: summary.totalPremium,
    sumAssured: summary.totalSumAssured
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=policy-report.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};

// Helper: Generate Excel for claims
exports.generateClaimExcel = async (claims, summary, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Claim Report');

  worksheet.columns = [
    { header: 'Claim Number', key: 'claimNumber', width: 20 },
    { header: 'Client Name', key: 'clientName', width: 25 },
    { header: 'Policy Number', key: 'policyNumber', width: 20 },
    { header: 'Claim Type', key: 'claimType', width: 20 },
    { header: 'Claim Amount', key: 'claimAmount', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Claim Date', key: 'claimDate', width: 15 }
  ];

  claims.forEach(claim => {
    worksheet.addRow({
      claimNumber: claim.claimNumber,
      clientName: claim.client?.name || 'N/A',
      policyNumber: claim.policy?.policyNumber || 'N/A',
      claimType: claim.claimType,
      claimAmount: claim.claimAmount,
      status: claim.status,
      claimDate: new Date(claim.claimDate).toLocaleDateString()
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=claim-report.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};

// Helper: Generate Excel for renewals
exports.generateRenewalExcel = async (policies, summary, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Renewal Report');

  worksheet.columns = [
    { header: 'Policy Number', key: 'policyNumber', width: 20 },
    { header: 'Client Name', key: 'clientName', width: 25 },
    { header: 'Client Phone', key: 'clientPhone', width: 15 },
    { header: 'Company', key: 'company', width: 15 },
    { header: 'Premium', key: 'premium', width: 15 },
    { header: 'Renewal Date', key: 'renewalDate', width: 15 },
    { header: 'Days Until Renewal', key: 'daysUntil', width: 18 }
  ];

  const today = new Date();
  policies.forEach(policy => {
    const renewalDate = new Date(policy.renewalDate);
    const daysUntil = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
    
    worksheet.addRow({
      policyNumber: policy.policyNumber,
      clientName: policy.client?.name || 'N/A',
      clientPhone: policy.client?.phone || 'N/A',
      company: policy.company,
      premium: policy.premiumAmount,
      renewalDate: renewalDate.toLocaleDateString(),
      daysUntil: daysUntil
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=renewal-report.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};

// Helper: Generate Excel for targets
exports.generateTargetExcel = async (targets, summary, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Target Report');

  worksheet.columns = [
    { header: 'Agent Name', key: 'agentName', width: 25 },
    { header: 'Period', key: 'period', width: 15 },
    { header: 'Product Type', key: 'productType', width: 15 },
    { header: 'Target Amount', key: 'targetAmount', width: 15 },
    { header: 'Achieved Amount', key: 'achievedAmount', width: 15 },
    { header: 'Achievement %', key: 'achievement', width: 15 },
    { header: 'Status', key: 'status', width: 12 }
  ];

  targets.forEach(target => {
    worksheet.addRow({
      agentName: target.agent?.name || 'N/A',
      period: target.targetPeriod,
      productType: target.productType,
      targetAmount: target.targetAmount,
      achievedAmount: target.achievedAmount,
      achievement: target.achievementPercentage.toFixed(2) + '%',
      status: target.status
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=target-report.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};
