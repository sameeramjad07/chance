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

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "ongoing" | "completed";
  creatorId: string;
  teamSize: number;
  effort: string;
  impact: string;
  peopleInfluenced: number | null;
  typeOfPeople: string | null;
  collaboration: string | null;
  likes: number;
  visibility: "public" | "private";
  createdAt: Date;
  updatedAt: Date | null;
  voteCount: number;
  creator: {
    id: string;
    username: string | null;
    profileImageUrl: string | null;
  } | null;
}
