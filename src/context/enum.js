const ACTION = {
  VIEW: 0,
  UPDATE: 1,
  DELETE: 2, 
}

const ROLE = {
  LEARNER: 0,
  PROVIDER: 1,
  APPROVER: 2,
  SYSTEM: 3,
}

const FUNC = {
  LOGIN: -3,
  REGISTER: -2,
  LOGOUT: -1,
  ALL_COURSES: 0,
  SELF_COURSES: 1,
  SUBJECTS: 2,
  ADMINS: 3,
  COURSE_SOURCE: 4,
  SUGGEST: 5,
  NOTIC: 6
}

const COURSE_STATUS = {
  N0: -2,
  BLOCK: -1,
  WAIT: 0,
  ALOW: 1
}

export {ACTION, ROLE, FUNC, COURSE_STATUS}