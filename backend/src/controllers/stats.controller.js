import statsService from '../services/stats.service.js';

export const getStatistics = async (req, res, next) => {
  try {
    const statistics = await statsService.getStatistics();
    res.status(200).json(statistics);
  } catch (err) {
    next(err);
  }
};
