export const Config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '1d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  urlAD: 'ldap://your-ldap-url', // URL de tu servidor LDAP (e.g., ldap://ad.company.com)
  baseDNAD: 'dc=company,dc=com', // DN base de tu organización (e.g., dc=company,dc=com)
  usernameAD: 'your-username', // Usuario con permisos de acceso
  passwordAD: 'your-password', // Contraseña del usuario
};