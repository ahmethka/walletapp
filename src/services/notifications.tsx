import { api } from './api';

export type AppNotification = {
  id: number;
  title: string;
  body?: string;
  date: string;   // ISO
  read: boolean;
};

export async function getNotifications(): Promise<AppNotification[]> {
  const { data } = await api.get<AppNotification[]>('/notifications?_sort=date&_order=desc');
  return data;
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await api.get<AppNotification[]>('/notifications', { params: { read: false } });
  return Array.isArray(data) ? data.length : 0;
}

export async function markAllAsRead(): Promise<boolean> {
  const { data: unread } = await api.get<AppNotification[]>('/notifications', { params: { read: false } });
  await Promise.all(unread.map(n => api.patch(`/notifications/${n.id}`, { read: true })));
  return true;
}

export async function addNotification(title: string, body?: string) {
  await api.post('/notifications', {
    title,
    body,
    date: new Date().toISOString(),
    read: false,
  });
  return true;
}

export async function markAsRead(id: number, read: boolean = true) {
  await api.patch(`/notifications/${id}`, { read });
  return true;
}

export async function deleteNotification(id: number) {
  await api.delete(`/notifications/${id}`);
  return true;
}
