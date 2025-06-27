import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const FarmForm = ({ farm, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    sizeUnit: 'acres',
    fields: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name || '',
        location: farm.location || '',
        size: farm.size || '',
        sizeUnit: farm.sizeUnit || 'acres',
        fields: farm.fields || []
      });
    }
  }, [farm]);

  const sizeUnitOptions = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'sqft', label: 'Square Feet' },
    { value: 'sqm', label: 'Square Meters' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Farm name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.size || isNaN(formData.size) || parseFloat(formData.size) <= 0) {
      newErrors.size = 'Please enter a valid size';
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
        size: parseFloat(formData.size)
      });
    } catch (error) {
      toast.error('Failed to save farm');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <ApperIcon name="MapPin" size={24} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {farm ? 'Edit Farm' : 'Add New Farm'}
              </h2>
              <p className="text-sm text-gray-600">
                {farm ? 'Update your farm information' : 'Enter your farm details to get started'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Farm Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g., Sunrise Farms"
              required
              icon="Home"
            />

            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="e.g., Fresno, CA"
              required
              icon="MapPin"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Farm Size"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleChange}
              error={errors.size}
              placeholder="Enter size"
              required
              icon="Ruler"
              min="0"
              step="0.1"
            />

            <FormField
              type="select"
              label="Size Unit"
              name="sizeUnit"
              value={formData.sizeUnit}
              onChange={handleChange}
              options={sizeUnitOptions}
              required
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
              {farm ? 'Update Farm' : 'Create Farm'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default FarmForm;