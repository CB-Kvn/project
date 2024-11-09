import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { Config } from '../config/config';
import { LoginDTO, RegisterDTO, TokenPair, JwtPayload, ResponseLogin, RegisterUsuarioDTO, Usuario } from '../types/auth.types';
import { HttpException } from '../middleware/error.middleware';
import { add } from 'date-fns';
import { Logger } from '../config/logger';
import { bindClient, createLdapClient } from '../config/ldap';

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

  static async register(data: RegisterUsuarioDTO) {
    const existingUser = await prisma.usuario.findMany({
      where: { Correo_Electronico: data.Correo_Electronico! },
    });

    if (existingUser.length !== 0) {
      throw new HttpException(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.Contrasena, 10);

    const user = await prisma.usuario.create({
      data: {
        ...data,
        Contrasena: hashedPassword,
      }
    });

    return {
      user
    };
  }

  static async login(data: LoginDTO) {


    const user = await prisma.usuario.findMany({
      where: { CodUsuario: data.codUsuario },
    });

    // const catalogo = await prismaCatalogos.area.findMany()

    // Logger.warn(catalogo)

    if (!user || user.length === 0) {
      throw new HttpException(401, 'Invalid credentials (Correo electronico)');
    } else {
      if (!user[0].Autenticacion) {
        return AuthService.loginWSql(user[0], data)
      }else{
        AuthService.searchActiveDirectory(data.codUsuario,data.password)
      }
    }

  }

  static async logout(userId: number) {

  }
  
  private static async loginWSql(user: any, data: LoginDTO){
    const isPasswordValid = await bcrypt.compare(data.password, user.Contrasena);
    Logger.info({ user, data, isPasswordValid });
  
    // Manejo de intentos fallidos y bloqueo
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      throw new HttpException(401, `Contraseña incorrecta. Intentos fallidos: ${user.Intentos_Fallidos + 1}`);
    }
  
    // Restablecer intentos fallidos si la autenticación es exitosa
    await prisma.usuario.update({
      where: { IdUsuario: user.IdUsuario! },
      data: { Intentos_Fallidos: 0,Sesion_Iniciada:true }
    });
  
    // Generación de tokens
    const tokens = this.generateTokenPair(user.IdUsuario, user.Correo_Electronico!);
  
    return {
      user: { ...user },
      ...tokens
    };
  }
  
  // Función auxiliar para manejar intentos fallidos
  private static async handleFailedLogin(user:any) {
    const updatedAttempts = user.Intentos_Fallidos + 1;
    const bloqueado = updatedAttempts >= 3;
  
    await prisma.usuario.update({
      where: { IdUsuario: user.IdUsuario! },
      data: {
        Intentos_Fallidos: updatedAttempts,
        Bloqueado: bloqueado
      }
    });
  
    if (bloqueado) {
      throw new HttpException(401, 'Intentos fallidos superados, el usuario ha sido bloqueado.');
    }
  }

  private static async searchActiveDirectory(codUsuario: string,password:string): Promise<any> {
    const client = createLdapClient();
    try {
      await bindClient(client);
  
      // const options: SearchOptions = {
      //   filter: `(mail=${email})`,
      //   scope: 'sub',
      //   attributes: ['cn', 'mail', 'title', 'department']  // Atributos que queremos recuperar
      // };
  
      // return new Promise((resolve, reject) => {
      //   client.search('dc=dominio,dc=com', options, (err, res) => {
      //     if (err) {
      //       console.error('Error en la búsqueda:', err);
      //       reject(err);
      //       return;
      //     }
  
      //     const entries: any[] = [];
      //     res.on('searchEntry', (entry) => {
      //       entries.push(entry.object);
      //     });
  
      //     res.on('error', (err) => {
      //       console.error('Error en la búsqueda:', err.message);
      //       reject(err);
      //     });
  
      //     res.on('end', (result) => {
      //       if (result.status === 0) {
      //         resolve(entries);
      //       } else {
      //         reject(new Error('La búsqueda no fue exitosa'));
      //       }
      //       client.unbind(); // Cerramos la conexión al terminar
      //     });
      //   });
      // });
    } catch (err) {
      
      throw new HttpException(500, 'Error al conectar o consultar en Active Directory');
    } finally {
      client.destroy(); // Asegura el cierre de la conexión en caso de error
    }
  }


  
}