
class DashboardUseCase {
  constructor(financialRecordRepository) {
    this.financialRecordRepository = financialRecordRepository;
  }

  async getDashboardSummary(filters = {}, currentUser) {
    // Only admins and analysts can access dashboard
    if (!currentUser.canAccessDashboard()) {
      throw new Error('Unauthorized: Only admins and analysts can access dashboard');
    }

    // Build filter for user
    const userId = currentUser.isAdmin() && filters.userId ? filters.userId : currentUser.id;

    // Apply date filters if provided
    const dateFilters = {};
    if (filters.startDate) {
      dateFilters.startDate = filters.startDate;
    }
    if (filters.endDate) {
      dateFilters.endDate = filters.endDate;
    }

    // Get aggregated data
    const aggregatedData = await this.financialRecordRepository.getAggregatedData(
      userId,
      dateFilters
    );

    // Get category breakdown
    const categoryTotals = await this.financialRecordRepository.getCategoryTotals(
      userId,
      dateFilters
    );

    // Calculate summary
    const summary = {
      totalIncome: aggregatedData.totalIncome || 0,
      totalExpenses: aggregatedData.totalExpenses || 0,
      netBalance: (aggregatedData.totalIncome || 0) - (aggregatedData.totalExpenses || 0),
      transactionCount: aggregatedData.count || 0,
      categoryBreakdown: {
        income: categoryTotals.income || [],
        expenses: categoryTotals.expenses || []
      },
      averageIncome: aggregatedData.avgIncome || 0,
      averageExpense: aggregatedData.avgExpense || 0
    };

    return summary;
  }

  async getMonthlyTrends(months = 6, currentUser) {
    // Only admins and analysts can access trends
    if (!currentUser.canAccessDashboard()) {
      throw new Error('Unauthorized: Only admins and analysts can access trends');
    }

    const userId = currentUser.isAdmin() ? null : currentUser.id;
    const trends = await this.financialRecordRepository.getMonthlyTrends(userId, months);

    return trends;
  }

  async getCategoryAnalysis(type = 'all', currentUser) {
    // Only admins and analysts can access analysis
    if (!currentUser.canAccessDashboard()) {
      throw new Error('Unauthorized: Only admins and analysts can access analysis');
    }

    const userId = currentUser.isAdmin() ? null : currentUser.id;
    
    const filters = {};
    if (type !== 'all' && ['income', 'expense'].includes(type)) {
      filters.type = type;
    }

    const categoryTotals = await this.financialRecordRepository.getCategoryTotals(
      userId,
      filters
    );

    // Sort categories by total amount
    const sortedIncome = (categoryTotals.income || []).sort((a, b) => b.total - a.total);
    const sortedExpenses = (categoryTotals.expenses || []).sort((a, b) => b.total - a.total);

    return {
      income: sortedIncome,
      expenses: sortedExpenses,
      topIncomeCategory: sortedIncome[0] || null,
      topExpenseCategory: sortedExpenses[0] || null
    };
  }

  async getFinancialHealth(currentUser) {
    // Only admins and analysts can access health metrics
    if (!currentUser.canAccessDashboard()) {
      throw new Error('Unauthorized: Only admins and analysts can access financial health');
    }

    const userId = currentUser.isAdmin() ? null : currentUser.id;

    // Get last 30 days data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentData = await this.financialRecordRepository.getAggregatedData(
      userId,
      { startDate: thirtyDaysAgo }
    );

    const totalIncome = recentData.totalIncome || 0;
    const totalExpenses = recentData.totalExpenses || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    // Financial health indicators
    let healthStatus = 'poor';
    if (savingsRate >= 20) {
      healthStatus = 'excellent';
    } else if (savingsRate >= 10) {
      healthStatus = 'good';
    } else if (savingsRate >= 0) {
      healthStatus = 'fair';
    }

    return {
      period: 'Last 30 days',
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      savingsRate: parseFloat(savingsRate.toFixed(2)),
      healthStatus,
      recommendations: this.getRecommendations(savingsRate, totalExpenses, totalIncome)
    };
  }

  getRecommendations(savingsRate, expenses, income) {
    const recommendations = [];

    if (savingsRate < 0) {
      recommendations.push('Your expenses exceed your income. Consider reviewing your spending habits.');
      recommendations.push('Look for areas where you can reduce unnecessary expenses.');
    } else if (savingsRate < 10) {
      recommendations.push('Try to increase your savings rate to at least 10% of your income.');
      recommendations.push('Review discretionary spending and identify potential savings.');
    } else if (savingsRate < 20) {
      recommendations.push('Good progress! Aim to increase your savings rate to 20% or more.');
      recommendations.push('Consider automating your savings to reach your goals faster.');
    } else {
      recommendations.push('Excellent savings rate! Keep up the good work.');
      recommendations.push('Consider investing surplus funds for long-term growth.');
    }

    if (income > 0 && expenses > income * 0.8) {
      recommendations.push('Your expenses are high relative to income. Build an emergency fund.');
    }

    return recommendations;
  }
}

module.exports = DashboardUseCase;
