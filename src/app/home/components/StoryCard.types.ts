export interface StoryCardProps {
  title: string;
  type: string;
  stories: Story[];
  icon: React.ReactNode;
}

interface Story {
  id: number;
  title: string;
  titleZh: string | null;
  url: string | null;
  text: string | null;
  textZh: string | null;
  by: string;
  score: number;
  time: Date;
}
