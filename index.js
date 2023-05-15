require('dotenv').config();

//Dependencies
const figlet = require('figlet');
const inquirer = require('inquirer');
const questions = require('./Main/lib/questions.js');
const mysql = require('mysql2');
const Table = require('cli-table3');

//Connect to the database
const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
);

//Function to get all roles
function getAllRoles() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT r.id, r.title, r.salary, d.name AS department
            FROM role r
            LEFT JOIN department d ON r.department_id = d.id
        `;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Create a new table with headers
                let table = new Table({
                    head: ['ID', 'Title', 'Salary', 'Department']
                });
                
                // Add each role to the table
                for (let role of results) {
                    table.push([role.id, role.title, role.salary, role.department]);
                }
                
                // Print the table to the console
                console.clear();
                console.log(table.toString());

                resolve(results);
            }
        });
    });
}

//Function to get all departments
function getAllDepartments() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM department`;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Create a new table with headers
                let table = new Table({
                    head: ['ID', 'Name']
                });
                
                // Add each department to the table
                for (let department of results) {
                    table.push([department.id, department.name]);
                }
                
                // Print the table to the console
                console.clear();
                console.log(table.toString());

                resolve(results);
            }
        });
    });
}

//Function to get all employees
function getAllEmployees() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT e.id, e.first_name, e.last_name, r.title AS role, CONCAT(m.first_name, ' ', m.last_name) AS manager, d.name AS department, r.salary
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
        `;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Create a new table with headers
                let table = new Table({
                    head: ['ID', 'First Name', 'Last Name', 'Role', 'Manager', 'Department', 'Salary']
                });
                
                // Add each employee to the table
                for (let employee of results) {
                    table.push([employee.id, employee.first_name, employee.last_name, employee.role, employee.manager || 'None', employee.department, employee.salary]);
                }
                
                // Print the table to the console
                console.clear();
                console.log(table.toString());
                
                resolve(results);
            }
        });
    });
}

function addEmployee(firstName, lastName, role, manager) {
    return new Promise((resolve, reject) => {
        const sqlForRoleAndManager = `
            SELECT (SELECT id FROM role WHERE title = ?) as role_id, 
                   (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?) as manager_id
        `;
        db.query(sqlForRoleAndManager, [role, manager], (err, results) => {
            if (err) {
                reject(err);
            } else {
                const roleId = results[0].role_id;
                const managerId = results[0].manager_id;
                
                const sqlForInsert = `
                    INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(sqlForInsert, [firstName, lastName, roleId, managerId], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
}

function updateEmployeeRole(role, employee) {
    return new Promise((resolve, reject) => {
        const sqlForNameandrole = `
            SELECT (SELECT id FROM role WHERE title = ?) as role_id,
                   (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?) as employee_id
        `;
        db.query(sqlForNameandrole, [role, employee], (err, results) => {
            if (err) {
                reject(err);
            } else {
                const roleId = results[0].role_id;
                const employeeId = results[0].employee_id;
                
                const sqlForUpdate = `
                    UPDATE employee 
                    SET role_id = ? 
                    WHERE id = ?
                `;
                db.query(sqlForUpdate, [roleId, employeeId], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
}

function addRole(title, salary, department) {
    return new Promise((resolve, reject) => {
        const sqlForDepartment = `
            SELECT id FROM department WHERE name = ?
        `;
        db.query(sqlForDepartment, [department], (err, results) => {
            if (err) {
                console.log("Error selecting department id:", err);
                reject(err);
            } else {
                if (results.length === 0) {
                    console.log(`No department found with name ${department}`);
                    return;
                }

                const departmentId = results[0].id;
                
                const sqlForInsert = `
                    INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)
                `;
                db.query(sqlForInsert, [title, salary, departmentId], (err, results) => {
                    if (err) {
                        console.log("Error inserting role:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
}





//Function to display the title of the application
figlet('Employee Manager', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    promptUser();
});

//Function to prompt the user with questions
function promptUser() {    
    inquirer.prompt(questions).then((answers) => {
        
        //Will display all roles in the database
        if (answers.options === 'View All Roles') {
            getAllRoles().catch(console.error);
        }

        //Will display all departments in the database
        if (answers.options === 'View All Departments') {
            getAllDepartments().catch(console.error);
        }

        //Will display all employees in the database
        if (answers.options === 'View All Employees') {
            getAllEmployees().catch(console.error);
        }

        if (answers.options === 'Add Employee') {
            addEmployee(answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager)
                .then(() => console.log('Employee added successfully!'))
                .catch(console.error);
        }

        if (answers.options === 'Update Employee Role') {
            updateEmployeeRole(answers.employeeRole, answers.employee)
                .then(() => console.log('Employee role updated successfully!'))
                .catch(console.error);
        }

        if (answers.options === 'Add Role') {
            addRole(answers.roleTitle, answers.roleSalary, answers.roleDepartment)
                .then(() => console.log('Role added successfully!'))
                .catch(console.error);
        }

        //Will quit the application
        if (answers.options === 'Quit') {
            console.log('Goodbye!');
            process.exit();
        }

        promptUser();
    });
}


