// Express 4 doesn't catch rejected promises from async route handlers on
// its own — wrap every async controller with this so thrown errors reach
// the centralized error handler in server.js instead of crashing.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}