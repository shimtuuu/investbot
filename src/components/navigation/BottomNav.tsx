import { NavLink } from "react-router-dom";
import { BriefcaseIcon, GiftIcon, HomeIcon, UsersIcon, WalletIcon } from "../icons";
import { cn } from "../../lib/cn";
import LiquidGlass from "liquid-glass-react";

const navItems = [
  { to: "/", label: "Главная", icon: HomeIcon },
  { to: "/wallet", label: "Кошелек", icon: WalletIcon },
  { to: "/cabinet", label: "Кабинет", icon: BriefcaseIcon, center: true },
  { to: "/partners", label: "Партнеры", icon: UsersIcon },
  { to: "/raffle", label: "Розыгрыш", icon: GiftIcon }
];

export default function BottomNav() {
  return (
    <div className="bottom-nav-wrap">
      <LiquidGlass
        className="bottom-nav-glass"
        style={{ position: "absolute", top: "50%", left: "50%", width: "100%" }}
        padding="0px"
        displacementScale={56}
        blurAmount={0.08}
        saturation={160}
        aberrationIntensity={1.6}
        elasticity={0.18}
        cornerRadius={30}
        mode="standard"
      >
        <nav className="bottom-nav" aria-label="Основная навигация">
          {navItems.map(({ to, label, icon: Icon, center }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn("nav-item", center && "nav-item--center", isActive && "nav-item--active")
              }
            >
              <span className="nav-icon">
                <Icon size={20} />
              </span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </LiquidGlass>
    </div>
  );
}
