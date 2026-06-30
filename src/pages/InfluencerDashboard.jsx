import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Check, CheckCircle, ClipboardList, DollarSign, Edit, MapPin, Plus, Send, Sparkles, User as UserIcon, Camera, MessageCircle, Trash, Mail, ExternalLink, Calendar } from 'lucide-react';

const InfluencerDashboard = () => {
  const navigate = useNavigate();
  const getBackendUrl = () => {
    const base = api.defaults.baseURL || '';
    return base.endsWith('/api') ? base.slice(0, -4) : base;
  };
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editStep, setEditStep] = useState(1);

  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [categories, setCategories] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [instagramFollowers, setInstagramFollowers] = useState(0);
  const [youtubeFollowers, setYoutubeFollowers] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [userName, setUserName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagline, setTagline] = useState('');
  const [pastBrands, setPastBrands] = useState('');
  const [featuredVideo, setFeaturedVideo] = useState('');
  const [featuredVideo2, setFeaturedVideo2] = useState('');
  const [featuredVideo3, setFeaturedVideo3] = useState('');
  const [videoLayout, setVideoLayout] = useState('1p_2l');
  const [photos, setPhotos] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [services, setServices] = useState([]);
  const [instagramEngagement, setInstagramEngagement] = useState(3.5);
  const [youtubeEngagement, setYoutubeEngagement] = useState(4.8);
  const [audienceGenderMale, setAudienceGenderMale] = useState(50);
  const [audienceGenderFemale, setAudienceGenderFemale] = useState(50);
  const [audienceTopCountries, setAudienceTopCountries] = useState('');
  const [audienceAgeRange, setAudienceAgeRange] = useState('');
  const [contentFormats, setContentFormats] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [faqs, setFaqs] = useState([]);

  const [submittingDeliverable, setSubmittingDeliverable] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [instagramPost, setInstagramPost] = useState('');
  const [youtubeVideo, setYoutubeVideo] = useState('');
  const [reelLink, setReelLink] = useState('');
  const [screenshotUpload, setScreenshotUpload] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [showDeliverableForm, setShowDeliverableForm] = useState(null);
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');

  const loadDashboardData = async () => {
    try {
      const profileRes = await api.get('/users/profile');
      setProfile(profileRes.data.profile);
      if (profileRes.data.user) {
        setUserName(profileRes.data.user.name || '');
        setProfileImage(profileRes.data.user.profileImage || '');
      }
      if (profileRes.data.profile) {
        const p = profileRes.data.profile;
        setBio(p.bio || '');
        setLocation(p.location || '');
        setCategories(p.categories?.join(', ') || '');
        setPortfolioItems(p.portfolio || []);
        setTagline(p.tagline || '');
        setPastBrands(p.pastBrands || '');
        setFeaturedVideo(p.featuredVideo || '');
        setFeaturedVideo2(p.featuredVideo2 || '');
        setFeaturedVideo3(p.featuredVideo3 || '');
        setVideoLayout(p.videoLayout || '1p_2l');
        setPhotos(p.photos || []);
        setServices(p.services || []);
        setAudienceGenderMale(p.audienceGenderMale ?? 50);
        setAudienceGenderFemale(p.audienceGenderFemale ?? 50);
        setAudienceTopCountries(p.audienceTopCountries || '');
        setAudienceAgeRange(p.audienceAgeRange || '');
        setContentFormats(p.contentFormats || '');
        setBusinessEmail(p.businessEmail || '');
        setBusinessPhone(p.businessPhone || '');
        setFaqs(p.faqs || []);

        const instaAcc = p.socialAccounts?.find(s => s.platform === 'instagram');
        if (instaAcc) {
          setInstagram(instaAcc.username || '');
          setInstagramFollowers(instaAcc.followers || 0);
          setInstagramEngagement(instaAcc.engagementRate || 3.5);
        }
        const ytAcc = p.socialAccounts?.find(s => s.platform === 'youtube');
        if (ytAcc) {
          setYoutube(ytAcc.username || '');
          setYoutubeFollowers(ytAcc.followers || 0);
          setYoutubeEngagement(ytAcc.engagementRate || 4.8);
        }
      }

      const walletRes = await api.get('/payments/wallet');
      setWallet(walletRes.data.wallet);
      setTransactions(walletRes.data.transactions);

      const appsRes = await api.get('/applications/my-applications');
      setApplications(appsRes.data);

      const userRes = profileRes.data.user;
      if (userRes?._id) {
        const reviewsRes = await api.get(`/reviews/influencer/${userRes._id}`).catch(() => null);
        if (reviewsRes) setReviews(reviewsRes.data);
      }

      const invRes = await api.get('/campaign-requests/my-invitations').catch(() => null);
      if (invRes) setInvitations(invRes.data);
    } catch (e) {
      console.warn('Dashboard data fetch warning', e);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const socialAccounts = [];
      if (instagram) {
        socialAccounts.push({ platform: 'instagram', username: instagram, followers: Number(instagramFollowers), engagementRate: Number(instagramEngagement) || 3.5 });
      }
      if (youtube) {
        socialAccounts.push({ platform: 'youtube', username: youtube, followers: Number(youtubeFollowers), engagementRate: Number(youtubeEngagement) || 4.8 });
      }

      const res = await api.put('/users/profile', {
        profileImage,
        bio,
        location,
        categories: categories.split(',').map(c => c.trim()).filter(Boolean),
        socialAccounts,
        portfolio: portfolioItems,
        tagline,
        pastBrands,
        featuredVideo,
        featuredVideo2,
        featuredVideo3,
        videoLayout,
        photos,
        services,
        audienceGenderMale: Number(audienceGenderMale) || 50,
        audienceGenderFemale: Number(audienceGenderFemale) || 50,
        audienceTopCountries,
        audienceAgeRange,
        contentFormats,
        businessEmail,
        businessPhone,
        faqs
      });

      alert('Profile updated successfully!');
      
      const userId = res.data?.user?._id || res.data?.user?.id;
      if (userId) {
        navigate(`/influencer/${userId}`);
      } else {
        loadDashboardData();
        setActiveTab('overview');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfileImage(res.data.profileImage);
      alert('Image uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.');
      return;
    }

    if (photos.length >= 3) {
      alert('You can only upload up to 3 photos.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingPhoto(true);
    try {
      const res = await api.post('/users/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPhotos(prev => [...prev, res.data.fileUrl]);
      alert('Photo uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleStartChat = async (participantId) => {
    try {
      const res = await api.post('/chats', { participantId });
      navigate('/chat', { state: { activeChatId: res.data._id } });
    } catch (err) {
      alert('Failed to start chat');
    }
  };

  const handleSubmitDeliverables = async (e) => {
    e.preventDefault();
    setSubmittingDeliverable(true);
    try {
      await api.patch(`/applications/${selectedAppId}/submit-deliverables`, {
        instagramPost,
        youtubeVideo,
        reelLink,
        screenshot: screenshotUpload,
      });
      alert('Deliverables submitted successfully!');
      setSelectedAppId(null);
      setInstagramPost('');
      setYoutubeVideo('');
      setReelLink('');
      setScreenshotUpload('');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit deliverables');
    } finally {
      setSubmittingDeliverable(false);
    }
  };

  const handleWithdrawRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments/withdraw', { amount: Number(withdrawAmount) });
      alert('Withdrawal request submitted successfully!');
      setWithdrawAmount('');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request withdrawal');
    }
  };

  const graphData = transactions
    .filter(t => t.type === 'credit')
    .slice(0, 6)
    .reverse()
    .map((t, idx) => ({
      name: `Payout ${idx + 1}`,
      amount: t.amount,
    }));

  const activeApps = applications.filter(a => a.status === 'approved' || a.status === 'delivered');
  const pendingApps = applications.filter(a => a.status === 'applied' || a.status === 'under_review' || a.status === 'shortlisted');
  const editSteps = ['Profile Basics', 'Content Portfolio', 'Social & Audience', 'Business & Services'];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-neutral-900">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-full overflow-hidden bg-brand-50 border border-neutral-200 flex items-center justify-center font-bold text-brand-600 text-lg flex-shrink-0">
              {profileImage ? (
                <img src={`${getBackendUrl()}${profileImage}`} className="h-full w-full object-cover" alt="Profile" />
              ) : (
                <UserIcon size={24} className="text-brand-500" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800">{userName || 'Creator Dashboard'}</h2>
              <div className="flex items-center space-x-2 text-xs text-neutral-500 mt-1">
                <MapPin size={14} />
                <span>{profile?.location || 'Location Not Specified'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xs md:text-right">
            <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1.5">
              <span>Profile Completion</span>
              <span className="text-brand-600">{profile?.profileCompletion || 0}%</span>
            </div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full transition-all duration-500" style={{ width: `${profile?.profileCompletion || 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-neutral-200 mb-6 space-x-4">
          {['overview', 'campaigns', 'invitations', 'edit-profile', 'wallet'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-all ${activeTab === tab ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 mb-3">
                    <DollarSign size={20} />
                  </div>
                  <p className="text-2xl font-extrabold text-neutral-800">${profile?.totalEarnings || 0}</p>
                  <p className="text-xs text-neutral-400 font-semibold uppercase mt-0.5">Total Earnings</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500 mb-3">
                    <CheckCircle size={20} />
                  </div>
                  <p className="text-2xl font-extrabold text-neutral-800">{activeApps.length}</p>
                  <p className="text-xs text-neutral-400 font-semibold uppercase mt-0.5">Active Contracts</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-3">
                    <ClipboardList size={20} />
                  </div>
                  <p className="text-2xl font-extrabold text-neutral-800">{pendingApps.length}</p>
                  <p className="text-xs text-neutral-400 font-semibold uppercase mt-0.5">Pending Proposals</p>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-neutral-800 mb-4">Earnings History</h3>
                <div className="h-64">
                  {graphData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-neutral-400">No earnings records yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} />
                        <YAxis stroke="#a1a1aa" fontSize={11} />
                        <Tooltip />
                        <Area type="monotone" dataKey="amount" stroke="#0e81ec" fill="rgba(14, 129, 236, 0.1)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
                  <h3 className="text-sm font-bold text-neutral-800">My Niche Profiles</h3>
                  <Sparkles size={16} className="text-brand-500" />
                </div>
                <div className="space-y-3.5 text-sm">
                  <div>
                    <span className="text-xs font-semibold text-neutral-400 uppercase">Categories</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {profile?.categories?.length > 0 ? (
                        profile.categories.map((c, idx) => (
                          <span key={idx} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600">{c}</span>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-400 italic">None specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-400 uppercase">Linked Accounts</span>
                    <div className="space-y-2 mt-2">
                      {profile?.socialAccounts?.map((acc, idx) => (
                        <div key={idx} className="flex justify-between items-center rounded-xl bg-neutral-50 p-2.5 border border-neutral-100">
                          <span className="capitalize font-bold text-xs text-neutral-700">{acc.platform}</span>
                          <span className="text-xs text-neutral-500">@{acc.username} ({acc.followers.toLocaleString()} fans)</span>
                        </div>
                      )) || <div className="text-xs text-neutral-400 italic">No social accounts linked</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
                  <h3 className="text-sm font-bold text-neutral-800">Rating & Reviews</h3>
                  <span className="text-amber-400 text-sm">★</span>
                </div>
                {(profile?.averageRating ?? 0) > 0 ? (
                  <>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl font-extrabold text-neutral-800">{profile.averageRating}</span>
                      <div className="flex text-amber-400 text-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>{star <= Math.round(profile.averageRating) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400">({profile.reviewCount} review{profile.reviewCount !== 1 ? 's' : ''})</span>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {reviews.map((r) => (
                        <div key={r._id} className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-amber-400 text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                              <span className="text-[10px] font-semibold text-neutral-500">{r.brand?.name || 'Brand'}</span>
                            </div>
                            <span className="text-[9px] text-neutral-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                          {r.comment && <p className="text-xs text-neutral-600 mt-1">{r.comment}</p>}
                          {r.campaign?.title && (
                            <p className="text-[10px] text-neutral-400 mt-1 italic">Campaign: {r.campaign.title}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-xs text-neutral-400">No reviews yet. Complete a campaign to receive your first rating!</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-800 mb-6 flex items-center space-x-2">
              <Mail size={18} className="text-brand-500" />
              <span>Campaign Invitations</span>
              {invitations.filter(i => i.status === 'invited').length > 0 && (
                <span className="rounded-full bg-amber-50 text-amber-600 px-2 py-0.5 text-[10px] font-bold">{invitations.filter(i => i.status === 'invited').length} new</span>
              )}
            </h3>

            {invitations.length === 0 ? (
              <div className="text-center py-12 text-sm text-neutral-400">No campaign invitations yet.</div>
            ) : (
              <div className="space-y-4">
                {invitations.map((inv) => {
                  const cr = inv.campaignRequest;
                  return (
                    <div key={inv._id} className="rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-neutral-800">{cr?.title || 'Campaign'}</h4>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                              inv.status === 'invited' ? 'bg-blue-50 text-blue-600' :
                              inv.status === 'accepted' ? 'bg-green-50 text-green-600' :
                              inv.status === 'submitted' ? 'bg-purple-50 text-purple-600' :
                              inv.status === 'approved' ? 'bg-brand-50 text-brand-600' :
                              'bg-red-50 text-red-600'
                            }`}>{inv.status}</span>
                          </div>
                          {cr?.description && <p className="text-xs text-neutral-500 mt-1">{cr.description.substring(0, 200)}</p>}
                          <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-neutral-400">
                            {cr?.budget > 0 && <span className="flex items-center gap-1"><DollarSign size={12} />${cr.budget.toLocaleString()}</span>}
                            {cr?.location && <span className="flex items-center gap-1"><MapPin size={12} />{cr.location}</span>}
                            {cr?.timeline && <span className="flex items-center gap-1"><Calendar size={12} />{cr.timeline}</span>}
                            {cr?.categories?.length > 0 && cr.categories.map((c, i) => <span key={i} className="rounded-full bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 border border-neutral-100">{c}</span>)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center space-x-2">
                        {inv.status === 'invited' && (
                          <>
                            <button onClick={async () => { try { await api.patch(`/campaign-requests/my-invitations/${inv._id}/respond`, { status: 'accepted' }); const r = await api.get('/campaign-requests/my-invitations'); setInvitations(r.data); } catch (e) { alert('Failed to accept'); } }} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">Accept</button>
                            <button onClick={async () => { try { await api.patch(`/campaign-requests/my-invitations/${inv._id}/respond`, { status: 'rejected' }); const r = await api.get('/campaign-requests/my-invitations'); setInvitations(r.data); } catch (e) { alert('Failed to reject'); } }} className="rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100">Decline</button>
                          </>
                        )}
                        {inv.status === 'accepted' && (
                          <button onClick={() => setShowDeliverableForm(showDeliverableForm === inv._id ? null : inv._id)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700">
                            {showDeliverableForm === inv._id ? 'Cancel' : 'Submit Deliverables'}
                          </button>
                        )}
                        {inv.status === 'submitted' && <span className="text-xs text-purple-600 font-semibold">Awaiting approval</span>}
                        {inv.status === 'approved' && <span className="text-xs text-green-600 font-semibold">Approved ✓</span>}
                        {inv.status === 'rejected' && <span className="text-xs text-red-600 font-semibold">Declined</span>}
                      </div>

                      {showDeliverableForm === inv._id && (
                        <div className="mt-3 rounded-lg border border-neutral-200 p-3 space-y-2 bg-neutral-50/50">
                          <input type="text" value={deliverableTitle} onChange={(e) => setDeliverableTitle(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs focus:border-brand-500 focus:outline-none" placeholder="Title (e.g. Instagram Post)" />
                          <input type="url" value={deliverableUrl} onChange={(e) => setDeliverableUrl(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs focus:border-brand-500 focus:outline-none" placeholder="URL to content" />
                          <input type="text" value={deliverableNotes} onChange={(e) => setDeliverableNotes(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs focus:border-brand-500 focus:outline-none" placeholder="Notes (optional)" />
                          <button onClick={async () => { if (!deliverableTitle || !deliverableUrl) return; try { await api.post(`/campaign-requests/my-invitations/${inv._id}/deliverables`, { title: deliverableTitle, url: deliverableUrl, notes: deliverableNotes }); setDeliverableTitle(''); setDeliverableUrl(''); setDeliverableNotes(''); setShowDeliverableForm(null); const r = await api.get('/campaign-requests/my-invitations'); setInvitations(r.data); } catch (e) { alert('Failed to submit'); } }} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700">Submit</button>
                        </div>
                      )}

                      {inv.deliverables?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {inv.deliverables.map((d) => (
                            <a key={d._id} href={d.url} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 rounded-lg bg-neutral-50 border border-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-neutral-600 hover:bg-neutral-100">
                              <ExternalLink size={10} />
                              <span>{d.title || 'View'}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-800 mb-6">My Campaigns & Applications</h3>
            <div className="space-y-4">
                {applications.length === 0 ? (
                <div className="text-center py-12 text-sm text-neutral-400">You haven't applied to any campaigns yet</div>
              ) : (
                applications.map((app) => {
                  const hasDeliverables = app.deliverables?.instagramPost || app.deliverables?.youtubeVideo || app.deliverables?.reelLink || app.deliverables?.screenshot;
                  return (
                    <div key={app._id} className="rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-800">{app.campaign?.title}</h4>
                          <p className="text-xs text-neutral-400 mt-1">Category: {app.campaign?.category} | Proposed: ${app.proposedRate}</p>

                          {(app.status === 'approved' || app.status === 'delivered' || app.status === 'completed') && app.campaign && (
                            <div className="mt-3 rounded-xl bg-neutral-50 p-3 border border-neutral-100 text-xs text-neutral-600 space-y-1">
                              <p><span className="font-semibold text-neutral-700">Instructions:</span> {app.campaign.description}</p>
                              <p><span className="font-semibold text-neutral-700">Deadline:</span> {new Date(app.campaign.endDate).toLocaleDateString()}</p>
                              <p><span className="font-semibold text-neutral-700">Target Audience:</span> {app.campaign.targetAudience || 'General'}</p>
                            </div>
                          )}

                          {hasDeliverables && (
                            <div className="mt-3 space-y-1">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Submitted Deliverables</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {app.deliverables?.instagramPost && (
                                  <a href={app.deliverables.instagramPost} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-600 hover:underline">Instagram Post</a>
                                )}
                                {app.deliverables?.youtubeVideo && (
                                  <a href={app.deliverables.youtubeVideo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:underline">YouTube Video</a>
                                )}
                                {app.deliverables?.reelLink && (
                                  <a href={app.deliverables.reelLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600 hover:underline">Reel</a>
                                )}
                                {app.deliverables?.screenshot && (
                                  <a href={app.deliverables.screenshot} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:underline">Screenshot</a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3.5 shrink-0">
                          <button
                            onClick={() => handleStartChat(app.campaign?.brand?._id)}
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 flex items-center gap-1"
                          >
                            <MessageCircle size={12} />
                            Message
                          </button>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${app.status === 'approved' ? 'bg-green-50 text-green-600' :
                              app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                app.status === 'delivered' ? 'bg-purple-50 text-purple-600' :
                                  app.status === 'completed' ? 'bg-brand-50 text-brand-600' :
                                    'bg-amber-50 text-amber-600'
                            }`}>
                            {app.status}
                          </span>
                          {app.status === 'approved' && !hasDeliverables && (
                            <button
                              onClick={() => {
                                setSelectedAppId(app._id);
                                setInstagramPost('');
                                setYoutubeVideo('');
                                setReelLink('');
                                setScreenshotUpload('');
                              }}
                              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors"
                            >
                              Submit Work
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'edit-profile' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-base font-bold text-neutral-800 mb-6">Edit Creator Profile</h3>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
              {editSteps.map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = editStep === stepNum;
                const isDone = editStep > stepNum;
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all ${
                        isDone ? 'bg-brand-600 text-white' :
                        isActive ? 'bg-brand-600 text-white ring-4 ring-brand-100' :
                        'bg-neutral-100 text-neutral-400'
                      }`}>
                        {isDone ? <Check size={14} /> : stepNum}
                      </div>
                      <span className={`mt-1 text-[10px] font-semibold whitespace-nowrap ${
                        isActive ? 'text-brand-600' : 'text-neutral-400'
                      }`}>{label}</span>
                    </div>
                    {idx < editSteps.length - 1 && (
                      <div className={`flex-1 h-px mx-3 ${editStep > stepNum ? 'bg-brand-600' : 'bg-neutral-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {editStep === 1 && (
              <div className="space-y-5 mb-6">
                <div className="flex items-center space-x-6 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200/60 mb-6">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0 group">
                    {profileImage ? (
                      <img src={`${getBackendUrl()}${profileImage}`} className="h-full w-full object-cover" alt="Avatar Preview" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-neutral-450 font-bold text-2xl bg-neutral-100">
                        {userName ? userName.charAt(0).toUpperCase() : <UserIcon size={32} />}
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Profile Picture</span>
                    <div className="flex items-center space-x-3">
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm">
                        <Camera size={14} className="mr-1.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                      </label>
                      {profileImage && (
                        <button type="button" onClick={() => setProfileImage('')} className="text-xs font-semibold text-neutral-500 hover:text-red-650 transition-colors cursor-pointer">Remove</button>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-450">JPG, PNG or WEBP. Max 2MB.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tagline / Hook</label>
                  <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. Professional Technology Filmmaker & Digital Storyteller" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Bio / Description</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" rows={3} placeholder="Tell brands about your voice, themes, and past work..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50">
                      <option value="">Select location...</option>
                      <option value="Mumbai, Maharashtra, India">Mumbai, India</option>
                      <option value="Delhi, India">Delhi, India</option>
                      <option value="Bangalore, Karnataka, India">Bangalore, India</option>
                      <option value="Hyderabad, Telangana, India">Hyderabad, India</option>
                      <option value="Chennai, Tamil Nadu, India">Chennai, India</option>
                      <option value="Kolkata, West Bengal, India">Kolkata, India</option>
                      <option value="Pune, Maharashtra, India">Pune, India</option>
                      <option value="Ahmedabad, Gujarat, India">Ahmedabad, India</option>
                      <option value="Jaipur, Rajasthan, India">Jaipur, India</option>
                      <option value="Lucknow, Uttar Pradesh, India">Lucknow, India</option>
                      <option value="London, UK">London, UK</option>
                      <option value="New York, USA">New York, USA</option>
                      <option value="Los Angeles, USA">Los Angeles, USA</option>
                      <option value="Dubai, UAE">Dubai, UAE</option>
                      <option value="Toronto, Canada">Toronto, Canada</option>
                      <option value="Sydney, Australia">Sydney, Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['Tech', 'Fashion', 'Travel', 'Food', 'Fitness', 'Beauty', 'Lifestyle', 'Gaming', 'Music', 'Comedy', 'Education', 'Business', 'Photography', 'Sports', 'Parenting'].map((cat) => {
                        const selected = categories.split(',').map(c => c.trim()).filter(Boolean).includes(cat);
                        return (
                          <label key={cat} className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all ${selected ? 'bg-brand-600 text-white border-brand-600' : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:border-brand-500 hover:text-brand-600'}`}>
                            <input type="checkbox" className="hidden" checked={selected} onChange={() => {
                              const current = categories.split(',').map(c => c.trim()).filter(Boolean);
                              setCategories(selected ? current.filter(c => c !== cat).join(', ') : [...current, cat].join(', '));
                            }} />
                            {cat}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Brands Collaborated With (Comma separated)</label>
                    <input type="text" value={pastBrands} onChange={(e) => setPastBrands(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="Samsung, Nike, Google, Amazon" />
                  </div>
                </div>
              </div>
            )}

            {editStep === 2 && (
              <div className="space-y-5 mb-6">
                <div className="border-b border-neutral-100 pb-4">
                  <h4 className="text-sm font-bold text-neutral-700">Video Portfolio (YouTube URLs)</h4>
                  <p className="text-xs text-neutral-400 mt-1">Add up to 3 YouTube videos to showcase your work.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Video 1 URL</label>
                    <input type="text" value={featuredVideo} onChange={(e) => setFeaturedVideo(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. https://www.youtube.com/watch?v=..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Video 2 URL</label>
                    <input type="text" value={featuredVideo2} onChange={(e) => setFeaturedVideo2(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. https://www.youtube.com/watch?v=..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Video 3 URL</label>
                    <input type="text" value={featuredVideo3} onChange={(e) => setFeaturedVideo3(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. https://www.youtube.com/watch?v=..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Portfolio Video Layout Orientation</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button type="button" onClick={() => setVideoLayout('1p_2l')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center ${videoLayout === '1p_2l' ? 'border-brand-500 bg-brand-50/20' : 'border-neutral-200 hover:border-neutral-300 bg-white'}`}>
                      <div className="flex space-x-1.5 mb-2 items-center">
                        <div className="w-4 h-8 bg-neutral-300 rounded-sm" />
                        <div className="flex flex-col space-y-1">
                          <div className="w-8 h-3.5 bg-neutral-300 rounded-sm" />
                          <div className="w-8 h-3.5 bg-neutral-300 rounded-sm" />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-neutral-700">1 Portrait + 2 Landscape</span>
                      <span className="text-[10px] text-neutral-450">Perfect for shorts & longer showcases</span>
                    </button>
                    <button type="button" onClick={() => setVideoLayout('2p_1l')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center ${videoLayout === '2p_1l' ? 'border-brand-500 bg-brand-50/20' : 'border-neutral-200 hover:border-neutral-300 bg-white'}`}>
                      <div className="flex space-x-1.5 mb-2 items-center">
                        <div className="w-4 h-8 bg-neutral-300 rounded-sm" />
                        <div className="w-4 h-8 bg-neutral-300 rounded-sm" />
                        <div className="w-8 h-4 bg-neutral-300 rounded-sm" />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">2 Portrait + 1 Landscape</span>
                      <span className="text-[10px] text-neutral-450">Great for multiple TikToks/reels and a cover</span>
                    </button>
                  </div>
                </div>

                <div className="border-b border-neutral-100 pb-4 pt-2">
                  <h4 className="text-sm font-bold text-neutral-700">Showcase Photos (Max 3)</h4>
                  <p className="text-xs text-neutral-400 mt-1">Add up to 3 high-quality pictures to display on your public profile gallery.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 group">
                      <img src={`${getBackendUrl()}${photo}`} alt={`Showcase ${index + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemovePhoto(index)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 shadow-md backdrop-blur-sm transition-colors"><Trash size={14} /></button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <label className={`flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 border-dashed border-neutral-300 hover:border-brand-500 bg-neutral-50/50 cursor-pointer transition-all ${uploadingPhoto ? 'opacity-70 pointer-events-none' : ''}`}>
                      <Camera className="text-neutral-400 mb-2 group-hover:text-brand-500" size={24} />
                      <span className="text-xs font-semibold text-neutral-500">{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhoto} />
                    </label>
                  )}
                </div>

                <div className="border-b border-neutral-100 pb-4 pt-2">
                  <h4 className="text-sm font-bold text-neutral-700">Portfolio Projects</h4>
                  <p className="text-xs text-neutral-400 mt-1">Showcase your past campaign work with links and descriptions.</p>
                </div>
                {portfolioItems.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-neutral-200 p-3 bg-neutral-50/50">
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <input type="text" value={item.title} onChange={(e) => { const updated = [...portfolioItems]; updated[idx] = { ...updated[idx], title: e.target.value }; setPortfolioItems(updated); }} className="block w-full rounded-lg border border-neutral-200 py-1.5 px-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white" placeholder="Project title" />
                      <input type="text" value={item.fileUrl} onChange={(e) => { const updated = [...portfolioItems]; updated[idx] = { ...updated[idx], fileUrl: e.target.value }; setPortfolioItems(updated); }} className="block w-full rounded-lg border border-neutral-200 py-1.5 px-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white" placeholder="Link URL" />
                    </div>
                    <textarea value={item.description} onChange={(e) => { const updated = [...portfolioItems]; updated[idx] = { ...updated[idx], description: e.target.value }; setPortfolioItems(updated); }} className="block w-full rounded-lg border border-neutral-200 py-1.5 px-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white mb-2" rows={2} placeholder="Brief description" />
                    <button type="button" onClick={() => setPortfolioItems(portfolioItems.filter((_, i) => i !== idx))} className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => setPortfolioItems([...portfolioItems, { title: '', description: '', fileUrl: '', thumbnail: '' }])} className="rounded-lg border border-dashed border-neutral-300 w-full py-2 text-xs font-semibold text-neutral-500 hover:border-brand-500 hover:text-brand-600 transition-colors">+ Add Portfolio Item</button>
              </div>
            )}

            {editStep === 3 && (
              <div className="space-y-5 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Business Email</label>
                    <input type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="collabs@creator.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Business Phone</label>
                    <input type="text" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="+1-234-567-890" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Content Formats</label>
                    <input type="text" value={contentFormats} onChange={(e) => setContentFormats(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="Reels, dedicated vids, unboxing" />
                  </div>
                </div>
                <div className="border-b border-neutral-100 pb-4" />
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Instagram</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-500">Handle</label>
                    <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="username" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500">Followers</label>
                    <input type="number" value={instagramFollowers} onChange={(e) => setInstagramFollowers(Number(e.target.value))} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500">Engagement Rate (%)</label>
                    <input type="number" step="0.1" value={instagramEngagement} onChange={(e) => setInstagramEngagement(Number(e.target.value))} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. 3.5" />
                  </div>
                </div>
                <div className="border-b border-neutral-100" />
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">YouTube</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-500">Channel Name</label>
                    <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="channelname" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500">Subscribers</label>
                    <input type="number" value={youtubeFollowers} onChange={(e) => setYoutubeFollowers(Number(e.target.value))} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500">Engagement Rate (%)</label>
                    <input type="number" step="0.1" value={youtubeEngagement} onChange={(e) => setYoutubeEngagement(Number(e.target.value))} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. 4.8" />
                  </div>
                </div>
                <div className="border-b border-neutral-100 pb-4" />
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Audience Demographics</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-500">Male (%)</label>
                    <input type="number" value={audienceGenderMale} onChange={(e) => { const val = Number(e.target.value); setAudienceGenderMale(val); setAudienceGenderFemale(100 - val); }} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" min="0" max="100" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500">Female (%)</label>
                    <input type="number" value={audienceGenderFemale} onChange={(e) => { const val = Number(e.target.value); setAudienceGenderFemale(val); setAudienceGenderMale(100 - val); }} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" min="0" max="100" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500">Age Range</label>
                    <input type="text" value={audienceAgeRange} onChange={(e) => setAudienceAgeRange(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. 18-24 (45%)" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500">Top Countries</label>
                    <input type="text" value={audienceTopCountries} onChange={(e) => setAudienceTopCountries(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. India (50%), US (20%)" />
                  </div>
                </div>
              </div>
            )}

            {editStep === 4 && (
              <div className="space-y-5 mb-6">
                <div className="border-b border-neutral-100 pb-4">
                  <h4 className="text-sm font-bold text-neutral-700">Pricing Packages & Services</h4>
                  <p className="text-xs text-neutral-400 mt-1">Define what you offer and how much you charge.</p>
                </div>
                {services.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-neutral-200 p-3 bg-neutral-50/50">
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-neutral-450">Service/Package Title</label>
                        <input type="text" required value={item.title} onChange={(e) => { const updated = [...services]; updated[idx] = { ...updated[idx], title: e.target.value }; setServices(updated); }} className="block w-full rounded-lg border border-neutral-200 py-1.5 px-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white mt-1" placeholder="e.g. Dedicated YouTube Video Review" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-450">Price ($)</label>
                        <input type="number" required value={item.price} onChange={(e) => { const updated = [...services]; updated[idx] = { ...updated[idx], price: Number(e.target.value) }; setServices(updated); }} className="block w-full rounded-lg border border-neutral-200 py-1.5 px-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white mt-1" placeholder="e.g. 500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-neutral-450">Delivery Time (Days)</label>
                        <input type="number" required value={item.deliveryDays} onChange={(e) => { const updated = [...services]; updated[idx] = { ...updated[idx], deliveryDays: Number(e.target.value) }; setServices(updated); }} className="block w-full rounded-lg border border-neutral-200 py-1.5 px-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white mt-1" placeholder="e.g. 7" />
                      </div>
                      <div className="flex items-end justify-end">
                        <button type="button" onClick={() => setServices(services.filter((_, i) => i !== idx))} className="text-xs text-red-500 hover:text-red-700 font-semibold py-1.5">Remove Package</button>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setServices([...services, { title: '', price: 0, deliveryDays: 5 }])} className="rounded-lg border border-dashed border-neutral-300 w-full py-2 text-xs font-semibold text-neutral-500 hover:border-brand-500 hover:text-brand-600 transition-colors">+ Add Service Package</button>

                <div className="border-b border-neutral-100 pb-4 pt-2">
                  <h4 className="text-sm font-bold text-neutral-700">Frequently Asked Questions (FAQs)</h4>
                  <p className="text-xs text-neutral-400 mt-1">Answer common questions brands ask before hiring you.</p>
                </div>
                {faqs.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-neutral-200 p-3 bg-neutral-50/50">
                    <div className="mb-2">
                      <label className="block text-[10px] text-neutral-450">Question</label>
                      <input type="text" required value={item.question} onChange={(e) => { const updated = [...faqs]; updated[idx] = { ...updated[idx], question: e.target.value }; setFaqs(updated); }} className="block w-full rounded-lg border border-neutral-200 py-1.5 px-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white mt-1" placeholder="e.g. What is your policy on revisions?" />
                    </div>
                    <div className="mb-2">
                      <label className="block text-[10px] text-neutral-450">Answer</label>
                      <textarea required value={item.answer} onChange={(e) => { const updated = [...faqs]; updated[idx] = { ...updated[idx], answer: e.target.value }; setFaqs(updated); }} className="block w-full rounded-lg border border-neutral-200 py-1.5 px-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white mt-1" rows={2} placeholder="e.g. I offer 2 rounds of creative revisions for editing and compliance..." />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))} className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove FAQ</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])} className="rounded-lg border border-dashed border-neutral-300 w-full py-2 text-xs font-semibold text-neutral-500 hover:border-brand-500 hover:text-brand-600 transition-colors">+ Add FAQ</button>
              </div>
            )}

            {/* Navigation & Submit */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
              {editStep > 1 ? (
                <button type="button" onClick={() => setEditStep(s => s - 1)} className="inline-flex items-center rounded-xl border border-neutral-200 px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all">
                  ← Back
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-neutral-400 font-mono">Step {editStep} of {editSteps.length}</span>
              </div>
              {editStep < editSteps.length ? (
                <button type="button" onClick={() => setEditStep(s => s + 1)} className="inline-flex items-center rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700 transition-all">
                  Next →
                </button>
              ) : (
                <button type="button" onClick={handleUpdateProfile} className="inline-flex items-center rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-700 transition-all">
                  Save Profile Updates
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-neutral-800 mb-4">Request Payout</h3>
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100 text-center mb-6">
                <span className="text-xs text-neutral-400 font-semibold uppercase">Withdrawable Balance</span>
                <p className="text-3xl font-extrabold text-brand-600 mt-1">${wallet?.balance || 0}</p>
                <p className="text-[10px] text-neutral-400 mt-1">Pending approval: ${wallet?.pendingWithdrawals || 0}</p>
              </div>
              <form onSubmit={handleWithdrawRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Withdrawal Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="e.g. 500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-all"
                >
                  Submit Payout Request
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-neutral-800 mb-4">Wallet Ledger Transactions</h3>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-sm text-neutral-400">No transactions recorded yet</div>
                ) : (
                  transactions.map((t) => (
                    <div key={t._id} className="flex justify-between items-center rounded-xl bg-neutral-50 p-3.5 border border-neutral-100 text-sm">
                      <div>
                        <p className="font-semibold text-neutral-800">{t.description}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'credit' ? '+' : '-'}${t.amount}
                        </span>
                        <p className="text-[9px] font-semibold text-neutral-400 capitalize">{t.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
            <h3 className="text-base font-bold text-neutral-800 mb-4">Submit Campaign Deliverables</h3>
            <form onSubmit={handleSubmitDeliverables} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Instagram Post Link</label>
                <input
                  type="url"
                  value={instagramPost}
                  onChange={(e) => setInstagramPost(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-3 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  placeholder="https://www.instagram.com/p/..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">YouTube Video Link</label>
                <input
                  type="url"
                  value={youtubeVideo}
                  onChange={(e) => setYoutubeVideo(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-3 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Reel / Shorts Link</label>
                <input
                  type="url"
                  value={reelLink}
                  onChange={(e) => setReelLink(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-3 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  placeholder="https://www.instagram.com/reel/..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Screenshot / Proof URL</label>
                <input
                  type="url"
                  value={screenshotUpload}
                  onChange={(e) => setScreenshotUpload(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-3 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  placeholder="https://imgur.com/..."
                />
              </div>
              <p className="text-[10px] text-neutral-400">Submit at least one link to your deliverables</p>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppId(null)}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDeliverable || (!instagramPost && !youtubeVideo && !reelLink && !screenshotUpload)}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {submittingDeliverable ? 'Submitting...' : 'Submit Work'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerDashboard;
