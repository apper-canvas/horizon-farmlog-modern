import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import Header from '@/components/organisms/Header';
import StatCard from '@/components/molecules/StatCard';
import TaskItem from '@/components/molecules/TaskItem';
import WeatherCard from '@/components/molecules/WeatherCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { farmsService } from '@/services/api/farmsService';
import { cropsService } from '@/services/api/cropsService';
import { tasksService } from '@/services/api/tasksService';
import { expensesService } from '@/services/api/expensesService';
import { weatherService } from '@/services/api/weatherService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    farms: [],
    crops: [],
    tasks: [],
    expenses: [],
    weather: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [farms, crops, tasks, expenses, weather] = await Promise.all([
        farmsService.getAll(),
        cropsService.getAll(),
        tasksService.getAll(),
        expensesService.getAll(),
        weatherService.getCurrentWeather()
      ]);

      setData({
        farms,
        crops,
        tasks,
        expenses,
        weather
      });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId) => {
    try {
      const task = data.tasks.find(t => t.Id === taskId);
      if (task) {
        await tasksService.update(taskId, { ...task, completed: !task.completed });
        await loadDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full">
        <Header 
          title="Dashboard" 
          subtitle="Welcome back! Here's what's happening on your farm." 
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <Loading type="dashboard" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <Header title="Dashboard" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    totalFarms: data.farms.length,
    activeCrops: data.crops.filter(crop => ['planted', 'growing', 'flowering', 'fruiting'].includes(crop.status)).length,
    pendingTasks: data.tasks.filter(task => !task.completed).length,
    monthlyExpenses: data.expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, expense) => sum + expense.amount, 0)
  };

  // Get today's and upcoming tasks
  const todaysTasks = data.tasks.filter(task => 
    !task.completed && isToday(new Date(task.dueDate))
  );

  const upcomingTasks = data.tasks.filter(task => 
    !task.completed && (isTomorrow(new Date(task.dueDate)) || isThisWeek(new Date(task.dueDate)))
  ).slice(0, 5);

  // Recent activities (last 5 completed tasks and recent expenses)
  const recentActivities = [
    ...data.tasks
      .filter(task => task.completed)
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
      .slice(0, 3)
      .map(task => ({
        id: task.Id,
        type: 'task',
        title: `Completed: ${task.title}`,
        date: task.dueDate,
        icon: 'CheckCircle',
        color: 'text-green-600'
      })),
    ...data.expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2)
      .map(expense => ({
        id: expense.Id,
        type: 'expense',
        title: `${expense.category}: $${expense.amount.toFixed(2)}`,
        date: expense.date,
        icon: 'DollarSign',
        color: 'text-yellow-600'
      }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="h-full">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening on your farm."
        actions={
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              icon="Plus" 
              onClick={() => navigate('/tasks')}
            >
              Add Task
            </Button>
            <Button 
              icon="Sprout" 
              onClick={() => navigate('/crops')}
            >
              Plant Crop
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Farms"
            value={stats.totalFarms}
            icon="MapPin"
            iconColor="text-primary-500"
            onClick={() => navigate('/farms')}
          />
          <StatCard
            title="Active Crops"
            value={stats.activeCrops}
            icon="Sprout"
            iconColor="text-green-500"
            onClick={() => navigate('/crops')}
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon="CheckSquare"
            iconColor="text-blue-500"
            onClick={() => navigate('/tasks')}
          />
          <StatCard
            title="This Month's Expenses"
            value={`$${stats.monthlyExpenses.toFixed(2)}`}
            icon="DollarSign"
            iconColor="text-yellow-500"
            onClick={() => navigate('/expenses')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Tasks */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Clock" size={18} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-gray-900">
                    Today's Tasks
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon="Plus"
                  onClick={() => navigate('/tasks')}
                >
                  Add Task
                </Button>
              </div>

              {todaysTasks.length === 0 ? (
                <Empty 
                  type="tasks" 
                  title="No tasks for today" 
                  description="Great! You have no pending tasks for today."
                  actionLabel="View All Tasks"
                  onAction={() => navigate('/tasks')}
                />
              ) : (
                <div className="space-y-4">
                  {todaysTasks.map(task => (
                    <TaskItem
                      key={task.Id}
                      task={task}
                      onToggle={handleTaskToggle}
                      compact
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calendar" size={18} className="text-orange-600" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-gray-900">
                    Upcoming Tasks
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon="ArrowRight"
                  onClick={() => navigate('/tasks')}
                >
                  View All
                </Button>
              </div>

              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
                  <p className="text-gray-600">No upcoming tasks scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTasks.map(task => (
                    <TaskItem
                      key={task.Id}
                      task={task}
                      onToggle={handleTaskToggle}
                      compact
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-8">
            {/* Weather */}
            <WeatherCard weather={data.weather} />

            {/* Recent Activity */}
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Activity" size={18} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-display font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>

              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <motion.div
                      key={`${activity.type}-${activity.id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${activity.color}`}>
                        <ApperIcon name={activity.icon} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(activity.date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  variant="outline" 
                  icon="MapPin"
                  onClick={() => navigate('/farms')}
                >
                  Add Farm
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  icon="Sprout"
                  onClick={() => navigate('/crops')}
                >
                  Plant Crop
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  icon="DollarSign"
                  onClick={() => navigate('/expenses')}
                >
                  Record Expense
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;