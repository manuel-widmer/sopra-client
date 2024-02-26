import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Registration.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="registration field">
      <label className="registration label">{props.label}</label>
      <input
        className="registration input"
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

const Registration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const doRegistration = async () => {
    try {
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users/registration", requestBody);

      const user = new User(response.data);

      localStorage.setItem("token", user.token);

      // Registration successful, navigate to the desired route.
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during registration: \n${handleError(error)}`
      );
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <BaseContainer>
      <div className="registration container">
        <div className="registration form">
          <FormField
            label="username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="password"
            value={name}
            onChange={(n: string) => setName(n)}
          />
          <div className="registration button-container">
            <Button
              disabled={!username || !name}
              width="100%" // controls size of register button
              onClick={() => doRegistration()}
            >
              Register
            </Button>
            <Button
              width="100%" // controls size of register button
              onClick={goToLogin}
            >
            Go to Login
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Registration;
