export const commands = {
    ADD_COURSE: 'ADD-COURSE-OFFERING',
    REGISTER: 'REGISTER',
    ALLOT_COURSE: 'ALLOT-COURSE',
};

export const commands_length = {
    ADD_COURSE: 5,
    REGISTER: 2,
    ALLOT_COURSE: 1,
};

export const prefixes = {
    COURSE_ID: 'OFFERING',
    REGISTRATION_ID: 'REG-COURSE',
};

export const errors = {
    INPUT_DATA: 'INPUT_DATA_ERROR',
    COURSE_EXISTS: 'INPUT_DATA_ERROR',
    COURSE_NOT_EXISTS: 'INPUT_DATA_ERROR'
};

export const response = {
    COURSE_REGISTER_SUCCESS: 'ACCEPTED',
    COURSE_REGISTER_FULL: 'COURSE_FULL_ERROR',
    COURSE_CANCELLED: 'COURSE_CANCELLED',
    ALLOT_SUCCESS: 'CONFIRMED',
};
