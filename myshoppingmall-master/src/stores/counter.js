import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounter = defineStore('counter', ()=> {
    const counter = ref(0)
    const doubleCounter = computed(() => counter.value * 2)

    function increment() {
        counter.value++
    }

    return {counter, doubleCounter ,increment}
})