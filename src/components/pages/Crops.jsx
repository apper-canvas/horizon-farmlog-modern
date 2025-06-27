import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, differenceInDays } from 'date-fns';
import Header from '@/components/organisms/Header';
import CropForm from '@/components/organisms/CropForm';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { cropsService } from '@/services/api/cropsService';
import { farmsService } from '@/services/api/farmsService';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [cropsData, farmsData] = await Promise.all([
        cropsService.getAll(),
        farmsService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = () => {
    setEditingCrop(null);
    setShowForm(true);
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  const handleDeleteCrop = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop? This action cannot be undone.')) {
      try {
        await cropsService.delete(cropId);
        toast.success('Crop deleted successfully');
        await loadData();
      } catch (error) {
        toast.error('Failed to delete crop');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingCrop) {
        await cropsService.update(editingCrop.Id, formData);
        toast.success('Crop updated successfully');
      } else {
        await cropsService.create(formData);
        toast.success('Crop planted successfully');
      }
      
      setShowForm(false);
      setEditingCrop(null);
      await loadData();
    } catch (error) {
      toast.error(`Failed to ${editingCrop ? 'update' : 'plant'} crop`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCrop(null);
  };

  const getFieldInfo = (fieldId) => {
    for (const farm of farms) {
      if (farm.fields) {
        const field = farm.fields.find(f => f.id === fieldId);
        if (field) {
          return { farmName: farm.name, fieldName: field.name, fieldSize: field.size, sizeUnit: farm.sizeUnit };
        }
      }
    }
    return { farmName: 'Unknown', fieldName: 'Unknown', fieldSize: 0, sizeUnit: 'acres' };
  };

  const getStatusColor = (status) => {
    const colors = {
      planted: 'text-blue-600 bg-blue-50 border-blue-200',
      growing: 'text-green-600 bg-green-50 border-green-200',
      flowering: 'text-purple-600 bg-purple-50 border-purple-200',
      fruiting: 'text-orange-600 bg-orange-50 border-orange-200',
      ready: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      harvested: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[status] || colors.planted;
  };

  const getStatusIcon = (status) => {
    const icons = {
      planted: 'Seed',
      growing: 'Sprout',
      flowering: 'Flower',
      fruiting: 'Apple',
      ready: 'Scissors',
      harvested: 'Package'
    };
    return icons[status] || 'Seed';
  };

  if (loading && !showForm) {
    return (
      <div className="h-full">
        <Header title="Crops" subtitle="Track your planted crops and their progress" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Loading type="cards" />
        </div>
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="h-full">
        <Header title="Crops" />
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
          title={editingCrop ? 'Edit Crop' : 'Plant New Crop'}
          breadcrumbs={['Crops', editingCrop ? 'Edit' : 'Plant New']}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <CropForm
            crop={editingCrop}
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
        title="Crops" 
        subtitle="Track your planted crops and their progress"
        actions={
          <Button icon="Plus" onClick={handleAddCrop}>
            Plant Crop
          </Button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {crops.length === 0 ? (
          <Empty 
            type="crops" 
            onAction={handleAddCrop}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {crops.map((crop) => {
                const fieldInfo = getFieldInfo(crop.fieldId);
                const plantingDate = new Date(crop.plantingDate);
                const daysPlanted = differenceInDays(new Date(), plantingDate);
                const expectedHarvest = crop.expectedHarvest ? new Date(crop.expectedHarvest) : null;
                const daysToHarvest = expectedHarvest ? differenceInDays(expectedHarvest, new Date()) : null;

                return (
                  <motion.div
                    key={crop.Id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card hover className="h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <ApperIcon 
                              name={getStatusIcon(crop.status)} 
                              size={24} 
                              className="text-green-600"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-display font-semibold text-gray-900 high-contrast capitalize">
                              {crop.type}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {fieldInfo.farmName} - {fieldInfo.fieldName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCrop(crop)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                          >
                            <ApperIcon name="Edit2" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(crop.Id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(crop.status)}`}>
                            <ApperIcon name={getStatusIcon(crop.status)} size={12} className="mr-1" />
                            {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {fieldInfo.fieldSize} {fieldInfo.sizeUnit}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-600">Planted:</span>
                            <span className="font-medium text-gray-900">
                              {format(plantingDate, 'MMM d, yyyy')}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {daysPlanted} days ago
                            </span>
                          </div>
                          
                          {expectedHarvest && (
                            <div>
                              <span className="block text-gray-600">Harvest:</span>
                              <span className="font-medium text-gray-900">
                                {format(expectedHarvest, 'MMM d, yyyy')}
                              </span>
                              <span className={`block text-xs ${daysToHarvest > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {daysToHarvest > 0 ? `in ${daysToHarvest} days` : `${Math.abs(daysToHarvest)} days overdue`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Edit2"
                            onClick={() => handleEditCrop(crop)}
                            className="flex-1"
                          >
                            Update Status
                          </Button>
                          {crop.status !== 'harvested' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Scissors"
                              onClick={() => {
                                const updatedCrop = { ...crop, status: 'harvested' };
                                cropsService.update(crop.Id, updatedCrop).then(() => {
                                  toast.success('Crop marked as harvested');
                                  loadData();
                                });
                              }}
                            >
                              Harvest
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crops;