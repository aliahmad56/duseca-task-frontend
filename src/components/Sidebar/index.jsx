import React from 'react';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white flex flex-col h-full w-64">
      <div className="h-full">
        <div className="py-4 px-6 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-lg font-bold mb-4">Dashboard</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="block hover:text-blue-500">
                  All User Details
                </a>
              </li>
              <li>
                <a href="#" className="block hover:text-blue-500">
                  Company Details
                </a>
              </li>
              <li>
                <a href="#" className="block hover:text-blue-500">
                  Total Expensis
                </a>
              </li>
              <li>
                <a href="#" className="block hover:text-blue-500">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
