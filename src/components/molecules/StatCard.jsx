import React from 'react';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconColor = 'text-primary-500',
  onClick,
  loading = false
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover={!!onClick} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 high-contrast">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 high-contrast">{value}</p>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${changeColors[changeType]}`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={12} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center ${iconColor}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;