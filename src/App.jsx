import React, { useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import OverviewPage from "./pages/overview/OverviewPage";
import UsersPage from "./pages/users/UsersPage";
import PredictionsPage from "./pages/predictions/PredictionsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import MapInsightsPage from "./pages/map/MapInsightsPage";

const pages = {
  overview: <OverviewPage />,
  users: <UsersPage />,
  predictions: <PredictionsPage />,
  map: <MapInsightsPage />,
  reports: <ReportsPage />,
  settings: <SettingsPage />,
};

export default function App() {
  const [activePage, setActivePage] = useState("users");

  return (
    <DashboardLayout activePage={activePage} onNavigate={setActivePage}>
      {pages[activePage] || pages.users}
    </DashboardLayout>
  );
}