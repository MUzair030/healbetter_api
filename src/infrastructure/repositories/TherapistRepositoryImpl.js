import Therapist from '../../domain/models/Therapist.js';
import TherapistRepository from "../../domain/repositories/TherapistRepository.js";

class TherapistRepositoryImpl extends TherapistRepository {
  async findById(id) {
    return Therapist.findOne({ _id: id });
  }

  async findByEmail(email) {
    return Therapist.findOne({ email });
  }

  async findByGoogleId(googleId) {
    return Therapist.findOne({ googleId });
  }

  async findAll() {
    return Therapist.find();
  }

  async save(user) {
    const newUser = new Therapist(user);
    return newUser.save();
  }

  async update(user) {
    try {
      const updatedUser = await Therapist.findByIdAndUpdate(user._id, user, { new: true, runValidators: true });
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async findByIdAndUpdate(id, updatedData) {
    try {
      return await Therapist.findByIdAndUpdate(id, {$set: updatedData}, {new: true, runValidators: true});
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async searchTherapists(query, skip = 0, limit = 10){
    try {
      if (skip || limit) {
        return await Therapist.find(query)
            .skip(skip)
            .limit(limit);
      } else {
        return await Therapist.countDocuments(query);
      }
    } catch (err) {
      console.error(err);
      throw new Error('Error while fetching therapists from the database');
    }
  };
}

export default TherapistRepositoryImpl;
