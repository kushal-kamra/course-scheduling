import { commands_length, prefixes, errors } from './constants.js';

export class Courses {
    constructor() {
        this.courses = new Map();
    }

    validateCourse(course_details) {
        if (course_details.length === commands_length.ADD_COURSE) {
            return true
        }

        return false;
    }

    createCourseObj(course_details) {
        const new_course = {};

        new_course.name = course_details[0];
        new_course.instructor = course_details[1];
        new_course.starting_date = course_details[2];
        new_course.min_empl = course_details[3];
        new_course.max_empl = course_details[4];

        new_course.id = `${prefixes.COURSE_ID}-${new_course.name}-${new_course.instructor}`;

        return new_course;
    }

    createCourse(course_details) {
        if (!this.validateCourse(course_details)) {
            return errors.INPUT_DATA;
        }

        const { id, ...value } = this.createCourseObj(course_details);
        console.log('id', id);
        console.log('value', value);
        this.courses.set(id, value);
        return id;
    }

}