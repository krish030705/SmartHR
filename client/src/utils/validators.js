const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates the login form. Returns an { field: message } object —
 * empty object means the form is valid. Kept framework-agnostic so it
 * can be reused (and unit tested) outside of React.
 */
export function validateLogin({ email, password }) {
  const errors = {}

  if (!email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}
