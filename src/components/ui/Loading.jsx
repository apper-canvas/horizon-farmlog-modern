import React from 'react';

const Loading = ({ type = 'dashboard' }) => {
  const renderDashboardSkeleton = () => (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="shimmer h-8 w-64 rounded-lg"></div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="shimmer h-4 w-24 rounded mb-3"></div>
            <div className="shimmer h-8 w-16 rounded mb-2"></div>
            <div className="shimmer h-3 w-32 rounded"></div>
          </div>
        ))}
      </div>
      
      {/* Content area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="shimmer h-6 w-32 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="shimmer h-4 w-4 rounded"></div>
                <div className="shimmer h-4 flex-1 rounded"></div>
                <div className="shimmer h-4 w-16 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="shimmer h-6 w-32 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="shimmer h-12 w-12 rounded-full"></div>
                <div className="flex-1">
                  <div className="shimmer h-4 w-24 rounded mb-2"></div>
                  <div className="shimmer h-3 w-32 rounded"></div>
                </div>
                <div className="shimmer h-6 w-16 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="shimmer h-6 w-32 rounded"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[...Array(5)].map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="shimmer h-4 w-20 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="shimmer h-4 w-24 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCardGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="shimmer h-6 w-32 rounded mb-4"></div>
          <div className="shimmer h-4 w-24 rounded mb-2"></div>
          <div className="shimmer h-4 w-16 rounded mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="shimmer h-6 w-20 rounded"></div>
            <div className="shimmer h-8 w-16 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="shimmer h-8 w-48 rounded mb-6"></div>
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="shimmer h-4 w-24 rounded mb-2"></div>
            <div className="shimmer h-12 w-full rounded-lg"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <div className="shimmer h-12 w-24 rounded-lg"></div>
        <div className="shimmer h-12 w-32 rounded-lg"></div>
      </div>
    </div>
  );

  switch (type) {
    case 'table':
      return renderTableSkeleton();
    case 'cards':
      return renderCardGridSkeleton();
    case 'form':
      return renderFormSkeleton();
    default:
      return renderDashboardSkeleton();
  }
};

export default Loading;