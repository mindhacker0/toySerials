import {createRouter,createWebHistory} from "vue-router";
import PageOne from "./components/pageOne.vue";
import PageTwo from "./components/pageTwo.vue";
const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URl),
    routes:[
        {
            path:"/one",
            name:"page-one",
            component:PageOne
        },
        {
            path:"/two",
            name:"page-two",
            component:PageTwo
        }
    ]
})
export default router;
