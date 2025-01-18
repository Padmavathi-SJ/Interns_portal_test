# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


admin-pages:
1. login
2. Dashboard
3. Employee --> AddEmployee --> EditEmployee
4. Department --> AddDepartment
5. WorkAllocation --> AddTask --> EditTask
6. Leave --> ApplyLeave



user-pages:
1. UserLogin
2. EmployeeDashboard
3. Profile
4. EmployeeeTask
5. ApplyLeave



      {/* Show All Tasks */}
      {showAllTasks && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">All Tasks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              return (
                <div
                  key={task.taskId}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-800 dark:text-gray-200">Task ID: {task.taskId}</p>
                    <p className={`text-lg ${getPriorityStyle(task.priority)}`}>{task.priority}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-800 dark:text-gray-300">Status: 
                      <span className={`inline-block px-4 py-2 rounded-lg ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </p>
                    <div className="mt-4 relative">
 

  {/* Status Dropdown */}
  <div className="absolute bottom-0 right-0 mb-4 mr-4">
    <select
      className="p-2 border rounded-md"
      value={task.status}
      onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>
  </div>

  {/* View Task Button */}
  <div className="mt-4 flex justify-between gap-4">
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      onClick={() => handleViewTask(task)}
    >
      View Task
    </button>
  </div>
</div>
</div>
                </div>
              );
            })}
          </div>
        </div>
      )}