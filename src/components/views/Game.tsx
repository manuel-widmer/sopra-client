import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate, Link} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <Link to={`/game/${user.id}`}>                      
      <div className="player username">{user.username}</div>
    </Link>                                                   
    <div className="player name">{user.name}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState 
  const [users, setUsers] = useState<User[]>(null);

  const logout = async (): Promise<void> => {
    try {
      // Gets userId from local storage
      const userId = localStorage.getItem("userId");

      if (!userId) {
      // Redirects to login page if userId is not available -> ensures that logout button still functions if user entry is deleted from backend db after login
        navigate("/login");
        
        return;
      }
  
      // 
      const response = await api.post("/users/logout", {
        id: userId,
      });

      // Handle successful logout
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error(
        `Something went wrong during logout: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert("Logout failed! See the console for details.");
    }
  };

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect 
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user: User) => (                  
            <li key={user.id}>
              {localStorage.getItem("token") &&           
                (                                         
                  <Link to={`/game/${user.id}`}>    
                    <Player user={user} />
                  </Link>                                 
                )                                         
              }
            </li>
          ))}
        </ul>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>List of users</h2>
      <p className="game paragraph">
        The following users have registered:
      </p>
      {content}
    </BaseContainer>
  );
};

export default Game;
