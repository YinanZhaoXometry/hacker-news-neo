import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Wrapper function to add retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 5
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`尝试第 ${i + 1} 次失败:`, error);

      if (i === maxRetries - 1) break;

      // 如果是连接错误，尝试重新连接
      if (error instanceof Error && error.message.includes('connection')) {
        await prisma.$connect();
      }

      // 指数退避重试
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000))
      );
    }
  }

  throw lastError;
}
