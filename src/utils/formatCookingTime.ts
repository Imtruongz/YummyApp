/**
 * Format cooking time from minutes to human-readable Vietnamese string
 * 
 * @param minutes - Total cooking time in minutes
 * @returns Formatted string in Vietnamese (e.g., "2 giờ 30 phút")
 * 
 * @example
 * formatCookingTime(30)  // "30 phút"
 * formatCookingTime(60)  // "1 giờ"
 * formatCookingTime(90)  // "1 giờ 30 phút"
 * formatCookingTime(150) // "2 giờ 30 phút"
 * formatCookingTime(0)   // "Chưa có thông tin"
 */
export const formatCookingTime = (minutes: number | string): string => {
    // Handle string input (for backward compatibility with old data)
    if (typeof minutes === 'string') {
        // If already formatted (e.g., "30 phút"), return as is
        if (minutes.includes('phút') || minutes.includes('giờ')) {
            return minutes;
        }
        // Try to parse as number
        const parsed = parseInt(minutes, 10);
        if (isNaN(parsed)) return 'Chưa có thông tin';
        minutes = parsed;
    }

    // Handle invalid or zero
    if (!minutes || minutes === 0) {
        return 'Chưa có thông tin';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    // Only minutes (less than 1 hour)
    if (hours === 0) {
        return `${mins} phút`;
    }

    // Only hours (exact hours)
    if (mins === 0) {
        return hours === 1 ? '1 giờ' : `${hours} giờ`;
    }

    // Both hours and minutes
    return `${hours} giờ ${mins} phút`;
};

/**
 * Parse cooking time string to minutes
 * Useful for migrating old string data to number
 * 
 * @param timeString - Time string in Vietnamese (e.g., "2 giờ 30 phút")
 * @returns Total minutes as number
 * 
 * @example
 * parseCookingTime("30 phút")         // 30
 * parseCookingTime("2 giờ")           // 120
 * parseCookingTime("1 giờ 30 phút")   // 90
 * parseCookingTime("480 phút")        // 480
 */
export const parseCookingTime = (timeString: string): number => {
    if (!timeString) return 0;

    let totalMinutes = 0;

    // Match hours: "X giờ"
    const hourMatch = timeString.match(/(\d+)\s*giờ/i);
    if (hourMatch) {
        totalMinutes += parseInt(hourMatch[1], 10) * 60;
    }

    // Match minutes: "Y phút"
    const minMatch = timeString.match(/(\d+)\s*phút/i);
    if (minMatch) {
        totalMinutes += parseInt(minMatch[1], 10);
    }

    // If no match found, try parsing as plain number
    if (totalMinutes === 0) {
        const parsed = parseInt(timeString, 10);
        if (!isNaN(parsed)) {
            totalMinutes = parsed;
        }
    }

    return totalMinutes;
};

/**
 * Validate cooking time value
 * 
 * @param minutes - Cooking time in minutes
 * @param min - Minimum allowed minutes (default: 1)
 * @param max - Maximum allowed minutes (default: 480 = 8 hours)
 * @returns Validation result with error message if invalid
 */
export const validateCookingTime = (
    minutes: number,
    min: number = 1,
    max: number = 480
): { isValid: boolean; error?: string } => {
    if (!minutes || minutes === 0) {
        return { isValid: false, error: 'Vui lòng chọn thời gian nấu' };
    }

    if (minutes < min) {
        return { isValid: false, error: `Thời gian nấu tối thiểu ${min} phút` };
    }

    if (minutes > max) {
        const maxHours = Math.floor(max / 60);
        return { isValid: false, error: `Thời gian nấu không nên quá ${maxHours} giờ` };
    }

    return { isValid: true };
};

/**
 * Get cooking time category for filtering/sorting
 * 
 * @param minutes - Cooking time in minutes
 * @returns Category string
 */
export const getCookingTimeCategory = (minutes: number): string => {
    if (minutes === 0) return 'unknown';
    if (minutes <= 30) return 'quick';      // <= 30 phút
    if (minutes <= 60) return 'medium';     // 30-60 phút
    if (minutes <= 120) return 'long';      // 1-2 giờ
    return 'very_long';                      // > 2 giờ
};

/**
 * Sort comparator for cooking time
 * 
 * @example
 * foods.sort((a, b) => compareCookingTime(a.CookingTime, b.CookingTime))
 */
export const compareCookingTime = (a: number, b: number): number => {
    return (a || 0) - (b || 0);
};
