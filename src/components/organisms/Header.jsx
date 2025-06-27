import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ 
  title, 
  subtitle,
  actions,
  showMenuButton = false,
  onMenuClick,
  breadcrumbs = []
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              onClick={onMenuClick}
              className="lg:hidden"
            />
          )}
          
          <div>
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <ApperIcon name="ChevronRight" size={14} />}
                    <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-gray-700'}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </nav>
            )}
            
            <h1 className="text-2xl font-display font-bold text-gray-900 high-contrast">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1 high-contrast">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;