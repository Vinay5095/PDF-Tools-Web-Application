import pool from './db';
import bcrypt from 'bcryptjs';
import { User, UserSubscription, UserUsage } from './types';

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  name?: string;
  password?: string;
  provider?: string;
  provider_id?: string;
  image_url?: string;
  email_verified?: boolean;
}): Promise<User | null> {
  try {
    const {
      email,
      name,
      password,
      provider = 'email',
      provider_id,
      image_url,
      email_verified = false,
    } = userData;

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    const result = await pool.query(
      `INSERT INTO users (email, name, password_hash, provider, provider_id, image_url, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [email, name, passwordHash, provider, provider_id, image_url, email_verified]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUser(
  id: number,
  updates: Partial<User>
): Promise<User | null> {
  try {
    const fields = Object.keys(updates)
      .filter(key => updates[key as keyof User] !== undefined)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(updates).filter(value => value !== undefined);

    const result = await pool.query(
      `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

export async function getUserSubscription(userId: number): Promise<UserSubscription | null> {
  try {
    const result = await pool.query(
      `SELECT us.*, sp.name as plan_name, sp.features, sp.limits
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE us.user_id = $1 AND us.status = 'active'
       ORDER BY us.created_at DESC
       LIMIT 1`,
      [userId]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

export async function getUserUsage(userId: number, monthYear?: Date): Promise<UserUsage | null> {
  try {
    const targetDate = monthYear || new Date();
    const firstDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);

    const result = await pool.query(
      'SELECT * FROM user_usage WHERE user_id = $1 AND month_year = $2',
      [userId, firstDayOfMonth]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user usage:', error);
    return null;
  }
}

export async function incrementUserUsage(
  userId: number,
  operationType: string,
  fileSize: number,
  isPremium: boolean = false
): Promise<void> {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    await pool.query(
      `INSERT INTO user_usage (user_id, month_year, operations_count, total_file_size, premium_operations_count)
       VALUES ($1, $2, 1, $3, $4)
       ON CONFLICT (user_id, month_year)
       DO UPDATE SET
         operations_count = user_usage.operations_count + 1,
         total_file_size = user_usage.total_file_size + $3,
         premium_operations_count = user_usage.premium_operations_count + $4,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, firstDayOfMonth, fileSize, isPremium ? 1 : 0]
    );
  } catch (error) {
    console.error('Error incrementing user usage:', error);
  }
}

export async function logFileOperation(
  userId: number | null,
  sessionId: string | null,
  operationType: string,
  fileCount: number,
  totalFileSize: number,
  processingTime: number,
  success: boolean,
  errorMessage?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO file_operations 
       (user_id, session_id, operation_type, file_count, total_file_size, processing_time, success, error_message, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [userId, sessionId, operationType, fileCount, totalFileSize, processingTime, success, errorMessage, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error logging file operation:', error);
  }
}