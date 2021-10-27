const inquirer = require('inquirer');

const namaHewan = [
    { hewan: 'Anjing', makanan: 'Tulang' },
    { hewan: 'kucing', makanan: 'ikan' },
    { hewan: 'kambing', makanan: 'rumput' }
]

inquirer.registerPrompt('selectLine', require('inquirer-select-line'));
inquirer.prompt([{
    type: 'selectLine',
    message: 'Where add line?',
    name: 'line',
    choices: namaHewan.map(topping => ({ name: topping.hewan, value: topping })),
}]).then(function (answers) {
    console.log('Chosen line: ' + answers.line);
    console.log(answers)
});