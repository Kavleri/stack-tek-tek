const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: 'Anda tidak memiliki izin untuk mengakses endpoint ini.' });
  }

  next();
};

module.exports = { authorizeRoles };