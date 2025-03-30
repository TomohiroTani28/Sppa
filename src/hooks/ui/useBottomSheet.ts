// src/app/hooks/ui/useBottomSheet.ts
import { useState, useCallback } from "react";

export const useBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    document.body.classList.add("overflow-hidden"); // body の classList を使用
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove("overflow-hidden"); // body の classList を使用
  }, []);

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("overflow-hidden", !isOpen); // body の classList を使用
  }, [isOpen]);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
};
