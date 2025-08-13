export interface CountryDialCode {
  name: string;
  cca2: string;
  callingCode: string;
}

export async function fetchCountryDialCodes(): Promise<CountryDialCode[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,idd,cca2"
  );
  const data = await res.json();
  const mapped: CountryDialCode[] = (data || [])
    .map((country: any) => {
      const root = country?.idd?.root ?? "";
      const suffixes: string[] = country?.idd?.suffixes ?? [];
      const code =
        root && suffixes?.length ? `${root}${suffixes[0]}` : root || "";
      return {
        name: country?.name?.common ?? country?.name?.official ?? "Unknown",
        cca2: country?.cca2 ?? "XX",
        callingCode: code || "+",
      } as CountryDialCode;
    })
    .filter(
      (country: CountryDialCode) =>
        country.callingCode && country.callingCode !== "+"
    )
    .sort((a: CountryDialCode, b: CountryDialCode) =>
      a.name.localeCompare(b.name)
    );
  return mapped;
}
