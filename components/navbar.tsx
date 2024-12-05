import { Bell, Menu, Search, Settings, User, User2 } from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Menu className="h-6 w-6 text-gray-500" />
            <span className="ml-4 text-xl font-semibold">
              Social Listening Dashboard
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
            <Settings className="h-6 w-6 text-gray-500 cursor-pointer" />
            <User2 className="h-6 w-6 text-gray-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
