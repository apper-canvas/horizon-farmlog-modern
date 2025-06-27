import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import Header from '@/components/organisms/Header';
import TaskForm from '@/components/organisms/TaskForm';
import TaskItem from '@/components/molecules/TaskItem';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { tasksService } from '@/services/api/tasksService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tasksService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksService.delete(taskId);
        toast.success('Task deleted successfully');
        await loadTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleTaskToggle = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (task) {
        await tasksService.update(taskId, { ...task, completed: !task.completed });
        toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!');
        await loadTasks();
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingTask) {
        await tasksService.update(editingTask.Id, formData);
        toast.success('Task updated successfully');
      } else {
        await tasksService.create(formData);
        toast.success('Task created successfully');
      }
      
      setShowForm(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      toast.error(`Failed to ${editingTask ? 'update' : 'create'} task`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'today':
        return isToday(taskDate) && !task.completed;
      case 'tomorrow':
        return isTomorrow(taskDate) && !task.completed;
      case 'overdue':
        return isPast(taskDate) && !isToday(taskDate) && !task.completed;
      case 'high':
        return task.priority === 'high' && !task.completed;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case 'type':
        return a.type.localeCompare(b.type);
      case 'completed':
        return a.completed - b.completed;
      default: // dueDate
        return new Date(a.dueDate) - new Date(b.dueDate);
    }
  });

  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'today', label: 'Due Today' },
    { value: 'tomorrow', label: 'Due Tomorrow' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'high', label: 'High Priority' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'type', label: 'Type' },
    { value: 'completed', label: 'Status' }
  ];

  // Task statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)) && !t.completed).length,
    today: tasks.filter(t => isToday(new Date(t.dueDate)) && !t.completed).length
  };

  if (loading && !showForm) {
    return (
      <div className="h-full">
        <Header title="Tasks" subtitle="Manage your farm tasks and schedules" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Loading type="table" />
        </div>
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="h-full">
        <Header title="Tasks" />
        <div className="p-4 sm:p-6 lg:p-8">
          <Error message={error} onRetry={loadTasks} />
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="h-full">
        <Header 
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          breadcrumbs={['Tasks', editingTask ? 'Edit' : 'Create New']}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <TaskForm
            task={editingTask}
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
        title="Tasks" 
        subtitle="Manage your farm tasks and schedules"
        actions={
          <Button icon="Plus" onClick={handleAddTask}>
            Add Task
          </Button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 high-contrast">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Tasks</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 high-contrast">{stats.completed}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 high-contrast">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 high-contrast">{stats.overdue}</div>
              <div className="text-xs text-gray-600">Overdue</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 high-contrast">{stats.today}</div>
              <div className="text-xs text-gray-600">Due Today</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-48">
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  options={filterOptions}
                  fullWidth={false}
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  fullWidth={false}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </Card>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Empty 
            type="tasks" 
            onAction={handleAddTask}
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.Id}
                  task={task}
                  onToggle={handleTaskToggle}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;