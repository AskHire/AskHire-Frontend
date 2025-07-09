export default function RoleBadge({ user, isEditing, onEditClick, onRoleChange, onSave, onCancel }) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <select
          className="px-3 py-1 text-sm border rounded-md"
          value={user.role}
          onChange={(e) => onRoleChange(user.id, e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Candidate">Candidate</option>
        </select>

        <button className="text-sm text-blue-600 underline" onClick={() => onSave(user.id)}>
          Save
        </button>
        <button className="text-sm text-red-500 underline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  }

  const bgColor =
    user.role === "Admin" ? "bg-green-500" : user.role === "Candidate" ? "bg-yellow-500" : "bg-blue-500";

  return (
    <button
      className={`text-sm px-5 py-1 rounded-full text-white ${bgColor}`}
      onClick={() => onEditClick(user.id)}
    >
      {user.role}
    </button>
  );
}
