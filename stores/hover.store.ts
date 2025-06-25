


export const useHoverStore = defineStore('hover', ()=> {

  const categoryHover =ref<boolean>(false);


  const setHoverCategory = (data:boolean)=> {
    categoryHover.value = data;
  }

  return {categoryHover, setHoverCategory}
})