import * as adminService from '../services/admin.service.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getAllRequests = async (req, res, next) => {
  try {
    const solicitudes = await adminService.getAllRequests(req.query);
    res.status(200).json(solicitudes);
  } catch (err) {
    next(err);
  }
};

export const changeRequestStatus = async (req, res, next) => {
  try {
    const solicitud = await adminService.changeRequestStatus(
      req.params.id,
      req.body.status,
    );
    res.status(200).json(solicitud);
  } catch (err) {
    next(err);
  }
};
