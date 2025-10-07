import { TASK_TYPE_ICONS, TASK_TYPE_LABELS } from '../../utils/constants';
import { getTaskTypeColor, formatPoints } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { toast } from '../common/Toast';

const TaskCard = ({ task, onComplete, onDelete, onEdit }) => {
  const { state, actions } = useApp();
  
  const isDisabled = task.type === 'achievement' && task.isAchieved;
  const isNegative = task.type === 'bad_habit';
  const currentUserId = state.viewingUser === 'current' 
    ? state.currentUserId 
    : state.otherUserId;
  
  // 检查是否在查看伙伴的数据
  const isViewingPartner = state.viewingUser === 'other';
  const canEdit = !isViewingPartner;
  
  const handleComplete = async () => {
    try {
      console.log('完成任务:', task.id, '用户ID:', currentUserId);
      await actions.completeTask(task.id, task.pointValue, currentUserId);
      onComplete && onComplete(task);
      console.log('任务完成成功');
      toast.success(`任务"${task.name}"完成！获得${task.pointValue > 0 ? '+' : ''}${task.pointValue}积分`);
    } catch (error) {
      console.error('完成任务失败:', error);
      toast.error('完成任务失败: ' + error.message);
    }
  };
  
  const handleDelete = async () => {
    try {
      if (confirm('确定要删除这个任务吗？')) {
        console.log('删除任务:', task.id, '用户ID:', currentUserId);
        await actions.deleteTask(task.id, currentUserId);
        onDelete && onDelete(task.id);
        console.log('任务删除成功');
        toast.success('任务删除成功');
      }
    } catch (error) {
      console.error('删除任务失败:', error);
      toast.error('删除任务失败: ' + error.message);
    }
  };
  
  const handleEdit = () => {
    onEdit && onEdit(task);
  };
  
  const pointColor = isNegative ? 'text-red-600' : 'text-green-600';
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{TASK_TYPE_ICONS[task.type]}</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTaskTypeColor(task.type)}`}>
            {TASK_TYPE_LABELS[task.type]}
          </span>
        </div>
        {canEdit && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="删除任务"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      
      <h3 className="font-medium text-gray-900 mb-3">{task.name}</h3>
      
      <div className="flex items-center justify-between">
        <div className={`text-lg font-bold ${pointColor}`}>
          {formatPoints(task.pointValue)}
        </div>
        
        <div className="flex space-x-2">
          {canEdit ? (
            <>
              <button
                onClick={handleComplete}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDisabled 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isNegative
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isDisabled ? 'Completed' : 'Complete'}
              </button>
              
              <button
                onClick={handleEdit}
                className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="编辑任务"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </>
          ) : (
            <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
              仅查看
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
