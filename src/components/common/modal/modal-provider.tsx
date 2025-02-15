"use client";

import { useEffect, useState } from "react";

import { useModalStore } from "@/store/useModalStore";

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
