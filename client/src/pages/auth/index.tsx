import { Route, Routes, useLocation } from "react-router-dom";

// Pages
import { LoginForm } from "./login";
import { ChangePass } from "./changePass";
import { RegisterForm } from "./register";

const Auth = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register-user/:id" element={<RegisterForm />} />
      <Route path="/change-password/:id" element={<ChangePass />} />
      <Route path="/*" element={<LoginForm />} />
    </Routes>
  );
};

export { LoginForm, ChangePass as ChangePassForm, RegisterForm, Auth };
