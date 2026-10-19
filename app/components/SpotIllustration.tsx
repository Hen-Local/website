/* eslint-disable @next/next/no-img-element -- small local illustrations are exported as lossless WebP assets */

export type IllustrationName =
  | "privacy-local"
  | "hardware-connections"
  | "scene-keynote"
  | "scene-workshop"
  | "scene-forum"
  | "scene-hybrid"
  | "cost-multiple-meetings"
  | "consultation-planning";

export default function SpotIllustration({ name, className = "", alt = "" }: {
  name: IllustrationName;
  className?: string;
  alt?: string;
}) {
  const hardware = name === "hardware-connections";
  return <img className={`spot-illustration ${className}`} src={`/illustrations/${name}.webp`} alt={alt} width={hardware ? 1200 : 960} height={hardware ? 400 : 480} loading="lazy" decoding="async" />;
}
