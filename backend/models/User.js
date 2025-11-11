const db = require('../config/database');

class User {
  static async create(userData) {
    const [user] = await db('users')
      .insert({
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName,
        phone: userData.phone,
        preferred_currency: userData.preferredCurrency,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning(['id', 'email', 'full_name as fullName', 'phone', 'preferred_currency as preferredCurrency']);
    
    return user;
  }

  static async findByEmail(email) {
    const user = await db('users')
      .select('id', 'email', 'password', 'full_name as fullName', 'phone', 'preferred_currency as preferredCurrency')
      .where('email', email)
      .first();
    
    return user;
  }

  static async findById(id) {
    const user = await db('users')
      .select('id', 'email', 'full_name as fullName', 'phone', 'preferred_currency as preferredCurrency')
      .where('id', id)
      .first();
    
    return user;
  }

  static async update(id, userData) {
    const [user] = await db('users')
      .where('id', id)
      .update({
        ...userData,
        updated_at: new Date()
      })
      .returning(['id', 'email', 'full_name as fullName', 'phone', 'preferred_currency as preferredCurrency']);
    
    return user;
  }
}

module.exports = User;