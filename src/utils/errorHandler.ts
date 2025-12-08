/**
 * Error Handler Wrapper
 * Centralized error handling and async action management
 * 
 * Impact: 39 occurrences → 1 wrapper
 * Reduces code by ~80 lines
 */

import { showToast } from './toast';

export interface AsyncActionOptions {
  onSuccess?: (data?: any) => void | Promise<void>;
  onError?: (error: any) => void | Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

/**
 * Handle async action with consistent error handling and notifications
 * Replaces try-catch blocks throughout the app
 * 
 * @param action - Async function to execute
 * @param options - Configuration options
 * @returns Result of the action
 * 
 * Example:
 * await handleAsyncAction(
 *   () => dispatch(addFoodAPI(data)),
 *   {
 *     onSuccess: () => navigation.goBack(),
 *     successMessage: 'Thành công',
 *     errorMessage: 'Không thể thêm món ăn'
 *   }
 * );
 */
export const handleAsyncAction = async <T,>(
  action: () => Promise<T>,
  options: AsyncActionOptions = {}
): Promise<T | null> => {
  const {
    onSuccess,
    onError,
    successMessage = 'Thành công',
    errorMessage = 'Có lỗi xảy ra',
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  try {
    const result = await action();

    if (showSuccessToast && successMessage) {
      showToast.success(successMessage);
    }

    if (onSuccess) {
      await onSuccess(result);
    }

    return result;
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || errorMessage;

    if (showErrorToast) {
      showToast.error('Lỗi', errorMsg);
    }

    if (onError) {
      await onError(error);
    }

    console.log('Async action error:', error);
    return null;
  }
};

/**
 * Handle async action without throwing errors
 * Returns {success, data, error} object
 * 
 * @param action - Async function to execute
 * @returns Object with success status, data, and error
 * 
 * Example:
 * const { success, data, error } = await tryCatch(() => 
 *   dispatch(getUserAPI()).unwrap()
 * );
 * if (success) {
 *   console.log('User:', data);
 * } else {
 *   console.error('Error:', error);
 * }
 */
export const tryCatch = async <T,>(
  action: () => Promise<T>
): Promise<{ success: boolean; data: T | null; error: any | null }> => {
  try {
    const data = await action();
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

/**
 * Wrap async function with error handling and optional retry logic
 * 
 * @param action - Async function to execute
 * @param options - Configuration options
 * @param maxRetries - Maximum number of retries (default: 0)
 * @returns Result of the action
 * 
 * Example:
 * const result = await withRetry(
 *   () => dispatch(fetchDataAPI()).unwrap(),
 *   { errorMessage: 'Failed to fetch' },
 *   3  // Retry up to 3 times
 * );
 */
export const withRetry = async <T,>(
  action: () => Promise<T>,
  options: AsyncActionOptions = {},
  maxRetries = 0
): Promise<T | null> => {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await action();
      
      if (attempt > 0 && options.showSuccessToast) {
        showToast.success('Thành công sau ' + attempt + ' lần thử lại');
      }

      return result;
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  // All retries failed
  const errorMsg = lastError?.response?.data?.message || 
                   lastError?.message || 
                   options.errorMessage ||
                   'Có lỗi xảy ra';

  if (options.showErrorToast) {
    showToast.error('Lỗi', errorMsg);
  }

  if (options.onError) {
    await options.onError(lastError);
  }

  console.log('Async action failed after retries:', lastError);
  return null;
};
