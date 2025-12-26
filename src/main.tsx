import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

/* if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
} */

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

const helmetContext = {};

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <RouterProvider router={router} />
      </HelmetProvider>
    </React.StrictMode>
  );
}
