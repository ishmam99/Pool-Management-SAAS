import { defineStore } from 'pinia'

export const useTechnicianStore = defineStore('technician', {

    state:()=>({
        currentMenu:'Dashboard'
    })

})