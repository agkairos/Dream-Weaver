import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Tenta carregar dotenv se não estiver em produção/Replit
if (!process.env.REPL_ID && process.env.NODE_ENV !== 'production') {
  try {
    // Usar import() para ES modules
    const dotenv = await import('dotenv');
    dotenv.config();
    console.log('✅ dotenv carregado via import()');
  } catch (error) {
    console.warn('⚠️ dotenv não disponível, usando variáveis do sistema');
  }
}

// DEBUG: Verificar se DATABASE_URL está disponível
console.log('DB Config - DATABASE_URL:', process.env.DATABASE_URL ? '✓ Disponível' : '✗ Indisponível');
console.log('DB Config - NODE_ENV:', process.env.NODE_ENV);
console.log('DB Config - REPL_ID:', process.env.REPL_ID || 'não definido');

if (!process.env.DATABASE_URL) {
  console.error('Variáveis de ambiente disponíveis:');
  Object.keys(process.env).forEach(key => {
    if (key.includes('DATABASE') || key.includes('DB')) {
      console.log(`  ${key}: ${process.env[key]}`);
    }
  });
  
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?\n" +
    "Dica: Verifique se o arquivo .env está na raiz do projeto com DATABASE_URL=postgresql://...",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });