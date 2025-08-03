/**
 * Converts UTC date to local date string with timezone awareness
 * @param {Date|string} utcDate - UTC date (either Date object or ISO string)
 * @param {Object} [options] - Formatting options
 * @param {string} [options.timeZone] - Target timezone (default: browser's timezone)
 * @param {string} [options.locale] - Locale for formatting (default: 'en-US')
 * @param {boolean} [options.includeTimezone] - Show timezone abbreviation (default: true)
 * @returns {string} Formatted local date string
 */
export default function utcToLocalDate(
    utcDate: Date | string,
    options?: {
      timeZone?: string;
      locale?: string;
      includeTimezone?: boolean;
    }
  ): string {
    // Convert input to Date object if it's a string
    const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
    
    // Use browser timezone if none specified
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const targetTimezone = options?.timeZone || detectedTimezone;
    
    try {
      return date.toLocaleString(options?.locale || 'en-US', {
        timeZone: targetTimezone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: options?.includeTimezone ? 'short' : undefined
      } as Intl.DateTimeFormatOptions);
    } catch (e) {
      console.error(`Invalid timezone "${targetTimezone}", falling back to UTC`);
      return date.toLocaleString(options?.locale || 'en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: options?.includeTimezone ? 'short' : undefined
      } as Intl.DateTimeFormatOptions);
    }
  }