import ldap, { Client } from 'ldapjs';
import dotenv from 'dotenv';
import { Config } from './config';
import { HttpException } from '../middleware/error.middleware';

dotenv.config();

export function createLdapClient(): Client {
  const client = ldap.createClient({
    url: process.env.LDAP_URL!,
  });

  client.on('error', (err:any) => {
    throw new HttpException(401, 'Error en el cliente LDAP');
  });

  return client;
}

export function bindClient(client: Client): Promise<void> {
    return new Promise((resolve, reject) => {
      client.bind(Config.ldap_user!, Config.ldap_password!, (err) => {
        if (err) {
            
          reject(err);
          throw new HttpException(401, 'Error de autenticación');
        } else {
          resolve();
        }
      });
    });
  }