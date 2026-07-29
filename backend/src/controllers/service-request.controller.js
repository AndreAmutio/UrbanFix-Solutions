import * as serviceRequestService from '../services/service-request.service.js';

export const create = async (req, res, next) => {
  try {
    const solicitud = await serviceRequestService.create(req.user.userId, req.body);
    res.status(201).json(solicitud);
  } catch (err) {
    next(err);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const solicitudes = await serviceRequestService.getMyRequests(req.user.userId);
    res.status(200).json(solicitudes);
  } catch (err) {
    next(err);
  }
};

export const getAvailable = async (req, res, next) => {
  try {
    const solicitudes = await serviceRequestService.getAvailable();
    res.status(200).json(solicitudes);
  } catch (err) {
    next(err);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const solicitudes = await serviceRequestService.getMyJobs(req.user.userId);
    res.status(200).json(solicitudes);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const solicitud = await serviceRequestService.getById(req.params.id);
    res.status(200).json(solicitud);
  } catch (err) {
    next(err);
  }
};

export const accept = async (req, res, next) => {
  try {
    const solicitud = await serviceRequestService.accept(req.params.id, req.user.userId);
    res.status(200).json(solicitud);
  } catch (err) {
    next(err);
  }
};

export const reject = async (req, res, next) => {
  try {
    const solicitud = await serviceRequestService.reject(req.params.id, req.user.userId);
    res.status(200).json(solicitud);
  } catch (err) {
    next(err);
  }
};
