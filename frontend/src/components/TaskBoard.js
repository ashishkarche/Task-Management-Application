import React, { useState, useEffect } from 'react';
import TaskColumn from './TaskColumn';
import AddTaskModal from './AddTaskModal';

const TaskBoard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState({ todo: [], onProgress: [], done: [], timeout: [] });
  const [loading, setLoading] = useState(false); // Loading state
  const [successModalOpen, setSuccessModalOpen] = useState(false); // State for success modal

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Helper function to categorize tasks by status and timeout
  const organizeTasksByStatus = (data) => {
    return {
      todo: data.filter((task) => task.status === 'To Do'),
      onProgress: data.filter((task) => task.status === 'On Progress'),
      done: data.filter((task) => task.status === 'Completed'),
      timeout: data.filter((task) => {
        const deadlineDate = new Date(task.deadline);
        return task.status !== 'Completed' && deadlineDate < new Date() - 48 * 60 * 60 * 1000; // 48 hours timeout
      }),
    };
  };

  // Fetch tasks from the backend API and organize them by status
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(organizeTasksByStatus(data));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle task deletion
  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, { method: 'DELETE' });

      // Remove task from the state
      const updatedTasks = { ...tasks };
      Object.keys(updatedTasks).forEach((column) => {
        updatedTasks[column] = updatedTasks[column].filter((task) => task.id !== taskId);
      });

      setTasks(updatedTasks);

      // Show success modal after deletion
      setSuccessModalOpen(true);

      // Close success modal after 3 seconds
      setTimeout(() => setSuccessModalOpen(false), 3000);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Fetch tasks on mount and set an interval to refresh tasks every minute
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 60000); // Refresh tasks every minute
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const renderTaskColumns = () => (
    <>
      {['todo', 'onProgress', 'done', 'timeout'].map((status) => (
        <TaskColumn
          key={status}
          title={capitalize(status)}
          tasks={tasks[status]}
          onDelete={deleteTask}
        />
      ))}
    </>
  );

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1); // Capitalize first letter

  return (
    <div className="task-board">
      <aside className="sidebar">
        <div className="sidebar-item">
          Expired Tasks <span>{tasks.timeout.length}</span>
        </div>
        <div className="sidebar-item">
          All Active Tasks <span>{tasks.todo.length + tasks.onProgress.length}</span>
        </div>
        <div className="sidebar-item">
          Completed Tasks{' '}
          <span>{tasks.done.length}/{tasks.todo.length + tasks.onProgress.length + tasks.done.length}</span>
        </div>
        <button className="add-task-btn" onClick={openModal}>
          + Add Task
        </button>
      </aside>

      {loading ? (
        <div className="loading-spinner">Loading...</div> // Display loading spinner when tasks are being fetched
      ) : (
        <div className="columns">{renderTaskColumns()}</div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={closeModal} onTaskCreated={fetchTasks} />

      {/* Success Modal for Task Deletion */}
      {successModalOpen && (
        <div className="success-modal">
          <div className="success-modal-content">
            <h2>Task Deleted Successfully</h2>
            <button onClick={() => setSuccessModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
