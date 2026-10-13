import "dotenv/config";

// Автономная версия: платформенные переменные не нужны,
// значения по умолчанию безопасны для standalone-запуска.
function optional(name: string, fallback: string): string {
  const value = process.env[name];
  // RelaxDev подставляет заглушки вроде "auto-generated-stub-for-build" — игнорируем их
  if (!value || value.includes("stub")) return fallback;
  return value;
}

export const env = {
  appId: optional("APP_ID", "standalone"),
  appSecret: optional("APP_SECRET", "standalone"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: optional("DATABASE_URL", "./data/invite.db"),
};
