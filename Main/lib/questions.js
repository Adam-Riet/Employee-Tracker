//Series of questions to be exported into an inquierer prompt. 
 
const questions = [
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: ['Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Employees', 'Add Department', 'View All Departments', 'Quit']
    },
    {
      type: 'input',
      name: 'shapesColor',
      message: 'What color would you like your shape?'
    },
    {
      type: 'input',
      name: 'text',
      message: 'Please enter text you want on your logo (Up to 3 characters)',
      //Must be 3 characters or less. 
      validate: function (input) {
        if (input.length <= 3) {
          return true;
        }
        return 'The input must be 3 characters or less.';
      },
    },
    {
      type: 'input',
      name: 'textColor',
      message: 'What color would you text?'
    },
  ];

module.exports = questions;