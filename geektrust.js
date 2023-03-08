// const fs = require("fs");
import fs from 'fs';
import { Courses } from './Courses.js';
import { commands } from './constants.js';

const courses = new Courses();

const filename = process.argv[2]

fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw new Error('Unable to read file ', filename);

    const input_lines = data.toString().split("\n");
    // Add your code here to process input commands

    for (const line of input_lines) {
        const input = line.split(' ');

        switch (input[0]) {
            case commands.ADD_COURSE:
                console.log(courses.createCourse(input.slice(1)));
                break;
            case commands.REGISTER:
                console.log(courses.registerCourse(input.slice(1)));
                break;
            default:
                throw new Error(`Invalid command ${input[0]}. Try again!`);
        }
    }
})
