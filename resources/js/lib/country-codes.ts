/**
 * ISO-3166 two-letter codes for the country names stored in `pais.nom_pais`.
 * Presentational only — used to render the small badge next to a country
 * name, the same way `EmpresaKuelap::nombreCorto()` formats a display name
 * from stored data.
 */
const CODES: Record<string, string> = {
    Argentina: 'AR',
    Bolivia: 'BO',
    Canadá: 'CA',
    Chile: 'CL',
    Colombia: 'CO',
    Ecuador: 'EC',
    España: 'ES',
    'Estados Unidos': 'US',
    Honduras: 'HN',
    México: 'MX',
    Panamá: 'PA',
    Paraguay: 'PY',
    Perú: 'PE',
    Uruguay: 'UY',
    Venezuela: 'VE',
};

export function countryCode(nombre: string): string {
    return CODES[nombre] ?? nombre.slice(0, 2).toUpperCase();
}
