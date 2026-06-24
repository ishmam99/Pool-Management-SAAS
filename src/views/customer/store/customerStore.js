import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {

    state:()=>({
        currentMenu:'Dashboard'
    })

})