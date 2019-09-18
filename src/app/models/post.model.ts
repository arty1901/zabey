export interface PostModel {
  postId: string;
  postTitle: string;
  postAuthor: string;
  authorId: string;
  postTags: ChipModel[];
  postText: string;
  postDate: Date;
  postLikeCounter: number;
  postLikedBy: string[];
  postComments: any[];
}

export interface ChipModel {
  name: string;
}
