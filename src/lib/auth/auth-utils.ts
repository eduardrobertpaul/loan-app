/**
 * Authentication utilities for the loan application system
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Secret for JWT, should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'loan-app-secret-key';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: { id: string; email: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Interface for user repository with email lookup
 */
interface UserRepository {
  getUserByEmail: (email: string) => Promise<any | null>;
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string,
  userRepo: UserRepository
): Promise<{ id: string; email: string; name: string; role: string } | null> {
  // Find user by email
  const user = await userRepo.getUserByEmail(email);
  if (!user) {
    return null;
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  // Return user data (excluding password)
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
} 