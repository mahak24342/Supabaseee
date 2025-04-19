import React from 'react'
import { CiFilter } from 'react-icons/ci'
import { IoMdArrowDropdown } from 'react-icons/io'

const Main = () => {
  return (
    <div className="p-4">
      {/* Outermost box */}
      <div className="border border-dashed border-gray-300 rounded-xl p-18">


        
        {/* Middle box with gray background */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 ">
          
          {/* Filters box (no background) */}
          <div className="inline-flex shadow-sm items-center gap-1 border border-gray-300 rounded px-1 py-1 cursor-pointer bg-white">
            <CiFilter className="text-lg" />
            <h2 className="text-base font-medium">Filters</h2>
            <IoMdArrowDropdown className="text-lg" />
          </div>

        </div>
        
      </div>
      <div className="flex justify-center items-center mt-5 ">
  <div className="flex flex-col text-left p-5">
    <h2 className="text-xl font-semibold mb-3">Instructions</h2>
    <p className="mb-1">1. User should be able to add multiple files.</p>
    <p className="mb-1">2. Various states including hover and focus are provided on the right — make sure to check them!</p>
    <p>3. Click on the link (button) placed above to play the prototype.</p>
  </div>
</div>

    </div>
  )
}

export default Main
