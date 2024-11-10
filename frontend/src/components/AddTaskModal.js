import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import SuccessModal from './SuccessModal';
import 'react-datepicker/dist/react-datepicker.css';
import './AddTaskModal.css';

const AddTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskContent, setTaskContent] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const calendarRef = useRef(null);

  // Event Handlers
  const handleDeadlineClick = () => setShowCalendar(!showCalendar);
  const handleCalendarChange = (date) => {
    setDeadline(date);
    setShowCalendar(false);
  };
  const handleOutsideClick = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setShowCalendar(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'title') setTaskTitle(value);
    if (field === 'content') setTaskContent(value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!taskTitle.trim()) newErrors.title = 'Title is required.';
    if (!taskContent.trim()) newErrors.content = 'Content is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTaskCreation = async () => {
    if (validateFields()) {
      setLoading(true);
      setSubmitError(null);
      try {
        const response = await fetch('http://localhost:5000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: taskTitle,
            description: taskContent,
            deadline: deadline ? deadline.toISOString() : null,
            status: 'To Do',
          }),
        });

        if (response.ok) {
          setShowSuccess(true);
          resetForm();
          onTaskCreated();
        } else {
          const errorText = await response.text();
          setSubmitError(errorText);
        }
      } catch (error) {
        setSubmitError('An error occurred while creating the task.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskContent('');
    setDeadline(null);
  };

  const handleCloseSuccessModal = () => setShowSuccess(false);

  // Effect for outside click to close the calendar
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Early return if modal is not open
  if (!isOpen) return null;

  if (showSuccess) {
    return <SuccessModal onClose={handleCloseSuccessModal} />;
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="add-task-modal">
        <div className="header">
          <h2>ADD TASK</h2>
          <span className="add-icon" onClick={onClose}>×</span>
        </div>

        {/* Task Title */}
        <input
          type="text"
          className="task-title-input"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        {errors.title && <div className="error-message">{errors.title}</div>}

        {/* Task Content */}
        <textarea
          className="task-content-input"
          placeholder="Enter task content"
          value={taskContent}
          onChange={(e) => handleInputChange('content', e.target.value)}
        />
        {errors.content && <div className="error-message">{errors.content}</div>}

        {/* Submit Errors */}
        {submitError && <div className="error-message">{submitError}</div>}

        <div className="task-footer">
          {/* Deadline Section */}
          <span className="label" onClick={handleDeadlineClick}>
            Deadline
          </span>

          {showCalendar && (
            <div ref={calendarRef} className="calendar-popup">
              <DatePicker
                selected={deadline}
                onChange={handleCalendarChange}
                dateFormat="dd MMM yyyy"
                className="deadline-input"
                popperPlacement="bottom"
                withPortal
                todayButton="Today"
                inline
              />
            </div>
          )}

          {/* Task Creation Button */}
          <span className="label" onClick={handleTaskCreation}>
            {loading ? 'Saving...' : 'Assign To'}
          </span>
        </div>
      </div>
    </>
  );
};

export default AddTaskModal;
