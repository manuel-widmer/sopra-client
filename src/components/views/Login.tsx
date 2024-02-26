import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder={`enter ${props.label}..`}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users/login", requestBody);

      const user = new User(response.data);
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.id);

      // Login successful, navigate to the desired route.
      navigate("/game");
    } catch (error) {
      alert(`Login failed: \n${handleError(error)}`);
    }
  };

  const goToRegistration = () => {
    navigate("/registration");
  };
  
  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="password"
            value={name}
            onChange={(n) => setName(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !name}
              width="100%" // controls size of login button
              onClick={() => doLogin()}
            >
              Login
            </Button>
            <Button
              width="100%" // controls size of register button
              onClick={goToRegistration}
            >
            Go to Registration
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
