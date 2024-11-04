import * as pluralize from "pluralize";
const vowels = ["a", "e", "i", "o", "u"];

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const camel = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
export const trim = (s: string) => s.trim();
export const kebab = (...s: string[]) => {
    return s.map(lower).map(trim).join("-");
}
export const natural = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ").map(lower).join(" ");
export const lower = (s: string) => s.toLowerCase();
export const describe = (s: string) => `${vowels.slice(0, -1).includes(s.charAt(0)) ? "an" : "a"} ${natural(s)}`;
export const plural = (s: string) => pluralize.plural(s);

