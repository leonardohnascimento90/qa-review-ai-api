function authorizeRole(userRole, allowedRoles = []) {
  return allowedRoles.includes(userRole);
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !authorizeRole(req.user.role, allowedRoles)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Sem permissão para acessar esta funcionalidade.', details: [] } });
    }
    next();
  };
}

module.exports = { authorizeRole, requireRole };
