// resources/js/pages/app/customers/utils/format.ts
import { format, parseISO, parse } from 'date-fns';
import { es } from 'date-fns/locale';

function parseAny(dateStr: string): Date {

  if (!dateStr) return new Date();
 
  if (dateStr.includes('T')) return parseISO(dateStr);

  /*  dd/MM/yyyy HH:mm:ss  → 14/03/2025 00:29:22  */
  return parse(dateStr, 'dd/MM/yyyy HH:mm:ss', new Date());
}

export const fDate = (
  raw: string,
  pattern = 'dd MMM yy – HH:mm',
) => format(parseAny(raw), pattern, { locale: es });
