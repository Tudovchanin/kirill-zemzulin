<script setup lang="ts">
import type { Slug, Image } from "~/types";
import { SLUG_CATEGORY_MAP } from "~/constants/mappings.constants";
import { CATEGORY_SEO } from "~/constants/seo.constants";

const baseUrl = useBaseUrl();

const route = useRoute();
const categoriesStore = useCategoriesStore();
const popUpStore = usePopUpStore();

const masonryRef = ref<HTMLElement | null>(null);
const photoRef = ref<HTMLElement[] | []>([]);

const slug = ref<Slug | null>(null);
const { device } = useDevice();

const lengthImages = computed(() => {
  return (
    (slug.value && categoriesStore.imagesByCategory[slug.value]?.length) || 0
  );
});
const loadImgState = ref<boolean[]>([]);



watch(
  () => slug.value,
  (newSlug) => {
    if (newSlug) {
      loadImgState.value = Array(lengthImages.value).fill(false);
      
      useSeoMeta({
        title: CATEGORY_SEO[newSlug].title,
        description: CATEGORY_SEO[newSlug].description,
        ogTitle: CATEGORY_SEO[newSlug].title,
        ogDescription: CATEGORY_SEO[newSlug].description,
        ogImage: baseUrl + CATEGORY_SEO[newSlug].imageUrl,
        ogType: CATEGORY_SEO[newSlug].ogType || "website",
        twitterCard: CATEGORY_SEO[newSlug].twitterCard || "summary_large_image",
      });

      useHead({
        link: [{ rel: "canonical", href: `${baseUrl}/${slug.value}` }],
      });
    }
  }
);

const handleLoadImage = async (index:number) => {
  await nextTick();
  loadImgState.value[index] = true
};

const masonryImagesRef = ref<HTMLElement[]>([]);

const handleClickImg = (img: Image) => {
  popUpStore.setPopUp(true);
  popUpStore.setPopUpImg(img);
};

onMounted(async () => {
  if (route.params?.slug) {
    slug.value = route.params.slug as Slug;
  }
});

</script>
<template>
  <div
    ref="masonryRef"
    class="photos-category page-padding-x page-padding-y width-page x-center"
  >
    <h1 class="photos-category__title">
      {{ slug && SLUG_CATEGORY_MAP[slug] }}
    </h1>

    <section aria-labelledby="photos-category-title" class="masonry">
      <h2 id="photos-category-title" class="sr-only">
        Фотографии категории {{ slug && SLUG_CATEGORY_MAP[slug] }}
      </h2>
      <template v-if="categoriesStore.imagesByCategory && slug">
        <ul class="masonry__list">
          <li
            v-for="(img, index) in categoriesStore.imagesByCategory[slug!]"
            :key="img._id"
            ref="masonryImagesRef"
            class="masonry__item"
            :class="{'masonry__item--visible': loadImgState[index]}"
            @click.stop="handleClickImg(img)"
          >
            <NuxtImg
         
              ref="photoRef"
              draggable="false"
              :src="
                device === 'mobile'
                  ? img.mobileUrl
                    ? img.mobileUrl
                    : img.url
                  : img.url
              "
              :width="img.width"
              :height="img.height"
              class="masonry__img"
              :alt="img.title || 'картинка без описания'"
              @load="handleLoadImage(index)"
              :loading="index > 7 ? 'lazy': 'eager'"
              format="webp"
            />
          </li>
        </ul>
      </template>

      <div v-else class="masonry__skeleton">
        <svg
          class="skeleton-loader"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
        >
          <rect
            fill="#000000"
            stroke="#000000"
            stroke-width="11"
            width="30"
            height="30"
            x="25"
            y="85"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.4"
            />
          </rect>
          <rect
            fill="#000000"
            stroke="#000000"
            stroke-width="11"
            width="30"
            height="30"
            x="85"
            y="85"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.2"
            />
          </rect>
          <rect
            fill="#000000"
            stroke="#000000"
            stroke-width="11"
            width="30"
            height="30"
            x="145"
            y="85"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="0"
            />
          </rect>
        </svg>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.photos-category {
  position: relative;

  &__title {
    margin-bottom: var(--gap-heading-section);
    font-size: var(--adaptive-font-24-30);
    color: var(--color-text-primary);
    opacity: 0;
    animation: from-right 1s 0.5s  forwards;
  }
}

.masonry {
  columns: 3 500px;
  min-height: 10000px;
  animation: photo-masonry 0.5s linear forwards;


  &__item {
    margin-bottom: 12px;
    text-align: center;
    cursor: pointer;
    opacity: 0;
  }

  &__item--visible:nth-child(4n + 1) {
    animation: from-right 1s 0.5s  forwards;
  }
  &__item--visible:nth-child(4n + 2) {
    animation: from-left 1s 0.5s  forwards;
  }
  &__item--visible:nth-child(4n + 3) {
    animation: from-up 1s 0.5s  forwards;
  }
  &__item--visible:nth-child(4n) {
    animation: from-bottom 1s 0.5s  forwards;
  }


  &__img {
    box-shadow: 0 0 4px 8px var(--color-primary);

    @media (hover: hover) {
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.02);
      }
    }
  }

  &__skeleton {
    position: absolute;
    left: 50%;
    width: 400px;
    transform: translateX(-50%);

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

@keyframes from-right {
  0% {
    transform: translateX(1500px);
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes from-left {
  0% {
    transform: translateX(-1500px);
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes from-bottom {
  0% {
    transform: translateY(1500px);
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes from-up {
  0% {
    transform: translateY(-1500px);
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}



@keyframes photo-masonry {
  0% {
    min-height: 10000px;
  }

  100% {
    min-height: 100vh;
  }
}
</style>
