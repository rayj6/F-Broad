import React from "react";

import "./styles.css";

const index = () => {
  return (
    <div className="login_container">
      <input id="email" type="text" placeholder="you@gmail.com" />
      <br />
      <input id="pasword" type="password" placeholder="Enter your password" />
      <br />
      <br />
      <button>Đăng nhập</button>
    </div>
  );
};

export default index;
