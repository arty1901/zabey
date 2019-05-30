export interface PostModel {
  postId: string;
  postTitle: string;
  postAuthor: string;
  postTags: ChipModel[];
  postText: string;
  postDate: Date;
  creator: string;
}

export interface ChipModel {
  name: string;
}
