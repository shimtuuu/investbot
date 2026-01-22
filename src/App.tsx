import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import CabinetPage from "./pages/CabinetPage";
import HomePage from "./pages/HomePage";
import PartnersPage from "./pages/PartnersPage";
import RafflePage from "./pages/RafflePage";
import WalletPage from "./pages/WalletPage";
import "./styles/animations.css";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/cabinet" element={<CabinetPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/raffle" element={<RafflePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
