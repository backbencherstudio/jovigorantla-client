import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";


// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);


const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
