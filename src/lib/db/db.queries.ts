import { withRetry } from './db.helpers';
import { OrderBy, StoryTag } from './db.types';
import { prisma } from './db.helpers';
import { Tag } from '@prisma/client';

export async function queryStoriesByTypesFromDB(
  storyTags: StoryTag[],
  pageSize: number = 10
) {
  try {
    const results = await withRetry(async () => {
      const queries = storyTags.map((storyTag) => {
        const baseQuery = {
          deleted: false,
          dead: false,
          type: storyTag === Tag.JOB ? 'job' : 'story',
          ...(storyTag === Tag.TOP
            ? {
                time: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
              }
            : {}),
          tags: {
            has: storyTag,
          },
        };

        let orderBy: OrderBy;
        switch (storyTag) {
          case Tag.TOP:
            orderBy = [{ score: 'desc' }, { time: 'desc' }];
            break;
          case Tag.NEW:
            orderBy = [{ time: 'desc' }];
            break;
          case Tag.BEST:
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
    return storyTags.map(() => []); // 返回空数组数组
  }
}

export async function queryStoriesByTypeFromDB(
  storyTag: StoryTag = Tag.TOP,
  page: number = 1,
  pageSize: number = 20
) {
  const skip = (page - 1) * pageSize;

  try {
    return await withRetry(async () => {
      console.log('storyTag: ', storyTag);
      const baseQuery = {
        deleted: false,
        dead: false,
        type: storyTag === Tag.JOB ? 'job' : 'story',
        ...(storyTag === Tag.TOP
          ? {
              time: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            }
          : {}),

        tags: {
          has: storyTag,
        },
      };

      let orderBy: OrderBy;
      switch (storyTag) {
        case Tag.TOP:
          orderBy = [{ score: 'desc' }, { time: 'desc' }];
          break;
        case Tag.NEW:
          orderBy = [{ time: 'desc' }];
          break;
        case Tag.BEST:
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
      'Query stories failed:',
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
