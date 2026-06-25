"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Delay slightly so route transitions finish before observers attach.
    const timer = setTimeout(() => {
      const observed = new WeakSet<HTMLElement>();

      const applyStagger = (root: ParentNode) => {
        const containers = Array.from(
          root.querySelectorAll<HTMLElement>("[data-reveal-stagger]")
        );

        for (const container of containers) {
          const children = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal]"));
          for (let i = 0; i < children.length; i++) {
            children[i].style.transitionDelay = `${i * 0.1}s`;
          }
        }
      };

      const revealImmediately = (root: ParentNode) => {
        const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
        for (const el of targets) el.classList.add("is-revealed");
      };

      if (typeof IntersectionObserver === "undefined") {
        applyStagger(document);
        revealImmediately(document);
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            el.classList.add("is-revealed");
            io.unobserve(el);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
      );

      const observeTargets = (root: ParentNode) => {
        const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
        for (const el of targets) {
          if (observed.has(el) || el.classList.contains("is-revealed")) continue;
          observed.add(el);
          io.observe(el);
        }
      };

      applyStagger(document);
      observeTargets(document);

      const mo = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;

            if (node.matches("[data-reveal-stagger]")) {
              applyStagger(node.parentElement ?? document);
            }
            if (node.matches("[data-reveal]")) {
              observeTargets(node.parentElement ?? document);
              continue;
            }

            applyStagger(node);
            observeTargets(node);
          }
        }
      });

      mo.observe(document.body, { childList: true, subtree: true });

      cleanup = () => {
        mo.disconnect();
        io.disconnect();
      };
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
