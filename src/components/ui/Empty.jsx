import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  type = "general",
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'farms':
        return {
          icon: 'MapPin',
          title: 'No Farms Added Yet',
          description: 'Start by adding your first farm to begin tracking your agricultural operations.',
          actionLabel: 'Add Farm',
          gradient: 'from-primary-50 to-primary-100'
        };
      case 'crops':
        return {
          icon: 'Sprout',
          title: 'No Crops Planted',
          description: 'Track your plantings and monitor crop progress throughout the growing season.',
          actionLabel: 'Plant Crop',
          gradient: 'from-green-50 to-green-100'
        };
      case 'tasks':
        return {
          icon: 'CheckSquare',
          title: 'All Tasks Complete!',
          description: 'Great work! You\'ve completed all your scheduled farm tasks.',
          actionLabel: 'Add New Task',
          gradient: 'from-blue-50 to-blue-100'
        };
      case 'expenses':
        return {
          icon: 'DollarSign',
          title: 'No Expenses Recorded',
          description: 'Keep track of your farm expenses to better manage your budget and finances.',
          actionLabel: 'Record Expense',
          gradient: 'from-yellow-50 to-yellow-100'
        };
      case 'weather':
        return {
          icon: 'Cloud',
          title: 'Weather Data Unavailable',
          description: 'Unable to load weather information. Check your connection and try again.',
          actionLabel: 'Refresh Weather',
          gradient: 'from-sky-50 to-sky-100'
        };
      default:
        return {
          icon: icon || 'Package',
          title: title || 'No Data Available',
          description: description || 'There\'s nothing to show here yet.',
          actionLabel: actionLabel || 'Get Started',
          gradient: 'from-gray-50 to-gray-100'
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center`}>
          <ApperIcon 
            name={config.icon} 
            size={40} 
            className="text-gray-600"
          />
        </div>
        
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
          {config.title}
        </h3>
        
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          {config.description}
        </p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" size={18} />
            <span>{config.actionLabel}</span>
          </button>
        )}
        
        <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
          <p className="text-xs text-primary-700 flex items-center justify-center space-x-1">
            <ApperIcon name="Lightbulb" size={14} />
            <span>Tip: Regular data entry helps you make better farming decisions</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Empty;