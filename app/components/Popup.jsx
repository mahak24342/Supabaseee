import React, { useState } from 'react';
import { CiSquarePlus } from 'react-icons/ci';
import { IoSearchOutline } from 'react-icons/io5';
import { IoMdArrowDropdown } from 'react-icons/io';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';

const Popup = ({ onApply, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCharacterOption, setSelectedCharacterOption] = useState('');

  const characterOptions = ['Hero', 'Villain', 'Sidekick', 'Mentor'];

  const handleCategoryClick = (category) => {
    if (category === 'Character') {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="absolute z-50 mt-2 bg-white border border-gray-300 shadow-md rounded-lg p-4 w-[90vw] sm:w-[300px] max-w-full">
      {/* Header: Add Filter */}
      <div className="flex items-center gap-2 mb-4 px-2 py-1 border border-gray-200 bg-[#E3FA99] rounded">
        <CiSquarePlus className="text-2xl text-green-600 min-w-[24px]" />
        <h2 className="text-sm font-medium text-gray-700">Add Filter</h2>
      </div>

      {/* Show when "Character" selected */}
      {selectedCategory === 'Character' && (
        <div className="p-3 flex flex-col gap-3 mb-3 border border-gray-200 rounded">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm">Tag</h2>
              <MdKeyboardArrowRight className="text-sm" />
              <h2 className="text-sm">Character</h2>
              <IoMdArrowDropdown className="text-sm" />
            </div>
            <RiDeleteBin6Line className="text-lg cursor-pointer" />
          </div>
          <div className="flex items-center gap-3">
            <h2 className="mt-1 text-sm">is</h2>
            <input
              type="text"
              placeholder="Select Value"
              className="bg-gray-100 p-1 text-xs rounded w-full"
            />
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 rounded-t focus-within:ring-2 focus-within:ring-[#d4f066] mb-3">
        <IoSearchOutline className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-sm text-gray-700"
        />
      </div>

      {/* Filter Options */}
      {selectedCategory === 'Character' ? (
        <div className="mt-2">
          {/* Select All */}
          <div className="flex items-center gap-2 px-2 py-1 mb-2">
            <div className="w-4 h-4 border-2 border-gray-500 rounded-sm flex items-center justify-center">
              <span className="text-[10px] text-black leading-none">—</span>
            </div>
            <h2 className="text-sm">Select all</h2>
          </div>

          {/* Character List */}
          <div className="flex flex-col gap-2">
            {characterOptions.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer text-sm hover:bg-[#E3FA99] rounded px-2 py-1"
              >
                <input
                  type="radio"
                  name="character"
                  value={option}
                  checked={selectedCharacterOption === option}
                  onChange={() => setSelectedCharacterOption(option)}
                  className="hidden"
                />
                <div
                  className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
                    selectedCharacterOption === option
                      ? 'bg-[#f1fcd2] border-gray-600'
                      : 'border-gray-400'
                  }`}
                >
                  {selectedCharacterOption === option && (
                    <span className="text-[10px] text-black leading-none">✔</span>
                  )}
                </div>
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 gap-4 my-3 px-2 flex-wrap">
            <h2 className="text-sm">Dimensions</h2>
            <h2 className="text-sm font-bold border-b border-black pb-1">Tags</h2>
            <h2 className="text-sm">Metrics</h2>
          </div>

          {/* Main Category List */}
          <div className="flex flex-col gap-2">
            {['Character', 'Background', 'Elements', 'CTA Position', 'CTA Text'].map((item, index) => (
              <h2
                key={index}
                onClick={() => handleCategoryClick(item)}
                className="cursor-pointer px-2 py-1 rounded hover:bg-[#f1fcd2] text-sm"
              >
                {item}
              </h2>
            ))}
          </div>
        </>
      )}

      {/* Apply Button */}
      <div className="mt-4">
        <button
          onClick={onApply}
          className="w-full bg-black text-white px-4 py-2 rounded hover:bg-[#E3FA99] hover:text-black text-sm transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Popup;
