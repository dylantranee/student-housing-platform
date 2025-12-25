import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    CircularProgress,
    Avatar,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    InputLabel,
    ListItemText,
    OutlinedInput,
    Chip,
    Slider,
} from '@mui/material';
import { PhotoCamera, Save, Publish } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    createRoommateProfile, 
    getRoommateProfile, 
    updateRoommateProfile,
    uploadProfilePhoto 
} from '../../service/roommate/roommateProfile.service';
import type { RoommateProfile, RoommateProfileCreate, RoommateProfileUpdate } from '../../types/roommateProfile.types';
import { UPLOADS_BASE_URL } from '../../config/apiConfig';
import { useNotification } from '../../context/NotificationContext';

const PREDEFINED_UNIVERSITIES = [
    'Vietnam National University, Ho Chi Minh City',
    'University of Technology - VNUHCM',
    'University of Science - VNUHCM',
    'University of Social Sciences and Humanities - VNUHCM',
    'University of Economics and Law - VNUHCM',
    'International University - VNUHCM',
    'University of Economics Ho Chi Minh City',
    'RMIT University Vietnam',
    'British University Vietnam',
    'FPT University',
    'Ton Duc Thang University',
    'Hoa Sen University',
    'Hanoi University of Science and Technology',
    'National Economics University',
    'Foreign Trade University',
];

import { Autocomplete } from '@mui/material';

interface RoommateProfileTabProps {
    userId: string;
}

export default function RoommateProfileTab({ userId }: RoommateProfileTabProps) {
    const queryClient = useQueryClient();
    const { showAlert } = useNotification();
    const [showOtherUniversity, setShowOtherUniversity] = useState(false);
    const [otherUniversity, setOtherUniversity] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        bio: '',
        studyProgram: '',
        university: '',
        moveInDate: null as Dayjs | null,
        budgetMin: 0,
        budgetMax: 10000000, // Large default to avoid filtering issues
        sleepSchedule: '' as 'Early Bird' | 'Night Owl' | 'Flexible' | '',
        cleanliness: 2,
        noiseTolerance: '' as 'Quiet' | 'Moderate' | 'Lively' | '',
        smoking: '' as 'Yes' | 'No' | 'Outside only' | '',
        socialPreference: '' as 'Very social' | 'Moderate' | 'Prefer privacy' | '',
        studyHabits: '' as 'Study at home' | 'Library' | 'Both' | '',
        preferredUniversities: [] as string[],
        roommatesWanted: 1,
        roomType: 'Any' as 'Private' | 'Shared' | 'Any',
        leaseLength: 'Flexible' as '3 months' | '6 months' | '1 year' | 'Flexible',
    });

    const { data: profile, isLoading: loading } = useQuery({
        queryKey: ['roommate-profile', userId],
        queryFn: () => getRoommateProfile(userId),
        enabled: !!userId,
        retry: false, // 404 is common if profile doesn't exist
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                bio: profile.bio || '',
                studyProgram: profile.studyProgram || '',
                university: profile.university || '',
                moveInDate: profile.moveInDate ? dayjs(profile.moveInDate) : null,
                budgetMin: profile.budgetMin ?? 0,
                budgetMax: profile.budgetMax ?? 100000000,
                sleepSchedule: profile.sleepSchedule || '',
                cleanliness: profile.cleanliness || 2,
                noiseTolerance: profile.noiseTolerance || '',
                smoking: profile.smoking || '',
                socialPreference: profile.socialPreference || '',
                studyHabits: profile.studyHabits || '',
                preferredUniversities: profile.preferredUniversities || [],
                roommatesWanted: profile.roommatesWanted || 1,
                roomType: profile.roomType || 'Any',
                leaseLength: profile.leaseLength || 'Flexible',
            });

            
            const customUniversities = (profile.preferredUniversities || []).filter(
                uni => !PREDEFINED_UNIVERSITIES.includes(uni)
            );
            
            if (customUniversities.length > 0) {
                setShowOtherUniversity(true);
                setOtherUniversity(customUniversities.join(', '));
            }
            
            if (profile.profilePhoto) {
                setPhotoPreview(profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `${UPLOADS_BASE_URL}/${profile.profilePhoto}`);
            }
        }
    }, [profile]);

    const saveMutation = useMutation({
        mutationFn: async ({ status }: { status: 'draft' | 'published' }) => {
            let universitiesList = [...formData.preferredUniversities];
            if (formData.preferredUniversities.includes('Other') && otherUniversity.trim()) {
                universitiesList = universitiesList.filter(u => u !== 'Other');
                const customUnis = otherUniversity.split(',').map(u => u.trim()).filter(u => u);
                universitiesList.push(...customUnis);
            }

            const cleanedFormData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => {
                    if (value === '' && ['sleepSchedule', 'noiseTolerance', 'smoking', 'socialPreference', 'studyHabits'].includes(key)) {
                        return [key, undefined];
                    }
                    return [key, value];
                })
            );

            const profileData = {
                ...cleanedFormData,
                moveInDate: formData.moveInDate ? formData.moveInDate.toISOString() : undefined,
                preferredUniversities: universitiesList,
                status,
            };

            let savedProfile: RoommateProfile;
            if (profile) {
                savedProfile = await updateRoommateProfile(profile._id, profileData as RoommateProfileUpdate);
            } else {
                savedProfile = await createRoommateProfile({
                    userId,
                    ...profileData,
                } as RoommateProfileCreate);
            }

            if (photoFile && savedProfile._id) {
                savedProfile = await uploadProfilePhoto(savedProfile._id, photoFile);
                setPhotoFile(null);
            }

            return savedProfile;
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['roommate-profile', userId], data);
            showAlert(variables.status === 'published' ? 'Roommate profile published successfully!' : 'Draft saved successfully!', 'success');
        },
        onError: (err: any) => {
            showAlert(err.message || 'Failed to save profile. Please try again.', 'error');
        }
    });

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showAlert('Photo size must be less than 5MB', 'warning');
                return;
            }
            if (!file.type.startsWith('image/')) {
                return;
            }
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveDraft = () => saveMutation.mutate({ status: 'draft' });

    const handlePublish = () => {
        // Validation with feedback - Only University and Move-in Date are strictly required for matching
        const missingFields = [];
        if (!formData.university) missingFields.push('University');
        if (!formData.moveInDate) missingFields.push('Move-in Date');

        if (missingFields.length > 0) {
            showAlert(`Please complete the required fields: ${missingFields.join(', ')}`, 'warning');
            return;
        }
        saveMutation.mutate({ status: 'published' });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    const saving = saveMutation.isPending;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ py: 2 }}>
                <Stack spacing={4}>
                    {/* Simplified Profile Section for Profile Tab */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #f0f0f0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#222' }}>
                            Roommate Connection Details
                        </Typography>
                        
                        <Stack spacing={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Avatar src={photoPreview} sx={{ width: 100, height: 100, border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Box>
                                    <input accept="image/*" style={{ display: 'none' }} id="photo-upload" type="file" onChange={handlePhotoChange} />
                                    <label htmlFor="photo-upload">
                                    <Button variant="outlined" component="span" startIcon={<PhotoCamera />} sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700 }}>
                                            {photoPreview ? 'Update Photo' : 'Upload Photo'}
                                        </Button>
                                    </label>
                                </Box>
                            </Box>

                            <TextField
                                fullWidth
                                label="Bio / Self Introduction"
                                multiline
                                rows={3}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Hi! I'm looking for a quiet place..."
                                inputProps={{ maxLength: 500 }}
                            />

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Major"
                                    value={formData.studyProgram}
                                    onChange={(e) => setFormData({ ...formData, studyProgram: e.target.value })}
                                />
                                <Autocomplete
                                    fullWidth
                                    options={PREDEFINED_UNIVERSITIES}
                                    value={formData.university}
                                    onChange={(_, newValue) => setFormData({ ...formData, university: newValue || '' })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="University *"
                                            placeholder="Select your university"
                                        />
                                    )}
                                    freeSolo
                                />
                            </Stack>

                            <DatePicker
                                label="Target Move-in Date *"
                                value={formData.moveInDate}
                                onChange={(newValue) => setFormData({ ...formData, moveInDate: newValue })}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Stack>
                    </Paper>

                    {/* Lifestyle Preferences - Keep it compact */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #f0f0f0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#222' }}>
                            Lifestyle Preferences
                        </Typography>
                        <Stack spacing={3}>
                            <FormControl component="fieldset">
                                <FormLabel sx={{ fontWeight: 700, mb: 1 }}>Sleep Schedule</FormLabel>
                                <RadioGroup row value={formData.sleepSchedule} onChange={(e) => setFormData({ ...formData, sleepSchedule: e.target.value as any })}>
                                    <FormControlLabel value="Early Bird" control={<Radio size="small" />} label="Early Bird" />
                                    <FormControlLabel value="Night Owl" control={<Radio size="small" />} label="Night Owl" />
                                    <FormControlLabel value="Flexible" control={<Radio size="small" />} label="Flexible" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl component="fieldset">
                                <FormLabel sx={{ fontWeight: 700, mb: 1 }}>Cleanliness</FormLabel>
                                <RadioGroup row value={formData.cleanliness} onChange={(e) => setFormData({ ...formData, cleanliness: Number(e.target.value) })}>
                                    <FormControlLabel value={1} control={<Radio size="small" />} label="Laid back" />
                                    <FormControlLabel value={2} control={<Radio size="small" />} label="Moderate" />
                                    <FormControlLabel value={3} control={<Radio size="small" />} label="Super neat" />
                                </RadioGroup>
                            </FormControl>
                            
                            <FormControl component="fieldset">
                                <FormLabel sx={{ fontWeight: 700, mb: 1 }}>Smoking</FormLabel>
                                <RadioGroup row value={formData.smoking} onChange={(e) => setFormData({ ...formData, smoking: e.target.value as any })}>
                                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                                    <FormControlLabel value="Outside only" control={<Radio size="small" />} label="Outside" />
                                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                                </RadioGroup>
                            </FormControl>

                            <Box sx={{ mt: 2 }}>
                                <Typography gutterBottom sx={{ fontWeight: 700 }}>
                                    Monthly Budget (VND): {formData.budgetMin.toLocaleString()} - {formData.budgetMax.toLocaleString()}
                                </Typography>
                                <Slider
                                    value={[formData.budgetMin, formData.budgetMax]}
                                    onChange={(_, newValue) => {
                                        const [min, max] = newValue as number[];
                                        setFormData({ ...formData, budgetMin: min, budgetMax: max });
                                    }}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={10000000}
                                    step={100000}
                                    sx={{ color: '#FF5A5F' }}
                                />
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Roommate Requirements Section */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #f0f0f0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#222' }}>
                            Roommate Requirements
                        </Typography>
                        <Stack spacing={4}>
                            <FormControl fullWidth>
                                <InputLabel>Preferred Universities</InputLabel>
                                <Select
                                    multiple
                                    value={formData.preferredUniversities}
                                    onChange={(e) => {
                                        const value = e.target.value as string[];
                                        setFormData({ ...formData, preferredUniversities: value });
                                        setShowOtherUniversity(value.includes('Other'));
                                    }}
                                    input={<OutlinedInput label="Preferred Universities" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value === 'Other' ? 'Other' : value.split(' - ')[0]} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {PREDEFINED_UNIVERSITIES.map((uni) => (
                                        <MenuItem key={uni} value={uni}>
                                            <ListItemText primary={uni} />
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="Other"><ListItemText primary="Other" /></MenuItem>
                                </Select>
                            </FormControl>

                            {showOtherUniversity && (
                                <TextField
                                    fullWidth
                                    label="Specify Universities (comma-separated)"
                                    value={otherUniversity}
                                    onChange={(e) => setOtherUniversity(e.target.value)}
                                />
                            )}

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                                <FormControl component="fieldset" sx={{ flex: 1 }}>
                                    <FormLabel sx={{ fontWeight: 700, mb: 1 }}>Room Type</FormLabel>
                                    <RadioGroup row value={formData.roomType} onChange={(e) => setFormData({ ...formData, roomType: e.target.value as any })}>
                                        <FormControlLabel value="Private" control={<Radio size="small" />} label="Private" />
                                        <FormControlLabel value="Shared" control={<Radio size="small" />} label="Shared" />
                                        <FormControlLabel value="Any" control={<Radio size="small" />} label="Any" />
                                    </RadioGroup>
                                </FormControl>
                                <FormControl component="fieldset" sx={{ flex: 1 }}>
                                    <FormLabel sx={{ fontWeight: 700, mb: 1 }}>Lease Length</FormLabel>
                                    <RadioGroup row value={formData.leaseLength} onChange={(e) => setFormData({ ...formData, leaseLength: e.target.value as any })}>
                                        <FormControlLabel value="6 months" control={<Radio size="small" />} label="6m" />
                                        <FormControlLabel value="1 year" control={<Radio size="small" />} label="1y" />
                                        <FormControlLabel value="Flexible" control={<Radio size="small" />} label="Flex" />
                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Save />}
                            onClick={handleSaveDraft}
                            disabled={saving}
                            sx={{ borderRadius: 50, px: 4, fontWeight: 700, textTransform: 'none' }}
                        >
                            Save Draft
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Publish />}
                            onClick={handlePublish}
                            disabled={saving}
                            sx={{ bgcolor: '#FF5A5F', '&:hover': { bgcolor: '#FF385C' }, borderRadius: 50, px: 4, fontWeight: 800, textTransform: 'none', boxShadow: 'none' }}
                        >
                            {saving ? <CircularProgress size={24} /> : 'Publish Profile'}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
}
