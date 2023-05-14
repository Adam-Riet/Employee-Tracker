require('dotenv').config();

const figlet = require('figlet');
const inquirer = require('inquirer');
const questions = require('./Main/lib/questions.js');
const mysql = require('mysql2');

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
        const sql = `SELECT * FROM role`;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                console.table(results);
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
                console.table(results);
                resolve(results);
            }
        });
    });
}

function getAllEmployees() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM employee`;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                console.table(results);
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


