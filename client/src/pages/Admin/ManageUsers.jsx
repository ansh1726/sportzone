import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios.js";
import useAuthStore from "../../store/authStore.js";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await axiosInstance.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-6">
      <div className="mb-5 md:mb-6">
        <h1 className="text-base md:text-lg font-semibold text-gray-100">Manage Users</h1>
        <p className="text-xs md:text-sm text-gray-500">{users.length} registered users</p>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-sm placeholder-gray-600 rounded-lg px-3 py-2 mb-4 md:mb-5 focus:outline-none focus:border-orange-500"
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No users found</div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredUsers.map((u) => {
              const isSelf = u._id === currentUser?._id;
              return (
                <div key={u._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-200">{u.name}</p>
                        {isSelf && (
                          <span className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">You</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-orange-500/20 text-orange-400" : "bg-gray-800 text-gray-400"}`}>
                          {u.role === "admin" ? "Admin" : "User"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{u.email}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Joined {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {!isSelf && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRole(u._id, u.role)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg transition"
                      >
                        {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs px-3 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_110px_160px] gap-3 px-4 py-3 bg-gray-950 text-xs text-gray-600 font-medium uppercase tracking-wide">
              <span>User</span>
              <span>Role</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {filteredUsers.map((u) => {
              const isSelf = u._id === currentUser?._id;
              return (
                <div
                  key={u._id}
                  className="grid grid-cols-[1fr_100px_110px_160px] gap-3 px-4 py-3 border-t border-gray-800 items-center"
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-200 font-medium flex items-center gap-2">
                        {u.name}
                        {isSelf && (
                          <span className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">You</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full w-fit ${u.role === "admin" ? "bg-orange-500/20 text-orange-400" : "bg-gray-800 text-gray-400"}`}>
                    {u.role === "admin" ? "Admin" : "User"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                  <div className="flex gap-2">
                    {isSelf ? (
                      <span className="text-xs text-gray-600">—</span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleRole(u._id, u.role)}
                          className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;