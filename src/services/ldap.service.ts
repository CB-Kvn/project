import { Client, SearchOptions } from 'ldapjs';
import { createLdapClient } from '../config/ldap';


export async function searchUserByEmail(email: string): Promise<any> {
  const client = createLdapClient();

  return new Promise((resolve, reject) => {
    client.bind(process.env.LDAP_USER!, process.env.LDAP_PASSWORD!, (err:any) => {
      if (err) {
        return reject('Error de autenticación');
      }

      const options: SearchOptions = {
        filter: `(mail=${email})`,
        scope: 'sub',
        attributes: ['cn', 'mail', 'title', 'department'],
      };

      client.search(process.env.LDAP_BASE_DN!, options, (err:any, res:any) => {
        if (err) {
          return reject('Error en la búsqueda');
        }

        const entries: any[] = [];
        res.on('searchEntry', (entry:any) => {
          entries.push(entry.object);
        });

        res.on('end', () => {
          client.unbind();
          resolve(entries);
        });

        res.on('error', (err:any) => {
          client.unbind();
          reject('Error en la búsqueda: ' + err.message);
        });
      });
    });
  });
}