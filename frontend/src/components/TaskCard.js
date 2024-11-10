import React from 'react';

const TaskCard = ({ task, onDelete }) => {
  const deadlineDate = new Date(task.deadline);
  const isOverdue = deadlineDate < new Date() && task.status !== 'Completed';
  
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`task-card ${task.priority ? task.priority.toLowerCase() : ''} ${isOverdue ? 'overdue' : ''}`}>
      {task.priority && <span className="priority">{task.priority}</span>}
      {task.status && <span className="status">{task.status}</span>}
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <span className="deadline">Deadline: {formattedDeadline}</span>
      
      {/* Delete Button */}
      <button className="delete-task-btn" onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
};

export default TaskCard;
