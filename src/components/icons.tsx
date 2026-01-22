import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const baseProps: Pick<
  SVGProps<SVGPathElement>,
  "fill" | "stroke" | "strokeWidth" | "strokeLinecap" | "strokeLinejoin"
> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

const iconSize = (size?: number) => size ?? 20;

export const HomeIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M3 10.5L12 3l9 7.5" />
    <path {...baseProps} d="M5 9.5V21h14V9.5" />
  </svg>
);

export const WalletIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path
      {...baseProps}
      d="M4 7.5h14.5a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5Z"
    />
    <path {...baseProps} d="M4 7.5V6a2 2 0 0 1 2-2h10" />
    <circle {...baseProps} cx="17.5" cy="14" r="1.5" />
  </svg>
);

export const BriefcaseIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
    <rect {...baseProps} x="3" y="7" width="18" height="13" rx="2" />
    <path {...baseProps} d="M3 12h18" />
  </svg>
);

export const UsersIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M16.5 14a3.5 3.5 0 1 0-3.4-4.4" />
    <circle {...baseProps} cx="9" cy="9" r="3.5" />
    <path {...baseProps} d="M2.5 19a6.5 6.5 0 0 1 13 0" />
    <path {...baseProps} d="M16 19a4.5 4.5 0 0 1 5.5-4.3" />
  </svg>
);

export const GiftIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
    <path {...baseProps} d="M2 7h20v5H2z" />
    <path {...baseProps} d="M12 2v20" />
    <path {...baseProps} d="M12 7h4.5a2.5 2.5 0 1 0-2.4-3.3" />
    <path {...baseProps} d="M12 7H7.5A2.5 2.5 0 1 1 9.9 3.7" />
  </svg>
);

export const ArrowUpIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M12 19V5" />
    <path {...baseProps} d="M6 11l6-6 6 6" />
  </svg>
);

export const ArrowDownIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M12 5v14" />
    <path {...baseProps} d="M6 13l6 6 6-6" />
  </svg>
);

export const SparkleIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3Z" />
    <path {...baseProps} d="M18.5 14.5l.9 2.2 2.1.8-2.1.8-.9 2.2-.9-2.2-2.1-.8 2.1-.8.9-2.2Z" />
  </svg>
);

export const TerminalIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <rect {...baseProps} x="3" y="4" width="18" height="16" rx="2" />
    <path {...baseProps} d="M7 9l3 3-3 3" />
    <path {...baseProps} d="M12 15h5" />
  </svg>
);

export const ChartIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M4 19V5" />
    <path {...baseProps} d="M10 19V9" />
    <path {...baseProps} d="M16 19v-6" />
    <path {...baseProps} d="M22 19V7" />
  </svg>
);

export const CalculatorIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <rect {...baseProps} x="5" y="3" width="14" height="18" rx="2" />
    <path {...baseProps} d="M8 7h8" />
    <path {...baseProps} d="M8 11h2" />
    <path {...baseProps} d="M12 11h2" />
    <path {...baseProps} d="M16 11h0" />
    <path {...baseProps} d="M8 15h2" />
    <path {...baseProps} d="M12 15h2" />
    <path {...baseProps} d="M8 19h2" />
    <path {...baseProps} d="M12 19h2" />
  </svg>
);

export const ShareIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <circle {...baseProps} cx="18" cy="5" r="3" />
    <circle {...baseProps} cx="6" cy="12" r="3" />
    <circle {...baseProps} cx="18" cy="19" r="3" />
    <path {...baseProps} d="M8.6 13.4l6.8 3.2" />
    <path {...baseProps} d="M15.4 8.4 8.6 10.6" />
  </svg>
);

export const InfoIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <circle {...baseProps} cx="12" cy="12" r="9" />
    <path {...baseProps} d="M12 16v-5" />
    <path {...baseProps} d="M12 8h.01" />
  </svg>
);

export const PlusIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <path {...baseProps} d="M12 5v14" />
    <path {...baseProps} d="M5 12h14" />
  </svg>
);

export const CopyIcon = ({ size, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={iconSize(size)} height={iconSize(size)} {...props}>
    <rect {...baseProps} x="9" y="9" width="11" height="11" rx="2" />
    <rect {...baseProps} x="4" y="4" width="11" height="11" rx="2" />
  </svg>
);
