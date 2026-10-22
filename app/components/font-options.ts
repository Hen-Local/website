export const fontOptions = [
  { id: "inter", name: "Inter", face: "Hen Preview Inter", family: '"Hen Preview Inter", Arial, sans-serif', character: "Clear & neutral", description: "A crisp, understated option with a familiar product feel.", source: "https://rsms.me/inter/" },
  { id: "dm-sans", name: "DM Sans", face: "Hen Preview DM Sans", family: '"Hen Preview DM Sans", Arial, sans-serif', character: "Warm & approachable", description: "Softer shapes that sit comfortably beside the hand-drawn illustrations.", source: "https://fontsource.org/fonts/dm-sans/about" },
  { id: "manrope", name: "Manrope", face: "Manrope", family: '"Manrope", Arial, sans-serif', character: "Geometric & polished", description: "The selected English typeface, with open, rounded forms.", source: "https://fontsource.org/fonts/manrope/about" },
  { id: "space-grotesk", name: "Space Grotesk", face: "Hen Preview Space Grotesk", family: '"Hen Preview Space Grotesk", Arial, sans-serif', character: "Distinctive & technical", description: "More character in the letterforms for a stronger technology identity.", source: "https://fontsource.org/fonts/space-grotesk/about" },
  { id: "arial", name: "Arial", face: "Arial", family: 'Arial, Helvetica, "SF Pro Display", sans-serif', character: "Previous font", description: "The previous website typography, kept here as a reference.", source: null },
] as const;

export type PreviewFontId = (typeof fontOptions)[number]["id"];
export const defaultPreviewFont = "manrope";
export const fontPreviewPath = "/en/font-preview/";

export function isPreviewFont(value: unknown): value is PreviewFontId {
  return fontOptions.some((font) => font.id === value);
}

export function getPreviewFont(value: unknown) {
  return fontOptions.find((font) => font.id === value) ?? fontOptions[2];
}
