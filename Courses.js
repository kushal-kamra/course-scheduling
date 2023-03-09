import { commands_length, prefixes, errors, response, status, EMAIL_LENGTH } from './constants.js';
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
        if (registration_details.length === commands_length.REGISTER) {
            return true;
        }

        return false;
    }

    validateAllotmentInput(allotment_details) {
        if (allotment_details.length === commands_length.ALLOT_COURSE) {
            return true;
        }

        return false;
    }

    validateCancellationInput(cancellation_details) {
        if (cancellation_details.length === commands_length.CANCELLATION) {
            return true;
        }

        return false;
    }

    validateRegisterEmail(email) {
        if (email.split('@').length === EMAIL_LENGTH) {
            return true;
        }

        return false;
    }

    validateCourseFull(course) {
        if (course.registrations.length >= course.max_empl) {
            return true;
        }

        return false;
    }

    validateCourseCancelled(course) {
        // if (course.status !== status.ALLOT_PENDING || !compareTodayDate(course.starting_date)) {
        if (course.status !== status.ALLOT_PENDING) {
            return true;
        }

        return false;
    }

    validateAllotmentCourseCancelled(course) {
        // if (course.status !== status.ALLOT_PENDING || !compareTodayDate(course.starting_date) || course.registrations.length < course.min_empl) {
        if (course.status !== status.ALLOT_PENDING || course.registrations.length < course.min_empl) {
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
        new_course.is_alloted = false;
        new_course.registrations = [];
        new_course.status = status.ALLOT_PENDING;

        new_course.id = `${prefixes.COURSE_ID}-${new_course.name}-${new_course.instructor}`;

        return new_course;
    }

    createRegisterObj(registration_details, course) {
        const new_registration = {};

        new_registration.email = registration_details[0];
        new_registration.course_id = registration_details[1];
        new_registration.empl_name = new_registration.email.split('@')[0];
        new_registration.status = status.ALLOT_PENDING;

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
            return errors.COURSE_NOT_EXISTS;
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
        course.registrations.push(id);
        this.courses.set(registration_details[1].trim(), course);
        return (`${id} ${response.COURSE_REGISTER_SUCCESS}`);
    }

    allotCourse(allotment_details) {
        if (!this.validateAllotmentInput(allotment_details)) {
            return errors.INPUT_DATA;
        }

        const course_id = allotment_details[0].trim();
        const course = this.courses.get(course_id);
        let course_cancelled = false;
        let registrations_list = [];

        if (!course) {
            return errors.INPUT_DATA;
        } else {
            //validate course cancelled
            if (this.validateAllotmentCourseCancelled(course)) {
                course_cancelled = true;
            }

            course.status = course_cancelled ? response.COURSE_CANCELLED : status.ALLOT_SUCCESS;
            this.courses.set(course_id, course);

            course.registrations.sort((a, b) => {
                return a < b ? -1 : (a > b) ? 1 : 0
            });

            course.registrations.forEach(id => {
                const registration = this.registrations.get(id);
                if (registration.status === status.ALLOT_PENDING) {
                    const course_status = course_cancelled ? response.COURSE_CANCELLED : status.ALLOT_SUCCESS;

                    let allotment_output = `${id} ${registration.email} ${registration.course_id} ${course.name} ${course.instructor} ${course.starting_date} ${course_status}`;
                    registrations_list.push(allotment_output);
                }
            });
        }

        return registrations_list;
    }

    cancelCourse(cancellation_details) {
        if (!this.validateCancellationInput(cancellation_details)) {
            return errors.INPUT_DATA;
        }

        const registration_id = cancellation_details[0].trim();
        const registration = this.registrations.get(registration_id);
        const course = this.courses.get(registration.course_id);

        if ((course.status === response.COURSE_CANCELLED || course.status === status.ALLOT_SUCCESS) && registration.status == status.ALLOT_PENDING) {
            registration.status = status.CANCEL_REJECTED;
            return `${registration_id} ${status.CANCEL_REJECTED}`;
        } else if (course.status === status.ALLOT_PENDING) {
            registration.status = status.CANCEL_SUCCESS;
        }

        this.registrations.set(registration_id, registration);
        return `${registration_id} ${status.CANCEL_SUCCESS}`;
    }
}