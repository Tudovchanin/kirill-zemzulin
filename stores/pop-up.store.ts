import type { Image } from "~/types";


export const usePopUpStore = defineStore('pop-up', ()=> {

  const popUpIsOpen = ref<boolean>(false);
  const img = ref<Image | null>(null)

  const setPopUp = (data:boolean)=> {
    popUpIsOpen.value = data;
  }

  const setPopUpImg = (dataImg:Image) => {
    img.value = dataImg;
  }

  return {popUpIsOpen, setPopUp, setPopUpImg, img}
})