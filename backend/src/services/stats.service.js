import statsRepository from '../repositories/stats.repository.js';

class StatsService {
  async getStatistics() {
    return await statsRepository.getStatistics();
  }
}

export default new StatsService();
