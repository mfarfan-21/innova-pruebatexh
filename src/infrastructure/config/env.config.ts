/**
 * Configuración y Validación de Variables de Entorno
 * 
 * Este archivo valida que todas las variables de entorno necesarias
 * estén presentes al iniciar la aplicación. Si falta alguna, la app
 * no arrancará y mostrará un error claro.
 */

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiUrl: string;
}

/**
 * Lista de variables de entorno requeridas
 */
const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_API_URL'
] as const;

/**
 * Valida que todas las variables de entorno requeridas estén presentes
 * @throws Error si falta alguna variable de entorno
 */
function validateEnvVars(): void {
  const missing: string[] = [];

  REQUIRED_ENV_VARS.forEach(varName => {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `❌ Faltan variables de entorno requeridas:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Por favor, crea un archivo .env en la raíz del proyecto con:\n` +
      `${missing.map(v => `${v}=tu_valor_aqui`).join('\n')}`
    );
  }
}

/**
 * Obtiene y valida la configuración de entorno
 * @returns Objeto con la configuración validada
 */
export function getEnvConfig(): EnvConfig {
  // Validar primero
  validateEnvVars();

  // Retornar configuración validada
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    apiUrl: import.meta.env.VITE_API_URL
  };
}

/**
 * Configuración de entorno validada
 * Se exporta como constante para uso en toda la aplicación
 */
export const ENV = getEnvConfig();
