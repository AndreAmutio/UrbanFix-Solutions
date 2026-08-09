import * as userService from '../services/user.service.js';

// ============ PERFIL ============

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await userService.getProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const data = req.body;
    const profile = await userService.updateProfile(userId, data);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// ============ IMAGEN ============

export const updateProfileImage = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Multer ya procesó la imagen y la subió a Cloudinary
    // La información está en req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const imageUrl = req.file.path; // URL de Cloudinary
    const imagePublicId = req.file.filename; // Public ID de Cloudinary

    const profile = await userService.updateProfileImage(
      userId,
      imageUrl,
      imagePublicId,
    );
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await userService.removeProfileImage(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// ============ PERFIL COMPLETO CON SOLICITUDES (CLIENTE) ============

export const getClientProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await userService.getClientProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// ============ PERFIL COMPLETO CON TRABAJOS (TÉCNICO) ============

export const getTechnicianProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await userService.getTechnicianProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getTechnicians = async (req, res, next) => {
  try {
    const technicians = await userService.getTechnicians();
    res.status(200).json(technicians);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(Number(id));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
