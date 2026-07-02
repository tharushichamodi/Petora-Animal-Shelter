
const Employee = require('./employee_model.js');

exports.getAllEmployees = async (req,res) => {
  try {

    const employees = await Employee.find();
    if (!employees || employees.length === 0) return res.status(404).json({ error: 'No employee found' });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    
    // const employee = await Employee.findById(req.params.id);

    const employee = await Employee.findOne({ userID: Number(req.params.userID) });

    if (!employee) return res.status(404).json({ error: 'Employee not found' });


    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.addEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body); // Assumes req.body has all required fields
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteEmployeeById = async (req, res) => {
  try {
    const deletedEmp = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmp) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
