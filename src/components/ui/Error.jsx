import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null,
  type = "general"
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'WifiOff',
          title: 'Connection Problem',
          description: 'Check your internet connection and try again.'
        };
      case 'notfound':
        return {
          icon: 'Search',
          title: 'No Results Found',
          description: 'We couldn\'t find what you\'re looking for.'
        };
      case 'permission':
        return {
          icon: 'Lock',
          title: 'Access Denied',
          description: 'You don\'t have permission to access this resource.'
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Something went wrong',
          description: message
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={config.icon} 
            size={32} 
            className="text-red-500"
          />
        </div>
        
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>
        
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {config.description}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Try Again</span>
          </button>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;