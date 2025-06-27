import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cropsService } from '@/services/api/cropsService';

const TaskForm = ({ task, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    cropId: '',
    completed: false
  });

  const [errors, setErrors] = useState({});
  const [crops, setCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(true);

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        type: task.type || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        priority: task.priority || 'medium',
        cropId: task.cropId || '',
        completed: task.completed || false
      });
    }
  }, [task]);

  const loadCrops = async () => {
    try {
      setCropsLoading(true);
      const cropsData = await cropsService.getAll();
      setCrops(cropsData);
    } catch (error) {
      toast.error('Failed to load crops');
    } finally {
      setCropsLoading(false);
    }
  };

  const taskTypeOptions = [
    { value: 'watering', label: 'Watering' },
    { value: 'fertilizing', label: 'Fertilizing' },
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'planting', label: 'Planting' },
    { value: 'weeding', label: 'Weeding' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const cropOptions = [
    { value: '', label: 'No specific crop' },
    ...crops.map(crop => ({
      value: crop.Id,
      label: `${crop.type} (${crop.status})`
    }))
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.type) {
      newErrors.type = 'Task type is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
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
        dueDate: new Date(formData.dueDate).toISOString(),
        cropId: formData.cropId || null
      });
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  if (cropsLoading) {
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
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-sm text-gray-600">
                {task ? 'Update your task details' : 'Add a new task to your farm schedule'}
              </p>
            </div>
          </div>

          <FormField
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g., Water tomato plants"
            required
            icon="Edit2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Task Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={taskTypeOptions}
              error={errors.type}
              required
              placeholder="Select task type"
            />

            <FormField
              type="date"
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
              required
            />

            <FormField
              type="select"
              label="Related Crop"
              name="cropId"
              value={formData.cropId}
              onChange={handleChange}
              options={cropOptions}
              placeholder="Optional - select crop"
            />
          </div>

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
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default TaskForm;