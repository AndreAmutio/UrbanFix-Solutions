import * as serviceRequestService from '../services/serviceRequest.service.js';

// ============ CLIENTE ============

export const createServiceRequest = async (req, res, next) => {
  try {
    const clienteId = req.user.userId;
    const data = req.body;
    const request = await serviceRequestService.createServiceRequest(
      clienteId,
      data,
    );
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getClientRequests = async (req, res, next) => {
  try {
    const clienteId = req.user.userId;
    const requests = await serviceRequestService.getClientRequests(clienteId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

// ============ TÉCNICO ============

export const getAvailableRequests = async (req, res, next) => {
  try {
    const { category } = req.query;
    const requests = await serviceRequestService.getAvailableRequests(category);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const tecnicoId = req.user.userId;
    const { id } = req.params;
    const request = await serviceRequestService.acceptRequest(
      tecnicoId,
      Number(id),
    );
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const tecnicoId = req.user.userId;
    const { id } = req.params;

    const request = await serviceRequestService.rejectRequest(
      tecnicoId,
      Number(id),
    );

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const getTechnicianJobs = async (req, res, next) => {
  try {
    const tecnicoId = req.user.userId;
    const jobs = await serviceRequestService.getTechnicianJobs(tecnicoId);
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// ============ TODOS (CLIENTE, TÉCNICO, ADMIN) ============

export const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await serviceRequestService.getRequestById(Number(id));
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

export const getAllRequests = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;

    const requests = await serviceRequestService.getAllRequests(filters);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const request = await serviceRequestService.updateRequestStatus(
      Number(id),
      status,
    );
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

// ============ IMAGEN (CLOUDINARY) ============

export const updateRequestImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const imageUrl = req.file.path;
    const imagePublicId = req.file.filename;

    const request = await serviceRequestService.updateRequestImage(
      Number(id),
      imageUrl,
      imagePublicId,
    );
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const removeRequestImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await serviceRequestService.removeRequestImage(Number(id));
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};
