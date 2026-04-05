

const { IUserRepository } = require('../../domain/repositories/IRepositories');
const User = require('../../domain/entities/User');
const UserModel = require('../database/models/UserModel');

class MongoUserRepository extends IUserRepository {
  async create(user) {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status
    });

    const savedUser = await userDoc.save();
    return this.toDomain(savedUser);
  }

  async findById(id) {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;
    return this.toDomain(userDoc);
  }

  async findByEmail(email) {
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
    if (!userDoc) return null;
    return this.toDomain(userDoc);
  }

  async findAll(filters = {}) {
    const query = {};
    
    if (filters.role) {
      query.role = filters.role;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const userDocs = await UserModel.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 100);

    return userDocs.map(doc => this.toDomain(doc));
  }

  async update(id, userData) {
    const updateData = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      updatedAt: new Date()
    };

    if (userData.password) {
      updateData.password = userData.password;
    }

    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!userDoc) throw new Error('User not found');
    return this.toDomain(userDoc);
  }

  async delete(id) {
    const result = await UserModel.findByIdAndDelete(id);
    if (!result) throw new Error('User not found');
    return true;
  }

  async count(filters = {}) {
    const query = {};
    
    if (filters.role) {
      query.role = filters.role;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }

    return await UserModel.countDocuments(query);
  }

  // Convert MongoDB document to Domain Entity
  toDomain(userDoc) {
    return new User({
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role,
      status: userDoc.status,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    });
  }
}

module.exports = MongoUserRepository;
