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
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
);

function getAllRoles() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM role`;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
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
                resolve(results);
            }
        });
    });
}

function getAllDepartments() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM employee`;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
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

    inquirer.prompt(questions).then((answers) => {
        if (answers.options === 'View All Roles') {
            getAllRoles().then(roles => {
                console.log(roles);
            }).catch(err => {
                console.error(err);
            });
        } else {
            console.log(JSON.stringify(answers, null, '  '));
        }
        if (answers.options === 'View All Departments') {
            getAllDepartments().then(departments => {
                console.log(departments);
            }).catch(err => {
                console.error(err);
            });
        } else {
            console.log(JSON.stringify(answers, null, '  '));
        }
        if (answers.options === 'View All Employees') {
            getAllDepartments().then(departments => {
                console.log(departments);
            }).catch(err => {
                console.error(err);
            });
        } else {
            console.log(JSON.stringify(answers, null, '  '));
        }
    });
});

