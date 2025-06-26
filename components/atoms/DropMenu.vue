<script setup lang="ts">
const route = useRoute();

type LinkDrop = {
  link: string;
  title: string;
};

const props = defineProps<{
  linksData: LinkDrop[];
  startsLink: string;
  colorBg: string;
  titleClass?: string;
}>();

const isCategoriesRoute = computed(() => {
  return route.path.startsWith(`${props.startsLink}`);
});

const activeDropMenu = ref(false);

const closeMenu = () => {
  activeDropMenu.value = false;
};
defineExpose({
  closeMenu,
});
</script>
<template>
  <div
    :class="[
      'drop-menu',
      props.titleClass,
      { 'router-link-exact-active': isCategoriesRoute },
    ]"
    @focus="activeDropMenu = true"
    @touchend="activeDropMenu = !activeDropMenu"
  >
    <div class="drop-menu__title">
      <span class="drop-menu__title-text">Проекты</span>

      <div class="drop-menu__title-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
          />
        </svg>
      </div>
    </div>
    <ul
      class="drop-menu__list"
      :class="{ 'drop-menu__list--visible': activeDropMenu }"
      @mouseleave="activeDropMenu = false"
    >
      <li
        v-for="data in props.linksData"
        :key="data.title"
        class="drop-menu__item"
      >
        <NuxtLink tabindex="0" :to="data.link" @touchend.stop
          >{{ data.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.drop-menu {
  position: relative;
  z-index: 1;
  color: var(--color-text-secondary);
  cursor: pointer;

  @media (hover: hover) {
    &:hover .drop-menu__list {
      display: flex;
      flex-direction: column;
      height: auto;
      padding: 20px;
      opacity: 1;
      pointer-events: initial;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__title-icon {
    display: flex;
    width: 24px;
  }

  &__list {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: -1;
    display: none;
    flex-direction: column;
    gap: 12px;
    height: 1px;
    padding: 0 20px;
    background-color: rgba(0, 0, 0, 0.912);
    opacity: 0;
    transition: all 0.3s;
    pointer-events: none;
    overflow: hidden;

    &--visible {
      display: flex;
      flex-direction: column;
      height: auto;
      padding: 20px;
      opacity: 1;
      pointer-events: initial;
    }
  }

  &__item {
    font-weight: 400;
    color: var(--color-text-secondary);

    @media (hover: hover) {
      &:hover {
        color: var(--color-accent-primary);
      }
    }
  }
}

.router-link-exact-active {
  color: var(--color-accent-primary);
}
@keyframes show-arrow {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
