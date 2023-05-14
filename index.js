require('dotenv').config();

const figlet = require('figlet');
const inquirer = require('inquirer');
const questions = require('./Main/lib/questions.js');
const mysql = require('mysql2');
const Table = require('cli-table3');

const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
);

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


function getAllEmployees() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT e.id, e.first_name, e.last_name, r.title AS role, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN employee m ON e.manager_id = m.id
        `;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Create a new table with headers
                let table = new Table({
                    head: ['ID', 'First Name', 'Last Name', 'Role', 'Manager']
                });
                
                // Add each employee to the table
                for (let employee of results) {
                    table.push([employee.id, employee.first_name, employee.last_name, employee.role, employee.manager || 'None']);
                }
                
                // Print the table to the console
                console.clear();
                console.log(table.toString());

                resolve(results);
            }
        });
    });
}


figlet('Employee Manager', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    promptUser();
});

function promptUser() {    
    inquirer.prompt(questions).then((answers) => {
        
        
        if (answers.options === 'View All Roles') {
            getAllRoles().catch(console.error);
        }


        if (answers.options === 'View All Departments') {
            getAllDepartments().catch(console.error);
        }


        if (answers.options === 'View All Employees') {
            getAllEmployees().catch(console.error);
        }

        if (answers.options === 'Quit') {
            console.log('Goodbye!');
            process.exit();
        }

        promptUser();
    });
}


