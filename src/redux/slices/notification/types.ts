export interface Notification {
  _id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actorId?: string;
}

export interface NotificationState {
  list: Notification[];
  isLoading: boolean;
  isError: boolean;
}
