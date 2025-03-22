import { HNItem } from '../hn';
import { withRetry } from './db.helpers';
import { prisma } from './db.helpers';

export async function createStoryInDB(item: HNItem) {
  return withRetry(() =>
    prisma.story.create({
      data: {
        id: item.id,
        title: item.title || '',
        url: item.url,
        text: item.text,
        by: item.by || '',
        score: item.score || 0,
        descendants: item.descendants || 0,
        time: new Date((item.time || 0) * 1000),
        type: item.type || 'story',
        dead: item.dead || false,
        deleted: item.deleted || false,
        kids: item.kids || [],
        translated: true,
      },
    })
  );
}
