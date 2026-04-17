import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await adminApi.get("/api/admin/users");
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user) => {
    await adminApi.patch(`/api/admin/users/${user.id}/status`, { active: !(user.active ?? true) });
    loadUsers();
  };

  const updateRole = async (userId, role) => {
    await adminApi.patch(`/api/admin/users/${userId}/role`, { role });
    loadUsers();
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isActive = user.active ?? true;
              return (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="FINANCE_MANAGER">FINANCE_MANAGER</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleStatus(user)}
                      className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      {isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
