import type { Image } from "~/types";


export const usePopUpStore = defineStore('pop-up', ()=> {

  const popUp = ref<boolean>(false);
  const img = ref<Image | null>(null)

  const setPopUp = (data:boolean)=> {
    popUp.value = data;
  }

  const setPopUpImg = (dataImg:Image) => {
    img.value = dataImg;
  }

  return {popUp, setPopUp, setPopUpImg, img}
})