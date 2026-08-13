const PHONE_RE = /^[0-9+-\s()]{7,15}$/

export const validateLogin = (form) => {
  const errors = {}

  if (!form?.email?.trim()) {
    errors.email = 'Email is required'
  }

  if (!form?.password?.trim()) {
    errors.password = 'Password is required'
  }

  return errors
}

export function validateEmployee({
  name,
  email,
  phone,
  department,
  position,
  joiningDate,
  salary,
}) {
  const errors = {}

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!name?.trim()) {
    errors.name = 'Name is required.'
  }

  if (!email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!phone?.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!PHONE_RE.test(phone.trim())) {
    errors.phone = 'Enter a valid phone number.'
  }

  if (!department) {
    errors.department = 'Department is required.'
  }

  if (!position?.trim()) {
    errors.position = 'Position is required.'
  }

  if (!joiningDate) {
    errors.joiningDate = 'Joining date is required.'
  }

  if (salary === '' || salary === undefined || salary === null) {
    errors.salary = 'Salary is required.'
  } else if (Number(salary) < 0) {
    errors.salary = 'Salary cannot be negative.'
  }

  return errors
}

