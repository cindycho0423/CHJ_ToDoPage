import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

export const PopoverContext = createContext({
  isOpen: false,
  togglePopover: () => {},
  closePopover: () => {},
});

export default function Popover({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const togglePopover = () => setIsOpen(!isOpen);
  const closePopover = () => setIsOpen(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const providerValue = useMemo(
    () => ({
      isOpen,
      togglePopover,
      closePopover,
    }),
    [isOpen],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, closePopover]);

  return (
    <PopoverContext.Provider value={providerValue}>
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

function Toggle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { togglePopover } = useContext(PopoverContext);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        togglePopover();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          togglePopover();
        }
      }}
      tabIndex={0}
      className={clsx(
        "rounded-full transition-all hover:bg-white/20",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isOpen } = useContext(PopoverContext);

  const wrapperClassName = clsx(
    "z-50 absolute top-35 rounded-8 border border-solid bg-black text-white px-8 py-6 text-center",
    className,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={wrapperClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Item({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  const { closePopover } = useContext(PopoverContext);

  return (
    <button
      className="text-nowrap rounded-8 px-8 py-6 text-14 transition-all hover:bg-white/20"
      onClick={() => {
        onClick();
        closePopover();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      tabIndex={0}
    >
      {children}
    </button>
  );
}

Popover.Toggle = Toggle;
Popover.Wrapper = Wrapper;
Popover.Item = Item;
