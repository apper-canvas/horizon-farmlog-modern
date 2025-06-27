import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { farmsService } from '@/services/api/farmsService';

const ExpenseForm = ({ expense, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    farmId: ''
  });

  const [errors, setErrors] = useState({});
  const [farms, setFarms] = useState([]);
  const [farmsLoading, setFarmsLoading] = useState(true);

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (expense) {
      setFormData({
        category: expense.category || '',
        amount: expense.amount || '',
        date: expense.date ? format(new Date(expense.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        description: expense.description || '',
        farmId: expense.farmId || ''
      });
    }
  }, [expense]);

  const loadFarms = async () => {
    try {
      setFarmsLoading(true);
      const farmsData = await farmsService.getAll();
      setFarms(farmsData);
    } catch (error) {
      toast.error('Failed to load farms');
    } finally {
      setFarmsLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'seeds', label: 'Seeds & Plants' },
    { value: 'fertilizer', label: 'Fertilizer' },
    { value: 'pesticides', label: 'Pesticides' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'labor', label: 'Labor' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'transport', label: 'Transportation' },
    { value: 'storage', label: 'Storage' },
    { value: 'other', label: 'Other' }
  ];

  const farmOptions = farms.map(farm => ({
    value: farm.Id,
    label: farm.name
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.farmId) {
      newErrors.farmId = 'Farm selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      });
    } catch (error) {
      toast.error('Failed to save expense');
    }
  };

  if (farmsLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="animate-pulse">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {expense ? 'Edit Expense' : 'Record New Expense'}
              </h2>
              <p className="text-sm text-gray-600">
                {expense ? 'Update your expense details' : 'Track your farm expenses for better budgeting'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categoryOptions}
              error={errors.category}
              required
              placeholder="Select category"
            />

            <FormField
              type="number"
              label="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              placeholder="0.00"
              required
              icon="DollarSign"
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              required
            />

            <FormField
              type="select"
              label="Farm"
              name="farmId"
              value={formData.farmId}
              onChange={handleChange}
              options={farmOptions}
              error={errors.farmId}
              required
              placeholder="Select farm"
            />
          </div>

          <FormField
            type="textarea"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional - add notes about this expense"
          />

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="Save"
            >
              {expense ? 'Update Expense' : 'Record Expense'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ExpenseForm;