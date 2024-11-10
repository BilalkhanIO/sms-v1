const { PERMISSIONS } = require('../utils/permissions');

const hasPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (!PERMISSIONS[requiredPermission]?.includes(userRole)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    next();
  };
};

module.exports = { hasPermission }; 