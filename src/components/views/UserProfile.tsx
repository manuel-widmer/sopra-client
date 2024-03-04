import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import { Button } from "components/ui/Button";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newBirthDate, setNewBirthDate] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error(
          `Error fetching user profile: \n${handleError(error)}`
        );
      }
    }

    fetchUserProfile();
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      // Send a request to the server to update the user's profile with the newUsername and newBirthDate
      await api.put(`/users/${id}`, {
        username: newUsername || user.username,
        birthDate: newBirthDate || user.birthDate,
      });
  
      // Fetch the updated user data directly from the server
      const updatedUserData = await api.get(`/users/${id}`);
      setUser(updatedUserData.data);
      setIsEditing(false); // Exit editing mode after saving changes
    } catch (error) {
      console.error(`Error saving changes: \n${handleError(error)}`);
    }
  };
      
  const loggedInUserId = localStorage.getItem("userId");
  const isUserLoggedIn = loggedInUserId !== null;

  return (
    <BaseContainer className="user-profile container">
      <div className="login container">
        <div className="login form">
          <h2>User Profile</h2>
          {user && (
            <div className="user-profile-details">
              <div>
                Username:{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                ) : (
                  user.username
                )}
              </div>
              <div>Online Status: {user.status}</div>
              <div>Creation Date: {user.creationDate}</div>
              <div>
                Birth Date:{" "}
                {isEditing ? (
                  <input
                    type="date"
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                  />
                ) : user.birthDate ? (
                  user.birthDate
                ) : (
                  "Not set"
                )}
              </div>
              <br />
              {isUserLoggedIn && user.id === Number(loggedInUserId) && (
                // Enable editing only for the logged-in user who owns the profile
                <>
                  {isEditing ? (
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </>
              )}
              <br />
              <br />
              <Link to="/game">
                <Button>Return to user overview</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </BaseContainer>
  );
};

UserProfile.propTypes = {
  // Add propTypes if needed
};

export default UserProfile;
