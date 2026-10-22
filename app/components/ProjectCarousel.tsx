"use client";

/* eslint-disable @next/next/no-img-element -- locally stored event key visuals */

import { useEffect, useRef, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

const AUTOPLAY_PIXELS_PER_SECOND = 80;

export type ServedProject = {
  name: string;
  detail: string;
  scale: string;
  start: string;
  end: string;
  website: string;
  image: string;
  artwork: string;
  imageOverlay: string | null;
  imageAlt: string;
};

export default function ProjectCarousel({ projects }: {
  projects: readonly ServedProject[];
}) {
  const t = useTranslations("home");
  const format = useFormatter();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const playingRef = useRef(true);
  const manualUntil = useRef(0);
  const cycleWidth = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => { playingRef.current = isPlaying; }, [isPlaying]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function syncPreference() { setIsPlaying(!preference.matches); }
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    const section = sectionRef.current;
    if (!carousel || !section) return;
    const artworks = carousel.querySelectorAll<HTMLElement>(".project-artwork");

    let visible = false;
    let hovered = false;
    let keyboardFocused = false;
    let touching = false;
    let lastTime = 0;
    let fractionalPixels = 0;
    let frame = 0;

    function measure() {
      if (!carousel) return;
      const card = carousel.querySelector<HTMLElement>(".project-card");
      if (!card) return;
      const oldCycle = cycleWidth.current;
      const fraction = oldCycle ? ((carousel.scrollLeft % oldCycle) + oldCycle) % oldCycle / oldCycle : 0;
      cycleWidth.current = (card.getBoundingClientRect().width + parseFloat(getComputedStyle(carousel).columnGap)) * projects.length;
      carousel.scrollLeft = cycleWidth.current * (1 + fraction);
    }

    function updatePosition() {
      if (!carousel || !cycleWidth.current) return;
      const offset = ((carousel.scrollLeft % cycleWidth.current) + cycleWidth.current) % cycleWidth.current;
      setActiveProject(Math.min(projects.length - 1, Math.floor((offset + 1) / (cycleWidth.current / projects.length))));
    }

    function pointerEnter(event: PointerEvent) { if (event.pointerType === "mouse") hovered = true; }
    function pointerLeave() { hovered = false; }
    function pointerDown() { touching = true; manualUntil.current = performance.now() + 3500; }
    function pointerUp() {
      if (!touching) return;
      touching = false;
      manualUntil.current = performance.now() + 1800;
    }
    function wheel() { manualUntil.current = performance.now() + 3500; }
    function focusIn(event: FocusEvent) { keyboardFocused = event.target instanceof Element && event.target.matches(":focus-visible"); }
    function focusOut(event: FocusEvent) {
      keyboardFocused = event.relatedTarget instanceof Element && !!section?.contains(event.relatedTarget) && event.relatedTarget.matches(":focus-visible");
    }

    function animate(time: number) {
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 0;
      lastTime = time;
      if (carousel && playingRef.current && visible && !document.hidden && !hovered && !keyboardFocused && !touching && time >= manualUntil.current && cycleWidth.current) {
        const cycle = cycleWidth.current;
        if (carousel.scrollLeft < cycle || carousel.scrollLeft >= cycle * 2) {
          carousel.scrollLeft = cycle + ((carousel.scrollLeft % cycle) + cycle) % cycle;
        }
        fractionalPixels += elapsed * AUTOPLAY_PIXELS_PER_SECOND / 1000;
        const distance = Math.floor(fractionalPixels);
        if (distance) { carousel.scrollLeft += distance; fractionalPixels -= distance; }
      }
      frame = requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(carousel);
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .1 });
    intersectionObserver.observe(section);
    carousel.addEventListener("scroll", updatePosition, { passive: true });
    artworks.forEach((artwork) => {
      artwork.addEventListener("pointerenter", pointerEnter);
      artwork.addEventListener("pointerleave", pointerLeave);
    });
    carousel.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", pointerUp);
    carousel.addEventListener("wheel", wheel, { passive: true });
    section.addEventListener("focusin", focusIn);
    section.addEventListener("focusout", focusOut);
    measure();
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      carousel.removeEventListener("scroll", updatePosition);
      artworks.forEach((artwork) => {
        artwork.removeEventListener("pointerenter", pointerEnter);
        artwork.removeEventListener("pointerleave", pointerLeave);
      });
      carousel.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
      carousel.removeEventListener("wheel", wheel);
      section.removeEventListener("focusin", focusIn);
      section.removeEventListener("focusout", focusOut);
    };
  }, [projects]);

  function scrollProjects(direction: number) {
    const carousel = carouselRef.current;
    const cycle = cycleWidth.current;
    if (!carousel || !cycle) return;
    manualUntil.current = performance.now() + 3500;
    if (carousel.scrollLeft < cycle || carousel.scrollLeft >= cycle * 2) {
      carousel.scrollLeft = cycle + ((carousel.scrollLeft % cycle) + cycle) % cycle;
    }
    carousel.scrollBy({ left: direction * cycle / projects.length, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  return (
    <section className="projects-section" id="projects" aria-labelledby="projects-title" ref={sectionRef}>
      <div className="projects-heading">
        <div><span className="story-label">{t("projectsTag")}</span><h2 id="projects-title">{t("projectsTitle")}</h2><p>{t("projectsIntro")}</p></div>
        <div className="project-navigation">
          <span className="project-position" aria-hidden="true"><b>{String(activeProject + 1).padStart(2, "0")}</b><span>/ {String(projects.length).padStart(2, "0")}</span></span>
          <div className="project-controls">
            <button type="button" aria-label={t("projectPrevious")} aria-controls="project-carousel" onClick={() => scrollProjects(-1)}><span aria-hidden="true">←</span></button>
            <button className="project-playback" type="button" aria-label={isPlaying ? t("projectPause") : t("projectPlay")} aria-pressed={!isPlaying} aria-controls="project-carousel" onClick={() => setIsPlaying((playing) => !playing)}><span aria-hidden="true">{isPlaying ? "Ⅱ" : "▷"}</span></button>
            <button type="button" aria-label={t("projectNext")} aria-controls="project-carousel" onClick={() => scrollProjects(1)}><span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
      <div className="project-carousel" id="project-carousel" ref={carouselRef} role="region" aria-roledescription="carousel" aria-label={t("projectGalleryLabel")} tabIndex={0} onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); scrollProjects(event.key === "ArrowLeft" ? -1 : 1); }
        if (event.key === "Home" || event.key === "End") {
          event.preventDefault(); manualUntil.current = performance.now() + 3500;
          event.currentTarget.scrollLeft = cycleWidth.current + (event.key === "Home" ? 0 : cycleWidth.current * (projects.length - 1) / projects.length);
        }
      }}>
        {[0, 1, 2].flatMap((copy) => projects.map((project, index) => (
          <article className="project-card" data-project-copy={copy} data-project-index={index} aria-hidden={copy !== 1 ? true : undefined} key={`${copy}-${project.website}`}>
            <div className="project-card-topline"><span className="project-card-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p className="project-scale" aria-label={t("projectScaleLabel")}>{project.scale}</p></div>
            <a className="project-card-link" href={project.website} target="_blank" rel="noreferrer" tabIndex={copy === 1 ? undefined : -1} aria-label={`${project.name} · ${t("projectWebsite")}`}>
              <div className={`project-artwork project-artwork--${project.artwork}`}>
                <img className="project-image" src={project.image} alt={copy === 1 ? project.imageAlt : ""} width="1200" height="750" loading="lazy" decoding="async" draggable={false} />
                {project.imageOverlay && <img className="project-image-overlay" src={project.imageOverlay} alt="" width="1400" height="136" loading="lazy" decoding="async" draggable={false} />}
                {project.artwork === "rust" && <div className="project-kv-title" aria-hidden="true"><strong>RustChinaConf</strong><span>SHENZHEN 2026</span></div>}
              </div>
              <div className="project-card-title"><h3>{project.name}</h3><span aria-hidden="true">↗</span></div>
            </a>
            <p className="project-detail">{project.detail}</p>
            <div className="project-card-meta">
              <p className="project-date"><time dateTime={project.start}>{format.dateTime(new Date(`${project.start}T00:00:00Z`), { year: "numeric", month: "2-digit", day: "2-digit" })}</time><span>–</span><time dateTime={project.end}>{format.dateTime(new Date(`${project.end}T00:00:00Z`), { month: "2-digit", day: "2-digit" })}</time></p>
            </div>
          </article>
        )))}
      </div>
    </section>
  );
}
