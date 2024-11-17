const Activity = require('../models/Activity');

const logActivity = async (user, type, description, metadata = {}) => {
  try {
    await Activity.create({
      user: user._id,
      type,
      description,
      metadata
    });
  } catch (error) {
    console.error('Activity logging failed:', error);
  }
};

module.exports = logActivity;
