const ACTION = {
  VIEW: 0,
  UPDATE: 1,
  DELETE: 2, 
}

const ROLE = {
  USER: 0,
  SUPER_USER: 1,
  SYSTEM_USER: 2,
}

const FUNC = {
  LOGIN: -3,
  REGISTER: -2,
  LOGOUT: -1,
  ALL_COURSES: 0,
  SELF_COURSES: 1,
  SUBJECTS: 2,
  USERS: 3,
  SUGGEST: 4
}

export {ACTION, ROLE, FUNC}