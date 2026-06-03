import { useState, useRef } from 'react';
import { useRooms, Room } from '@/hooks/useRooms';
import { useImageZones } from '@/hooks/useImageZones';
import { Edit, Loader2, Save, Users, IndianRupee, X, Type, Plus, Trash2, ArrowLeft, ArrowRight, Sparkles, Building, CheckCircle2, ShieldAlert, Upload } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';

interface FormInputGroupProps {
  label: string;
  icon: any;
  value: string | number;
  type?: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
}

function FormInputGroup({
  label,
  icon: Icon,
  value,
  type = 'text',
  onChange,
  required = false,
  placeholder = ''
}: FormInputGroupProps) {
  return (
    <div className="relative group/input flex-1 w-full">
      <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C4A665]/40 group-focus-within/input:text-[#C4A665] transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all font-medium"
        />
      </div>
    </div>
  );
}

export default function AdminRooms() {
  const { rooms, loading, updateRoom, createRoom, deleteRoom } = useRooms();
  const { uploadImageDirect } = useImageZones();
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadImageDirect(file);
      if (result?.success && result.url) {
        const currentImages = editingRoom?.images || [];
        setEditingRoom({
          ...editingRoom,
          images: [...currentImages, result.url]
        });
        toast.success('Image uploaded successfully from PC!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during file upload');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom || !editingRoom.name) return;
    setSaving(true);
    
    // Fallback card cover
    const coverUrl = editingRoom.card_image_url || (editingRoom.images && editingRoom.images[0]) || '';
    const slug = editingRoom.slug || editingRoom.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const finalRoomData = {
      ...editingRoom,
      card_image_url: coverUrl,
      slug
    };

    let result;
    if (editingRoom.id) {
      result = await updateRoom(editingRoom.id, finalRoomData);
    } else {
      result = await createRoom({
        name: finalRoomData.name || 'New Suite',
        slug: finalRoomData.slug || 'new-suite',
        description: finalRoomData.description || '',
        max_guests: finalRoomData.max_guests || 2,
        fake_price: finalRoomData.fake_price || null,
        real_price: finalRoomData.real_price || null,
        is_available: finalRoomData.is_available !== false,
        is_visible: finalRoomData.is_visible !== false,
        card_image_url: finalRoomData.card_image_url || null,
        images: finalRoomData.images || [],
        display_order: finalRoomData.display_order || 0
      });
    }

    setSaving(false);
    if (result.success) {
      toast.success(editingRoom.id ? 'Suite details updated' : 'New Suite registered');
      setEditingRoom(null);
    } else {
      toast.error('Failed to save suite changes');
    }
  };

  const handleDeleteSuite = async (id: string, name: string) => {
    const confirm = window.confirm(`Are you absolutely sure you want to delete "${name}"? This action is permanent and cannot be undone.`);
    if (!confirm) return;

    const result = await deleteRoom(id);
    if (result.success) {
      toast.success('Suite deleted from registry');
    } else {
      toast.error('Failed to delete suite');
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    const result = await updateRoom(id, { is_available: !current });
    if (result.success) {
      toast.success(current ? 'Marked as Sold Out' : 'Marked as Available');
    }
  };

  // Helper Stats Board metrics
  const totalListed = rooms.length;
  const totalAvailable = rooms.filter(r => r.is_available).length;
  const totalSoldOut = totalListed - totalAvailable;

  return (
    <div className="space-y-6 text-[#E2E8F0] min-h-screen">
      {editingRoom ? (
        /* Unified Edit/Add Form Inline (Flat Premium Theme) */
        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-200">
          <div className="p-4 border-b border-[#1C2E2A] flex items-center justify-between bg-[#0E1715]/50 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C4A665]" />
              <h3 className="font-heading text-[#F8FAFC] text-sm uppercase tracking-wider font-bold">
                {editingRoom.id ? `Edit Suite Settings: ${editingRoom.name}` : 'Register New Suite'}
              </h3>
            </div>
            <button
              onClick={() => setEditingRoom(null)}
              className="text-[#8E9F96] hover:text-[#F8FAFC] cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C4A665]" /> Back to Registry
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <FormInputGroup
                label="Suite / Room Name"
                icon={Type}
                value={editingRoom.name || ''}
                onChange={(val) => setEditingRoom({ ...editingRoom, name: val })}
                required
                placeholder="e.g. Pinewood Family Suite"
              />
              <FormInputGroup
                label="Display Order (priority)"
                icon={Type}
                type="number"
                value={editingRoom.display_order || 0}
                onChange={(val) => setEditingRoom({ ...editingRoom, display_order: parseInt(val) || 0 })}
                placeholder="e.g. 1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <FormInputGroup
                label="Max Guest Limit"
                icon={Users}
                type="number"
                value={editingRoom.max_guests || 0}
                onChange={(val) => setEditingRoom({ ...editingRoom, max_guests: parseInt(val) || 0 })}
                required
              />
              <FormInputGroup
                label="Room URL Slug"
                icon={Type}
                value={editingRoom.slug || ''}
                onChange={(val) => setEditingRoom({ ...editingRoom, slug: val })}
                placeholder="pinewood-family-suite"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <FormInputGroup
                label="Selling Rate (₹)"
                icon={IndianRupee}
                type="number"
                value={editingRoom.real_price || 0}
                onChange={(val) => setEditingRoom({ ...editingRoom, real_price: parseInt(val) || 0 })}
                required
              />
              <FormInputGroup
                label="Strike Rate (₹)"
                icon={IndianRupee}
                type="number"
                value={editingRoom.fake_price || 0}
                onChange={(val) => setEditingRoom({ ...editingRoom, fake_price: parseInt(val) || 0 })}
              />
            </div>

            {/* Cover Card Image */}
            <div className="text-left">
              <ImageUploader
                label="Card Cover Image URL (Main list)"
                currentImage={editingRoom.card_image_url || ''}
                onImageChange={(path) => setEditingRoom({ ...editingRoom, card_image_url: path })}
                aspectRatio="aspect-video max-w-xs w-full"
              />
            </div>

            {/* Dynamic Multi-Images Array List Editor */}
            <div className="text-left space-y-2">
              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1">
                Room Gallery Images (Multiple Slides)
              </label>
              
              {/* Miniature Image Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {(editingRoom.images || []).map((img, i) => (
                  <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-[#1C2E2A] bg-black/40">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = [...(editingRoom.images || [])];
                            const tmp = newImgs[i];
                            newImgs[i] = newImgs[i - 1];
                            newImgs[i - 1] = tmp;
                            setEditingRoom({ ...editingRoom, images: newImgs });
                          }}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Move Left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}
                      {i < (editingRoom.images || []).length - 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = [...(editingRoom.images || [])];
                            const tmp = newImgs[i];
                            newImgs[i] = newImgs[i + 1];
                            newImgs[i + 1] = tmp;
                            setEditingRoom({ ...editingRoom, images: newImgs });
                          }}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Move Right"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newImgs = (editingRoom.images || []).filter((_, idx) => idx !== i);
                          setEditingRoom({ ...editingRoom, images: newImgs });
                        }}
                        className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors cursor-pointer"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-[8px] text-white px-1.5 py-0.5 rounded leading-none">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add new image input box */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-grow flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste Unsplash or local image URL..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-grow px-3 py-2 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newImageUrl.trim()) return;
                      const currentImages = editingRoom.images || [];
                      setEditingRoom({
                        ...editingRoom,
                        images: [...currentImages, newImageUrl.trim()]
                      });
                      setNewImageUrl('');
                    }}
                    className="px-4 py-2 bg-[#C4A665]/10 border border-[#C4A665]/20 hover:bg-[#C4A665]/20 text-[#C4A665] text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add URL
                  </button>
                </div>

                <div className="flex gap-2 shrink-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full sm:w-auto px-4 py-2 bg-[#1C2E2A] hover:bg-[#253D38] border border-[#1C2E2A] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C4A665]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#C4A665]" />
                    )}
                    {uploadingImage ? 'Uploading...' : 'Upload from PC'}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative text-left">
              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Description Summary</label>
              <textarea
                value={editingRoom.description || ''}
                onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all resize-none leading-relaxed font-medium"
              />
            </div>

            {/* Status Toggle Box */}
            <div className="flex items-center justify-between p-4 bg-[#060B0A]/40 border border-[#1C2E2A] rounded-xl text-left">
              <div>
                <span className="text-xs font-semibold text-[#F8FAFC] block">Availability Status</span>
                <span className="text-[10px] text-[#8E9F96]">Select whether room can be booked by clients</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingRoom({ ...editingRoom, is_available: !editingRoom.is_available })}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer ${
                  editingRoom.is_available ? 'bg-emerald-500' : 'bg-[#1C2E2A]'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  editingRoom.is_available ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Form Action Controls */}
            <div className="flex justify-end gap-2 pt-4 border-t border-[#1C2E2A]">
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="px-4 py-2 border border-[#1C2E2A] hover:bg-[#1C2E2A]/50 text-[#8E9F96] hover:text-[#E2E8F0] text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#C4A665] hover:bg-[#FAF9F5] text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Suite Details
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Registry List & Stats Overview (Inline Cards Compact Layout) */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Action Strip */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-[#C4A665] pl-5 py-0.5 text-left">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-medium text-[#F8FAFC]">SUITES REGISTRY</h1>
              <p className="text-[#8E9F96] text-xs mt-1">Manage high-altitude suite listings, occupancy limits, and visual catalogs.</p>
            </div>
            <button
              onClick={() => setEditingRoom({
                name: '',
                slug: '',
                description: '',
                max_guests: 2,
                fake_price: 15000,
                real_price: 11500,
                is_available: true,
                is_visible: true,
                card_image_url: '',
                images: [],
                display_order: 0
              })}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#C4A665] hover:bg-[#FAF9F5] text-black font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> REGISTER NEW SUITE
            </button>
          </div>

          {/* Stats Metrics board */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0D1412] border border-[#1C2E2A] p-4.5 rounded-2xl flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-[#C4A665]/10 border border-[#C4A665]/20 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 text-[#C4A665]" />
              </div>
              <div>
                <span className="text-[10px] text-[#8E9F96] uppercase tracking-wider font-bold block">Total Listed Suites</span>
                <span className="text-xl font-bold font-mono text-[#FAF8F5]">{totalListed} Room{totalListed !== 1 && 's'}</span>
              </div>
            </div>

            <div className="bg-[#0D1412] border border-[#1C2E2A] p-4.5 rounded-2xl flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] text-[#8E9F96] uppercase tracking-wider font-bold block">Available Rooms</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{totalAvailable} Active</span>
              </div>
            </div>

            <div className="bg-[#0D1412] border border-[#1C2E2A] p-4.5 rounded-2xl flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <span className="text-[10px] text-[#8E9F96] uppercase tracking-wider font-bold block">Sold Out Rooms</span>
                <span className="text-xl font-bold font-mono text-red-400">{totalSoldOut} Locked</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#C4A665]" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-16 bg-[#0D1412] border border-dashed border-[#1C2E2A] rounded-2xl max-w-xl mx-auto">
              <Building className="w-10 h-10 text-[#C4A665]/40 mx-auto mb-3" />
              <h3 className="text-sm font-heading text-white uppercase tracking-wider">No Suites Registered</h3>
              <p className="text-[#8E9F96] text-xs mt-1 max-w-xs mx-auto">Please click the button above to register your first luxury high-altitude suite.</p>
            </div>
          ) : (
            /* Super Compact Stacked List Layout */
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-[#0D1412] border border-[#1C2E2A] p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#C4A665]/40 text-left"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Compact Image Thumbnail */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/40 border border-[#1C2E2A] shrink-0">
                      <img
                        src={room.card_image_url || 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=200'}
                        className="w-full h-full object-cover"
                        alt={room.name}
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-heading font-medium text-[#F8FAFC]">{room.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                          room.is_available
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {room.is_available ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#8E9F96] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-[#C4A665]/70" /> Max {room.max_guests} guests
                        </span>
                        <span className="flex items-center text-[#F8FAFC] font-semibold">
                          <IndianRupee className="h-3 w-3 mr-0.5 text-[#C4A665]" />
                          {room.real_price?.toLocaleString('en-IN') || '—'} / night
                        </span>
                        {room.fake_price && (
                          <span className="line-through text-[#8E9F96]/50">
                            ₹{room.fake_price?.toLocaleString('en-IN')}
                          </span>
                        )}
                        {room.images?.length > 0 && (
                          <span className="text-[#C4A665]/80 font-mono text-[9px]">
                            {room.images.length} photo{room.images.length !== 1 && 's'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compact Actions Row */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                    <button
                      onClick={() => toggleAvailability(room.id, room.is_available)}
                      className={`py-1.5 px-3 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        room.is_available
                          ? 'bg-red-500/5 border-red-500/10 text-red-400/80 hover:bg-red-500/20 hover:text-red-400'
                          : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400/80 hover:bg-emerald-500/20 hover:text-emerald-400'
                      }`}
                    >
                      {room.is_available ? 'Lock Sold' : 'Unlock'}
                    </button>
                    <button
                      onClick={() => setEditingRoom({ ...room })}
                      className="py-1.5 px-3 rounded-lg text-[10px] font-bold bg-[#C4A665]/10 border border-[#C4A665]/20 hover:bg-[#C4A665]/20 text-[#C4A665] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSuite(room.id, room.name)}
                      className="p-1.5 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                      title="Remove Suite"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
