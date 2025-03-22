import { NextResponse } from 'next/server';
import { fetchHnStories, fetchHnMultipleStories } from '@/lib/hn/hn';
import { createStoryInDB, queryStoryExistsFromDB } from '@/lib/db';

interface Story {
  id: number;
  title: string;
}

export async function GET() {
  try {
    // 先获取 new 类型的最新文章
    const newStoryIds = await fetchHnStories('new');
    const newStories = await fetchHnMultipleStories(newStoryIds.slice(0, 30));

    const results: Array<{ id: number; title: string }> = [];

    // 处理每个故事
    for (const story of newStories) {
      try {
        if (!story) {
          console.log('跳过空故事');
          continue;
        }

        const exists = await queryStoryExistsFromDB(story.id);
        console.log(`故事 ${story.id} ${exists ? '已存在' : '不存在'}`);

        if (!exists) {
          // 保存故事
          const savedStory = (await createStoryInDB(story)) as Story;
          console.log(`故事 ${story.id} 保存完成`);

          results.push({
            id: savedStory.id,
            title: savedStory.title,
          });
        }
      } catch (err) {
        console.error('处理故事时出错:', story?.id, err);
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      message: `成功获取内容：${results.length} 篇文章`,
      results,
    });
  } catch (error) {
    console.error('Manual fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: String(error) },
      { status: 500 }
    );
  }
}

// 配置路由处理程序
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 设置最大执行时间为5分钟
