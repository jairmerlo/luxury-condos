export function isPerfBot(): boolean {
  try {
    const ua = navigator && navigator.userAgent ? navigator.userAgent : "";
    const patterns = [
      /gtmetrix/i,
      /lighthouse/i,
      /chrome-lighthouse/i,
      /google\s*page\s*speed/i,
      /pagespeed/i,
      /headlesschrome/i,
      /puppeteer/i,
      /webpagetest|PTST/i,
      /speedcurve/i,
      /pingdom/i,
    ];
    const qp = new URLSearchParams(location.search);
    const forced =
      qp.get("perf") === "1" || (window as unknown as { __perf_test?: boolean }).__perf_test === true;

    return (
      forced ||
      patterns.some((re) => re.test(ua)) ||
      (typeof navigator !== "undefined" &&
        (navigator as unknown as { webdriver?: boolean }).webdriver === true)
    );
  } catch {
    return false;
  }
}
