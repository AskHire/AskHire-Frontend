import { HiDotsVertical } from "react-icons/hi";
import RoleBadge from "./RoleBadge";
import UserDetailModal from "./UserDetailModal";

export default function UserRow({
  user,
  index,
  isEditing,
  selectedUser,
  onEditClick,
  onRoleChange,
  onSave,
  onCancel,
  onToggleDetail,
  onCloseDetail,
}) {
  return (
    <div className="grid items-center grid-cols-12 p-3 mt-3 bg-white rounded-lg">
      <span className="col-span-1 font-medium">{index + 1}</span>

      <div className="col-span-2">
        <img
          className="w-10 h-10 rounded-full"
          src={user.image || "http://via.placeholder.com/40"}
          alt={user.firstName}
        />
      </div>

      <span className="col-span-5 font-medium">
        {user.firstName} {user.lastName}
      </span>

      <div className="col-span-3">
        <RoleBadge
          user={user}
          isEditing={isEditing}
          onEditClick={onEditClick}
          onRoleChange={onRoleChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>

      <div className="col-span-1 text-right">
        <button className="text-gray-500 hover:text-gray-700" onClick={() => onToggleDetail(user)}>
          <HiDotsVertical className="w-5 h-5" />
        </button>
      </div>

      {selectedUser?.id === user.id && (
        <UserDetailModal user={selectedUser} onClose={onCloseDetail} />
      )}
    </div>
  );
}
