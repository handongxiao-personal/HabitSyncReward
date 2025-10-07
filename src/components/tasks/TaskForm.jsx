import { useState, useEffect } from 'react';
import { TASK_TYPES, TASK_TYPE_LABELS } from '../../utils/constants';

const TaskForm = ({ task, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    pointValue: 10,
    type: 'daily'
  });
  
  const [errors, setErrors] = useState({});
  
  // 如果是编辑模式，填充现有数据
  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        name: task.name || '',
        pointValue: task.pointValue || 10,
        type: task.type || 'daily'
      });
    }
  }, [isEditing, task]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证表单
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }
    if (formData.pointValue === 0) {
      newErrors.pointValue = 'Point value cannot be 0';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 清除错误并提交
    setErrors({});
    onSubmit(formData);
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="e.g., Complete morning workout"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Point Value
        </label>
        <input
          type="number"
          value={formData.pointValue}
          onChange={(e) => handleInputChange('pointValue', parseInt(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.pointValue ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.pointValue && (
          <p className="text-red-500 text-sm mt-1">{errors.pointValue}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Use negative values for bad habits
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {Object.entries(TASK_TYPES).map(([key, value]) => (
            <option key={key} value={value}>
              {TASK_TYPE_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
