<script setup lang="ts">
import { CONTACT_SEO } from "~/constants/seo.constants";
import { SLUG_CATEGORY_MAP } from "~/constants/mappings.constants";

type MailData = {
  from: string;
  replyTo: string;
  subject: string;
  text: string;
};

const mail = useMail();
const baseUrl = useBaseUrl();
const absoluteImageUrl = baseUrl + CONTACT_SEO.imageUrl;


useSeoMeta({
  title: CONTACT_SEO.title,
  description: CONTACT_SEO.description,
  ogTitle: CONTACT_SEO.title,
  ogDescription: CONTACT_SEO.description,
  ogImage: absoluteImageUrl,
  ogType: CONTACT_SEO.ogType || "website",
  twitterCard: CONTACT_SEO.twitterCard || "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: `${baseUrl}/contact` }],
});

const formMobileHidden = ref(true);
const sendOn = ref(false);

const form = reactive({
  name: "",
  email: "",
  category: "",
  shooting_date: "",
  message: "",
  captchaAnswer: "",
});

const getMailData = computed(() => {
  return {
    from: '"Кирилл Земзюлин — портфолио" <sotto36623@yandex.ru>',
    replyTo: `${form.name} <${form.email}>`,
    subject: `Заявка на фотосессию: ${form.category}`,
    text: `Имя: ${form.name}
Email: ${form.email}
Категория: ${form.category}
Дата съёмки: ${form.shooting_date || "не указана"}
Сообщение: ${form.message || "нет"}`,
  };
});

const captchaQuestion = "Сколько будет 3 + 4?";
const correctCaptcha = "7";
const errorMessage = ref("");
const successMessage = ref("");

const validateForm = (): { valid: boolean; error: string } => {
  if (!form.name || !form.email || !form.category) {
    return { valid: false, error: "Пожалуйста, заполните обязательные поля" };
  }
  if (form.captchaAnswer.trim() !== correctCaptcha) {
    return { valid: false, error: "Неверный ответ на капчу" };
  }
  return { valid: true, error: "" };
};
const resetForm = () => {
  form.name = "";
  form.email = "";
  form.category = "";
  form.shooting_date = "";
  form.message = "";
  form.captchaAnswer = "";
};

const resetMessage = () => {
  errorMessage.value = "";
  successMessage.value = "";
};
const sendMessage = async (
  mailData: MailData
): Promise<{ success: boolean; error?: string }> => {
  try {
    await mail.send(mailData);
    return { success: true };
  } catch (e: any) {
    let errorMsg = "Ошибка сети";
    if (typeof e === "string") {
      errorMsg = e;
    } else if (e && typeof e.message === "string") {
      errorMsg = e.message;
    }
    return { success: false, error: errorMsg };
  }
};

const handleSubmit = async () => {
  resetMessage();

  const resultValidate = validateForm();
  if (!resultValidate.valid) {
    errorMessage.value = resultValidate.error;
    return;
  }
  sendOn.value = true;
  const resultSend = await sendMessage(getMailData.value);
  sendOn.value = false;
  if (resultSend.success) {
    successMessage.value = "Спасибо! Ваша заявка отправлена.";
    resetForm();
  } else {
    errorMessage.value = resultSend.error || "неизвестная ошибка";
  }
};
const handleCloseMessage = () => {
  errorMessage.value = "";
  successMessage.value = "";
};
const handleShowForm = () => {
  formMobileHidden.value = !formMobileHidden.value;
  resetForm();
  resetMessage();
};


</script>
<template>
  <div
    class="contact page-padding-x page-padding-y width-page x-center"
    @click="handleCloseMessage"
  >
    <h1 class="contact__title">Оставить заявку на фотосессию</h1>

    <form
      class="contact__form form"
      :class="{
        'contact__form--off': sendOn || errorMessage || successMessage,
        'contact__form--hidden': formMobileHidden,
      }"
      @submit.prevent="handleSubmit"
    >
      <button
        type="button"
        aria-label="закрыть форму"
        class="contact__form-close"
        @click="formMobileHidden = true"
      >
        <Icon :name="'lucide-x'" size="32" />
      </button>
      <div class="form__field">
        <label for="name" class="form__label">Ваше имя<span>*</span>:</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          name="name"
          required
          placeholder="Введите ваше имя"
          class="form__input"
        />
      </div>
      <div class="form__field">
        <label for="email" class="form__label">Email<span>*</span>:</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          required
          placeholder="example@mail.com"
          title="Введите корректный email, например: user@example.com"
          class="form__input"
        />
      </div>
      <div class="form__field">
        <label for="category" class="form__label"
          >Категория фотосессии<span>*</span>:</label
        >
        <select
          id="category"
          v-model="form.category"
          name="category"
          required
          class="form__select"
        >
          <option value="" disabled selected class="form__select--placeholder">
            Выберите категорию
          </option>
          <option v-for="(category, slug) in SLUG_CATEGORY_MAP" :value="slug">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="form__field">
        <label for="shooting_date" class="form__label"
          >Желаемая дата съёмки:</label
        >
        <input
          id="shooting_date"
          v-model="form.shooting_date"
          type="date"
          name="shooting_date"
          class="form__input-date"
        />
      </div>
      <div class="form__field">
        <label for="message" class="form__label"
          >Описание вашего запроса:</label
        >
        <textarea
          id="message"
          v-model="form.message"
          name="message"
          rows="5"
          placeholder="Расскажите о своих пожеланиях, стиле, количестве человек и т.д."
          class="form__text-area"
        ></textarea>
      </div>

      <div class="form__field">
        <label for="captcha" class="form__label"
          >Капча: {{ captchaQuestion }}<span>*</span>:</label
        >
        <input
          id="captcha"
          v-model="form.captchaAnswer"
          type="text"
          required
          placeholder="Введите ответ"
          class="form__input"
        />
      </div>
      <div class="form__field">
        <button type="submit" class="form__submit base-btn">Отправить</button>
      </div>
    </form>

    <div class="contact__canvas">
      <CanvasStars
        :stars-colors="[
          'hsl(285, 77%, 83%)',
          'hsl(0, 0%, 80%)',
          'hsl(0, 0%, 12%)',
          'hsl(39, 77%, 83%)',
        ]"
        :number-stars="150"
      />
    </div>

    <div v-show="sendOn" class="contact__loader">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
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
    <div
      v-if="(errorMessage || successMessage) && !sendOn"
      class="contact__message-send message"
    >
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: white">{{ successMessage }}</p>
      <button
        aria-label="закрыть сообщение"
        class="message__close"
        @click="handleCloseMessage"
      >
        <Icon :name="'lucide-x'" size="32" />
      </button>
    </div>

    <button
      v-if="formMobileHidden"
      @click="handleShowForm"
      class="contact__show-form base-btn"
    >
      Открыть форму
    </button>
  </div>
</template>

<style lang="scss" scoped>
.contact {
  position: relative;
  min-height: 100vh;

  &__loader {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 500px;
    width: 100%;
    opacity: 0.2;
    transform: translate(-50%, -50%);
  }

  &__message-send {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    max-width: 500px;
    width: 100%;
    transform: translate(-50%, -50%);
  }

  &__title {
    position: relative;
    width: fit-content;
    margin-bottom: var(--gap-heading-section);
    font-size: var(--adaptive-font-24-30);
    font-weight: 600;
    color: var(--color-text-primary);
    text-shadow: -1px -1px 2px black;
    animation: right-transform 1s;
  }

  &__form {
    position: relative;
    z-index: 2;
    animation: left-transform 0.5s;

    @media (max-width: 768px) {
      transform: translateX(-100vw);
      animation: left-transform 0.5s forwards;
    }

    &--hidden {
      @media (max-width: 768px) {
        display: none;
      }
    }

    &--off {
      pointer-events: none;
    }
  }

  &__form-close {
    display: none;

    @media (max-width: 768px) {
      position: absolute;
      top: 0;
      right: 0;
      padding-top: 5px;
      padding-right: 5px;
      display: block;
      color: white;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  }

  &__show-form {
    display: none;

    @media (max-width: 768px) {
      position: absolute;
      top: 200px;
      left: 50%;
      display: block;
      width: max-content;
      transform: translateX(-50%);
    }

    &--hidden {
      display: none;
    }
  }

  &__canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1500px;
    opacity: 0;
    animation: stars 1s 0.5s forwards;
  }
}

.message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 10px 20px;
  text-align: center;
  background-color: var(--color-primary);

  &__close {
    color: white;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}

@keyframes stars {
  0% {
    transform: scale(0.1);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
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

@keyframes left-transform {
  0% {
    transform: translateX(-300px);
  }

  50% {
    transform: translateX(100px);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes right-transform {
  0% {
    transform: translateX(500px);
  }

  50% {
    transform: translate(-100px);
  }

  100% {
    transform: translate(0);
  }
}
</style>
