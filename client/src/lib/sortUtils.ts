/**
 * Sort helpers to easily toggle between Ascending and Descending orders.
 */

// Mapping of ASC <-> DESC pairs
const SORT_FLIP_MAP: Record<string, string> = {
  // Doctors
  newest: 'oldest',
  oldest: 'newest',
  'name-asc': 'name-desc',
  'name-desc': 'name-asc',
  alpha: 'name-desc',
  'patients-desc': 'patients-asc',
  'patients-asc': 'patients-desc',
  patients: 'patients-asc',

  // Patients
  'age-asc': 'age-desc',
  'age-desc': 'age-asc',

  // Sessions
  'date-desc': 'date-asc',
  'date-asc': 'date-desc',
  'patient-asc': 'patient-desc',
  'patient-desc': 'patient-asc',
  'doctor-asc': 'doctor-desc',
  'doctor-desc': 'doctor-asc',
  'status-asc': 'status-desc',
  'status-desc': 'status-asc',
};

export function toggleSortOrder(currentSort: string): string {
  return SORT_FLIP_MAP[currentSort] || (currentSort.endsWith('-asc')
    ? currentSort.replace(/-asc$/, '-desc')
    : currentSort.endsWith('-desc')
    ? currentSort.replace(/-desc$/, '-asc')
    : 'oldest');
}

export function isSortAscending(currentSort: string): boolean {
  return (
    currentSort === 'oldest' ||
    currentSort.endsWith('-asc') ||
    currentSort === 'alpha'
  );
}
