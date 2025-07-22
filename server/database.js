// Alternative: Local SQLite database setup for development
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

export async function initializeDatabase() {
  if (db) return db;

  try {
    // Open SQLite database
    db = await open({
      filename: path.join(process.cwd(), 'volunteer_platform.db'),
      driver: sqlite3.Database
    });

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        skills TEXT DEFAULT '[]',
        interests TEXT DEFAULT '[]',
        location TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        joined_date TEXT DEFAULT CURRENT_TIMESTAMP,
        profile_image TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        location_lat REAL,
        location_lng REAL,
        location_address TEXT NOT NULL,
        category TEXT NOT NULL,
        volunteers_needed INTEGER DEFAULT 0,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        organizer TEXT NOT NULL,
        requirements TEXT DEFAULT '[]',
        image TEXT DEFAULT '',
        created_by TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        sender_id TEXT,
        receiver_id TEXT,
        content TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS volunteer_registrations (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        service_id TEXT,
        registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (service_id) REFERENCES services(id),
        UNIQUE(user_id, service_id)
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
      CREATE INDEX IF NOT EXISTS idx_services_date ON services(date);
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    await initializeDatabase();
  }
  return db;
}

// Database service functions
export const dbService = {
  // User operations
  async createUser(userData) {
    const db = await getDatabase();
    const { id, name, email, password, skills, interests, location, phone, profile_image } = userData;
    
    return await db.run(
      `INSERT INTO users (id, name, email, password, skills, interests, location, phone, profile_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email, password, JSON.stringify(skills || []), JSON.stringify(interests || []), location || '', phone || '', profile_image || '']
    );
  },

  async getUserByEmail(email) {
    const db = await getDatabase();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (user) {
      user.skills = JSON.parse(user.skills || '[]');
      user.interests = JSON.parse(user.interests || '[]');
    }
    return user;
  },

  async getUserById(id) {
    const db = await getDatabase();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (user) {
      user.skills = JSON.parse(user.skills || '[]');
      user.interests = JSON.parse(user.interests || '[]');
    }
    return user;
  },

  async updateUser(id, updates) {
    const db = await getDatabase();
    const { name, phone, location, skills, interests } = updates;
    
    return await db.run(
      `UPDATE users SET name = ?, phone = ?, location = ?, skills = ?, interests = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, phone || '', location || '', JSON.stringify(skills || []), JSON.stringify(interests || []), id]
    );
  },

  async getAllUsers() {
    const db = await getDatabase();
    const users = await db.all('SELECT * FROM users ORDER BY created_at DESC');
    return users.map(user => ({
      ...user,
      skills: JSON.parse(user.skills || '[]'),
      interests: JSON.parse(user.interests || '[]')
    }));
  },

  // Service operations
  async createService(serviceData) {
    const db = await getDatabase();
    const { id, name, description, location_lat, location_lng, location_address, category, volunteers_needed, date, time, organizer, requirements, image, created_by } = serviceData;
    
    return await db.run(
      `INSERT INTO services (id, name, description, location_lat, location_lng, location_address, category, volunteers_needed, date, time, organizer, requirements, image, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description, location_lat, location_lng, location_address, category, volunteers_needed, date, time, organizer, JSON.stringify(requirements || []), image || '', created_by]
    );
  },

  async getAllServices() {
    const db = await getDatabase();
    const services = await db.all('SELECT * FROM services ORDER BY date ASC');
    return services.map(service => ({
      ...service,
      requirements: JSON.parse(service.requirements || '[]'),
      location: {
        lat: service.location_lat,
        lng: service.location_lng,
        address: service.location_address
      }
    }));
  },

  async getServicesByCategory(category) {
    const db = await getDatabase();
    const services = await db.all('SELECT * FROM services WHERE category = ? ORDER BY date ASC', [category]);
    return services.map(service => ({
      ...service,
      requirements: JSON.parse(service.requirements || '[]'),
      location: {
        lat: service.location_lat,
        lng: service.location_lng,
        address: service.location_address
      }
    }));
  },

  // Message operations
  async createMessage(messageData) {
    const db = await getDatabase();
    const { id, sender_id, receiver_id, content } = messageData;
    
    return await db.run(
      'INSERT INTO messages (id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)',
      [id, sender_id, receiver_id, content]
    );
  },

  async getMessagesForUser(userId) {
    const db = await getDatabase();
    return await db.all(
      'SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at DESC',
      [userId, userId]
    );
  },

  // Volunteer registration operations
  async registerForService(userId, serviceId) {
    const db = await getDatabase();
    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return await db.run(
      'INSERT INTO volunteer_registrations (id, user_id, service_id) VALUES (?, ?, ?)',
      [registrationId, userId, serviceId]
    );
  },

  async getUserRegistrations(userId) {
    const db = await getDatabase();
    return await db.all(`
      SELECT s.*, vr.registered_at 
      FROM services s 
      JOIN volunteer_registrations vr ON s.id = vr.service_id 
      WHERE vr.user_id = ?
      ORDER BY vr.registered_at DESC
    `, [userId]);
  }
};