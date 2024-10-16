// 定义数据类型
export type Chapter = {
  id: string;
  title: string;
  fileName: string;
  bookTitle: string;
  book: Audiobook;
};

export type Audiobook = {
  id: string;
  title: string;
  chapters: Chapter[];
};
