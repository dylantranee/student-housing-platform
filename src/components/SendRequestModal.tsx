import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { sendMatchRequest } from '../service/roommate/matchRequest.service';

interface SendRequestModalProps {
  open: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
  receiverPhoto?: string;
  onSuccess?: () => void;
  contextPropertyTitle?: string;
  contextPropertyUrl?: string;
}

const UPLOADS_BASE_URL = 'http://localhost:3000/uploads';

export const SendRequestModal: React.FC<SendRequestModalProps> = ({
  open,
  onClose,
  receiverId,
  receiverName,
  receiverPhoto,
  onSuccess,
  contextPropertyTitle,
  contextPropertyUrl,
}) => {
  const [message, setMessage] = useState('');
  const [propertyLink, setPropertyLink] = useState('');
  
  // Auto-fill property link if context is provided
  useEffect(() => {
    if (contextPropertyUrl) {
      setPropertyLink(contextPropertyUrl);
    } else {
      setPropertyLink('');
    }
  }, [contextPropertyUrl, open]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please add a personal message to your request.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sendMatchRequest({
        receiverId,
        message,
        propertyLink: propertyLink.trim() || undefined,
      });
      
      if (onSuccess) onSuccess();
      onClose();
      setMessage('');
      setPropertyLink('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send connection request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const photoUrl = receiverPhoto ? (
    receiverPhoto.startsWith('http') ? receiverPhoto : `${UPLOADS_BASE_URL}/${receiverPhoto}`
  ) : undefined;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography component="div" variant="h6" sx={{ fontWeight: 800 }}>Say Hello</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: '#F9F9F9', borderRadius: 3 }}>
          <Avatar src={photoUrl} sx={{ width: 48, height: 48 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Connecting with {receiverName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tell them why you'd be a great roommate!
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity={error.includes('already') ? 'info' : 'error'} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {!error?.includes('already') && (
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Hi! I saw we have a high soul match score. I'm also looking for a quiet place near university..."
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 300))}
            sx={{ 
              mb: 1,
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
            helperText={`${message.length}/300 characters`}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          sx={{ color: '#717171', fontWeight: 700, textTransform: 'none' }}
        >
          {error?.includes('already') ? 'Close' : 'Cancel'}
        </Button>
        {!error?.includes('already') && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              bgcolor: '#FF5A5F !important',
              color: 'white',
              borderRadius: 50,
              px: 4,
              py: 1.2,
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#E14850 !important' }
            }}
          >
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
