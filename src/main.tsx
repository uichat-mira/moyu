import React from "react";
import { createRoot } from "react-dom/client";
import { FolioApp, type FolioDoc } from "@uichat-mira/folio";
import "@uichat-mira/folio/styles.css";
import docs from "virtual:folio/content";
import config from "../folio.config";
import { HomePage } from "./HomePage";
import "./site.css";

const content = docs as FolioDoc[];
const basePath = import.meta.env.BASE_URL;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FolioApp
      config={config}
      docs={content}
      basePath={basePath}
      slots={{ home: <HomePage docs={content} basePath={basePath} /> }}
      ui={{ docsShell: false, defaultTheme: "light" }}
    />
  </React.StrictMode>,
);
