import { useState, useEffect } from 'react';
import { TASK_TYPES, TASK_TYPE_LABELS } from '../../utils/constants';
import { useApp } from '../../context/AppContext';

const TaskForm = ({ task, onSubmit, onCancel, isEditing = false }) => {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    pointValue: 10,
    type: 'daily'
  });
  
  // 根据当前查看的用户决定主题颜色
  const isCurrentUser = state.viewingUser === 'current';
  const themeColor = isCurrentUser ? 'purple' : 'blue';
  
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
    
    // 验证分数值
    const pointValue = typeof formData.pointValue === 'string' ? parseInt(formData.pointValue) : formData.pointValue;
    if (pointValue === 0 || formData.pointValue === '' || isNaN(pointValue)) {
      newErrors.pointValue = 'Point value cannot be 0';
    } else if (formData.type === 'bad_habit' && pointValue > 0) {
      newErrors.pointValue = 'Bad habit must have negative points';
    } else if ((formData.type === 'daily' || formData.type === 'achievement') && pointValue < 0) {
      newErrors.pointValue = 'Daily tasks and achievements must have positive points';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 确保 pointValue 是数字
    const submitData = {
      ...formData,
      pointValue
    };
    
    // 清除错误并提交
    setErrors({});
    onSubmit(submitData);
  };
  
  const handleInputChange = (field, value) => {
    // 如果更改任务类型，自动调整默认分数
    if (field === 'type') {
      // 只在类型真正改变时才重置分数
      setFormData(prev => {
        if (prev[field] === value) {
          // 类型没有改变，不做任何操作
          return prev;
        }
        
        // 类型改变了，设置默认分数
        let defaultPoints = 10;
        if (value === 'daily') defaultPoints = 10;
        else if (value === 'achievement') defaultPoints = 50;
        else if (value === 'bad_habit') defaultPoints = -10;
        
        return { ...prev, [field]: value, pointValue: defaultPoints };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNumberChange = (field, value) => {
    // 如果输入为空字符串，保持空字符串状态
    if (value === '') {
      setFormData(prev => ({ ...prev, [field]: '' }));
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [field]: numValue }));
      }
    }
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
          className={`w-full px-3 py-2 border rounded-lg ${isCurrentUser ? 'focus:ring-2 focus:ring-purple-500' : ''} focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          style={!isCurrentUser ? {
            outlineColor: '#4169E1'
          } : {}}
          onFocus={(e) => {
            if (!isCurrentUser) {
              e.target.style.boxShadow = '0 0 0 2px #4169E1';
              e.target.style.borderColor = 'transparent';
            }
          }}
          onBlur={(e) => {
            if (!isCurrentUser) {
              e.target.style.boxShadow = '';
              e.target.style.borderColor = '';
            }
          }}
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
          onChange={(e) => handleNumberChange('pointValue', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg ${isCurrentUser ? 'focus:ring-2 focus:ring-purple-500' : ''} focus:border-transparent ${
            errors.pointValue ? 'border-red-500' : 'border-gray-300'
          }`}
          style={!isCurrentUser ? {
            outlineColor: '#4169E1'
          } : {}}
          onFocus={(e) => {
            if (!isCurrentUser) {
              e.target.style.boxShadow = '0 0 0 2px #4169E1';
              e.target.style.borderColor = 'transparent';
            }
          }}
          onBlur={(e) => {
            if (!isCurrentUser) {
              e.target.style.boxShadow = '';
              e.target.style.borderColor = '';
            }
          }}
          required
        />
        {errors.pointValue && (
          <p className="text-red-500 text-sm mt-1">{errors.pointValue}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {formData.type === 'bad_habit' 
            ? 'Bad habits must use negative values (e.g., -10)'
            : 'Daily tasks and achievements must use positive values (e.g., 10, 50)'}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isCurrentUser ? 'focus:ring-2 focus:ring-purple-500' : ''} focus:border-transparent`}
          style={!isCurrentUser ? {
            outlineColor: '#4169E1'
          } : {}}
          onFocus={(e) => {
            if (!isCurrentUser) {
              e.target.style.boxShadow = '0 0 0 2px #4169E1';
              e.target.style.borderColor = 'transparent';
            }
          }}
          onBlur={(e) => {
            if (!isCurrentUser) {
              e.target.style.boxShadow = '';
              e.target.style.borderColor = '';
            }
          }}
        >
          {Object.entries(TASK_TYPES).map(([key, value]) => (
            <option key={key} value={value}>
              {value === 'bad_habit' ? 'Bad Habit' : TASK_TYPE_LABELS[value]}
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
