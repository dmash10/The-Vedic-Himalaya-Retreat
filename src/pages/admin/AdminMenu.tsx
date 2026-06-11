import { useState, useMemo } from 'react';
import { useMenu, MenuItem } from '@/hooks/useMenu';
import {
  Plus, Trash2, Eye, EyeOff, Loader2, IndianRupee, X, Save,
  Coffee, UtensilsCrossed, Soup, Salad, Beef, IceCream, Type, FileText, Leaf
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: UtensilsCrossed },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'soup', label: 'Soups', icon: Soup },
  { id: 'salad', label: 'Salads & Starters', icon: Salad },
  { id: 'main', label: 'Main Course', icon: Beef },
  { id: 'pahadi', label: 'Pahadi Cuisine', icon: Leaf },
  { id: 'dessert', label: 'Dessert', icon: IceCream },
  { id: 'beverage', label: 'Beverages', icon: Coffee },
];

interface FormInputProps {
  label: string;
  icon: any;
  value: string | number;
  type?: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
}

function FormInput({
  label,
  icon: Icon,
  value,
  type = 'text',
  onChange,
  required = false,
  placeholder = ''
}: FormInputProps) {
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
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all font-medium placeholder-white/10"
        />
      </div>
    </div>
  );
}

export default function AdminMenu() {
  const { menuItems, loading, addItem: addMenuItem, updateItem: updateMenuItem, deleteItem: deleteMenuItem } = useMenu();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  // Form State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'breakfast',
    description: '',
    price: '',
    is_visible: true,
  });

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [menuItems, activeCategory]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      toast.error('Name and Price are required');
      return;
    }

    setAdding(true);
    const result = await addMenuItem({
      name: newItem.name,
      category: newItem.category,
      description: newItem.description || null,
      price: parseInt(newItem.price),
      is_visible: newItem.is_visible,
      image_url: null,
    });
    setAdding(false);

    if (result.success) {
      toast.success('Menu item added successfully');
      setNewItem({
        name: '',
        category: 'breakfast',
        description: '',
        price: '',
        is_visible: true,
      });
      setShowAddModal(false);
    } else {
      toast.error('Failed to add menu item');
    }
  };

  const handleToggleVisibility = async (item: MenuItem) => {
    const result = await updateMenuItem(item.id, { is_visible: !item.is_visible });
    if (result.success) {
      toast.success(item.is_visible ? 'Item hidden from public menu' : 'Item marked as visible');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    const result = await deleteMenuItem(id);
    if (result.success) {
      toast.success('Item deleted');
    } else {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6 text-[#E2E8F0] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="border-l-4 border-[#C4A665] pl-5 py-0.5">
          <h1 className="text-2xl md:text-3xl font-heading font-medium text-[#F8FAFC]">RESTAURANT MENU</h1>
          <p className="text-[#8E9F96] text-xs mt-1">Manage dishes, pricing, and category visibility.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-center py-2 px-4 rounded-lg text-xs font-bold bg-[#C4A665] hover:bg-[#FAF9F5] text-black transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Dish
        </button>
      </div>

      {/* Category Slider */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-2 pb-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1C2E2A] text-[#C4A665] border-[#C4A665]/20'
                    : 'bg-[#0D1412] text-[#8E9F96] border-[#1C2E2A] hover:text-[#E2E8F0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#C4A665]" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-[#0D1412] border border-dashed border-[#1C2E2A] rounded-xl shadow-none">
          <p className="text-[#8E9F96] text-sm">No dishes found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl p-5 flex flex-col justify-between shadow-none"
            >
              <div>
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <h4 className="font-heading font-medium text-sm text-[#F8FAFC]">{item.name}</h4>
                    <span className="text-[9px] uppercase font-bold text-[#C4A665] tracking-widest mt-0.5 block">
                      {item.category}
                    </span>
                  </div>
                  <span className="flex items-center font-bold text-sm text-[#F8FAFC]">
                    <IndianRupee className="w-3.5 h-3.5 text-[#C4A665] mr-0.5" />
                    {item.price}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-[#8E9F96] leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#1C2E2A]/50 pt-3 mt-auto">
                <button
                  onClick={() => handleToggleVisibility(item)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold border cursor-pointer transition-colors ${
                    item.is_visible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {item.is_visible ? (
                    <>
                      <Eye className="w-3 h-3" /> Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> Hidden
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-[#8E9F96] hover:text-[#EF4444] transition-colors cursor-pointer"
                  title="Delete dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none">
            <div className="p-4 border-b border-[#1C2E2A] flex items-center justify-between bg-[#0E1715]/50">
              <h3 className="font-heading text-[#F8FAFC] text-sm uppercase font-bold tracking-wider">Add New Dish</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8E9F96] hover:text-[#F8FAFC] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <FormInput
                label="Dish Name"
                icon={Type}
                value={newItem.name}
                onChange={(val) => setNewItem({ ...newItem, name: val })}
                placeholder="e.g. Kadhi Chawal"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group/input flex-1 w-full">
                  <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">
                    Category Group
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all font-medium"
                  >
                    {CATEGORIES.slice(1).map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#0D1412]">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <FormInput
                  label="Selling Price (₹)"
                  icon={IndianRupee}
                  type="number"
                  value={newItem.price}
                  onChange={(val) => setNewItem({ ...newItem, price: val })}
                  placeholder="e.g. 180"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Description Ingredients</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Ingredients, preparation style..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all resize-none leading-relaxed font-medium"
                />
              </div>

              {/* Status Toggle Box */}
              <div className="flex items-center justify-between p-4 bg-[#060B0A]/40 border border-[#1C2E2A] rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-[#F8FAFC] block">Menu Visibility</span>
                  <span className="text-[10px] text-[#8E9F96]">Show this dish immediately to public website</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, is_visible: !newItem.is_visible })}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer ${
                    newItem.is_visible ? 'bg-emerald-500' : 'bg-[#1C2E2A]'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    newItem.is_visible ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#1C2E2A] mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#1C2E2A] hover:bg-[#1C2E2A]/50 text-[#8E9F96] hover:text-[#E2E8F0] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-5 py-2 bg-[#C4A665] hover:bg-[#FAF9F5] text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {adding ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
