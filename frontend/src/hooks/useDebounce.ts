import { useEffect, useState } from "react";

/**
 * Hook useDebounce
 * Digunakan untuk menunda update value sampai user berhenti mengetik selama sekian milidetik.
 *
 * @param value Nilai yang ingin di-delay (biasanya state search query)
 * @param delay Waktu tunda dalam milidetik (misal: 500)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout: Update debouncedValue hanya setelah 'delay' milidetik
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Jika value berubah sebelum waktu habis (user ngetik lagi),
    // batalkan timeout sebelumnya. Ini kuncinya!
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
