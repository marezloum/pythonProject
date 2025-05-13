import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.scss";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ProfilePage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { id: userId, user_role } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (user_role === "admin") {
      fetchUsers();
    }
  }, [user_role]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3008/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await axios.post("http://localhost:3008/change-role", {
        userId,
        newRole,
      });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to change role:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3008/change-password",
        {
          userId,
          currentPassword,
          newPassword,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(response.data.message || "An error occurred.");
      }
    } catch (error) {
      setErrorMessage("Failed to change password. Please try again.");
    }
  };

  const handleUserPasswordChange = async () => {
    if (!selectedUserId || !newUserPassword) return;

    try {
      await axios.post("http://localhost:3008/admin-change-password", {
        userId: selectedUserId,
        newPassword: newUserPassword,
      });
      setShowModal(false);
      setNewUserPassword("");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to change user password:", error);
    }
  };
console.log(users)
  return (
    <div className="profile-page">
      <h2>Change Your Password</h2>
      <form onSubmit={handlePasswordChange} className="password-form">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Change Password</button>
      </form>

      {user_role === "admin" && (
        <section className="admin-section">
          <h2>All Users</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Display Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.display_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.user_role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setShowModal(true);
                      }}
                    >
                      Update Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Set New Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleUserPasswordChange}>Update Password</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
