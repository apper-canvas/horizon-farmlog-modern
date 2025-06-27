import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import FarmForm from '@/components/organisms/FarmForm';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { farmsService } from '@/services/api/farmsService';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await farmsService.getAll();
      setFarms(data);
    } catch (err) {
      setError('Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarm = () => {
    setEditingFarm(null);
    setShowForm(true);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleDeleteFarm = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      try {
        await farmsService.delete(farmId);
        toast.success('Farm deleted successfully');
        await loadFarms();
      } catch (error) {
        toast.error('Failed to delete farm');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingFarm) {
        await farmsService.update(editingFarm.Id, formData);
        toast.success('Farm updated successfully');
      } else {
        await farmsService.create(formData);
        toast.success('Farm created successfully');
      }
      
      setShowForm(false);
      setEditingFarm(null);
      await loadFarms();
    } catch (error) {
      toast.error(`Failed to ${editingFarm ? 'update' : 'create'} farm`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFarm(null);
  };

  if (loading && !showForm) {
    return (
      <div className="h-full">
        <Header title="Farms" subtitle="Manage your farm locations and fields" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Loading type="cards" />
        </div>
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="h-full">
        <Header title="Farms" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Error message={error} onRetry={loadFarms} />
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="h-full">
        <Header 
          title={editingFarm ? 'Edit Farm' : 'Add New Farm'}
          breadcrumbs={['Farms', editingFarm ? 'Edit' : 'Add New']}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <FarmForm
            farm={editingFarm}
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
        title="Farms" 
        subtitle="Manage your farm locations and fields"
        actions={
          <Button icon="Plus" onClick={handleAddFarm}>
            Add Farm
          </Button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {farms.length === 0 ? (
          <Empty 
            type="farms" 
            onAction={handleAddFarm}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {farms.map((farm) => (
                <motion.div
                  key={farm.Id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card hover className="h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                          <ApperIcon 
                            name="MapPin" 
                            size={24} 
                            className="text-primary-600"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-display font-semibold text-gray-900 high-contrast">
                            {farm.name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <ApperIcon name="MapPin" size={14} className="mr-1" />
                            {farm.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditFarm(farm)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFarm(farm.Id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-900">
                          {farm.size} {farm.sizeUnit}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Fields:</span>
                        <span className="font-medium text-gray-900">
                          {farm.fields?.length || 0}
                        </span>
                      </div>
                    </div>

                    {farm.fields && farm.fields.length > 0 && (
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Fields:</h4>
                        <div className="space-y-2">
                          {farm.fields.slice(0, 3).map((field) => (
                            <div 
                              key={field.id} 
                              className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2"
                            >
                              <span className="font-medium">{field.name}</span>
                              <span className="text-gray-600">{field.size} {farm.sizeUnit}</span>
                            </div>
                          ))}
                          {farm.fields.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{farm.fields.length - 3} more fields
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        icon="Eye"
                        onClick={() => handleEditFarm(farm)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Farms;