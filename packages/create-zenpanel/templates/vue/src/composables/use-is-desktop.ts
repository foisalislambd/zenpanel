import { onMounted, onUnmounted, ref } from "vue";

export const DESKTOP_BREAKPOINT = 1024;

export function useIsDesktop() {
  const isDesktop = ref(false);

  onMounted(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    isDesktop.value = mq.matches;

    const onChange = () => {
      isDesktop.value = mq.matches;
    };
    mq.addEventListener("change", onChange);
    onUnmounted(() => mq.removeEventListener("change", onChange));
  });

  return isDesktop;
}
