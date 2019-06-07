export interface PostModel {
  postId: string;
  postTitle: string;
  postAuthor: string;
  postTags: ChipModel[];
  postText: string;
  postDate: Date;
  postCreator: string;
}

export interface ChipModel {
  name: string;
}
