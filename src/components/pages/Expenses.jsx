import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import Header from '@/components/organisms/Header';
import ExpenseForm from '@/components/organisms/ExpenseForm';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { expensesService } from '@/services/api/expensesService';
import { farmsService } from '@/services/api/farmsService';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [expensesData, farmsData] = await Promise.all([
        expensesService.getAll(),
        farmsService.getAll()
      ]);
      setExpenses(expensesData);
      setFarms(farmsData);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expensesService.delete(expenseId);
        toast.success('Expense deleted successfully');
        await loadData();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingExpense) {
        await expensesService.update(editingExpense.Id, formData);
        toast.success('Expense updated successfully');
      } else {
        await expensesService.create(formData);
        toast.success('Expense recorded successfully');
      }
      
      setShowForm(false);
      setEditingExpense(null);
      await loadData();
    } catch (error) {
      toast.error(`Failed to ${editingExpense ? 'update' : 'record'} expense`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : 'Unknown Farm';
  };

  // Filter and sort expenses
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    
    switch (filter) {
      case 'thisMonth':
        return isWithinInterval(expenseDate, {
          start: startOfMonth(now),
          end: endOfMonth(now)
        });
      case 'lastMonth':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return isWithinInterval(expenseDate, {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth)
        });
      case 'seeds':
      case 'fertilizer':
      case 'equipment':
      case 'fuel':
      case 'labor':
        return expense.category === filter;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'farm':
        return getFarmName(a.farmId).localeCompare(getFarmName(b.farmId));
      default: // date
        return new Date(b.date) - new Date(a.date);
    }
  });

  const filterOptions = [
    { value: 'all', label: 'All Expenses' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'seeds', label: 'Seeds & Plants' },
    { value: 'fertilizer', label: 'Fertilizer' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'labor', label: 'Labor' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'category', label: 'Category' },
    { value: 'farm', label: 'Farm' }
  ];

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return isWithinInterval(expenseDate, {
      start: startOfMonth(now),
      end: endOfMonth(now)
    });
  }).reduce((sum, expense) => sum + expense.amount, 0);

  // Category breakdown
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const getCategoryIcon = (category) => {
    const icons = {
      seeds: 'Seed',
      fertilizer: 'Sprout',
      pesticides: 'Bug',
      equipment: 'Wrench',
      fuel: 'Fuel',
      labor: 'Users',
      irrigation: 'Droplets',
      maintenance: 'Settings',
      utilities: 'Zap',
      insurance: 'Shield',
      transport: 'Truck',
      storage: 'Warehouse',
      other: 'Package'
    };
    return icons[category] || 'Package';
  };

  if (loading && !showForm) {
    return (
      <div className="h-full">
        <Header title="Expenses" subtitle="Track and manage your farm expenses" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Loading type="table" />
        </div>
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="h-full">
        <Header title="Expenses" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="h-full">
        <Header 
          title={editingExpense ? 'Edit Expense' : 'Record New Expense'}
          breadcrumbs={['Expenses', editingExpense ? 'Edit' : 'Record New']}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Header 
        title="Expenses" 
        subtitle="Track and manage your farm expenses"
        actions={
          <Button icon="Plus" onClick={handleAddExpense}>
            Record Expense
          </Button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <ApperIcon name="DollarSign" size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total (Filtered)</p>
                <p className="text-2xl font-bold text-gray-900 high-contrast">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 high-contrast">
                  ${monthlyExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <ApperIcon name="FileText" size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 high-contrast">
                  {expenses.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-48">
                    <Select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      options={filterOptions}
                      fullWidth={false}
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      options={sortOptions}
                      fullWidth={false}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredExpenses.length} of {expenses.length} expenses
                </div>
              </div>
            </Card>

            {/* Expenses List */}
            {filteredExpenses.length === 0 ? (
              <Empty 
                type="expenses" 
                onAction={handleAddExpense}
              />
            ) : (
              <Card padding="none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Farm
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {filteredExpenses.map((expense) => (
                          <motion.tr
                            key={expense.Id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {format(new Date(expense.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <ApperIcon 
                                  name={getCategoryIcon(expense.category)} 
                                  size={16} 
                                  className="text-gray-500"
                                />
                                <span className="text-sm text-gray-900 capitalize">
                                  {expense.category.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-xs truncate">
                                {expense.description || 'No description'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getFarmName(expense.farmId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                              ${expense.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2 justify-end">
                                <button
                                  onClick={() => handleEditExpense(expense)}
                                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                                >
                                  <ApperIcon name="Edit2" size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteExpense(expense.Id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                  <ApperIcon name="Trash2" size={16} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Category Breakdown Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Top Categories
              </h3>
              {topCategories.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="PieChart" size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No data to display</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topCategories.map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ApperIcon 
                          name={getCategoryIcon(category)} 
                          size={16} 
                          className="text-gray-500"
                        />
                        <span className="text-sm text-gray-900 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  variant="outline" 
                  icon="Plus"
                  onClick={handleAddExpense}
                >
                  Record Expense
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  icon="Download"
                  onClick={() => toast.info('Export feature coming soon!')}
                >
                  Export Data
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  icon="BarChart3"
                  onClick={() => toast.info('Reports feature coming soon!')}
                >
                  View Reports
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;