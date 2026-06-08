import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M6 9l6 6 6-6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M3 4h2l2.4 11.4a2 2 0 002 1.6h8.2a2 2 0 002-1.5L21 8H6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="17" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M6 8h12l-1 12H7L6 8z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 8V6a3 3 0 016 0v2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ChefIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M6 14a4 4 0 014-4 4 4 0 014-4 4 4 0 014 4 4 4 0 010 8H6a3 3 0 010-6z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 20h8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ScooterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="6" cy="17" r="2.5" strokeWidth="1.8" />
      <circle cx="18" cy="17" r="2.5" strokeWidth="1.8" />
      <path
        d="M8.5 17H15l3-7h-3l-2-3h-4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 14V9h2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DoorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M6 21V5a2 2 0 012-2h8a2 2 0 012 2v16"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M4 21h16" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" strokeWidth="1.8" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="9" width="18" height="12" rx="1.5" strokeWidth="1.8" />
      <path d="M3 13h18M12 9v12" strokeWidth="1.8" />
      <path
        d="M12 9c-2 0-4-1-4-3s2-3 4 0c2-3 4-2 4 0s-2 3-4 3z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
      <path
        d="M4 21c0-4 4-6 8-6s8 2 8 6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path
        d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}
