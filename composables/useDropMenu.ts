export function useDropdownMenu() {
  const activeDropMenu = ref(false);

  const handleTouchend = () => {
    activeDropMenu.value = !activeDropMenu.value;
  };
  const handleFocus = () => {
    const isTouchCapable = matchMedia("(pointer: coarse)").matches;

    if (!activeDropMenu.value && !isTouchCapable) {
      activeDropMenu.value = true;
    }
  };
  const closeMenu = () => {
    activeDropMenu.value = false;
  };

  return {
    activeDropMenu,
    handleTouchend,
    handleFocus,
    closeMenu,
  };
}
