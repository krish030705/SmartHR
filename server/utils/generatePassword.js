// Generates a random temporary password for a newly created employee
// account (there's no signup form — Admin creates accounts). Shown once
// in the API response so Admin can share it with the new hire.
export function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 10; i += 1) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${password}!1`
}