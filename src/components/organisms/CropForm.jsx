import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { farmsService } from '@/services/api/farmsService';

const CropForm = ({ crop, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    type: '',
    fieldId: '',
    plantingDate: format(new Date(), 'yyyy-MM-dd'),
    expectedHarvest: '',
    status: 'planted'
  });

  const [errors, setErrors] = useState({});
  const [farms, setFarms] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (crop) {
      setFormData({
        type: crop.type || '',
        fieldId: crop.fieldId || '',
        plantingDate: crop.plantingDate ? format(new Date(crop.plantingDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        expectedHarvest: crop.expectedHarvest ? format(new Date(crop.expectedHarvest), 'yyyy-MM-dd') : '',
        status: crop.status || 'planted'
      });
    }
  }, [crop]);

  const loadFarms = async () => {
    try {
      setFieldsLoading(true);
      const farmsData = await farmsService.getAll();
      setFarms(farmsData);
    } catch (error) {
      toast.error('Failed to load farms');
    } finally {
      setFieldsLoading(false);
    }
  };

  const cropTypeOptions = [
    { value: 'corn', label: 'Corn' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'soybeans', label: 'Soybeans' },
    { value: 'rice', label: 'Rice' },
    { value: 'tomatoes', label: 'Tomatoes' },
    { value: 'potatoes', label: 'Potatoes' },
    { value: 'lettuce', label: 'Lettuce' },
    { value: 'carrots', label: 'Carrots' },
    { value: 'onions', label: 'Onions' },
    { value: 'peppers', label: 'Peppers' },
    { value: 'cucumber', label: 'Cucumber' },
    { value: 'squash', label: 'Squash' },
    { value: 'beans', label: 'Beans' },
    { value: 'peas', label: 'Peas' },
    { value: 'cabbage', label: 'Cabbage' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'planted', label: 'Planted' },
    { value: 'growing', label: 'Growing' },
    { value: 'flowering', label: 'Flowering' },
    { value: 'fruiting', label: 'Fruiting' },
    { value: 'ready', label: 'Ready to Harvest' },
    { value: 'harvested', label: 'Harvested' }
  ];

  // Create field options from all farms
  const fieldOptions = farms.reduce((acc, farm) => {
    if (farm.fields && farm.fields.length > 0) {
      farm.fields.forEach(field => {
        acc.push({
          value: field.id,
          label: `${farm.name} - ${field.name} (${field.size} ${farm.sizeUnit})`
        });
      });
    }
    return acc;
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Crop type is required';
    }

    if (!formData.fieldId) {
      newErrors.fieldId = 'Field selection is required';
    }

    if (!formData.plantingDate) {
      newErrors.plantingDate = 'Planting date is required';
    }

    if (formData.expectedHarvest && new Date(formData.expectedHarvest) <= new Date(formData.plantingDate)) {
      newErrors.expectedHarvest = 'Expected harvest date must be after planting date';
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
        plantingDate: new Date(formData.plantingDate).toISOString(),
        expectedHarvest: formData.expectedHarvest ? new Date(formData.expectedHarvest).toISOString() : null
      });
    } catch (error) {
      toast.error('Failed to save crop');
    }
  };

  if (fieldsLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="animate-pulse">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
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
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <ApperIcon name="Sprout" size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {crop ? 'Edit Crop' : 'Plant New Crop'}
              </h2>
              <p className="text-sm text-gray-600">
                {crop ? 'Update your crop information' : 'Add a new crop to track its progress'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Crop Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={cropTypeOptions}
              error={errors.type}
              required
              placeholder="Select crop type"
            />

            <FormField
              type="select"
              label="Field"
              name="fieldId"
              value={formData.fieldId}
              onChange={handleChange}
              options={fieldOptions}
              error={errors.fieldId}
              required
              placeholder="Select field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="date"
              label="Planting Date"
              name="plantingDate"
              value={formData.plantingDate}
              onChange={handleChange}
              error={errors.plantingDate}
              required
            />

            <FormField
              type="date"
              label="Expected Harvest Date"
              name="expectedHarvest"
              value={formData.expectedHarvest}
              onChange={handleChange}
              error={errors.expectedHarvest}
              placeholder="Optional"
            />
          </div>

          <FormField
            type="select"
            label="Current Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            required
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
              {crop ? 'Update Crop' : 'Plant Crop'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default CropForm;