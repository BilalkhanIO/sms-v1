import AuditLog from '../models/AuditLog.js';
import asyncHandler from 'express-async-handler';

export const logActivity = (action, entity, entityIdField = 'id') =>
  asyncHandler(async (req, res, next) => {
    // Let the route handler execute first
    res.on('finish', async () => {
      try {
        const userId = req.user?._id;
        const schoolId = req.user?.school;
        const ipAddress = req.ip;

        if (!userId) {
          // Cannot log if user is not identified
          return;
        }

        let entityId = null;
        if (req.params && req.params[entityIdField]) {
            entityId = req.params[entityIdField];
        } else if (res.locals.entityId) {
            // Some controllers might pass the new entity ID in res.locals
            entityId = res.locals.entityId;
        }


        const logData = {
          user: userId,
          school: schoolId,
          action,
          entity,
          entityId,
          status: res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILURE',
          details: `User ${req.user.email} performed action: ${action} on ${entity}`,
          ipAddress,
        };

        await AuditLog.create(logData);
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
    });

    next();
  });
