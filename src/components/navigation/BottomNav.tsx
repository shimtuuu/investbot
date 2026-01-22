import { NavLink } from "react-router-dom";
import { BriefcaseIcon, GiftIcon, HomeIcon, UsersIcon, WalletIcon } from "../icons";
import { cn } from "../../lib/cn";

const navItems = [
  { to: "/", label: "Главная", icon: HomeIcon },
  { to: "/wallet", label: "Кошелек", icon: WalletIcon },
  { to: "/cabinet", label: "Кабинет", icon: BriefcaseIcon, center: true },
  { to: "/partners", label: "Партнеры", icon: UsersIcon },
  { to: "/raffle", label: "Розыгрыш", icon: GiftIcon }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
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
  );
}
