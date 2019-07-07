export interface PostModel {
  postId: string;
  postTitle: string;
  postAuthor: string;
  postTags: ChipModel[];
  postText: string;
  postDate: Date;
  postCreator: string;
  postLikeCounter: number;
  postLikedBy: string[];
  postComments: any[];
}

export interface ChipModel {
  name: string;
}
