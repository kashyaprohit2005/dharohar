'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import VisualCultureCard, { VisualHeritageItem } from './VisualCultureCard';

interface MobileHeritageSheetProps {
  items: VisualHeritageItem[];
  selectedItem: VisualHeritageItem | null;
  onSelectItem: (id: number) => void;
  categories: { key: string; label: string; icon: string }[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedState: string;
  onClearState: () => void;
}

export default function MobileHeritageSheet({
  items,
  selectedItem,
  onSelectItem,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedState,
  onClearState,
}: MobileHeritageSheetProps) {
  // Snap points: 'peek' (~130px), 'half' (50vh), 'full' (86vh)
  const [snapState, setSnapState] = useState<'peek' | 'half' | 'full'>('peek');
  const touchStartY = useRef<number | null>(null);
  const currentTranslateY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;

    // Swiped Up
    if (deltaY < -40) {
      if (snapState === 'peek') setSnapState('half');
      else if (snapState === 'half') setSnapState('full');
    }
    // Swiped Down
    else if (deltaY > 40) {
      if (snapState === 'full') setSnapState('half');
      else if (snapState === 'half') setSnapState('peek');
    }

    touchStartY.current = null;
  };

  const getHeightClass = () => {
    switch (snapState) {
      case 'full':
        return 'h-[86vh]';
      case 'half':
        return 'h-[50vh]';
      case 'peek':
      default:
        return 'h-[140px]';
    }
  };

  const currentActive = selectedItem || items[0] || null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#e6e5e2] rounded-t-[2rem] shadow-2xl transition-all duration-300 ease-out flex flex-col ${getHeightClass()}`}
    >
      {/* Drag Bar & Handle */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (snapState === 'peek') setSnapState('half');
          else if (snapState === 'half') setSnapState('full');
          else setSnapState('peek');
        }}
        className="w-full py-2.5 flex flex-col items-center justify-center cursor-pointer select-none shrink-0"
      >
        <div className="w-12 h-1.5 rounded-full bg-[#d0cfcd] mb-1.5 hover:bg-[#b15f2c] transition-colors" />
        <div className="flex items-center justify-between w-full px-5 text-xs text-[#8d8d8d]">
          <span className="font-semibold text-[#111111] flex items-center gap-1.5">
            <span>🏛️</span>
            <span>Living Traditions ({items.length})</span>
            {selectedState !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-[#f1f0ee] text-[#b15f2c] text-[10px] font-bold">
                {selectedState}
              </span>
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSnapState(snapState === 'full' ? 'peek' : 'full');
              }}
              className="text-[11px] font-semibold text-[#b15f2c] hover:underline"
            >
              {snapState === 'full' ? 'Collapse ↓' : 'Expand ↑'}
            </button>
          </div>
        </div>
      </div>

      {/* PEEK STATE CONTENT: Quick summary card */}
      {snapState === 'peek' && currentActive && (
        <div className="px-4 pb-3 flex-1 flex items-center justify-between gap-3 overflow-hidden">
          <div
            onClick={() => setSnapState('half')}
            className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f1f0ee] shrink-0 border border-[#e6e5e2]">
              {currentActive.image_url ? (
                <img
                  src={currentActive.image_url}
                  alt={currentActive.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl bg-amber-50">
                  🏺
                </div>
              )}
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d] block truncate">
                {currentActive.category} · {currentActive.state}
              </span>
              <h4 className="text-sm font-semibold text-[#111111] truncate">
                {currentActive.name}
              </h4>
              <p className="text-[11px] text-[#666666] truncate">
                📍 {currentActive.region}
              </p>
            </div>
          </div>

          <Link
            href={`/heritage/${currentActive.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#111111] text-white shrink-0 hover:bg-[#b15f2c] transition-colors"
          >
            Passport →
          </Link>
        </div>
      )}

      {/* HALF & FULL STATES: Categories filter + scrollable card feed */}
      {snapState !== 'peek' && (
        <div className="flex-1 flex flex-col overflow-hidden px-4 pb-6 space-y-3">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.key.toLowerCase();
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onSelectCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border shrink-0 ${
                    isActive
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#111111] border-[#e6e5e2]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active State Filter Tag if applied */}
          {selectedState !== 'ALL' && (
            <div className="flex items-center justify-between text-xs bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-900 shrink-0">
              <span>Filtered to <strong>{selectedState}</strong></span>
              <button
                type="button"
                onClick={onClearState}
                className="font-bold underline text-[11px]"
              >
                Clear State Filter
              </button>
            </div>
          )}

          {/* Scrollable Visual Culture Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {items.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8d8d8d]">
                No traditions found for this selection. Try changing the category.
              </div>
            ) : (
              items.map((item) => (
                <VisualCultureCard
                  key={item.id}
                  item={item}
                  variant={snapState === 'full' ? 'spotlight' : 'compact'}
                  isSelected={currentActive?.id === item.id}
                  onSelect={() => onSelectItem(item.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
