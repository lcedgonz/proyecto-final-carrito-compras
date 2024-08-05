const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const fetchProductCount = async () => {
  const result = await pool.query('SELECT COUNT(*) AS count FROM productos');
  return result.rows[0].count;
};

const fetchSalesCount = async () => {
  const result = await pool.query('SELECT COUNT(*) AS count FROM ventas');
  return result.rows[0].count;
};

const fetchRevenue = async () => {
  const result = await pool.query('SELECT COALESCE(SUM(total), 0) AS sum FROM ventas');
  return result.rows[0].sum;
};

const fetchUserCount = async () => {
  const result = await pool.query('SELECT COUNT(*) AS count FROM usuarios');
  return result.rows[0].count;
};

const fetchTasks = async (userId) => {
  const result = await pool.query('SELECT id, task_text, completed FROM tasks WHERE user_id = $1', [userId]);
  return result.rows; 
};

const addTask = async (userId, taskText) => {
  await pool.query('INSERT INTO tasks (user_id, task_text) VALUES ($1, $2)', [userId, taskText]);
};

const completeTask = async (taskId) => {
  await pool.query('UPDATE tasks SET completed = TRUE WHERE id = $1', [taskId]);
};

const deleteTask = async (taskId) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
};

exports.adminDashboard = async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/");
  }

  try {

    const productosCount = await fetchProductCount();
    const ventasCount = await fetchSalesCount();
    const revenue = await fetchRevenue();
    const usuariosCount = await fetchUserCount();
    const tasks = await fetchTasks(req.session.user.id);

    res.render("admin/dashboard", {
      layout: 'adminMain',
      user: req.session.user,
      title: 'Dashboard del Administrador',
      productosCount, 
      ventasCount, 
      revenue, 
      usuariosCount,
      tasks 
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("Error fetching dashboard data");
  }
};

exports.addTask = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { taskText } = req.body;
    await addTask(userId, taskText);
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ success: false, error: "Error adding task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    await deleteTask(taskId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, error: "Error deleting task" });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    await completeTask(taskId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ success: false, error: "Error completing task" });
  }
};
