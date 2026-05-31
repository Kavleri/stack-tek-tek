function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;

    if (!userRole) {
      return res.status(403).json({ message: 'Role pengguna tidak ditemukan.' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Anda tidak memiliki izin untuk mengakses endpoint ini.' });
    }

    return next();
  };
}

module.exports = {
  authorizeRoles,
};