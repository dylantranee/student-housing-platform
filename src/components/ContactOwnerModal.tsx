import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert,
    CircularProgress,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Send, People, CheckCircle } from '@mui/icons-material';
import { submitInquiry, checkExistingInquiry, type PropertyInquiry } from '../service/propertyInquiry.service';
import type { Property } from '../service/properties/getProperties.service';
import { getProfile } from '../service/user/getProfile.service';
import { getAcceptedConnections, type ConnectedRoommate } from '../service/roommate/connections.service';
import { COLORS } from '../theme/theme';

interface ContactOwnerModalProps {
    open: boolean;
    onClose: () => void;
    property: Property | null;
    onSuccess?: () => void;
}

export default function ContactOwnerModal({ open, onClose, property, onSuccess }: ContactOwnerModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [connectedRoommates, setConnectedRoommates] = useState<ConnectedRoommate[]>([]);
    const [existingInquiry, setExistingInquiry] = useState<PropertyInquiry | null>(null);
    
    const [formData, setFormData] = useState({
        message: '',
        moveInDate: null as Dayjs | null,
        phone: '',
        selectedRoommateId: ''
    });
    
    const [fieldErrors, setFieldErrors] = useState({
        message: '',
        moveInDate: '',
        phone: ''
    });

    useEffect(() => {
        if (open && property) {
            loadUserData();
            loadAcceptedRoommates();
            checkForExistingInquiry();
            // Reset form when modal opens
            setFormData({
                message: '',
                moveInDate: null,
                phone: '',
                selectedRoommateId: ''
            });
            setFieldErrors({ message: '', moveInDate: '', phone: '' });
            setError('');
            setSuccess(false);
            setExistingInquiry(null);
        }
    }, [open, property?._id]);

    const loadUserData = async () => {
        try {
            const res = await getProfile();
            const data = res.data || res;
            setUserData(data);
            setFormData(prev => ({
                ...prev,
                phone: data.phone || ''
            }));
        } catch (err) {
            console.error('Error loading user profile:', err);
        }
    };

    const loadAcceptedRoommates = async () => {
        try {
            const connections = await getAcceptedConnections();
            setConnectedRoommates(connections);
        } catch (err) {
            console.error('Error loading roommates:', err);
        }
    };

    const checkForExistingInquiry = async () => {
        if (!property) return;
        try {
            const existing = await checkExistingInquiry(property._id);
            setExistingInquiry(existing);
        } catch (err) {
            console.error('Error checking existing inquiry:', err);
        }
    };

    const validate = () => {
        const errors = {
            message: '',
            moveInDate: '',
            phone: ''
        };
        let isValid = true;

        if (!formData.message.trim()) {
            errors.message = 'Message is required';
            isValid = false;
        } else if (formData.message.trim().length < 20) {
            errors.message = 'Message must be at least 20 characters';
            isValid = false;
        }

        if (!formData.moveInDate) {
            errors.moveInDate = 'Move-in date is required';
            isValid = false;
        } else if (formData.moveInDate.isBefore(dayjs(), 'day')) {
            errors.moveInDate = 'Move-in date must be in the future';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone.trim())) {
            errors.phone = 'Phone number must be exactly 10 digits';
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validate() || !property) return;

        setLoading(true);
        setError('');

        try {
            await submitInquiry({
                propertyId: property._id,
                message: formData.message.trim(),
                moveInDate: formData.moveInDate!.toISOString(),
                tenantPhone: formData.phone.trim(),
                linkedRoommateId: formData.selectedRoommateId || undefined
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!property) return null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog 
                open={open} 
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 4 }
                }}
            >
                <DialogTitle>
                    <Box>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 800, color: '#222' }}>
                            Contact Property Owner
                        </Typography>
                        <Typography variant="body2" component="div" color="text.secondary" sx={{ mt: 0.5 }}>
                            Inquiry for: {property.title}
                        </Typography>
                    </Box>
                </DialogTitle>
                
                <DialogContent>
                    {existingInquiry ? (
                        <Alert severity="info" icon={<CheckCircle />} sx={{ borderRadius: 3, my: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
                                ✓ Inquiry Already Submitted
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                You contacted the owner on {dayjs(existingInquiry.createdAt).format('MMM D, YYYY')}
                            </Typography>
                            {existingInquiry.linkedRoommateName && (
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'info.dark' }}>
                                    With roommate: {existingInquiry.linkedRoommateName}
                                </Typography>
                            )}
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                    Your Message:
                                </Typography>
                                <Typography variant="body2">
                                    {existingInquiry.message}
                                </Typography>
                            </Box>
                        </Alert>
                    ) : success ? (
                        <Alert severity="success" sx={{ borderRadius: 3, my: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                🎉 Inquiry submitted successfully!
                            </Typography>
                            <Typography variant="body2">
                                The property owner will contact you soon.
                            </Typography>
                        </Alert>
                    ) : (
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            {error && (
                                <Alert severity="error" sx={{ borderRadius: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box>
                                <TextField
                                    fullWidth
                                    label="Your Name"
                                    value={userData?.name || 'Loading...'}
                                    disabled
                                    variant="filled"
                                />
                            </Box>

                            <Box>
                                <TextField
                                    fullWidth
                                    label="Your Email"
                                    value={userData?.email || 'Loading...'}
                                    disabled
                                    variant="filled"
                                />
                            </Box>

                            <Box>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    error={!!fieldErrors.phone}
                                    helperText={fieldErrors.phone || 'The owner will contact you at this number'}
                                    placeholder="0123456789"
                                />
                            </Box>

                            <Box>
                                <DatePicker
                                    label="Planned Move-in Date"
                                    value={formData.moveInDate}
                                    onChange={(newValue: Dayjs | null) => setFormData({ ...formData, moveInDate: newValue })}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!fieldErrors.moveInDate,
                                            helperText: fieldErrors.moveInDate
                                        }
                                    }}
                                    minDate={dayjs()}
                                />
                            </Box>

                            {connectedRoommates.length > 0 && (
                                <Box>
                                    <FormControl fullWidth>
                                        <InputLabel>Apply with a roommate (optional)</InputLabel>
                                        <Select
                                            value={formData.selectedRoommateId}
                                            onChange={(e) => setFormData({ ...formData, selectedRoommateId: e.target.value })}
                                            label="Apply with a roommate (optional)"
                                            startAdornment={<People sx={{ mr: 1, color: '#999' }} />}
                                        >
                                            <MenuItem value="">
                                                <em>Apply alone</em>
                                            </MenuItem>
                                            {connectedRoommates.map((roommate) => (
                                                <MenuItem key={roommate._id} value={roommate._id}>
                                                    {roommate.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {formData.selectedRoommateId 
                                                ? 'Your roommate will be notified and can confirm their interest' 
                                                : 'Select a matched roommate to apply together'}
                                        </FormHelperText>
                                    </FormControl>
                                </Box>
                            )}

                            <Box>
                                <TextField
                                    fullWidth
                                    label="Message to Owner"
                                    multiline
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    error={!!fieldErrors.message}
                                    helperText={fieldErrors.message || `${formData.message.length}/500 characters (minimum 20)`}
                                    placeholder="Hi! I'm interested in this property. I'm a student at..."
                                    inputProps={{ maxLength: 500 }}
                                />
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    {existingInquiry ? (
                        <Button
                            onClick={onClose}
                            variant="contained"
                            sx={{
                                bgcolor: COLORS.primary,
                                '&:hover': { bgcolor: COLORS.primaryHover },
                                borderRadius: 50,
                                textTransform: 'none',
                                fontWeight: 800,
                                px: 4,
                                boxShadow: 'none'
                            }}
                        >
                            Close
                        </Button>
                    ) : !success && (
                        <>
                            <Button 
                                onClick={onClose}
                                sx={{ 
                                    borderRadius: 50, 
                                    textTransform: 'none', 
                                    fontWeight: 700,
                                    px: 3 
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                                sx={{
                                    bgcolor: COLORS.primary,
                                    '&:hover': { bgcolor: COLORS.primaryHover },
                                    borderRadius: 50,
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    px: 4,
                                    boxShadow: 'none'
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Inquiry'}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
