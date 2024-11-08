import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { Config } from '../config/config';
import { LoginDTO, RegisterDTO, TokenPair, JwtPayload, ResponseLogin } from '../types/auth.types';
import { HttpException } from '../middleware/error.middleware';
import { add } from 'date-fns';

export class AuthService {
  private static generateTokenPair(userId: number, email: string): TokenPair {
    const accessToken = jwt.sign(
      { userId, email, type: 'access' } as JwtPayload,
      Config.jwtSecret,
      { expiresIn: Config.jwtAccessExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId, email, type: 'refresh' } as JwtPayload,
      Config.jwtRefreshSecret,
      { expiresIn: Config.jwtRefreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  private static async saveRefreshToken(userId: number, token: string) {
    const expiresAt = add(new Date(), { days: 7 });
    
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  static async register(data: RegisterDTO) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const tokens = this.generateTokenPair(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }

  static async login(data: LoginDTO) {
    // const user = await prisma.user.findUnique({
    //   where: { email: data.email },
    // });

    const user:ResponseLogin[] = await prisma.$queryRaw `EXEC [Seguridad].[ConsultarUsuario] @Correo_Electronico=${data.email}, @Contrasena=${data.password}`;

    if (!user || user.length === 0) {
      throw new HttpException(401, 'Invalid credentials');
    }

    // const isPasswordValid = await bcrypt.compare(data.password, user.password);

    

    // if (isPasswordValid ) {
    //   throw new HttpException(401, 'Invalid credentials');
    // }

    const tokens = this.generateTokenPair(user[0].idUsuario, user[0].correo_Electronico!);
    // await this.saveRefreshToken(user.idUsuario, tokens.refreshToken);

    return {
      user: {
        ...user
      },
      ...tokens,
    };
  }

  static async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, Config.jwtRefreshSecret) as JwtPayload;
      
      if (decoded.type !== 'refresh') {
        throw new HttpException(401, 'Invalid token type');
      }

      const savedToken = await prisma.refreshToken.findFirst({
        where: {
          token,
          userId: decoded.userId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!savedToken) {
        throw new HttpException(401, 'Invalid refresh token');
      }

      // Delete used refresh token
      await prisma.refreshToken.delete({
        where: { id: savedToken.id },
      });

      const tokens = this.generateTokenPair(decoded.userId, decoded.email);
      await this.saveRefreshToken(decoded.userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new HttpException(401, 'Invalid refresh token');
    }
  }

  static async logout(userId: number) {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}