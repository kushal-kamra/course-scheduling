import { commands_length, prefixes, errors, response } from './constants.js';
import { compareTodayDate } from './utils.js';

export class Courses {
    constructor() {
        this.courses = new Map();
        this.registrations = new Map();
    }

    validateCourseInput(course_details) {
        if (course_details.length === commands_length.ADD_COURSE) {
            return true;
        }

        return false;
    }

    validateRegistrationInput(registration_details) {
        if (registration_details.length === commands_length.REGISTER_COURSE) {
            return true;
        }

        return false;
    }

    validateRegisterEmail(email) {
        if (email.split('@').length === 2) {
            return true;
        }

        return false;
    }

    validateCourseFull(course) {
        if (course.booked_seats >= course.max_empl) {
            return true;
        }

        return false;
    }

    validateCourseCancelled(course) {
        if (course.booked_seats < course.min_empl && !compareTodayDate(course.starting_date)) {
            return true;
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
        new_course.booked_seats = 0;
        new_course.is_alloted = false;

        new_course.id = `${prefixes.COURSE_ID}-${new_course.name}-${new_course.instructor}`;

        return new_course;
    }

    createRegisterObj(registration_details, course) {
        const new_registration = {};

        new_registration.email = registration_details[0];
        new_registration.course_id = registration_details[1];
        new_registration.empl_name = new_registration.email.split('@')[0];

        new_registration.id = `${prefixes.REGISTRATION_ID}-${new_registration.empl_name}-${course.name}`;

        return new_registration;
    }

    createCourse(course_details) {
        if (!this.validateCourseInput(course_details)) {
            return errors.INPUT_DATA;
        }

        const { id, ...value } = this.createCourseObj(course_details);

        if (this.courses.get(id)) {
            return errors.COURSE_EXISTS;
        }

        this.courses.set(id, value);
        return id;
    }

    registerCourse(registration_details) {
        if (!this.validateRegistrationInput(registration_details)) {
            return errors.INPUT_DATA;
        }

        //validate email
        if (!this.validateRegisterEmail(registration_details[0])) {
            return errors.INPUT_DATA;
        }

        //validate course exists
        const course = this.courses.get(registration_details[1].trim());

        if (!course) {
            return errors.INPUT_DATA;
        } else {
            //validate course full
            if (this.validateCourseFull(course)) {
                return response.COURSE_REGISTER_FULL;
            }
            
            //validate course cancelled
            if (this.validateCourseCancelled(course)) {
                return response.COURSE_CANCELLED;
            }
        }

        const { id, ...value } = this.createRegisterObj(registration_details, course);
        this.registrations.set(id, value);
        return (`${id} ${response.COURSE_REGISTER_SUCCESS}`);
    }
}