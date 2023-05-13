//Series of questions to be exported into an inquirer prompt. 
const inquirer = require('inquirer');

const questions = [
  {
    type: 'list',
    name: 'options',
    message: 'What would you like to do?',
    choices: ['Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Employees', 'Add Department', 'View All Departments', 'Quit']
  },
  // Questions for adding an employee
  {
    type: 'input',
    name: 'addEmployee',
    message: 'Please enter the name of the employee you would like to add.',
    when: (answers) => answers.options === 'Add Employee',
    validate: function (input) {
      if (input.length <= 30) {
        return true;
      }
      return 'The input must be 30 characters or less.';
    },
  },
  {
    type: 'input',
    name: 'employeeRole',
    message: 'Please enter the role of the employee you would like to add.',
    when: (answers) => !!answers.addEmployee,
    validate: function (input) {
      if (input.length <= 30) {
        return true;
      }
      return 'The input must be 30 characters or less.';
    },
  },
  // Questions for updating an employee's role
  {
    type: 'input',
    name: 'updateEmployee',
    message: 'Please enter the name of the employee whose role you would like to update.',
    when: (answers) => answers.options === 'Update Employee Role',
    validate: function (input) {
      if (input.length <= 30) {
        return true;
      }
      return 'The input must be 30 characters or less.';
    },
  },
  {
    type: 'input',
    name: 'newRole',
    message: 'Please enter the new role for this employee.',
    when: (answers) => !!answers.updateEmployee,
    validate: function (input) {
      if (input.length <= 30) {
        return true;
      }
      return 'The input must be 30 characters or less.';
    },
  },
  // Questions for adding a role
  {
    type: 'input',
    name: 'addRole',
    message: 'Please enter the name of the role you would like to add.',
    when: (answers) => answers.options === 'Add Role',
    validate: function (input) {
      if (input.length <= 30) {
        return true;
      }
      return 'The input must be 30 characters or less.';
    },
  },
  // Questions for adding a department
  {
    type: 'input',
    name: 'addDepartment',
    message: 'Please enter the name of the department you would like to add.',
    when: (answers) => answers.options === 'Add Department',
    validate: function (input) {
      if (input.length <= 30) {
        return true;
      }
      return 'The input must be 30 characters or less.';
    },
  },
];

module.exports = questions;

