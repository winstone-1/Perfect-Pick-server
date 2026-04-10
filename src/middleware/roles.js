export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  res.status(403).json({ message: 'Not authorized as admin' })
}

export const managerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'manager')) return next()
  res.status(403).json({ message: 'Not authorized' })
}