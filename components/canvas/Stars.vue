<script setup lang="ts">

type CanvasStars = {
  starsColors: string[];
  numberStars: number;
};

const props = defineProps<CanvasStars>();
// Массив с цветами для stars
const arrayColors = [...props.starsColors];
// Создаем массив для хранения stars
const stars: { x: number; y: number; size: number; color: string }[] = [];

// DOM
const containerCanvasRef = ref();
const canvasRef = ref();
let ctx: any = null;

// INIT STARS IN array stars
const initStars = () => {
  // Генерируем 50 случайных star и добавляем их в массив stars
  for (let index = 0; index < props.numberStars; index++) {
    stars.push({
      x: Math.floor(Math.random() * canvasRef.value.width), // Случайная позиция по оси X
      y: Math.floor(Math.random() * canvasRef.value.height), // Случайная позиция по оси Y
      size: Math.random() * 3 + 5, // Случайный размер star (от 5 до 8)
      color: arrayColors[Math.floor(Math.random() * arrayColors.length)], // Случайный цвет из массива
    });
  }
};

// Функция для рисования звезд на canvasRef.value
const drawStars = () => {
  if (!ctx) return;

  stars.forEach((star) => {
    ctx.fillStyle = star.color; // Устанавливаем цвет для текущей звезды
    ctx.beginPath(); // Начинаем новый путь

    const spikes = 5; // Количество лучей звезды
    const outerRadius = star.size; // Внешний радиус (размер звезды)
    const innerRadius = star.size / 2; // Внутренний радиус (размер углубления звезды)

    // Угол
    const angle = Math.PI / spikes;

    // Рисуем звезду
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius; // Чередуем радиусы
      const x = star.x + Math.cos(angle * i) * radius; // Вычисляем координату X
      const y = star.y + Math.sin(angle * i) * radius; // Вычисляем координату Y
      ctx.lineTo(x, y); // Добавляем точку к пути
    }

    ctx.closePath(); // Закрываем путь
    ctx.fill(); // Заполняем звезду цветом
  });
};

const handleMousemove = (event: MouseEvent) => {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height); // Очищаем canvasRef.value

  drawStars();
  // Получаем координаты мыши относительно элемента containerCanvasRef.value
  const mouse = {
    x: event.clientX - containerCanvasRef.value.getBoundingClientRect().left,
    y: event.clientY - containerCanvasRef.value.getBoundingClientRect().top,
  };

  // Проверяем расстояние от мыши до каждой точки
  stars.forEach((star) => {
    const distance = Math.sqrt(
      (mouse.x - star.x) ** 2 + (mouse.y - star.y) ** 2
    ); // Вычисляем расстояние
    if (distance < 200) {
      // Если расстояние меньше 300 пикселей
      ctx.strokeStyle = star.color; // Устанавливаем цвет для линии
      ctx.lineWidth = 1; // Устанавливаем ширину линии
      ctx.beginPath(); // Начинаем новый путь
      ctx.moveTo(star.x, star.y); // Перемещаемся к точке
      ctx.lineTo(mouse.x, mouse.y); // Рисуем линию к мыши
      ctx.stroke(); // Отрисовываем линию
    }
  });
};

const handleMouseout = () => {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height); // Очищаем canvasRef.value
  drawStars();
};

const handleResize = () => {
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height); // Очищаем canvasRef.value
  canvasRef.value.width = containerCanvasRef.value.offsetWidth; // Устанавливаем ширину canvasRef
  canvasRef.value.height = containerCanvasRef.value.offsetHeight; // Устанавливаем высоту canvasRef

  // Очищаем массив stars и генерируем новые точки
  stars.length = 0; // Очищаем массив
  for (let index = 0; index < 100; index++) {
    stars.push({
      x: Math.floor(Math.random() * canvasRef.value.width), // Случайная позиция по оси X
      y: Math.floor(Math.random() * canvasRef.value.height), // Случайная позиция по оси Y
      size: Math.random() * 3 + 5, // Случайный размер точки (от 5 до 8)
      color: arrayColors[Math.floor(Math.random() * 5)], // Случайный цвет из массива
    });
  }
  drawStars();
};

onMounted(() => {
  // Устанавливаем ширину и высоту canvas.value равными его отображаемым размерам
  canvasRef.value.width = canvasRef.value.offsetWidth;
  canvasRef.value.height = canvasRef.value.offsetHeight;

  // Получаем контекст рисования 2D для canvasRef.value
  ctx = canvasRef.value.getContext("2d");
  initStars();
  drawStars();

  containerCanvasRef.value.addEventListener("mousemove", handleMousemove);
  containerCanvasRef.value.addEventListener("mouseout", handleMouseout);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  containerCanvasRef.value.removeEventListener("mousemove", handleMousemove);

  containerCanvasRef.value.removeEventListener("mouseout", handleMouseout);
  window.removeEventListener("resize", handleResize);
});
</script>
<template>
  <div ref="containerCanvasRef" class="container-canvas">
    <canvas
      id="starsCanvas"
      ref="canvasRef"
      class="container-canvas__canvas"
    ></canvas>
  </div>
</template>

<style lang="scss" scoped>
.container-canvas {
  position: relative;
  width: 100%;
  height: 100vh;

  &__canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}
</style>
