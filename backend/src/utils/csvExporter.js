const exportTasksToCSV = (tasks) => {
  const header = 'id,title,description,status,priority,dueDate,createdAt\n';
  const rows = tasks.map(({ id, title, description, status, priority, dueDate, createdAt }) =>
    `${id},"${(title || '').replace(/"/g, '""')}","${(description || '').replace(/"/g, '""')}",${status},${priority},${dueDate ? dueDate.toISOString() : ''},${createdAt.toISOString()}`
  );
  return header + rows.join('\n');
};

module.exports = { exportTasksToCSV };
