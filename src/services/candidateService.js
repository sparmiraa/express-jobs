import { Candidate } from "../models/Candidate.js";

class CandidateService {
  async createEmpty(userId, transaction) {
    return Candidate.create(
      {
        user_id: userId,
      },
      { transaction }
    );
  }
}

export default new CandidateService()