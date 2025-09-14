export interface Heartbeat {
  id: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  comments: number;
  visibility: "public" | "private";
  isLikedByUser: boolean;
  userId: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    profileImageUrl: string | null;
  };
}

export interface HeartbeatComment {
  id: string;
  content: string;
  heartbeatId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    profileImageUrl: string | null;
  } | null; // Allow null for user
}

export interface HeartbeatCommentWithUser {
  comment: {
    id: string;
    content: string;
    heartbeatId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
  };
  user: {
    id: string;
    name: string | null;
    username: string | null;
    profileImageUrl: string | null;
  } | null; // Allow null for user
}
