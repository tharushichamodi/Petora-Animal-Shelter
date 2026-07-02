import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import './css/admin_dashboard.css';
import './css/add_employee_form.css';



function AdminDashboard() {
  const [employees, setEmployees] = useState([]);

    useEffect(() => {
    Axios.get('http://localhost:3001/employee/api/employees')
      .then((res) => {
        console.log('employees found:', res.data);
        setEmployees(res.data);
    })
      .catch((err) => {
        console.error('employees not found:', err);
        alert(err.response?.data?.message || 'Failed to fetch employees');
      });
  }, []); // runs once on mount


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [popupEmployee, setPopupEmployee] = useState(null);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const match = employees.find(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        setPopupEmployee(match);
      } else {
        alert('Employee not found');
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
  (emp.firstName ? emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) : false) &&
  (selectedDepartment === '' || emp.department === selectedDepartment) &&
  (selectedGender === '' || emp.gender === selectedGender) &&
  (selectedPosition === '' || emp.position === selectedPosition)
);

  // handle overlay
const[showOverlay, setShowOverlay] = useState(false)
const [addEmpForm, setAddEmpForm] = useState(false)

const handleAddEmployeeBtn = () =>{
  if(showOverlay){
    setShowOverlay(false) 
    setAddEmpForm(false)
  }
  else{
    setShowOverlay(true)
    setAddEmpForm(true)
  }
  
}

  const handleOverlayChange = () => {
    setShowOverlay(prev => !prev);
  };
const [allUsers, serAllUsers] = useState([]);
  const handleOnSubmit = async (newEmployee) => {
    try {
      // POST request to backend
      Axios.get('http://localhost:3001/user/api/users')
      .then((res) => {
        console.log('users found:', res.data);
        // Optional: store token or user in localStorage/session
        serAllUsers(res.data)
      })
      .catch((err) => {
        console.error('users not found:', err);
        alert(
          err.response?.data?.message || 'Invalid email or password'
        );
      });
      const matchedUser = allUsers.find(
      (user) =>
        user.userEmail === newEmployee.email &&
        user.password === newEmployee.password
      );

      if(matchedUser){
        newEmployee.userID = matchedUser.userID
      }

      const response = await Axios.post('http://localhost:3001/employee/api/employees', newEmployee);
      console.log('Employee added:', response.data);

      // Close form & overlay
      setAddEmpForm(false);
      setShowOverlay(false);

      // Optional: update local employees list (if stored in state)
      employees.push(response.data); // Only if employees array is in state, otherwise fetch fresh
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Check console.');
    }
  }
  return (
    <div className="AD dashboard_container">
      
    <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet"/>

    <div className={`overlay ${showOverlay ? "visible" : ""}`} onClick={() => setShowOverlay(false)}></div>


      <div className="filters">
        <input
          type="text"
          placeholder="Search employee name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />

        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          <option value="">All Departments</option>
          <option value="Veterinary">Veterinary</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>

        <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
          <option value="">All Positions</option>
          <option value="Specialist">Specialist</option>
          <option value="Manager">Manager</option>
          <option value="Accountant">Accountant</option>
          <option value="Assistant">Assistant</option>
        </select>
      </div>
      <div><button className='add_emp_btn' onClick={handleAddEmployeeBtn}><i className='fa-solid fa-plus-circle'></i>Add Employee</button></div>
      <div className="employee_card_container">
        {filteredEmployees.map((emp) => (
          <div className="employee_card" key={emp.empId}>
            <img className="emp_photo" src={`http://localhost:3001/uploads/${emp.profilePic.trim()}`} alt={emp.name} />
            <h3>{emp.name}</h3>
            <p><strong>ID:</strong> {emp.empID}</p>
            <p><strong>Email:</strong> {emp.email}</p>
            <p><strong>Department:</strong> {emp.department}</p>
            <p><strong>Gender:</strong> {emp.gender}</p>
            <p><strong>Position:</strong> {emp.role}</p>
          </div>
        ))}
      </div>

      {popupEmployee && (
        <div className="popup">
          <div className="popup_content">
            <span className="close_btn" onClick={() => setPopupEmployee(null)}>&times;</span>
            <img className="emp_photo_large" src={popupEmployee.photo} alt={popupEmployee.name} />
            <h2>{popupEmployee.name}</h2>
            <p><strong>ID:</strong> {popupEmployee.empId}</p>
            <p><strong>Email:</strong> {popupEmployee.email}</p>
            <p><strong>Department:</strong> {popupEmployee.department}</p>
            <p><strong>Gender:</strong> {popupEmployee.gender}</p>
            <p><strong>Position:</strong> {popupEmployee.position}</p>
          </div>
        </div>
      )}
      {setAddEmpForm && (
        <div className={`new_emp ${addEmpForm ? "visible" : ""}`} onClick={handleAddEmployeeBtn}>
          <AddEmpForm onClose={() => {setAddEmpForm(false); setShowOverlay(false); }} onSubmit={handleOnSubmit} />     
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

function AddEmpForm({onClose, onSubmit}){
   const [employeeData, setEmployeeData] = useState({
    userID:"",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
    birthday: "",
    gender: "",
    role: "",
    registrationNumber: "",
    contactNumber: "",
    address: "",
    salary: "",
    department: "",
    hireDate: "",
    profilePic: "",
    shift: "",
    shiftStart: "",
    shiftEnd: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEmployeeData({ ...employeeData, [name]: files[0] });
    } else {
      setEmployeeData({ ...employeeData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(employeeData);

  };

  return (
    
      <div className="AE_form" onClick={(e) => e.stopPropagation()}>
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="form_close_button"
            onClick={onClose}
          >
            <i className="fa-solid fa-close"></i>
          </button>
        </div>

        <h1 style={{ textAlign: "center" }}>Add New Employee</h1>

        <div className="form_group">
          <label htmlFor="AE_firstName">First Name</label>
          <input
            className="AE_input"
            type="text"
            name="firstName"
            id="AE_firstName"
            value={employeeData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_lastName">Last Name</label>
          <input
            className="AE_input"
            type="text"
            name="lastName"
            id="AE_lastName"
            value={employeeData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_email">Email</label>
          <input
            className="AE_input"
            type="email"
            name="email"
            id="AE_email"
            value={employeeData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_password">Password</label>
          <input
            className="AE_input"
            type="password"
            name="password"
            id="AE_password"
            value={employeeData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_userName">Username</label>
          <input
            className="AE_input"
            type="text"
            name="userName"
            id="AE_userName"
            value={employeeData.userName}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_birthday">Birthday</label>
          <input
            className="AE_input date"
            type="date"
            name="birthday"
            id="AE_birthday"
            value={employeeData.birthday}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_gender">Gender</label>
          <select
            className="AE_selection"
            name="gender"
            id="AE_gender"
            value={employeeData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form_group">
          <label htmlFor="AE_role">Role</label>
          <input
            className="AE_input"
            type="text"
            name="role"
            id="AE_role"
            value={employeeData.role}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_registrationNumber">Registration Number</label>
          <input
            className="AE_input"
            type="text"
            name="registrationNumber"
            id="AE_registrationNumber"
            value={employeeData.registrationNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_contactNumber">Contact Number</label>
          <input
            className="AE_input phone"
            type="text"
            name="contactNumber"
            id="AE_contactNumber"
            value={employeeData.contactNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_address">Address</label>
          <input
            className="AE_input"
            type="text"
            name="address"
            id="AE_address"
            value={employeeData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_salary">Salary</label>
          <input
            className="AE_input"
            type="number"
            name="salary"
            id="AE_salary"
            value={employeeData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_department">Department</label>
          <input
            className="AE_input"
            type="text"
            name="department"
            id="AE_department"
            value={employeeData.department}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_hireDate">Hire Date</label>
          <input
            className="AE_input date"
            type="date"
            name="hireDate"
            id="AE_hireDate"
            value={employeeData.hireDate}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label htmlFor="AE_profilePic">Profile Picture</label>
          <input
            className="AE_upload_photo"
            type="file"
            name="profilePic"
            id="AE_profilePic"
            onChange={handleChange}
          />
          <label htmlFor="AE_profilePic" className="AE_upload_label">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Profile Pic
          </label>
        </div>

        <div className="form_section submit_section">
          <button
            type="submit"
            className="AE_submit_btn"
            onClick={handleSubmit}
          >
            Add Employee
          </button>
        </div>
      </div>
    
  );
      
  
}