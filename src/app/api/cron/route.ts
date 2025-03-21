import { NextResponse } from 'next/server';
import { fetchStories, fetchMultipleStories, type HNItem } from '@/lib/hn';
import { createStory, storyExists } from '@/lib/db';

interface DBStory {
  id: number;
  title: string;
  titleZh: string | null;
  type: 'story' | 'job';
}

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5分钟超时

function isValidCronRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET) {
    return authHeader === `Bearer ${process.env.CRON_SECRET}`;
  }
  return true;
}

// 将 HN 类型映射到数据库类型
function mapHNTypeToDBType(hnType: string): 'story' | 'job' {
  switch (hnType) {
    case 'ask':
      return 'story';
    case 'show':
      return 'story';
    case 'job':
      return 'job';
    default:
      return 'story';
  }
}

interface ProcessedStory {
  id: number;
  type: 'story' | 'job';
  title: string;
}

async function processStory(
  story: HNItem,
  type: string
): Promise<ProcessedStory | null> {
  if (!story) return null;

  try {
    const exists = await storyExists(story.id);
    if (!exists) {
      console.log(`开始处理文章: ${story.id} (${type})`);
      const dbType = mapHNTypeToDBType(type);

      const savedStory = (await createStory({
        ...story,
        type: dbType,
      })) as DBStory;

      console.log(`文章处理完成: ${story.id} (类型: ${dbType})`);
      return {
        id: savedStory.id,
        type: dbType,
        title: savedStory.titleZh || savedStory.title,
      };
    }
    console.log(`文章已存在: ${story.id}`);
    return null;
  } catch (error) {
    console.error(`处理文章出错 ${story.id}:`, error);
    return null;
  }
}

export async function GET(req: Request) {
  if (!isValidCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const results = [];
  const errors = [];

  try {
    const types = ['new', 'top', 'best', 'ask', 'show', 'job'];

    for (const type of types) {
      try {
        console.log(`正在获取 ${type} 类型的文章...`);
        const storyIds = await fetchStories(type);
        const stories = await fetchMultipleStories(storyIds.slice(0, 10));

        // 并行处理文章，但限制并发数
        const batchSize = 3;
        for (let i = 0; i < stories.length; i += batchSize) {
          const batch = stories.slice(i, i + batchSize);
          const processedStories = await Promise.all(
            batch.map((story) => processStory(story, type))
          );

          results.push(...processedStories.filter(Boolean));
        }
      } catch (error) {
        console.error(`处理 ${type} 类型文章时出错:`, error);
        errors.push({ type, error: String(error) });
      }
    }

    const duration = (Date.now() - startTime) / 1000;
    return NextResponse.json({
      success: true,
      message: `定时任务完成 (${duration.toFixed(1)}秒)：成功获取 ${
        results.length
      } 篇文章`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: String(error),
        results,
        errors,
      },
      { status: 500 }
    );
  }
}
