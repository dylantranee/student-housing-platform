import React, { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';
import * as notificationService from '../service/notification.service';
import { getAuthToken } from '../util/auth';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: 'PropertyInquiry' | 'MatchRequest' | 'system';
  relatedId?: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  showAlert: (message: string, severity?: AlertColor) => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  deleteById: (id: string) => void;
  clearAll: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Toast State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');

  // Persistent Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Map backend notification to frontend notification
  const mapBackendToFrontend = (n: notificationService.PersistentNotification): Notification => ({
    id: n._id,
    title: n.title,
    message: n.message,
    type: n.type,
    category: n.category,
    relatedId: n.relatedId,
    timestamp: new Date(n.createdAt),
    read: n.read
  });

  const refreshNotifications = useCallback(async () => {
    try {
      // Only fetch if token exists (using correct 'access_token' via utility)
      if (!getAuthToken()) return;
      
      const backendNotifs = await notificationService.getNotifications();
      setNotifications(backendNotifs.map(mapBackendToFrontend));
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, []);

  // Check for notifications on load and periodically (simplified polling for now)
  useEffect(() => {
    refreshNotifications();
    
    // Check every 30 seconds for new notifications
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const showAlert = useCallback((message: string, severity: AlertColor = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  }, []);

  const addNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    // If we have back-end persistence, typically the back-end emits this via Socket.io
    // For now, we still add locally for immediate feedback + assume back-end saved it via Observer
    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    showAlert(message, type as AlertColor);
  }, [showAlert]);

  const markAsRead = useCallback(async (id: string) => {
    // 1. Optimistic Update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    // 2. Sync with Backend
    try {
      await notificationService.markNotificationAsRead(id);
    } catch (err) {
      console.error('Failed to mark notification as read on backend:', err);
    }
  }, []);

  const deleteById = useCallback(async (id: string) => {
    // 1. Optimistic Update
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // 2. Sync with Backend
    try {
      await notificationService.deleteNotificationByID(id);
    } catch (err) {
      console.error('Failed to delete notification on backend:', err);
    }
  }, []);

  const clearAll = useCallback(async () => {
    // 1. Optimistic Update
    setNotifications([]);
    
    // 2. Sync with Backend
    try {
      await notificationService.clearAllNotifications();
    } catch (err) {
      console.error('Failed to clear notifications on backend:', err);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCloseAlert = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showAlert, addNotification, notifications, unreadCount, markAsRead, deleteById, clearAll, refreshNotifications }}>
      {children}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} variant="filled" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
