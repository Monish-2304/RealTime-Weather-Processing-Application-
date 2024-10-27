import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { login, signup, loading } = useAuthStore();

  const handleAuth = async () => {
    try {
      setError(null);
      if (isLogin) {
        await login(name, password);
      } else {
        await signup(name, password);
      }
      navigate("/");
    } catch (error: any) {
      setError(error.response?.data?.message || "Authentication failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center align-middle w-full p-20">
      <div className="p-4 w-[60%]">
        <h1 className="text-2xl font-bold mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleAuth}>{isLogin ? "Login" : "Sign Up"}</Button>

        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create an account" : "Already have an account? Login"}
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;
