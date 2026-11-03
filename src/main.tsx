import React from "react";
import { createRoot } from "react-dom/client";
import { FolioApp, type FolioDoc } from "@uichat-mira/folio";
import "@uichat-mira/folio/styles.css";
import "./site-footer.css";
import docs from "virtual:folio/content";
import config from "../folio.config";

const runtimeConfig = {
  ...config,
  logo: `${import.meta.env.BASE_URL}images/moyu-logo.webp`,
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FolioApp
      config={runtimeConfig}
      docs={docs as FolioDoc[]}
      basePath={import.meta.env.BASE_URL}
    />
  </React.StrictMode>,
);
