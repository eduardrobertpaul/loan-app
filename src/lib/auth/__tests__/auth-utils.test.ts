import '@testing-library/jest-dom';
import { authenticateUser, hashPassword, verifyPassword, generateToken } from '../auth-utils';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password_123'),
  compare: jest.fn().mockImplementation((password, hashedPassword) => {
    return Promise.resolve(password === 'correct_password');
  })
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake_token_123')
}));

describe('Authentication Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    test('should hash a password', async () => {
      const result = await hashPassword('password123');
      expect(result).toBe('hashed_password_123');
    });
  });

  describe('verifyPassword', () => {
    test('should return true for correct password', async () => {
      const result = await verifyPassword('correct_password', 'hashed_password_123');
      expect(result).toBe(true);
    });

    test('should return false for incorrect password', async () => {
      const result = await verifyPassword('wrong_password', 'hashed_password_123');
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    test('should generate a token with user data', () => {
      const userData = { id: '123', email: 'user@example.com' };
      const token = generateToken(userData);
      expect(token).toBe('fake_token_123');
    });
  });

  describe('authenticateUser', () => {
    const mockUserRepo = {
      getUserByEmail: jest.fn()
    };

    test('should return null for non-existent user', async () => {
      mockUserRepo.getUserByEmail.mockResolvedValueOnce(null);
      
      const result = await authenticateUser('nonexistent@example.com', 'password123', mockUserRepo);
      
      expect(result).toBeNull();
      expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    test('should return null for incorrect password', async () => {
      mockUserRepo.getUserByEmail.mockResolvedValueOnce({
        id: '123',
        email: 'user@example.com',
        password: 'hashed_password_123'
      });
      
      const result = await authenticateUser('user@example.com', 'wrong_password', mockUserRepo);
      
      expect(result).toBeNull();
      expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith('user@example.com');
    });

    test('should return user data for correct credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'user@example.com',
        password: 'hashed_password_123',
        name: 'Test User',
        role: 'user'
      };
      
      mockUserRepo.getUserByEmail.mockResolvedValueOnce(mockUser);
      
      const result = await authenticateUser('user@example.com', 'correct_password', mockUserRepo);
      
      expect(result).toEqual({
        id: '123',
        email: 'user@example.com',
        name: 'Test User',
        role: 'user'
      });
      expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith('user@example.com');
    });
  });
}); 