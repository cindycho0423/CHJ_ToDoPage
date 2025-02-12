"use client";

import { useModalStore } from "@/store/useModalStore";
import { useEffect, useState } from "react";

export default function ModalProvider() {
  const { component } = useModalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return component;
}
