<script setup lang="ts">
import { CATEGORY_SLUG_MAP } from "~/constants/mappings.constants";
import { useScrollSmoother } from "#gsap";

type LinkDrop = {
  link: string;
  title: string;
};

const route = useRoute();

const categoriesStore = useCategoriesStore();
const contactStore = useContactStore();
const popUpStore = usePopUpStore();

const dropMenuData = ref<LinkDrop[]>([]);

const isAboutPage = ref(false);
const isContactPage = ref(false);
const isCategories = ref(false);
const isScrollY = ref(false);
const isMenuOpen = ref(false);

const mobileMenuRef = ref();
const burgerBtnRef = ref();
const itemDropRef = ref();
const dropMenuComponentRef = ref();

let scrollSmoother: null | ScrollSmoother = null;

let scrollTimeout: ReturnType<typeof setTimeout>;
let noScrollTimeout: ReturnType<typeof setTimeout> | null = null;

const handleScroll = () => {
  clearTimeout(scrollTimeout);
  isScrollY.value = true;

  scrollTimeout = setTimeout(() => {
    isScrollY.value = false;
  }, 150);
};
const handleTouchPage = (e: TouchEvent) => {
  const targetElem = e.target as HTMLElement;

  if (itemDropRef.value && !itemDropRef.value.contains(targetElem)) {
    dropMenuComponentRef.value.closeMenu();
  }

  if (
    mobileMenuRef.value &&
    !mobileMenuRef.value.contains(targetElem) &&
    !burgerBtnRef.value.contains(targetElem)
  ) {
    isMenuOpen.value = false;
    noScrollTimeout = setTimeout(() => {
      noScrollTimeout = null;
      if (!popUpStore.popUpIsOpen) {
        toggleBlockScroll(false);
      }
    }, 200);
  }
};
const handleFocusAbout = () => {
  dropMenuComponentRef.value.closeMenu();
};
const handleClosePopUp = (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target) return;
  // if (target.closest(".pop-up__img")) {
  // }
  popUpStore.setPopUp(false);
};
const handleClickBurgerIcon = () => {
  isMenuOpen.value = !isMenuOpen.value;
  toggleBlockScroll(isMenuOpen.value);
};

const toggleBlockScroll = (value: boolean) => {
  scrollSmoother?.paused(value);
  document.documentElement.classList.toggle("no-scroll", value);
};

const initLinks = (data: string) => {};

watch(
  () => route.path,
  (newPath) => {
    // await nextTick();
    isAboutPage.value = newPath === "/about";
    isContactPage.value = newPath === "/contact";
    isCategories.value = route.path.startsWith("/categories");
  },
  { immediate: true }
);
watch(
  () => popUpStore.popUpIsOpen,
  (isOpen) => {
    toggleBlockScroll(isOpen);
  }
);

onMounted(async () => {
  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories();
  }
  if (!contactStore.contact) {
    await contactStore.fetchContact();
  }
  if (!scrollSmoother) {
    scrollSmoother = new useScrollSmoother({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      normalizeScroll: false,
      ignoreMobileResize: true,
    });
  }

  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (noScrollTimeout) {
    clearTimeout(noScrollTimeout);
    noScrollTimeout = null;
  }

  if (scrollSmoother) {
    scrollSmoother.kill();
  }
});
</script>

<template>
  <div class="layout-root">
    <div
      class="pop-up"
      :class="{ 'pop-up--visible': popUpStore.popUpIsOpen }"
      @click="handleClosePopUp"
    >
      <div class="pop-up__container-img">
        <NuxtImg
          v-if="popUpStore.popUpIsOpen"
          draggable="false"
          :src="popUpStore.img?.url"
          :width="popUpStore.img?.width"
          :height="popUpStore.img?.height"
          sizes="md:700"
          :alt="popUpStore.img?.description"
          class="pop-up__img"
        />
      </div>
      <button class="pop-up__close">
        <Icon :name="'lucide-x'" size="32" />
      </button>
    </div>
    <div id="smooth-wrapper" @touchstart.passive="handleTouchPage">
      <div id="smooth-content" class="layout-page">
        <div
          aria-hidden="true"
          class="background-blur"
          :class="{
            'background-blur--animate': isScrollY,
            'background-blur--about': isAboutPage,
            'background-blur--contact': isContactPage,
            'background-blur--categories': isCategories,
          }"
        ></div>

        <header class="header header-animate">
          <div class="header__content width-page x-center page-padding-x">
            <NuxtLink to="/" class="header__logo logo"
              >Kirill Zemzyulin</NuxtLink
            >
            <div
              ref="mobileMenuRef"
              class="header__mobile-content"
              :class="{ 'header__mobile-content--open': isMenuOpen }"
            >
              <nav class="header__nav">
                <ul class="header__list list-menu">
                  <li class="list-menu__item">
                    <NuxtLink to="/" class="link-menu">Портфолио</NuxtLink>
                  </li>
                  <li
                    ref="itemDropRef"
                    class="list-menu__item"
                    :class="{
                      'list-menu__item--hidden':
                        !categoriesStore.categories.length,
                    }"
                  >
                    <AtomsDropMenu
                      ref="dropMenuComponentRef"
                      tabindex="0"
                      starts-link="/categories"
                      color-bg="var(--drop-menu)"
                      title-class="link-menu"
                      :links-data="categoriesStore.getLinksCategory('/categories/')"
                    />
                  </li>
                  <li class="list-menu__item">
                    <NuxtLink
                      to="/about"
                      class="link-menu"
                      @focus="handleFocusAbout"
                      >Мои услуги</NuxtLink
                    >
                  </li>
                  <li class="list-menu__item">
                    <NuxtLink to="/contact" class="link-menu"
                      >Контакты</NuxtLink
                    >
                  </li>
                </ul>
              </nav>
              <ul class="header__social container-icons">
                <li v-if="contactStore.mainSocialLinks.telegram">
                  <a
                    :href="contactStore.mainSocialLinks.telegram?.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label=" ссылка на телеграм Кирилла Земзюлина"
                  >
                    <Icon
                      class="social-icon"
                      name="simple-icons:telegram"
                      size="28"
                    />
                  </a>
                </li>
                <li v-if="contactStore.mainSocialLinks.vk">
                  <a
                    :href="contactStore.mainSocialLinks.vk?.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label=" ссылка на профиль вк Кирилла Земзюлина"
                  >
                    <Icon
                      class="social-icon"
                      name="entypo-social:vk"
                      size="28"
                    />
                  </a>
                </li>
                <li v-if="contactStore.mainSocialLinks.watsApp">
                  <a
                    :href="contactStore.mainSocialLinks.watsApp?.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label=" ссылка на wats app Кирилла Земзюлина"
                  >
                    <Icon
                      class="social-icon"
                      name="simple-icons:whatsapp"
                      size="28"
                    />
                  </a>
                </li>
                <li v-if="contactStore.mainSocialLinks.vk">
                  <a
                    :href="contactStore.mainSocialLinks.vk?.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label=" ссылка на профиль инстаграм Кирилла Земзюлина"
                  >
                    <Icon
                      class="social-icon"
                      name="simple-icons:instagram"
                      size="28"
                    />
                  </a>
                </li>
              </ul>
            </div>
            <button
              :aria-label="isMenuOpen ? 'закрыть меню' : 'открыть меню'"
              ref="burgerBtnRef"
              class="header__burger burger"
              @click="handleClickBurgerIcon"
            >
              <Icon :name="isMenuOpen ? 'lucide-x' : 'lucide-menu'" size="32" />
            </button>
          </div>
        </header>
        <main class="main main--flex-grow-1">
          <slot></slot>
        </main>
        <footer class="footer">
          <div class="footer__content width-page x-center page-padding-x">
            <p class="footer__content-right">
              © 2025 Kirill Zemzyulin. Все права защищены.
            </p>
            <div class="footer__content-left">
              <p>
                Сайт разработан командой:
                <a href="mailto:michdev@example.com">MichDev</a>
              </p>
              <p>
                Совместно с
                <a
                  href="https://www.sanity.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Sanity</a
                >
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.layout-root {
  overflow: hidden;
}

.pop-up {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: none;
  background-color: rgba(0, 0, 0, 0.493);
  backdrop-filter: blur(10px);

  &--visible {
    display: grid;
    justify-items: center;
    align-items: center;
  }

  &__container-img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70vw;
    height: 95vh;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__close {
    position: absolute;
    top: 50px;
    right: 50px;
    display: flex;
    color: white;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}

#smooth-wrapper {
  position: relative;
  overflow: hidden;
}

#smooth-content {
  position: relative;
  min-height: calc(100vh + 1px);
  overflow: hidden;
  will-change: transform;
}

.background-blur {
  position: absolute;
  top: 100px;
  right: 0;
  z-index: -1;
  width: 90vmax;
  height: 90vmax;
  background-image: var(--hero-bg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 100%;
  filter: brightness(2) saturate(0);
  transition: filter 0.3s, border-radius 0.5s;
  animation: move-decor 4s linear infinite alternate;
  animation-play-state: paused;

  @media (max-width: 768px) {
    width: 60vmax;
    height: 60vmax;
  }

  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 60%;
    z-index: -1;
    display: none;
    width: 20%;
    height: 100%;
    opacity: 0;
    animation: opacity 1s 0.5s linear forwards;
    backdrop-filter: blur(1px) brightness(2) saturate(0);
  }

  &--animate:not(
      .background-blur--about,
      .background-blur--categories,
      .background-blur--contact
    ) {
    filter: brightness(1) saturate(1);
    animation: move-decor 4s linear infinite alternate;
  }

  &--about {
    width: 100%;
    height: calc(100vh - 132px);
    min-height: 500px;
    border-radius: 0;
    opacity: 0;
    filter: brightness(1) saturate(0);

    animation: move-decor 4s linear infinite alternate,
      about 0.3s ease-in forwards, about-mask 0.6s ease-out 0.5s forwards;
    animation-play-state: paused, running, running;
    animation: name duration timing-function delay iteration-count direction
      fill-mode;
  }

  &--contact {
    overflow: hidden;
    animation: move-decor 4s linear infinite alternate,
      contact-mask 1s 0.3s forwards;
    animation-play-state: paused, running;
    filter: brightness(1) saturate(1);

    &::before {
      display: block;
    }
  }

  &--categories {
    border-radius: 0;
    filter: saturate(1) brightness(25%);

    &::before {
      animation: categories-decor 1.5s linear forwards;
    }
  }
}

.layout-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-animate {
  animation: header-init 0.5s linear;
}

@keyframes contact-decor {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes move-decor {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(400px, 100px) rotate(-20deg);
  }

  50% {
    transform: translate(300px, 650px) rotate(-60deg);
  }

  75% {
    transform: translate(100px, 100px) rotate(-20deg);
  }

  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes about {
  0% {
    transform: scaleX(1) translate(110px, 0) rotate(100deg) scale(2);
    opacity: 0;
    filter: brightness(2) saturate(0);
  }

  30% {
    transform: scaleX(1) translate(0, 0) rotate(0deg) scale(1.5);
    opacity: 1;
    filter: brightness(2) saturate(0);
  }

  60% {
    transform: scaleX(1) translate(0, 0) rotate(0deg) scale(1.2);
    opacity: 1;
  }

  100% {
    background-image: var(--about-bg);
    transform: scaleX(-1) translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
}

@keyframes about-mask {
  0% {
    mask-image: linear-gradient(to bottom, transparent, #000),
      linear-gradient(to bottom, #000, transparent),
      linear-gradient(to bottom, transparent, #000),
      linear-gradient(to bottom, #000, transparent),
      linear-gradient(to bottom, transparent, #000);
    mask-size: 0 0;
    mask-position: 0 100%, 25% 25%, 50% 50%, 75% 0, 100% 50%;
    mask-repeat: no-repeat;
  }

  100% {
    mask-image: linear-gradient(to bottom, transparent, #000),
      linear-gradient(to bottom, #000, transparent),
      linear-gradient(to bottom, transparent, #000),
      linear-gradient(to bottom, #000, transparent),
      linear-gradient(to bottom, transparent, #000);
    mask-size: 18% 70%;
    mask-position: 0 100%, 25% 25%, 50% 50%, 75% 0, 100% 50%;
    mask-repeat: no-repeat;
  }
}

@keyframes contact-mask {
  0% {
    mask-image: linear-gradient(to bottom, transparent, #000),
      linear-gradient(to bottom, #000, transparent),
      linear-gradient(to bottom, transparent, #000),
      linear-gradient(to bottom, #000, transparent),
      linear-gradient(to bottom, transparent, #000);
    mask-size: 0 0;
    mask-position: 0 100%, 25% 25%, 50% 50%, 75% 0, 100% 50%;
    mask-repeat: no-repeat;
  }

  100% {
    mask-image: linear-gradient(to bottom, transparent, #000),
      linear-gradient(to bottom, #000, transparent),
      linear-gradient(to bottom, transparent, #000),
      linear-gradient(to bottom, #000, transparent),
      linear-gradient(to bottom, transparent, #000);
    mask-size: 18% 70%;
    mask-position: 0 100%, 25% 25%, 50% 50%, 75% 0, 100% 50%;
    mask-repeat: no-repeat;
  }
}

@keyframes header-init {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes opacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
