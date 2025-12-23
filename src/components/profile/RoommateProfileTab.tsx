import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    Slider,
    Alert,
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
    Checkbox,
    ListItemText,
    OutlinedInput,
    Chip,
} from '@mui/material';
import { PhotoCamera, Save, Publish } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { 
    createRoommateProfile, 
    getRoommateProfile, 
    updateRoommateProfile,
    uploadProfilePhoto 
} from '../../service/roommate/roommateProfile.service';
import type { RoommateProfile, RoommateProfileCreate, RoommateProfileUpdate } from '../../types/roommateProfile.types';
import { UPLOADS_BASE_URL } from '../../config/apiConfig';

interface RoommateProfileTabProps {
    userId: string;
}

export default function RoommateProfileTab({ userId }: RoommateProfileTabProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<RoommateProfile | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showOtherUniversity, setShowOtherUniversity] = useState(false);
    const [otherUniversity, setOtherUniversity] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        bio: '',
        studyProgram: '',
        university: '',
        moveInDate: null as Dayjs | null,
        budgetMin: 3000000,
        budgetMax: 8000000,
        // Lifestyle Preferences
        sleepSchedule: '' as 'Early Bird' | 'Night Owl' | 'Flexible' | '',
        cleanliness: 2,
        noiseTolerance: '' as 'Quiet' | 'Moderate' | 'Lively' | '',
        smoking: '' as 'Yes' | 'No' | 'Outside only' | '',
        socialPreference: '' as 'Very social' | 'Moderate' | 'Prefer privacy' | '',
        studyHabits: '' as 'Study at home' | 'Library' | 'Both' | '',
        // Roommate Requirements
        preferredUniversities: [] as string[],
        roommatesWanted: 1,
        roomType: 'Any' as 'Private' | 'Shared' | 'Any',
        leaseLength: 'Flexible' as '3 months' | '6 months' | '1 year' | 'Flexible',
    });

    useEffect(() => {
        if (userId) {
            loadProfile();
        }
    }, [userId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const existingProfile = await getRoommateProfile(userId);
            setProfile(existingProfile);
            
            // Populate form
            setFormData({
                bio: existingProfile.bio || '',
                studyProgram: existingProfile.studyProgram || '',
                university: existingProfile.university || '',
                moveInDate: existingProfile.moveInDate ? dayjs(existingProfile.moveInDate) : null,
                budgetMin: existingProfile.budgetMin || 3000000,
                budgetMax: existingProfile.budgetMax || 8000000,
                // Lifestyle Preferences
                sleepSchedule: existingProfile.sleepSchedule || '',
                cleanliness: existingProfile.cleanliness || 2,
                noiseTolerance: existingProfile.noiseTolerance || '',
                smoking: existingProfile.smoking || '',
                socialPreference: existingProfile.socialPreference || '',
                studyHabits: existingProfile.studyHabits || '',
                // Roommate Requirements
                preferredUniversities: existingProfile.preferredUniversities || [],
                roommatesWanted: existingProfile.roommatesWanted || 1,
                roomType: existingProfile.roomType || 'Any',
                leaseLength: existingProfile.leaseLength || 'Flexible',
            });
            
            // Check if any university is a custom value
            const predefinedUniversities = [
                'Vietnam National University, Ho Chi Minh City', 'University of Technology - VNUHCM',
                'University of Science - VNUHCM', 'University of Social Sciences and Humanities - VNUHCM',
                'University of Economics and Law - VNUHCM', 'International University - VNUHCM',
                'University of Economics Ho Chi Minh City',
                'RMIT University Vietnam', 'British University Vietnam', 'FPT University',
                'Ton Duc Thang University', 'Hoa Sen University'
            ];
            
            const customUniversities = (existingProfile.preferredUniversities || []).filter(
                uni => !predefinedUniversities.includes(uni)
            );
            
            if (customUniversities.length > 0) {
                setShowOtherUniversity(true);
                setOtherUniversity(customUniversities.join(', '));
            }
            
            if (existingProfile.profilePhoto) {
                setPhotoPreview(existingProfile.profilePhoto.startsWith('http') ? existingProfile.profilePhoto : `${UPLOADS_BASE_URL}/${existingProfile.profilePhoto}`);
            }
        } catch (profileErr: any) {
            if (profileErr.response?.status === 404) {
                // Expected - user hasn't created a profile yet, no need to log as error
                console.log('No existing profile found');
            } else {
                console.error('Error loading profile:', profileErr);
                setError('Failed to load roommate profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Only image files are allowed');
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

    const handleSaveDraft = async () => {
        await saveProfile('draft');
    };

    const handlePublish = async () => {
        if (!formData.bio || !formData.studyProgram || !formData.university || !formData.moveInDate) {
            setError('Please fill all required fields before publishing');
            return;
        }
        await saveProfile('published');
    };

    const saveProfile = async (status: 'draft' | 'published') => {
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            let universitiesList = [...formData.preferredUniversities];
            if (formData.preferredUniversities.includes('Other') && otherUniversity.trim()) {
                universitiesList = universitiesList.filter(u => u !== 'Other');
                const customUnis = otherUniversity.split(',').map(u => u.trim()).filter(u => u);
                universitiesList.push(...customUnis);
            }
            
            // Clean up profileData to remove empty strings for fields that backend models might expect to be optional or valid enums
            const cleanedFormData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => {
                    // If it's an empty string and not a critical field, set to undefined/null or omit
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

            setProfile(savedProfile);
            setSuccess(status === 'published' ? 'Roommate profile published!' : 'Draft saved!');
        } catch (err: any) {
            const backendError = err.response?.data;
            if (backendError?.errors && Array.isArray(backendError.errors)) {
                setError(`${backendError.message}: ${backendError.errors.join(', ')}`);
            } else {
                setError(backendError?.message || 'Failed to save profile');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ py: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

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
                                            Update Photo
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
                                <TextField
                                    fullWidth
                                    label="University"
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                />
                            </Stack>

                            <DatePicker
                                label="Target Move-in Date"
                                value={formData.moveInDate}
                                onChange={(newValue) => setFormData({ ...formData, moveInDate: newValue })}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                            
                            <Box>
                                <Typography gutterBottom sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                    Monthly Budget Range (₫)
                                </Typography>
                                <Slider
                                    value={[formData.budgetMin, formData.budgetMax]}
                                    onChange={(_, newValue) => {
                                        const [min, max] = newValue as number[];
                                        setFormData({ ...formData, budgetMin: min, budgetMax: max });
                                    }}
                                    valueLabelDisplay="auto"
                                    min={1000000}
                                    max={15000000}
                                    step={500000}
                                    valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)}M`}
                                    sx={{ color: '#FF5A5F' }}
                                />
                            </Box>
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
                                    <MenuItem value="Vietnam National University, Ho Chi Minh City"><ListItemText primary="VNU-HCM" /></MenuItem>
                                    <MenuItem value="University of Technology - VNUHCM"><ListItemText primary="UT - VNUHCM" /></MenuItem>
                                    <MenuItem value="RMIT University Vietnam"><ListItemText primary="RMIT Vietnam" /></MenuItem>
                                    <MenuItem value="FPT University"><ListItemText primary="FPT University" /></MenuItem>
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
