/**
 * Auth service.
 *
 * Phase 1 status: mocked so the three login pages have real loading/error/
 * success behavior to build and test against. Phase 4 replaces the body of
 * `login()` with an axios POST to /api/auth/login (JWT + role check) — the
 * function signature and return shape below are designed to stay the same,
 * so no page-level code should need to change when that happens.
 */

const MOCK_LATENCY_MS = 700

/**
 * @param {{ email: string, password: string, role: 'admin'|'manager'|'employee' }} credentials
 * @returns {Promise<{ token: string, user: { email: string, role: string } }>}
 */
export async function login({ email, password, role }) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))

  // Simple placeholder rule so the "wrong password" error path is testable
  // right now, before the real backend exists.
  if (password.length < 6) {
    const error = new Error('Invalid email or password.')
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  return {
    token: 'mock-jwt-token',
    user: { email, role },
  }
}
