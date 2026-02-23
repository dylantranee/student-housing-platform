import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, IconButton, Box, Typography, Popover, List, ListItem, ListItemButton, Divider, Button, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/Inbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotification, type Notification } from '../../context/NotificationContext';
import dayjs from 'dayjs';

const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, deleteById, clearAll } = useNotification();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    handleClose();

    // Navigate based on category with correct tab parameters
    if (notif.category === 'PropertyInquiry') {
      navigate('/requests?tab=3');
    } else if (notif.category === 'MatchRequest') {
      navigate('/requests?tab=0');
    }
  };

  const handleDeleteClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    deleteById(id);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleClick} aria-describedby={id}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 360, maxHeight: 480, overflow: 'hidden', display: 'flex', flexDirection: 'column' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6">Notifications</Typography>
          <Button size="small" color="inherit" onClick={clearAll} sx={{ fontSize: '0.75rem' }}>
            Clear All
          </Button>
        </Box>
        
        <List sx={{ overflowY: 'auto', flexGrow: 1, py: 0 }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', opacity: 0.6 }}>
              <InboxIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography>No notifications yet</Typography>
            </Box>
          ) : (
            notifications.map((notif: Notification, index) => (
              <React.Fragment key={notif.id}>
                <ListItem 
                  disablePadding
                  secondaryAction={
                    <Tooltip title="Delete">
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        size="small" 
                        onClick={(e) => handleDeleteClick(e, notif.id)}
                        sx={{ opacity: 0.2, '&:hover': { opacity: 1, color: 'error.main' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ 
                    bgcolor: notif.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                    '&:hover': { 
                      bgcolor: 'rgba(0,0,0,0.04)',
                      '& .MuiListItemSecondaryAction-root .MuiIconButton-root': { opacity: 0.6 }
                    }
                  }}
                >
                  <ListItemButton 
                    onClick={() => handleNotificationClick(notif)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 1.5,
                      width: '100%',
                      pr: 7 // Add padding for secondary action
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: notif.read ? 500 : 700 }}>
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(notif.timestamp).format('HH:mm')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.2
                    }}>
                      {notif.message}
                    </Typography>
                  </ListItemButton>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
        
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button fullWidth size="small" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;
