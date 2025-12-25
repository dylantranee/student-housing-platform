import { request } from '../util/request';

const API_URL = '/api/notifications';

export interface PersistentNotification {
    _id: string;
    recipient: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    category: 'PropertyInquiry' | 'MatchRequest' | 'system';
    relatedId?: string;
    read: boolean;
    createdAt: string;
}

export const getNotifications = async (): Promise<PersistentNotification[]> => {
    return request<PersistentNotification[]>(API_URL);
};

export const markNotificationAsRead = async (id: string): Promise<PersistentNotification> => {
    return request<PersistentNotification>({ 
        method: 'PATCH', 
        url: `${API_URL}/${id}/read` 
    });
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    return request<void>({ 
        method: 'PATCH', 
        url: `${API_URL}/read-all` 
    });
};

export const deleteNotificationByID = async (id: string): Promise<void> => {
    return request<void>({ 
        method: 'DELETE', 
        url: `${API_URL}/${id}` 
    });
};

export const clearAllNotifications = async (): Promise<void> => {
    return request<void>({ 
        method: 'DELETE', 
        url: `${API_URL}/clear` 
    });
};
