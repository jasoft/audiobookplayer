// 定义数据类型
export type Chapter = {
  id: string;
  title: string;
  fileName: string;
  bookTitle: string;
};

export type Audiobook = {
  id: string;
  title: string;
  chapters: Chapter[];
};
