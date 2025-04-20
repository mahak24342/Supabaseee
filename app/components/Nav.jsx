import React from 'react';

const Nav = () => {
  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
      <div className="flex items-center">
        <img
          src="/image.png"
          alt="Logo"
          className="h-10 md:h-14 w-auto object-contain"
        />
      </div>
    </nav>
  );
};

export default Nav;
