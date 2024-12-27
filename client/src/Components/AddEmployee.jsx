import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const [employee, setEmployee] = useState({
        employeeId:'',
        name:'',
        email: '',
        password:'',
        education:'',
        experience:'',
        department_id:'',
        salary: '',
        profile_picture:''
    })

    const [departments, setDepartments] = useState([]);
  
    useEffect(() => {
      axios.get('http://localhost:3000/auth/get_departments')
        .then((response) => {
          console.log(response.data); // Debugging: Log API response
          if (response.data.Status) {
            setDepartments(response.data.Result); // Ensure departments is an array
          } else {
            alert('Failed to fetch departments');
          }
        })
        .catch((err) => {
          console.log(err);
          alert('Error fetching departments');
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('password', employee.password);
    formData.append('education', employee.education);
    formData.append('experience', employee.experience);
    formData.append('department_id', employee.department_id);
    formData.append('salary', employee.salary);

    // Append the file
    const fileInput = document.querySelector('input[name="profilePicture"]');
    formData.append('profile_picture', fileInput.files[0]);

        axios.post('http://localhost:3000/auth/add_employee', employee)
        .then(result => console.log(result.data))
        .catch(err => console.log(err))
    }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            onChange={(e) => setEmployee({...employee, employeeId: e.target.value})}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            onChange={(e) => setEmployee({...employee, name: e.target.value})}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmployee({...employee, email: e.target.value})}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) => setEmployee({...employee, password: e.target.value})}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="education" className="block text-sm font-medium text-gray-700">Educational Qualification</label>
          <input
            type="text"
            name="education"
            onChange={(e) => setEmployee({...employee, education: e.target.value})}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Previous Experience</label>
          <input
            type="text"
            name="experience"
            onChange={(e) => setEmployee({...employee, experience: e.target.value})}
            className="w-full px-4 py-2 mt-1 border rounded-md"
          />
        </div>

        <div className="mb-4">
  <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
  <select
    name="department"
    id="department"
    onChange={(e) => setEmployee({...employee, department_id: e.target.value})}
    className="w-full px-4 py-2 mt-1 border rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500"
  >
    {departments.map((department) => (
      <option key={department.id} value={department.id}>
        {department.name}
      </option>
    ))}
  </select>
</div>

        <div className="mb-4">
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
          <input
            type="number"
            name="salary"
            onChange={(e) => setEmployee({...employee, salary: e.target.value})}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={(e) => setEmployee({...employee, profile_picture: e.target.value})}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
