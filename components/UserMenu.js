"use client";

import { useEffect, useRef, useState } from "react";

function getUserInitial(user) {
  const source = user?.email || user?.user_metadata?.full_name || "U";
  return source.trim().charAt(0).toUpperCase();
}

export default function UserMenu({
  user,
  theme,
  onToggleTheme,
  onImportLocalData,
  onSignOut,
  isMigrating,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

