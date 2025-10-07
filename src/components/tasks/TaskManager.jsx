import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateId } from '../../utils/helpers';
import { toast } from '../common/Toast';
import TaskCard from './TaskCard';
import Modal from '../common/Modal';
import TaskForm from './TaskForm';

const TaskManager = () => {
  const { state, actions } = useApp();
  
  const [editingTask, setEditingTask] = useState(null);
  
  const currentUserData = state.viewingUser === 'current' 
    ? state.currentUserData 
    : state.otherUserData;
    
  const currentUserId = state.viewingUser === 'current' 
    ? state.currentUserId 
    : state.otherUserId;
  
  const handleTaskComplete = (task) => {
    console.log('Task completed:', task);
    // Toast notification would go here
  };
  
  const handleTaskDelete = (taskId) => {
    console.log('Task deleted:', taskId);
    // Toast notification would go here
  };
  
  const handleTaskEdit = (task) => {
    setEditingTask(task);
    actions.showTaskModal();
  };
  
  const handleAddTask = () => {
    setEditingTask(null);
    actions.showTaskModal();
  };
  
  const handleTaskSubmit = async (formData) => {
    try {
      if (editingTask) {
        // 更新任务
        await actions.updateTask(editingTask.id, formData, currentUserId);
        console.log('任务更新成功');
        toast.success('任务更新成功！');
      } else {
        // 创建新任务 - 不需要手动生成ID，Firebase会自动生成
        console.log('创建任务，用户ID:', currentUserId);
        console.log('任务数据:', formData);
        
        if (!currentUserId) {
          console.error('用户ID未设置，无法创建任务');
          toast.error('用户未登录，请刷新页面重试');
          return;
        }
        
        await actions.addTask(formData, currentUserId);
        console.log('任务创建成功');
        toast.success('任务创建成功！');
      }
      
      actions.hideTaskModal();
      setEditingTask(null);
    } catch (error) {
      console.error('保存任务失败:', error);
      toast.error('保存失败: ' + error.message);
    }
  };
  
  const handleCloseModal = () => {
    actions.hideTaskModal();
    setEditingTask(null);
  };
  
  const groupedTasks = currentUserData.tasks.reduce((acc, task) => {
    if (!acc[task.type]) acc[task.type] = [];
    acc[task.type].push(task);
    return acc;
  }, {});
  
  return (
    <div className="px-6 pb-20">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {currentUserData.tasks.length === 0 ? 'No tasks yet' : 'Your Tasks'}
        </h2>
        
        {currentUserData.tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 mb-2">No tasks created yet</p>
            <p className="text-sm text-gray-400">Tap the + button to add your first task</p>
          </div>
        )}
      </div>
      
      {Object.entries(groupedTasks).map(([type, typeTasks]) => (
        <div key={type} className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3 capitalize">
            {type === 'bad_habit'
              ? 'Bad Habits'
              : type === 'achievement'
              ? 'Achievements'
              : `${type.replace('_', ' ')} Tasks`}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {typeTasks.map(task => (
              <TaskCard 
                key={task.id}
                task={task}
                onComplete={handleTaskComplete}
                onDelete={handleTaskDelete}
                onEdit={handleTaskEdit}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Task Modal */}
      <Modal
        isOpen={state.showTaskModal}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Add New Task"}
        subtitle={editingTask ? "Update your task details" : "Create a new task or achievement to earn points"}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onCancel={handleCloseModal}
          isEditing={!!editingTask}
        />
      </Modal>
    </div>
  );
};

export default TaskManager;
