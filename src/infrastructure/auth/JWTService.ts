import { UnauthorizedError } from '@/shared/errors';
const jwt = require('jsonwebtoken');

interface TokenPayload {
  id: string;
  username: string;
}

export class JWTService {
  
  generateToken(userId: string, username: string): string {
    const secret = process.env.JWT_SECRET || 'da3a2458a23aedeff4d6a9b1ca9cc8d6ae279e388bd3dafefa9d39b0eec76aa9';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    return jwt.sign(
      { id: userId, username: username },
      secret,
      { expiresIn: expiresIn }
    );
  }

  verifyToken(token: string): TokenPayload {
    const secret = process.env.JWT_SECRET || 'da3a2458a23aedeff4d6a9b1ca9cc8d6ae279e388bd3dafefa9d39b0eec76aa9';
    
    try {
      const decoded: any = jwt.verify(token, secret);
      
      if (!decoded.id || !decoded.username) {
        throw new UnauthorizedError('Invalid token payload');
      }
      
      return {
        id: decoded.id,
        username: decoded.username
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token');
      }
      throw new UnauthorizedError('Token verification failed');
    }
  }
}