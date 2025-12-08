/**
 * useModal Hook
 * Custom hook for managing modal/dialog visibility state
 * 
 * Impact: 8+ occurrences -> 1 hook
 * Reduces code by ~20 lines
 */

import { useState, useCallback } from 'react';

export interface UseModalReturn {
  isVisible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook for managing modal/dialog visibility state
 * 
 * @param initialState - Initial visibility state (default: false)
 * @returns Object with isVisible state and control functions
 * 
 * Example:
 * const bankModal = useModal();
 * const deleteModal = useModal();
 * 
 * // In JSX:
 * <Modal visible={bankModal.isVisible}>
 *   <Button onPress={bankModal.close} title="Close" />
 * </Modal>
 * 
 * <Button onPress={bankModal.open} title="Open Bank Modal" />
 * <Button onPress={deleteModal.toggle} title="Toggle Delete Modal" />
 */
export const useModal = (initialState = false): UseModalReturn => {
  const [isVisible, setIsVisible] = useState(initialState);

  const open = useCallback(() => {
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return { isVisible, open, close, toggle };
};
