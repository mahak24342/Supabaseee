'use client';
import React, { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { IoMdArrowDropdown } from 'react-icons/io';
import Popup from '@/app/components/Popup'; // Adjust path as needed

const Main = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    setFilterCount(3); // Set your actual filter logic here
    setIsApplied(true); // Mark filters as applied
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="p-4 relative">
      <div className="border border-dashed border-gray-300 rounded-xl p-18">
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 relative">
          {/* Filters button with toggle */}
          <div
            onClick={() => setShowPopup((prev) => !prev)}
            className="inline-flex items-center gap-1 border border-gray-300 rounded px-1 py-1 cursor-pointer bg-white"
          >
            <CiFilter className="text-lg" />
            <h2 className="text-base font-medium">Filters</h2>
            {filterCount > 0 && (
              <span className="bg-[#E3FA99] text-black rounded-3xl text-xs w-9 h-6 flex items-center justify-center">
                {filterCount.toString().padStart(2, '0')}
              </span>
            )}
            <IoMdArrowDropdown className="text-lg" />
          </div>

          {/* Popup for filters */}
          {showPopup && (
            <Popup onApply={handleApply} onClose={() => setShowPopup(false)} />
          )}
        </div>
      </div>

      {/* Instructions - only shown before filters are applied */}
      {!isApplied && (
        <div className="flex justify-center items-center mt-5">
          <div className="flex flex-col text-left p-5">
            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
            <p className="mb-1">1. User should be able to add multiple files.</p>
            <p className="mb-1">
              2. Various states including hover and focus are provided on the right — make sure to check them!
            </p>
            <p>3. Click on the link (button) placed above to play the prototype.</p>
          </div>
        </div>
      )}

      {/* Post-apply instruction */}
      {isApplied && (
        <div className="flex ml-15 mt-5">
          <div className="flex flex-col text-left p-5">
            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
            <p>Click 'R' to restart prototype</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
