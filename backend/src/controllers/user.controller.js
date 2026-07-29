import * as userService from '../services/user.service.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.user.userId);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await userService.updateProfile(req.user.userId, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
