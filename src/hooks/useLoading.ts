import { useLoading as useLoadingContext } from '@/contexts/LoadingContext';

/**
 * Hook to control global loading modal
 * 
 * @example
 * const { show, hide } = useLoading();
 * 
 * // Show loading
 * show();
 * 
 * // With message (optional)
 * show('Loading...');
 * 
 * // Hide loading
 * hide();
 * 
 * @returns Object with show() and hide() methods
 */
export const useLoading = () => useLoadingContext();
