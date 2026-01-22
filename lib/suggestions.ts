interface FinancialData {
  totalIncome: number
  totalExpenses: number
  totalFixedExpenses: number
  totalVariableExpenses: number
  totalAdditionalExpenses: number
}

export function getFinancialSuggestions(data: FinancialData): string[] {
  const suggestions: string[] = []
  const { totalIncome, totalExpenses, totalFixedExpenses, totalVariableExpenses } = data

  // Calculate percentages
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0
  const fixedExpenseRatio = totalIncome > 0 ? (totalFixedExpenses / totalIncome) * 100 : 0
  const variableExpenseRatio = totalIncome > 0 ? (totalVariableExpenses / totalIncome) * 100 : 0

  // Rule 1: High expense ratio
  if (expenseRatio > 90) {
    suggestions.push('⚠️ Your expenses exceed 90% of your income. Consider reducing non-essential spending.')
  } else if (expenseRatio > 80) {
    suggestions.push('💡 Your expenses are high relative to income. Look for ways to cut costs.')
  }

  // Rule 2: Fixed expenses too high
  if (fixedExpenseRatio > 50) {
    suggestions.push('🏠 Fixed expenses are more than 50% of income. Consider renegotiating recurring bills.')
  }

  // Rule 3: Variable expenses too high
  if (variableExpenseRatio > 40) {
    suggestions.push('🛒 Variable expenses are high. Track daily spending to identify savings opportunities.')
  }

  // Rule 4: Positive balance
  if (totalIncome > totalExpenses) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100
    if (savingsRate >= 20) {
      suggestions.push('✅ Excellent! You\'re saving more than 20% of your income. Keep it up!')
    } else if (savingsRate >= 10) {
      suggestions.push('👍 Good savings rate! Consider increasing it to 20% for better financial security.')
    } else {
      suggestions.push('💪 You have a positive balance. Try to save at least 10% of your income.')
    }
  } else {
    suggestions.push('🚨 You\'re spending more than you earn. Focus on reducing expenses or increasing income.')
  }

  // Rule 5: No income recorded
  if (totalIncome === 0) {
    suggestions.push('📝 Start by recording your income sources to track your financial health.')
  }

  // Rule 6: No expenses recorded
  if (totalExpenses === 0 && totalIncome > 0) {
    suggestions.push('📊 Record your expenses to get a complete picture of your financial situation.')
  }

  return suggestions.length > 0 ? suggestions : ['📈 Keep tracking your finances to maintain good financial health!']
}
