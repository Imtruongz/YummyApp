/**
 * regexPatterns.ts
 * 
 * Tập hợp các biểu thức chính quy (regex) được sử dụng trong toàn bộ ứng dụng YummyApp.
 * File này giúp tập trung quản lý tất cả các pattern regex, giúp dễ bảo trì và đồng nhất.
 */

/**
 * Biểu thức chính quy kiểm tra email hợp lệ
 * - Phải có một ký tự @ nằm giữa các ký tự
 * - Phải có ít nhất một ký tự '.' sau @
 * - Không cho phép khoảng trắng
 * 
 * Ví dụ hợp lệ: user@example.com, name.surname@domain.co.uk
 * Ví dụ không hợp lệ: user@, user@.com, user @domain.com
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Biểu thức chính quy kiểm tra số điện thoại Việt Nam
 * - Bắt đầu bằng số 0 hoặc +84
 * - Tiếp theo là các đầu số nhà mạng hợp lệ
 * - Tổng độ dài đảm bảo đúng chuẩn số điện thoại VN
 * 
 * Ví dụ hợp lệ: 0912345678, +84912345678, 0363704403
 */
export const VN_PHONE_REGEX = /^(\+84|0)([3|5|7|8|9])([0-9]{8})$/;

/**
 * Biểu thức chính quy kiểm tra mật khẩu mạnh
 * - Ít nhất 8 ký tự
 * - Chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt
 * 
 * Ví dụ hợp lệ: Passw0rd!, StrongP@ss123
 */
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Biểu thức chính quy kiểm tra mật khẩu cơ bản
 * - Ít nhất 6 ký tự
 * 
 * Phù hợp với yêu cầu hiện tại của ứng dụng
 */
export const BASIC_PASSWORD_REGEX = /^.{6,}$/;

/**
 * Biểu thức chính quy chỉ cho phép số
 * Dùng để lọc input chỉ nhận số (vd: trong ô nhập số tiền)
 */
export const NUMBERS_ONLY_REGEX = /^[0-9]+$/;

/**
 * Biểu thức chính quy thêm dấu phẩy ngăn cách hàng nghìn
 * Ví dụ: 1000 -> 1,000
 */
export const FORMAT_THOUSANDS_REGEX = /\B(?=(\d{3})+(?!\d))/g;

/**
 * Biểu thức chính quy kiểm tra URL hợp lệ
 */
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

/**
 * Biểu thức chính quy kiểm tra tên người dùng hợp lệ
 * - Chỉ cho phép chữ cái, số, dấu gạch dưới và dấu gạch ngang
 * - Độ dài từ 3-30 ký tự
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;

/**
 * Biểu thức chính quy kiểm tra chỉ có chữ cái và khoảng trắng
 * Dùng cho tên người dùng, tên món ăn, v.v.
 */
export const LETTERS_AND_SPACES_ONLY = /^[a-zA-Z\s]+$/;

/**
 * Biểu thức chính quy kiểm tra chỉ có chữ cái, số và khoảng trắng
 * Phù hợp với các trường thông tin cơ bản
 */
export const ALPHANUMERIC_AND_SPACES = /^[a-zA-Z0-9\s]+$/;

/**
 * Biểu thức chính quy kiểm tra thời gian định dạng HH:MM
 * Ví dụ: 09:30, 14:45
 */
export const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Biểu thức chính quy kiểm tra định dạng ngày DD/MM/YYYY
 * Ví dụ hợp lệ: 01/01/2023, 31/12/2023, 1/1/2023
 * Ví dụ không hợp lệ: 32/01/2023, 01/13/2023
 */
export const DATE_DMY_REGEX = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

/**
 * Biểu thức chính quy kiểm tra định dạng ngày YYYY-MM-DD (ISO)
 * Phù hợp với chuẩn ISO 8601 cho ngày
 */
export const DATE_ISO_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

/**
 * Biểu thức chính quy lọc các ký tự không mong muốn trong tìm kiếm
 * Hữu ích khi xử lý chuỗi tìm kiếm từ người dùng
 */
export const CLEAN_SEARCH_REGEX = /[^\w\s]/gi;

/**
 * Loại bỏ ký tự đặc biệt HTML để ngăn chặn XSS
 */
export const SANITIZE_HTML_REGEX = /[&<>"']/g;

/**
 * Kiểm tra chuỗi có chứa emoji không
 */
export const EMOJI_REGEX = /[\p{Emoji}]/u;

/**
 * Hàm tiện ích kiểm tra định dạng email
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Hàm tiện ích kiểm tra định dạng số điện thoại Việt Nam
 */
export const isValidVNPhone = (phone: string): boolean => {
  return VN_PHONE_REGEX.test(phone);
};

/**
 * Hàm tiện ích kiểm tra định dạng mật khẩu mạnh
 */
export const isStrongPassword = (password: string): boolean => {
  return STRONG_PASSWORD_REGEX.test(password);
};

/**
 * Hàm tiện ích kiểm tra mật khẩu cơ bản theo yêu cầu của ứng dụng
 */
export const isValidPassword = (password: string): boolean => {
  return BASIC_PASSWORD_REGEX.test(password);
};

/**
 * Hàm tiện ích định dạng số với dấu phẩy ngăn cách hàng nghìn
 */
export const formatNumberWithCommas = (number: number | string): string => {
  return number.toString().replace(FORMAT_THOUSANDS_REGEX, ',');
};

/**
 * Hàm tiện ích định dạng tiền USD (thêm ký hiệu $ ở đầu)
 */
export const formatUSDCurrency = (amount: number | string): string => {
  return '$' + formatNumberWithCommas(amount);
};

/**
 * Hàm tiện ích định dạng tiền VNĐ (thêm đ ở cuối)
 */
export const formatVNDCurrency = (amount: number | string): string => {
  return formatNumberWithCommas(amount) + 'đ';
};

/**
 * Hàm tiện ích chỉ giữ lại số trong chuỗi đầu vào
 */
export const extractNumbersOnly = (input: string): string => {
  return input.replace(/[^0-9]/g, '');
};

/**
 * Hàm tiện ích xóa khoảng trắng đầu, cuối và gộp nhiều khoảng trắng liền kề
 */
export const normalizeSpaces = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

/**
 * Hàm tiện ích làm sạch chuỗi tìm kiếm
 * Loại bỏ các ký tự đặc biệt, chuẩn hóa khoảng trắng
 */
export const cleanSearchQuery = (query: string): string => {
  return normalizeSpaces(query.replace(CLEAN_SEARCH_REGEX, ''));
};

/**
 * Hàm tiện ích chuẩn hóa chuỗi tìm kiếm và chuyển về chữ thường
 * Sử dụng cho việc tìm kiếm không phân biệt chữ hoa/thường
 */
export const normalizeSearchText = (text: string): string => {
  return cleanSearchQuery(text).toLowerCase();
};

/**
 * Hàm kiểm tra một chuỗi có chứa chuỗi khác không, không phân biệt hoa thường và dấu
 * @param source Chuỗi nguồn để tìm kiếm trong đó
 * @param search Chuỗi cần tìm
 * @returns true nếu source chứa search (không phân biệt hoa thường)
 */
export const containsTextCaseInsensitive = (source: string, search: string): boolean => {
  if (!source || !search) return false;
  return normalizeSearchText(source).includes(normalizeSearchText(search));
};

/**
 * Hàm tiện ích kiểm tra định dạng ngày DD/MM/YYYY
 * Không chỉ kiểm tra định dạng mà còn xác thực tính hợp lệ của ngày
 * (Ví dụ: không chấp nhận 31/02/2023)
 */
export const isValidDateDMY = (date: string): boolean => {
  if (!DATE_DMY_REGEX.test(date)) return false;
  
  const [day, month, year] = date.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

/**
 * Hàm tiện ích kiểm tra định dạng ngày ISO YYYY-MM-DD
 * Không chỉ kiểm tra định dạng mà còn xác thực tính hợp lệ của ngày
 */
export const isValidDateISO = (date: string): boolean => {
  if (!DATE_ISO_REGEX.test(date)) return false;
  
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};