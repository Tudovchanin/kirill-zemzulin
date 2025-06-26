<script setup lang="ts">

type CanvasStars = {
  starsColors: string[];
  numberStars: number;
};

const props = defineProps<CanvasStars>();

const arrayColors = [...props.starsColors];

const stars: { x: number; y: number; size: number; color: string }[] = [];


const containerCanvasRef = ref();
const canvasRef = ref();
let ctx: any = null;


const initStars = () => {

  for (let index = 0; index < props.numberStars; index++) {
    stars.push({
      x: Math.floor(Math.random() * canvasRef.value.width),
      y: Math.floor(Math.random() * canvasRef.value.height),
      size: Math.random() * 3 + 5,
      color: arrayColors[Math.floor(Math.random() * arrayColors.length)],
    });
  }
};


const drawStars = () => {
  if (!ctx) return;

  stars.forEach((star) => {
    ctx.fillStyle = star.color;
    ctx.beginPath();

    const spikes = 5;
    const outerRadius = star.size; 
    const innerRadius = star.size / 2;


    const angle = Math.PI / spikes;


    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = star.x + Math.cos(angle * i) * radius;
      const y = star.y + Math.sin(angle * i) * radius;
      ctx.lineTo(x, y); 
    }

    ctx.closePath();
    ctx.fill();
  });
};

const handleMousemove = (event: MouseEvent) => {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  drawStars();

  const mouse = {
    x: event.clientX - containerCanvasRef.value.getBoundingClientRect().left,
    y: event.clientY - containerCanvasRef.value.getBoundingClientRect().top,
  };


  stars.forEach((star) => {
    const distance = Math.sqrt(
      (mouse.x - star.x) ** 2 + (mouse.y - star.y) ** 2
    );
    if (distance < 200) {

      ctx.strokeStyle = star.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  });
};

const handleMouseout = () => {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  drawStars();
};

const handleResize = () => {
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  canvasRef.value.width = containerCanvasRef.value.offsetWidth;
  canvasRef.value.height = containerCanvasRef.value.offsetHeight;


  stars.length = 0;
  for (let index = 0; index < 100; index++) {
    stars.push({
      x: Math.floor(Math.random() * canvasRef.value.width),
      y: Math.floor(Math.random() * canvasRef.value.height),
      size: Math.random() * 3 + 5,
      color: arrayColors[Math.floor(Math.random() * 5)], 
    });
  }
  drawStars();
};

onMounted(() => {

  canvasRef.value.width = canvasRef.value.offsetWidth;
  canvasRef.value.height = canvasRef.value.offsetHeight;


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
