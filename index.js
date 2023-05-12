const figlet = require('figlet');
const inquirer = require('inquirer');
const questions = require('./Main/lib/questions.js');

figlet('Employee Manager', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)

    
    inquirer.prompt(questions).then((answers) => {
        console.log(JSON.stringify(answers, null, '  '));
    });
});
