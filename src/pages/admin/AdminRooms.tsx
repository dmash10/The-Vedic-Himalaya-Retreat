import { useState } from 'react';
import { useRooms, Room } from '@/hooks/useRooms';
import { Edit, Loader2, Save, Users, IndianRupee, X, Type, FileText, BedDouble } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';

// Premium input styling helper inside AdminRooms
interface FormInputGroupProps {
  label: string;
  icon: any;
  value: string | number;
  type?: string;
  onChange: (val: string) => void;
  required?: boolean;
}

function FormInputGroup({
  label,
  icon: Icon,
  value,
  type = 'text',
  onChange,
  required = false
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
          required={required}
          className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all font-medium"
        />
      </div>
    </div>
  );
}

export default function AdminRooms() {
  const { rooms, loading, updateRoom } = useRooms();
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    setSaving(true);
    const result = await updateRoom(editingRoom.id, editingRoom);
    setSaving(false);
    if (result.success) {
      toast.success('Room updated successfully');
      setEditingRoom(null);
    } else {
      toast.error('Failed to update room');
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    const result = await updateRoom(id, { is_available: !current });
    if (result.success) {
      toast.success(current ? 'Marked as Sold Out' : 'Marked as Available');
    }
  };

  return (
    <div className="space-y-6 text-[#E2E8F0] min-h-screen">
      {/* Title */}
      <div className="border-l-4 border-[#C4A665] pl-5 py-0.5">
        <h1 className="text-2xl md:text-3xl font-heading font-medium text-[#F8FAFC]">SUITES MANAGEMENT</h1>
        <p className="text-[#8E9F96] text-xs mt-1">Manage suite pricing, occupancy limits, and booking availability.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#C4A665]" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 bg-[#0D1412] border border-dashed border-[#1C2E2A] rounded-xl shadow-none">
          <p className="text-[#8E9F96]">No suites found. Please check your Supabase database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden flex flex-col justify-between shadow-none"
            >
              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-heading font-medium text-[#F8FAFC]">{room.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#8E9F96] mt-0.5">
                      <Users className="h-3.5 w-3.5 text-[#C4A665]/60" />
                      <span>Up to {room.max_guests} guests</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    room.is_available
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {room.is_available ? 'Available' : 'Sold Out'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#060B0A]/40 border border-[#1C2E2A] rounded-xl">
                    <span className="text-[9px] text-[#8E9F96] uppercase tracking-wider font-bold block">Rate (Selling)</span>
                    <div className="flex items-center text-base font-bold text-[#F8FAFC] mt-1">
                      <IndianRupee className="h-4 w-4 mr-0.5 text-[#C4A665]" />
                      {room.real_price?.toLocaleString('en-IN') || '—'}
                    </div>
                  </div>
                  <div className="p-3 bg-[#060B0A]/40 border border-[#1C2E2A] rounded-xl opacity-60">
                    <span className="text-[9px] text-[#8E9F96] uppercase tracking-wider font-bold block font-mono">Strike Price</span>
                    <div className="flex items-center text-sm font-bold text-[#F8FAFC] mt-1 line-through decoration-red-500">
                      <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                      {room.fake_price?.toLocaleString('en-IN') || '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-[#0A0F0E]/50 border-t border-[#1C2E2A] flex items-center gap-2">
                <button
                  onClick={() => toggleAvailability(room.id, room.is_available)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    room.is_available
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {room.is_available ? 'Mark Sold Out' : 'Mark Available'}
                </button>
                <button
                  onClick={() => setEditingRoom({ ...room })}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-[#C4A665] hover:bg-[#FAF9F5] text-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal (Flat Dark Theme) */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-none">
            <div className="p-4 border-b border-[#1C2E2A] flex items-center justify-between bg-[#0E1715]/50">
              <h3 className="font-heading text-[#F8FAFC] text-sm uppercase tracking-wider font-bold">Edit Suite details</h3>
              <button onClick={() => setEditingRoom(null)} className="text-[#8E9F96] hover:text-[#F8FAFC] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInputGroup
                  label="Suite / Room Name"
                  icon={Type}
                  value={editingRoom.name}
                  onChange={(val) => setEditingRoom({ ...editingRoom, name: val })}
                  required
                />
                <FormInputGroup
                  label="Max Guest Limit"
                  icon={Users}
                  type="number"
                  value={editingRoom.max_guests}
                  onChange={(val) => setEditingRoom({ ...editingRoom, max_guests: parseInt(val) || 0 })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <ImageUploader
                  label="Card Cover Image"
                  currentImage={editingRoom.card_image_url || ''}
                  onImageChange={(path) => setEditingRoom({ ...editingRoom, card_image_url: path })}
                  aspectRatio="aspect-video w-full"
                />
              </div>

              <div className="relative">
                <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Description Summary</label>
                <textarea
                  value={editingRoom.description || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all resize-none leading-relaxed font-medium"
                />
              </div>

              {/* Status Toggle Box */}
              <div className="flex items-center justify-between p-4 bg-[#060B0A]/40 border border-[#1C2E2A] rounded-xl">
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

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[#1C2E2A] mt-4">
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
                  Save Suite Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
