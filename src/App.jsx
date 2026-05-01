import React, { useState, useEffect } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import OverviewPage from "./pages/overview/OverviewPage";
import UsersPage from "./pages/users/UsersPage";
import CreateUserPage from "./pages/users/CreateUserPage";
import PredictionsPage from "./pages/predictions/PredictionsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import MapInsightsPage from "./pages/map/MapInsightsPage";

export default function App() {
  const [activePage, setActivePage] = useState("users");

  // Extract token from URL query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const pages = {
    overview: <OverviewPage />,
    users: <UsersPage onAddUser={() => setActivePage("users-create")} />,
    "users-create": (
      <CreateUserPage
        onCancel={() => setActivePage("users")}
      />
    ),
    predictions: <PredictionsPage />,
    map: <MapInsightsPage />,
    reports: <ReportsPage />,

  };

  return (
    <DashboardLayout activePage={activePage} onNavigate={setActivePage}>
      {pages[activePage] || pages.users}
    </DashboardLayout>
  );
}