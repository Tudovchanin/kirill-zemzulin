import type { Device } from "~/types";

export function useDevice() {
  const device = ref<Device>("desc");

  const imageSizes = computed(() => {
    switch (device.value) {
      case "mobile":
        return { width: 450, height: 640 };
      case "desc":
      default:
        return { width: 550, height: 800 };
    }
  });
  let mobileWidthMediaQuery: MediaQueryList | null = null;

  const handleChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      device.value = "mobile";
    } else {
      device.value = "desc";
    }
  };
  onMounted(() => {
    mobileWidthMediaQuery = window.matchMedia("(max-width: 768px)");
    device.value = mobileWidthMediaQuery.matches ? "mobile" : "desc";
    mobileWidthMediaQuery.addEventListener("change", handleChange);
  });
  onUnmounted(() => {
    if (!mobileWidthMediaQuery) return;
    mobileWidthMediaQuery.removeEventListener("change", handleChange);
  });

  return {device, imageSizes}
}
