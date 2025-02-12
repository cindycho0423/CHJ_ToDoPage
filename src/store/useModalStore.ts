import { create } from "zustand";
import React, { ReactElement } from "react";

interface ModalState {
  isOpen: boolean;
  component: ReactElement | null;
  openModal: <T extends object>(
    Component: React.ComponentType<T>,
    props: T,
  ) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  component: null,
  openModal: <T extends object>(
    Component: React.ComponentType<T>,
    props: T,
  ) => {
    const element = React.createElement(Component, props);
    set({ isOpen: true, component: element });
  },
  closeModal: () => set({ isOpen: false, component: null }),
}));
