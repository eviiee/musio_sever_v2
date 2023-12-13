export default function numWithCommas(x: number | undefined | null) {
    if (x == undefined || x == null) return '';
    return x!.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}