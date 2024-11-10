import React from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, onDelete }) => {
  return (
    <div className="task-column">
      <h2>{title}</h2>
      <div className="task-cards">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
