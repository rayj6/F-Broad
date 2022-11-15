import React from "react";
import "./styles.css";

import Paper from "../Paper/index.js";

import { Auth } from "../../firebase.config.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Index = () => {
  const Authentication = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(Auth, provider)
      .then(async (result) => {
        const user = result.user;
        const userUID = user.uid;
        const username = user.displayName;

        console.log(`You signed in with : \n{
        \tUsername\t:\t${username};\n
        \tUID\t:\t${userUID};\n
      }`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="LoginContainer">
      <button onClick={() => Authentication()}>Tiếp tục với Email</button>
    </div>
  );
};

export default Index;
