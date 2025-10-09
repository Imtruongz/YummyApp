import { DATE_DMY_REGEX, isValidDateDMY } from './regexPatterns';

/**
 * Định dạng chỉ ngày (Date)
 * @param dateString Chuỗi ngày tháng từ API (ISO 8601 format)
 * @param locale Locale mặc định (ví dụ: 'en-GB' cho DD/MM/YYYY)
 * @returns Chuỗi ngày đã định dạng (Ví dụ: '13/01/2025' nếu 'en-GB')
 */
export const formatDate = (
  dateString: string | undefined,
  locale: string = 'en-GB',
): string => {
  if (!dateString) return ''; // Nếu không có dữ liệu, trả về chuỗi rỗng
  const date = new Date(dateString); // Chuyển đổi chuỗi sang Date object
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (
  dateString: string | undefined,
  locale: string = 'en-GB',
): string => {
  if (!dateString) return ''; // Nếu không có dữ liệu, trả về chuỗi rỗng
  const date = new Date(dateString); // Chuyển đổi chuỗi sang Date object
  return date.toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Xác thực và phân tích chuỗi ngày dạng DD/MM/YYYY
 * @param dateString Chuỗi ngày theo định dạng DD/MM/YYYY
 * @returns Date object nếu chuỗi hợp lệ, null nếu không hợp lệ
 */
export const parseDateDMY = (dateString: string): Date | null => {
  if (!isValidDateDMY(dateString)) return null;
  
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};
