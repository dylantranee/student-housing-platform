import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  Avatar, 
  Button, 
  Chip, 
  Stack, 
  CircularProgress,
  Paper,
  Alert
} from '@mui/material';
import { 
  Check, 
  Close, 
  ArrowForward, 
  History, 
  PendingActions, 
  Forum,
  HomeWork,
  Business
} from '@mui/icons-material';
import { getMyRequests, respondToMatchRequest, cancelMatchRequest } from '../service/roommate/matchRequest.service';
import type { MatchRequest } from '../service/roommate/matchRequest.service';
import { getMyInquiries, withdrawInquiry, type PropertyInquiry } from '../service/propertyInquiry.service';
import Header from '../components/layout/Header';
import { COLORS } from '../theme/theme';

const UPLOADS_BASE_URL = 'http://localhost:3000/uploads';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyRequestsPage: React.FC = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<{ incoming: MatchRequest[], outgoing: MatchRequest[] }>({ incoming: [], outgoing: [] });
  const [propertyInquiries, setPropertyInquiries] = useState<PropertyInquiry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [requestsData, inquiriesData] = await Promise.all([
        getMyRequests(),
        getMyInquiries()
      ]);
      setRequests(requestsData);
      setPropertyInquiries(inquiriesData);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleResponse = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
      await respondToMatchRequest(requestId, status);
      fetchRequests(); // Refresh
    } catch (err) {
      alert('Failed to update request');
    }
  };

  const handleCancel = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await cancelMatchRequest(requestId);
      fetchRequests(); // Refresh
    } catch (err) {
      alert('Failed to cancel request');
    }
  };

  const handleWithdrawInquiry = async (inquiryId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this inquiry? The landlord will be notified.')) return;
    try {
      await withdrawInquiry(inquiryId);
      fetchRequests(); // Refresh
    } catch (err) {
      alert('Failed to withdraw inquiry');
    }
  };

  const RequestCard = ({ req, type }: { req: MatchRequest, type: 'incoming' | 'outgoing' }) => {
    const otherUser = type === 'incoming' ? req.senderId : req.receiverId;
    const photoUrl = req.otherUserProfile?.profilePhoto ? (
      req.otherUserProfile.profilePhoto.startsWith('http') ? req.otherUserProfile.profilePhoto : `${UPLOADS_BASE_URL}/${req.otherUserProfile.profilePhoto}`
    ) : undefined;

    return (
      <Card 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 2, 
          borderRadius: 4, 
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            borderColor: '#FF5A5F'
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar src={photoUrl} sx={{ width: 64, height: 64, border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{otherUser.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {req.otherUserProfile?.university?.split(' - ')[0] || 'Community Member'}
                </Typography>
              </Box>
              <Chip 
                label={req.status.toUpperCase()} 
                size="small" 
                color={req.status === 'accepted' ? 'success' : req.status === 'pending' ? 'warning' : 'default'}
                sx={{ fontWeight: 800, px: 1, borderRadius: 2 }}
              />
            </Box>

            <Paper sx={{ p: 2, bgcolor: '#F9F9F9', borderRadius: 3, mb: 2, boxShadow: 'none', border: '1px solid #eee' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#444' }}>
                "{req.message}"
              </Typography>
            </Paper>

            {req.propertyLink && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, bgcolor: '#FFF5F5', borderRadius: 2 }}>
                <HomeWork sx={{ color: COLORS.primary, fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.primary }}>
                  Referencing a property listing
                </Typography>
                <Button 
                  size="small" 
                  href={req.propertyLink} 
                  target="_blank"
                  sx={{ ml: 'auto', textTransform: 'none', fontWeight: 700 }}
                >
                  View Listing
                </Button>
              </Box>
            )}

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {type === 'incoming' && req.status === 'pending' && (
                <>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    startIcon={<Close />}
                    onClick={() => handleResponse(req._id, 'declined')}
                    sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700 }}
                  >
                    Decline
                  </Button>
                  <Button 
                    variant="contained" 
                    disableElevation
                    startIcon={<Check />}
                    onClick={() => handleResponse(req._id, 'accepted')}
                    sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryHover }, borderRadius: 50, textTransform: 'none', fontWeight: 800 }}
                  >
                    Accept
                  </Button>
                </>
              )}
              {type === 'outgoing' && req.status === 'pending' && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => handleCancel(req._id)}
                  sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700 }}
                >
                  Cancel Request
                </Button>
              )}
              {req.status === 'accepted' && (
                <Button 
                  variant="contained" 
                  color="success"
                  startIcon={<Forum />}
                  sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 800 }}
                >
                  Message
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      </Card>
    );
  };

  const PropertyInquiryCard = ({ inquiry }: { inquiry: PropertyInquiry }) => {
    const property = inquiry.propertyId as any;
    const propertyImage = property?.images?.[0] 
      ? (property.images[0].startsWith('http') ? property.images[0] : `${UPLOADS_BASE_URL}/${property.images[0]}`)
      : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80';

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
      <Card 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 2, 
          borderRadius: 4, 
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            borderColor: '#FF5A5F'
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box
            component="img"
            src={propertyImage}
            sx={{
              width: 100,
              height: 100,
              borderRadius: 3,
              objectFit: 'cover',
              border: '2px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {property?.title || 'Property Inquiry'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Submitted on {formatDate(inquiry.createdAt)}
                </Typography>
              </Box>
              <Chip 
                label={inquiry.status.toUpperCase()} 
                size="small" 
                color={inquiry.status === 'rejected' ? 'default' : 'info'}
                sx={{ fontWeight: 800, px: 1, borderRadius: 2 }}
              />
            </Box>

            {inquiry.linkedRoommateName && (
              <Box sx={{ mb: 2, p: 1.5, bgcolor: '#F0F7FF', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  Applying with: {inquiry.linkedRoommateName}
                  {inquiry.linkedRoommateConfirmed && ' ✓'}
                </Typography>
              </Box>
            )}

            <Paper sx={{ p: 2, bgcolor: '#F9F9F9', borderRadius: 3, mb: 2, boxShadow: 'none', border: '1px solid #eee' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, fontWeight: 700 }}>
                Your Message:
              </Typography>
              <Typography variant="body2" sx={{ color: '#444' }}>
                "{inquiry.message}"
              </Typography>
            </Paper>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {['pending', 'contacted', 'viewed'].includes(inquiry.status) && (
                <Button 
                  variant="outlined"
                  color="error"
                  onClick={() => handleWithdrawInquiry(inquiry._id)}
                  sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700 }}
                >
                  Withdraw
                </Button>
              )}
              <Button 
                variant="outlined"
                href={`/property/${property?._id}`}
                sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700 }}
              >
                View Property
              </Button>
            </Stack>
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ bgcolor: '#FDFDFD', minHeight: '100vh', pb: 8 }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 12 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'var(--font-serif)', color: '#222' }}>
            My Handshakes
          </Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
            Manage your roommate connections and hello requests.
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={value} onChange={handleChange} textColor="inherit" indicatorColor="primary">
            <Tab 
              icon={<PendingActions />} 
              iconPosition="start" 
              label={`Incoming (${requests.incoming.filter(r => r.status === 'pending').length})`} 
              sx={{ fontWeight: 700, textTransform: 'none' }} 
            />
            <Tab 
              icon={<ArrowForward />} 
              iconPosition="start" 
              label="Outgoing" 
              sx={{ fontWeight: 700, textTransform: 'none' }} 
            />
            <Tab 
              icon={<History />} 
              iconPosition="start" 
              label="History" 
              sx={{ fontWeight: 700, textTransform: 'none' }} 
            />
            <Tab 
              icon={<Business />} 
              iconPosition="start" 
              label={`Property Inquiries (${propertyInquiries.length})`}
              sx={{ fontWeight: 700, textTransform: 'none' }} 
            />
          </Tabs>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: COLORS.primary }} />
          </Box>
        ) : (
          <>
            <TabPanel value={value} index={0}>
              {requests.incoming.filter(r => r.status === 'pending').length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">No pending requests yet.</Typography>
                  <Typography variant="body2" color="text.secondary">When people say hello, they'll show up here!</Typography>
                </Box>
              ) : (
                requests.incoming.filter(r => r.status === 'pending').map(req => (
                  <RequestCard key={req._id} req={req} type="incoming" />
                ))
              )}
            </TabPanel>

            <TabPanel value={value} index={1}>
              {requests.outgoing.filter(r => r.status === 'pending').length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">No active outgoing requests.</Typography>
                  <Button 
                    variant="text" 
                    href="/roommates/browse"
                    sx={{ color: COLORS.primary, fontWeight: 700, mt: 1 }}
                  >
                    Go find potential roommates
                  </Button>
                </Box>
              ) : (
                requests.outgoing.filter(r => r.status === 'pending').map(req => (
                  <RequestCard key={req._id} req={req} type="outgoing" />
                ))
              )}
            </TabPanel>

            <TabPanel value={value} index={2}>
              {[...requests.incoming, ...requests.outgoing]
                .filter(r => r.status !== 'pending')
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(req => (
                  <RequestCard 
                    key={req._id} 
                    req={req} 
                    type={requests.incoming.some(i => i._id === req._id) ? 'incoming' : 'outgoing'} 
                  />
                ))}
              {([...requests.incoming, ...requests.outgoing].filter(r => r.status !== 'pending').length === 0) && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">Your history is empty.</Typography>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={value} index={3}>
              {propertyInquiries.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">No property inquiries yet.</Typography>
                  <Button 
                    variant="text" 
                    href="/search"
                    sx={{ color: COLORS.primary, fontWeight: 700, mt: 1 }}
                  >
                    Browse Properties
                  </Button>
                </Box>
              ) : (
                propertyInquiries
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(inquiry => (
                    <PropertyInquiryCard key={inquiry._id} inquiry={inquiry} />
                  ))
              )}
            </TabPanel>
          </>
        )}
      </Container>
    </Box>
  );
};

export default MyRequestsPage;
