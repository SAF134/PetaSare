import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Pages
import Home from "./pages/Home.tsx";
import Hotels from "./pages/Hotels.tsx";
import About from "./pages/About.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/hotels", element: <Hotels /> },
      { path: "/about", element: <About /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      // Tambahkan rute lain di sini jika ada
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);