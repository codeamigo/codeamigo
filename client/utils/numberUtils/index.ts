import numeral from 'numeral';

export function formatNumber(num: number) {
  if (!num) {
    return 0;
  }
  return numeral(num).format('0.[0]a');
}
