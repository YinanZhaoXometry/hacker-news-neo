/* eslint-disable @typescript-eslint/no-explicit-any */

interface Story {
  id: number;
  title: string;
  url: string | null;
  text: string | null;
  by: string;
  score: number;
  time: Date;
}

interface ContainerProps extends PropsWithChildren {
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}
