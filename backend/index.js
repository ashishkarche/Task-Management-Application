const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT =  5000;

// Route to get all tasks
app.get('/tasks', async (req, res) => {
    try {
      const [tasks] = await pool.query('SELECT * FROM projects');
  
      // Loop through the tasks and update status if expired
      const updatedTasks = await Promise.all(tasks.map(async (task) => {
        const deadlineDate = new Date(task.deadline);
        const currentDate = new Date();
  
        if (task.status !== 'Completed' && deadlineDate < currentDate) {
          // Update task status to 'Expired' if deadline has passed and status is not 'Completed'
          await pool.query('UPDATE projects SET status = ? WHERE id = ?', ['Expired', task.id]);
          task.status = 'Expired'; // Update status locally to reflect the change
        }
  
        return task;
      }));
  
      res.json(updatedTasks); // Return the updated tasks
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Route to add a new task
app.post('/tasks', async (req, res) => {
    const { title, description, status, deadline } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO projects (title, description, status, deadline) VALUES (?, ?, ?, ?)',
        [title, description, status, deadline]  // Ensure 'description' is used here
      );
      res.json({ id: result.insertId, title, description, status, deadline });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Route to update a task status
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE projects SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Task status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM projects WHERE id = ?', [id]);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
