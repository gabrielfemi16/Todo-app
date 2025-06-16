import { createContext, useContext } from "react";

interface AuthContextType {
  user: { email: string; username: string; image: string } | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// AuthContext with an initial value of null
const AuthContext = createContext<AuthContextType | null>(null);

//Now, insteaad of doing useContext(AuthContext) everywhere, you just call useAuth() -- clean and reuseable.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an Authprovider");
  }
  return context;
};

export default AuthContext;
/*

>> The React Context API is a built-in feature that enables data sharing between components without the need to explicitly pass props through every level of the component tree, a process known as "prop drilling." It provides a way to create global variables that can be accessed by any component within an application
 
>> createContext is a function provided by React that creates a context object. This context will hold some value that can be shared between components in your application.


>> createContext<AuthContextType | null>(null):


This initializes the context with a default value of null, which is useful for typesafety. It indicates that before any context is provided (e.g., before AuthProvider is wrapped around the app), the context value is null.
 
>> Promise<void>: The Promise is a built-in JavaScript type that represents a value that might not be available yet, but will be at some point in the future (i.e., an asynchronous operation). void means this function doesn't return any value — it simply performs the login action asynchronously.

*/
