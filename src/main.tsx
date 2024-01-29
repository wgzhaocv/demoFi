import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import "@/lib/i18n.ts";
import { Toaster } from "@/components/ui/sonner";

import { Theme } from "@radix-ui/themes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Theme
      appearance="dark"
      accentColor="crimson"
      grayColor="sand"
      radius="large"
      scaling="95%"
    >
      <RouterProvider router={router} />
      <Toaster />
    </Theme>
  </>
);
