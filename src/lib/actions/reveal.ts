import type { Action } from "svelte/action";

export type RevealParams = {
  /** Stagger delay in ms */
  delay?: number;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
};

/**
 * Scroll-reveal: adds `.is-visible` when element enters viewport.
 * Respects prefers-reduced-motion (instant visible).
 */
export const reveal: Action<HTMLElement, RevealParams | undefined> = (
  node,
  params,
) => {
  const delay = params?.delay ?? 0;
  const rootMargin = params?.rootMargin ?? "0px 0px -8% 0px";

  node.classList.add("reveal");
  if (delay > 0) {
    node.style.setProperty("--reveal-delay", `${delay}ms`);
  }

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    node.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      }
    },
    { root: null, rootMargin, threshold: 0.12 },
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
};
