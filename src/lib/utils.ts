// src/lib/utils.ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for composing Tailwind CSS class names
 * Resolves conflicting classes with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Date formatting options type to improve type safety
 */
type DateFormatOptions = {
  locale?: string;
  dateOptions?: Intl.DateTimeFormatOptions;
};

/**
 * Format a date with customizable options
 */
export function formatDate(
  date: Date | string | number,
  options: DateFormatOptions = {},
) {
  const {
    locale = "ja-JP",
    dateOptions = { year: "numeric", month: "short", day: "numeric" },
  } = options;

  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, dateOptions).format(d);
}

/**
 * Currency formatting options type
 */
type CurrencyFormatOptions = {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
};

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {},
) {
  const {
    currency = "IDR",
    locale = "id-ID",
    minimumFractionDigits = 0,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
  }).format(amount);
}

/**
 * Phone number formatting options
 */
type PhoneFormatOptions = {
  defaultCountryCode?: string;
};

/**
 * Format a phone number to E.164 format
 */
export function formatPhoneNumber(
  phone: string,
  options: PhoneFormatOptions = {},
): string {
  const { defaultCountryCode = "62" } = options;

  // Return empty string for empty input
  if (!phone) return "";

  // E.164 format regex
  const e164Regex = /^\+\d{1,3}\d{1,14}$/;

  // Already in E.164 format
  if (e164Regex.test(phone)) {
    return phone;
  }

  // Extract digits only
  const digits = phone.replace(/\D/g, "");

  // Apply country code logic
  if (digits.startsWith("0")) {
    return `+${defaultCountryCode}${digits.substring(1)}`;
  }

  if (!digits.startsWith(defaultCountryCode)) {
    return `+${defaultCountryCode}${digits}`;
  }

  return `+${digits}`;
}

/**
 * Extract filename from a URL
 */
export function getFilenameFromUrl(url: string): string {
  if (!url) return "";

  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  if (!lastPart) return "";

  const filename = lastPart.split("?")[0];
  return filename || "";
}

/**
 * Truncate text to specified length and add ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Random ID generation options
 */
type RandomIdOptions = {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
};

/**
 * Generate a random ID with customizable options
 */
export function generateRandomId(options: RandomIdOptions = {}): string {
  const {
    length = 10,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
  } = options;

  let characters = "";
  if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) characters += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) characters += "0123456789";

  if (characters.length === 0) {
    characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

/**
 * Remove empty values from an object (for GraphQL queries)
 */
export function removeEmptyValues<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  const result: Partial<T> = {};

  Object.entries(obj).forEach(([key, value]) => {
    const isValueEmpty = value === undefined || value === null || value === "";
    const isEmptyArray = Array.isArray(value) && value.length === 0;

    if (!isValueEmpty && !isEmptyArray) {
      if (Array.isArray(value)) {
        // Type assertion to ensure compatibility
        result[key as keyof T] = value as T[keyof T];
      } else if (typeof value === "object") {
        const cleaned = removeEmptyValues(value);

        if (Object.keys(cleaned).length > 0) {
          result[key as keyof T] = cleaned as T[keyof T];
        }
      } else {
        result[key as keyof T] = value;
      }
    }
  });

  return result;
}

/**
 * Parse URL query parameters into an object
 */
export function parseQueryParams(queryString: string): Record<string, string> {
  // Check for empty or invalid query string
  const isValidQuery =
    queryString && queryString !== "?" && queryString.includes("?");

  if (!isValidQuery) {
    return {};
  }

  // Remove leading ? if present
  const cleanQuery = queryString.startsWith("?")
    ? queryString.substring(1)
    : queryString;

  const params = new URLSearchParams(cleanQuery);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Convert an object to URL query parameters
 */
export function buildQueryString(
  params: Record<string, string | number | boolean>,
): string {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    const isValuePresent =
      value !== undefined && value !== null && value !== "";

    if (isValuePresent) {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  return queryString ? `?${queryString}` : "";
}
