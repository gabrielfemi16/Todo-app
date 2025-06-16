//this is our React component that acts as a "provider" for the AuthContext.
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { URL } from "../App";

//This defines that AuthProvider must receive childern (any TSX elements) to wrap inside th ecurrent provider.
interface AuthProviderProps {
  children: ReactNode;
  // ReactNode Represent all of the things React can render.
}

// this wraps your whole app and gives it access to authentication data.
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{ email: string; username: string; image:string } | null>(
    null
  ); // Holds the current user info (just email and username here, but you could expand it).
  const [loading, setLoading] = useState<boolean>(true); //loading state
  const [error, setError] = useState<string>(""); //error

  //fetch user on app start
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/account/me`, {
          withCredentials: true,
        });
        if (res.data.user) {
          setUser({
            email: res.data.user.email,
            username: res.data.user.username,
            image: res.data.user.image,
          }); //optional: store more fields
        }
      } catch (err) {
        console.log("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${URL}/account/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.message === "Login successful") {
        const res = await axios.get(`${URL}/account/me`, {
          withCredentials: true,
        });
        if (res.data.user) {
          setUser({
            email: res.data.user.email,
            username: res.data.user.username,
            image: res.data.user.image,
          });
        }
        setError("");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed"); // ? It safely accesses deeply nested properties without throwing an error if any part is missing. it will return undefined instead
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${URL}/account/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

/*
withCredentials: true is an option you pass to Axios (or fetch) that tells the browser:


✅ “Include credentials like cookies, authorization headers, or TLS client certificates in the request.”


🧠 Why is it important?
If your backend uses cookies for authentication (e.g., login sessions), you must include this option so the browser sends the cookies with your request — especially when the frontend and backend are on different domains/ports.


*/
