import { defineStore } from 'pinia'

export const useProviderStore = defineStore('provider', {

    state:()=>({
        currentMenu:'Dashboard'
    })

})