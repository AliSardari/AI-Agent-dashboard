import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";

const Overview = lazy(() =>
  import("./pages/Overview").then((m) => ({ default: m.Overview })),
);
const Models = lazy(() =>
  import("./pages/Models").then((m) => ({ default: m.Models })),
);
const Requests = lazy(() =>
  import("./pages/Requests").then((m) => ({ default: m.Requests })),
);
const Settings = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Settings })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);
const Login = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.Login })),
);
const Register = lazy(() =>
  import("./pages/Register").then((m) => ({ default: m.Register })),
);
const Profile = lazy(() =>
  import("./pages/Profile").then((m) => ({ default: m.Profile })),
);
const Notifications = lazy(() =>
  import("./pages/Notifications").then((m) => ({ default: m.Notifications })),
);

export const router = createBrowserRouter(
  [
    { path: "/login", element: <Suspense fallback={null}><Login /></Suspense> },
    { path: "/register", element: <Suspense fallback={null}><Register /></Suspense> },
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Overview /> },
        { path: "models", element: <Models /> },
        { path: "requests", element: <Requests /> },
        { path: "settings", element: <Settings /> },
        { path: "profile", element: <Profile /> },
        { path: "notifications", element: <Notifications /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  // "/" locally; becomes "/<repo>/" when built with vite --base=/<repo>/,
  // which keeps deep links working on GitHub Pages.
  { basename: import.meta.env.BASE_URL },
);
