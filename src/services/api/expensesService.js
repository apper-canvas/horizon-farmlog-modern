import expensesData from '@/services/mockData/expenses.json';

let expenses = [...expensesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const expensesService = {
  async getAll() {
    await delay(300);
    return [...expenses];
  },

  async getById(id) {
    await delay(200);
    const expense = expenses.find(e => e.Id === parseInt(id));
    if (!expense) {
      throw new Error('Expense not found');
    }
    return { ...expense };
  },

  async create(expenseData) {
    await delay(400);
    const maxId = expenses.length > 0 ? Math.max(...expenses.map(e => e.Id)) : 0;
    const newExpense = {
      ...expenseData,
      Id: maxId + 1
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async update(id, expenseData) {
    await delay(400);
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Expense not found');
    }
    expenses[index] = { ...expenses[index], ...expenseData, Id: parseInt(id) };
    return { ...expenses[index] };
  },

  async delete(id) {
    await delay(300);
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Expense not found');
    }
    expenses.splice(index, 1);
    return true;
  }
};