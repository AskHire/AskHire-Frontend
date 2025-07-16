import { AiOutlineSearch, AiOutlineBell, AiOutlineUser } from 'react-icons/ai';

const ManagerTopbar = () => {
  return (
    <div>
      {/* Logo and topbar container */}
      <div className="flex items-center">
        
        {/* Search and icons section - right side */}
        <div className="flex-1 h-16 flex items-center justify-end px-4">
          
          {/* Notification and profile icons */}
          <div className="flex items-center">
            <button className="p-2 text-gray-700 hover:text-gray-900">
              <AiOutlineBell size={22} />
            </button>
            <button className="p-2 text-gray-700 hover:text-gray-900 ml-2">
              <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <AiOutlineUser size={20} className="text-gray-600" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerTopbar;