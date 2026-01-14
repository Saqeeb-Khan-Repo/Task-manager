import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TaskProvider } from "./store/Context.jsx";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const Key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={Key} appearance={{ theme: dark }}
    >
      <TaskProvider>
        <App />
        <Analytics />
      </TaskProvider>
    </ClerkProvider>
  </StrictMode>
);
