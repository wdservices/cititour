export function fmt(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object' && val !== null && '_lat' in val && '_long' in val) {
    const g = val as { _lat: number; _long: number };
    return `${g._lat.toFixed(4)}, ${g._long.toFixed(4)}`;
  }
  return String(val);
}
