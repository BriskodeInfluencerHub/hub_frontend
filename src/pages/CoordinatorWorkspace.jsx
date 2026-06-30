import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { ClipboardList, MapPin, DollarSign, Calendar, User, CheckCircle, XCircle, Clock, ChevronRight, Search, ExternalLink, Plus, Trash2, FileText, MessageSquare } from 'lucide-react';

const STATUS_COLORS = {
  invited: 'bg-blue-50 text-blue-600',
  accepted: 'bg-green-50 text-green-600',
  submitted: 'bg-purple-50 text-purple-600',
  approved: 'bg-brand-50 text-brand-600',
  rejected: 'bg-red-50 text-red-600',
};

const CoordinatorWorkspace = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  const [influencers, setInfluencers] = useState([]);
  const [campaignMembers, setCampaignMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteDropdown, setShowInviteDropdown] = useState(false);
  const inviteRef = useRef(null);

  const [newDeliverable, setNewDeliverable] = useState({ title: '', url: '', notes: '' });
  const [addingDeliverableFor, setAddingDeliverableFor] = useState(null);
  const [editNotesFor, setEditNotesFor] = useState(null);
  const [notesText, setNotesText] = useState('');

  const loadAssignedCampaigns = useCallback(async () => {
    try {
      const res = await api.get('/coordinator/campaigns');
      setCampaigns(res.data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCampaignMembers = useCallback(async (campaignId) => {
    try {
      const res = await api.get(`/coordinator/campaigns/${campaignId}/influencers`);
      setCampaignMembers(res.data);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const loadInfluencers = useCallback(async () => {
    try {
      const res = await api.get('/users/influencers');
      setInfluencers(res.data);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    loadAssignedCampaigns();
  }, [loadAssignedCampaigns]);

  useEffect(() => {
    if (selectedCampaign) {
      loadCampaignMembers(selectedCampaign._id);
      loadInfluencers();
    }
  }, [selectedCampaign, loadCampaignMembers, loadInfluencers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inviteRef.current && !inviteRef.current.contains(e.target)) {
        setShowInviteDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInvite = async (influencerId) => {
    try {
      await api.post(`/coordinator/campaigns/${selectedCampaign._id}/invite`, { influencerId });
      loadCampaignMembers(selectedCampaign._id);
      setShowInviteDropdown(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to invite influencer');
    }
  };

  const handleStatusChange = async (memberId, status) => {
    try {
      await api.patch(`/coordinator/campaigns/${selectedCampaign._id}/influencers/${memberId}/status`, { status });
      loadCampaignMembers(selectedCampaign._id);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddDeliverable = async (memberId) => {
    if (!newDeliverable.title || !newDeliverable.url) return;
    try {
      await api.post(`/coordinator/campaigns/${selectedCampaign._id}/influencers/${memberId}/deliverables`, newDeliverable);
      setNewDeliverable({ title: '', url: '', notes: '' });
      setAddingDeliverableFor(null);
      loadCampaignMembers(selectedCampaign._id);
    } catch (err) {
      alert('Failed to add deliverable');
    }
  };

  const handleRemoveDeliverable = async (memberId, deliverableId) => {
    try {
      await api.delete(`/coordinator/campaigns/${selectedCampaign._id}/influencers/${memberId}/deliverables/${deliverableId}`);
      loadCampaignMembers(selectedCampaign._id);
    } catch (err) {
      alert('Failed to remove deliverable');
    }
  };

  const handleSaveNotes = async (memberId) => {
    try {
      await api.patch(`/coordinator/campaigns/${selectedCampaign._id}/influencers/${memberId}/notes`, { notes: notesText });
      setEditNotesFor(null);
      loadCampaignMembers(selectedCampaign._id);
    } catch (err) {
      alert('Failed to save notes');
    }
  };

  const availableInfluencers = influencers.filter(
    (inf) => !campaignMembers.some((m) => m.influencer?._id === inf._id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {!selectedCampaign ? (
          <>
            <div className="flex items-center space-x-3 mb-6">
              <ClipboardList className="text-brand-500" size={24} />
              <h2 className="text-xl font-bold text-neutral-800">Coordinator Workspace</h2>
              <span className="rounded-full bg-neutral-100 text-neutral-600 px-3 py-0.5 text-xs font-semibold">{campaigns.length} assigned</span>
            </div>

            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
                  <ClipboardList size={40} className="mx-auto text-neutral-300 mb-4" />
                  <p className="text-sm text-neutral-400">No campaigns assigned yet.</p>
                  <p className="text-xs text-neutral-300 mt-1">When the admin assigns a campaign, it will appear here.</p>
                </div>
              ) : (
                campaigns.map((c) => (
                  <div key={c._id} onClick={() => setSelectedCampaign(c)} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-neutral-300 transition-colors cursor-pointer flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-neutral-800">{c.title}</h4>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${c.status === 'assigned' ? 'bg-blue-50 text-blue-600' : c.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-neutral-50 text-neutral-500'}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-neutral-500">{c.description?.substring(0, 120)}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-neutral-400">
                        {c.brand?.name && <span className="flex items-center gap-1"><User size={12} />{c.brand.name}</span>}
                        {c.location && <span className="flex items-center gap-1"><MapPin size={12} />{c.location}</span>}
                        {c.budget > 0 && <span className="flex items-center gap-1"><DollarSign size={12} />${c.budget.toLocaleString()}</span>}
                        {c.timeline && <span className="flex items-center gap-1"><Calendar size={12} />{c.timeline}</span>}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-neutral-300 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div>
            <button onClick={() => setSelectedCampaign(null)} className="text-sm text-brand-600 hover:underline mb-4 flex items-center space-x-1">&larr; Back to all campaigns</button>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-800">{selectedCampaign.title}</h3>
                <p className="text-xs text-neutral-500">Brand: {selectedCampaign.brand?.name || selectedCampaign.brandInfo?.name}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${selectedCampaign.status === 'assigned' ? 'bg-blue-50 text-blue-600' : selectedCampaign.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-neutral-50 text-neutral-500'}`}>{selectedCampaign.status}</span>
            </div>

            <div className="flex border-b border-neutral-200 mb-6 space-x-4">
              <button onClick={() => setActiveTab('details')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'details' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Details</button>
              <button onClick={() => setActiveTab('influencers')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'influencers' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Influencers {campaignMembers.length > 0 && <span className="ml-1">({campaignMembers.length})</span>}</button>
              <button onClick={() => setActiveTab('deliverables')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'deliverables' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Deliverables</button>
            </div>

            {activeTab === 'details' && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {selectedCampaign.location && (
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Location</span>
                      <p className="text-sm font-semibold text-neutral-700 mt-1">{selectedCampaign.location}</p>
                    </div>
                  )}
                  {selectedCampaign.budget > 0 && (
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Budget</span>
                      <p className="text-sm font-semibold text-neutral-700 mt-1">${selectedCampaign.budget.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedCampaign.timeline && (
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Timeline</span>
                      <p className="text-sm font-semibold text-neutral-700 mt-1">{selectedCampaign.timeline}</p>
                    </div>
                  )}
                  {selectedCampaign.categories?.length > 0 && (
                    <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Categories</span>
                      <p className="text-sm font-semibold text-neutral-700 mt-1">{selectedCampaign.categories.join(', ')}</p>
                    </div>
                  )}
                </div>
                <div className="mb-6">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Description</span>
                  <p className="text-sm text-neutral-700 mt-1.5">{selectedCampaign.description}</p>
                </div>
                {selectedCampaign.requirements && (
                  <div className="mb-6">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Requirements</span>
                    <p className="text-sm text-neutral-700 mt-1.5">{selectedCampaign.requirements}</p>
                  </div>
                )}
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-700">Brand Contact</p>
                    <p className="text-xs text-amber-600 mt-1">{selectedCampaign.brand?.email || selectedCampaign.brandInfo?.email || 'N/A'}</p>
                  </div>
                  <a href="/chat" className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 flex items-center space-x-1">
                    <MessageSquare size={14} />
                    <span>Message Brand</span>
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'influencers' && (
              <div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-neutral-800">Invited Influencers</h3>
                    <div className="relative" ref={inviteRef}>
                      <button onClick={() => { setShowInviteDropdown(!showInviteDropdown); if (!showInviteDropdown) loadInfluencers(); }} className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 flex items-center space-x-1.5">
                        <Plus size={14} />
                        <span>Invite Influencer</span>
                      </button>
                      {showInviteDropdown && (
                        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xl animate-fade-in z-10">
                          <div className="relative mb-2">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-neutral-200 pl-8 pr-3 py-2 text-xs focus:border-brand-500 focus:outline-none" placeholder="Search influencers..." autoFocus />
                          </div>
                          <div className="max-h-48 overflow-y-auto space-y-1">
                            {availableInfluencers.filter((inf) => inf.name?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                              <p className="text-xs text-neutral-400 text-center py-4">No influencers found</p>
                            ) : (
                              availableInfluencers.filter((inf) => inf.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((inf) => (
                                <button key={inf._id} onClick={() => handleInvite(inf._id)} className="w-full flex items-center space-x-2.5 rounded-lg px-3 py-2 hover:bg-neutral-50 text-left transition-colors">
                                  {inf.profileImage ? (
                                    <img src={`http://localhost:5001${inf.profileImage}`} alt="" className="h-7 w-7 rounded-full object-cover border border-neutral-200" />
                                  ) : (
                                    <div className="h-7 w-7 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600 text-xs">{inf.name?.charAt(0)}</div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-neutral-800 truncate">{inf.name}</p>
                                    <p className="text-xs text-neutral-400 truncate">{inf.email}</p>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {campaignMembers.length === 0 ? (
                    <div className="text-center py-10 text-sm text-neutral-400">No influencers invited yet. Click "Invite Influencer" to get started.</div>
                  ) : (
                    <div className="space-y-3">
                      {campaignMembers.map((m) => (
                        <div key={m._id} className="rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 transition-colors">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-3 min-w-0">
                              {m.influencer?.profileImage ? (
                                <img src={`http://localhost:5001${m.influencer.profileImage}`} alt="" className="h-9 w-9 rounded-full object-cover border border-neutral-200 shrink-0" />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600 text-sm shrink-0">{m.influencer?.name?.charAt(0) || '?'}</div>
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-neutral-800 text-sm truncate">{m.influencer?.name || 'Unknown'}</p>
                                <p className="text-xs text-neutral-400 truncate">{m.influencer?.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${STATUS_COLORS[m.status] || 'bg-neutral-50 text-neutral-500'}`}>{m.status}</span>
                              {m.status === 'invited' && (
                                <>
                                  <button onClick={() => handleStatusChange(m._id, 'accepted')} className="rounded-lg bg-green-50 text-green-600 px-2 py-1 text-[10px] font-semibold hover:bg-green-100">Accept</button>
                                  <button onClick={() => handleStatusChange(m._id, 'rejected')} className="rounded-lg bg-red-50 text-red-600 px-2 py-1 text-[10px] font-semibold hover:bg-red-100">Reject</button>
                                </>
                              )}
                              {m.status === 'accepted' && (
                                <button onClick={() => handleStatusChange(m._id, 'invited')} className="rounded-lg bg-blue-50 text-blue-600 px-2 py-1 text-[10px] font-semibold hover:bg-blue-100">Reset</button>
                              )}
                              {m.status === 'submitted' && (
                                <button onClick={() => handleStatusChange(m._id, 'approved')} className="rounded-lg bg-green-50 text-green-600 px-2 py-1 text-[10px] font-semibold hover:bg-green-100">Approve</button>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-3 text-[10px] text-neutral-400">
                            <span>Invited: {new Date(m.invitedAt).toLocaleDateString()}</span>
                            {m.respondedAt && <span>Responded: {new Date(m.respondedAt).toLocaleDateString()}</span>}
                            {m.deliverables?.length > 0 && <span>Deliverables: {m.deliverables.length}</span>}
                          </div>
                          <div className="mt-2">
                            {editNotesFor === m._id ? (
                              <div className="flex items-center space-x-2">
                                <input type="text" value={notesText} onChange={(e) => setNotesText(e.target.value)} className="flex-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs focus:border-brand-500 focus:outline-none" placeholder="Private notes..." autoFocus />
                                <button onClick={() => handleSaveNotes(m._id)} className="text-xs font-semibold text-brand-600 hover:underline">Save</button>
                                <button onClick={() => setEditNotesFor(null)} className="text-xs text-neutral-400 hover:underline">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => { setEditNotesFor(m._id); setNotesText(m.coordinatorNotes || ''); }} className="flex items-center space-x-1 text-[10px] text-neutral-400 hover:text-neutral-600">
                                <FileText size={11} />
                                <span>{m.coordinatorNotes || 'Add private notes...'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'deliverables' && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-neutral-800 mb-6">Submitted Deliverables</h3>
                {campaignMembers.filter((m) => m.deliverables?.length > 0).length === 0 ? (
                  <div className="text-center py-10 text-sm text-neutral-400">No deliverables submitted yet.</div>
                ) : (
                  <div className="space-y-4">
                    {campaignMembers.filter((m) => m.deliverables?.length > 0).map((m) => (
                      <div key={m._id} className="rounded-xl border border-neutral-200 p-4">
                        <div className="flex items-center space-x-2.5 mb-3">
                          {m.influencer?.profileImage ? (
                            <img src={`http://localhost:5001${m.influencer.profileImage}`} alt="" className="h-7 w-7 rounded-full object-cover border border-neutral-200" />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600 text-xs">{m.influencer?.name?.charAt(0)}</div>
                          )}
                          <p className="font-semibold text-neutral-800 text-sm">{m.influencer?.name}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_COLORS[m.status]}`}>{m.status}</span>
                        </div>
                        <div className="space-y-2">
                          {m.deliverables.map((d) => (
                            <div key={d._id} className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 border border-neutral-100 group">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-neutral-700">{d.title}</p>
                                {d.notes && <p className="text-xs text-neutral-400 truncate">{d.notes}</p>}
                              </div>
                              <div className="flex items-center space-x-2 shrink-0">
                                <a href={d.url} target="_blank" rel="noreferrer" className="rounded-lg bg-brand-50 text-brand-600 px-2.5 py-1 text-[10px] font-semibold hover:bg-brand-100 flex items-center space-x-1">
                                  <ExternalLink size={11} />
                                  <span>View</span>
                                </a>
                                <button onClick={() => handleRemoveDeliverable(m._id, d._id)} className="text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={13} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {addingDeliverableFor === m._id ? (
                          <div className="mt-3 rounded-lg border border-neutral-200 p-3 space-y-2 bg-neutral-50/50">
                            <input type="text" value={newDeliverable.title} onChange={(e) => setNewDeliverable({ ...newDeliverable, title: e.target.value })} className="w-full rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs focus:border-brand-500 focus:outline-none" placeholder="Deliverable name" />
                            <input type="url" value={newDeliverable.url} onChange={(e) => setNewDeliverable({ ...newDeliverable, url: e.target.value })} className="w-full rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs focus:border-brand-500 focus:outline-none" placeholder="URL to content" />
                            <input type="text" value={newDeliverable.notes} onChange={(e) => setNewDeliverable({ ...newDeliverable, notes: e.target.value })} className="w-full rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs focus:border-brand-500 focus:outline-none" placeholder="Notes (optional)" />
                            <div className="flex space-x-2">
                              <button onClick={() => handleAddDeliverable(m._id)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700">Add</button>
                              <button onClick={() => setAddingDeliverableFor(null)} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setAddingDeliverableFor(m._id); setNewDeliverable({ title: '', url: '', notes: '' }); }} className="mt-2 flex items-center space-x-1 text-xs text-brand-600 hover:text-brand-700">
                            <Plus size={12} />
                            <span>Add deliverable</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CoordinatorWorkspace;
