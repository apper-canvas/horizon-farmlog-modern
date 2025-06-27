import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const TaskItem = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  compact = false
}) => {
  const priorityColors = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-green-600 bg-green-50 border-green-200'
  };

  const taskTypeIcons = {
    watering: 'Droplets',
    fertilizing: 'Sprout',
    harvesting: 'Scissors',
    planting: 'Seed',
    weeding: 'Trash2',
    inspection: 'Eye',
    maintenance: 'Wrench',
    other: 'CheckSquare'
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle(task.Id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white border border-gray-200 rounded-lg p-4 ${compact ? 'py-3' : 'p-6'} hover:border-primary-200 transition-colors duration-200`}
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
            task.completed
              ? 'bg-primary-500 border-primary-500 text-white'
              : 'border-gray-300 hover:border-primary-500'
          }`}
        >
          {task.completed && <ApperIcon name="Check" size={12} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'} high-contrast`}>
                {task.title}
              </h4>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <ApperIcon name={taskTypeIcons[task.type] || 'CheckSquare'} size={14} />
                  <span className="capitalize">{task.type}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <ApperIcon name="Calendar" size={14} />
                  <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                  <ApperIcon 
                    name={task.priority === 'high' ? 'AlertTriangle' : task.priority === 'medium' ? 'Minus' : 'ArrowDown'} 
                    size={10} 
                    className="mr-1" 
                  />
                  {task.priority} priority
                </span>
                
                {task.cropId && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                    <ApperIcon name="Sprout" size={10} className="mr-1" />
                    Crop Task
                  </span>
                )}
              </div>
            </div>

            {!compact && (
              <div className="flex items-center space-x-2 ml-4">
                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(task.Id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;