import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useParams, Link } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import { Button } from "components/ui/Button";

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User>(null);
  const [newBirthDate, setNewBirthDate] = useState<string>("");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await api.get(`/users/${username}`);
        setUser(response.data);
      } catch (error) {
        console.error(
          `Error fetching user profile: \n${handleError(error)}`
        );
      }
    }

    fetchUserProfile();
  }, [username]);

  const handleSetBirthDate = async () => {
    try {
      // Send a request to the server to update the user's profile with the newBirthDate
      const response = await api.put(`/users/${username}`, {
        birthDate: newBirthDate,
      });

      // Update the local state with the updated user data
      setUser(response.data);
    } catch (error) {
      console.error(`Error setting birth date: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer className="user-profile container">
      <h2>User Profile</h2>
      {user && (
        <div className="user-profile-details">
          <div>Username: {user.username}</div>
          <div>Online Status: {user.status}</div>
          <div>Creation Date: {user.creationDate}</div>
          <div>
            Birth Date:{" "}
            {user.birthDate ? (
              user.birthDate
            ) : (
              <>
                Not set
                {/* Render input field and button if Birth Date is not set */}
                <br />
                <br />
                <input
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                />
                <Button onClick={handleSetBirthDate}>Set Birth Date</Button>
              </>
            )}
          </div>
          <br />
          <Link to="/game">
            <Button>Return to user overview</Button>
          </Link>
        </div>
      )}
    </BaseContainer>
  );
};
UserProfile.propTypes = {
  // Add propTypes if needed
};

export default UserProfile;
