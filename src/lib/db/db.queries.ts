import { withRetry } from './db.helpers';
import { StoryType } from './db.types';
import { prisma } from './db.helpers';

type OrderBy = {
  score?: 'asc' | 'desc';
  time?: 'asc' | 'desc';
}[];

export async function queryStoriesByTypesFromDB(
  types: StoryType[],
  pageSize: number = 10
) {
  try {
    const results = await withRetry(async () => {
      const queries = types.map((type) => {
        const baseQuery = {
          deleted: false,
          dead: false,
          type:
            type === 'top' || type === 'new' || type === 'best'
              ? 'story'
              : type,
          ...(type === 'top'
            ? {
                time: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
              }
            : {}),
        };

        let orderBy: OrderBy;
        switch (type) {
          case 'top':
            orderBy = [{ score: 'desc' }, { time: 'desc' }];
            break;
          case 'new':
            orderBy = [{ time: 'desc' }];
            break;
          case 'best':
            orderBy = [{ score: 'desc' }];
            break;
          default:
            orderBy = [{ score: 'desc' }, { time: 'desc' }];
        }

        return prisma.story.findMany({
          where: baseQuery,
          orderBy,
          take: pageSize,
        });
      });

      return Promise.all(queries);
    });

    return results;
  } catch (error) {
    console.error(
      '查询文章失败:',
      error instanceof Error ? error.message : error
    );
    return types.map(() => []); // 返回空数组数组
  }
}

export async function queryStoriesByTypeFromDB(
  type: StoryType = 'top',
  page: number = 1,
  pageSize: number = 20
) {
  const skip = (page - 1) * pageSize;

  try {
    return await withRetry(async () => {
      const baseQuery = {
        deleted: false,
        dead: false,
        type:
          type === 'new'
            ? 'story'
            : type === 'top' || type === 'best'
            ? 'story'
            : type,
      };

      let orderBy: OrderBy;
      switch (type) {
        case 'top':
          orderBy = [{ score: 'desc' }, { time: 'desc' }];
          break;
        case 'new':
          orderBy = [{ time: 'desc' }];
          break;
        case 'best':
          orderBy = [{ score: 'desc' }];
          break;
        default:
          orderBy = [{ score: 'desc' }, { time: 'desc' }];
      }

      const [stories, total] = await Promise.all([
        prisma.story.findMany({
          where: baseQuery,
          orderBy,
          skip,
          take: pageSize,
        }),
        prisma.story.count({
          where: baseQuery,
        }),
      ]);

      return {
        stories,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    });
  } catch (error) {
    console.error(
      '查询文章失败:',
      error instanceof Error ? error.message : error
    );
    return {
      stories: [],
      total: 0,
      totalPages: 0,
    };
  }
}

export async function queryStoryFromDB(id: number) {
  return withRetry(() =>
    prisma.story.findUnique({
      where: { id },
    })
  );
}

export async function queryStoryExistsFromDB(id: number): Promise<boolean> {
  const count: number = await withRetry(() =>
    prisma.story.count({
      where: { id },
    })
  );
  return count > 0;
}
