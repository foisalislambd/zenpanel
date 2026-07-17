export const DESKTOP_BREAKPOINT = 1024;

export function createIsDesktop() {
  let isDesktop = $state(false);

  $effect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    isDesktop = mq.matches;

    const onChange = () => {
      isDesktop = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  });

  return {
    get current() {
      return isDesktop;
    },
  };
}
