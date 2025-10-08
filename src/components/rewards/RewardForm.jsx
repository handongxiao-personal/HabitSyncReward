import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const RewardForm = ({ reward, onSubmit, onCancel, isEditing = false }) => {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    pointCost: 100,
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // 根据当前查看的用户决定主题颜色
  const isCurrentUser = state.viewingUser === 'current';
  
  // 如果是编辑模式，填充现有数据
  useEffect(() => {
    if (isEditing && reward) {
      setFormData({
        name: reward.name || '',
        pointCost: reward.pointCost || 100,
        description: reward.description || ''
      });
    }
  }, [isEditing, reward]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证表单
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Reward name is required';
    }
    if (formData.pointCost <= 0 || formData.pointCost === '') {
      newErrors.pointCost = 'Point cost must be greater than 0';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 确保 pointCost 是数字
    const submitData = {
      ...formData,
      pointCost: typeof formData.pointCost === 'string' ? parseInt(formData.pointCost) : formData.pointCost
    };
    
    // 清除错误并提交
    setErrors({});
    onSubmit(submitData);
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          Reward Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="e.g., Movie night with popcorn"
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
          Point Cost
        </label>
        <input
          type="number"
          value={formData.pointCost}
          onChange={(e) => handleNumberChange('pointCost', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg ${isCurrentUser ? 'focus:ring-2 focus:ring-purple-500' : ''} focus:border-transparent ${
            errors.pointCost ? 'border-red-500' : 'border-gray-300'
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
          min="1"
        />
        {errors.pointCost && (
          <p className="text-red-500 text-sm mt-1">{errors.pointCost}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your reward..."
          rows={3}
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
        />
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
          {isEditing ? 'Update Reward' : 'Add Reward'}
        </button>
      </div>
    </form>
  );
};

export default RewardForm;
