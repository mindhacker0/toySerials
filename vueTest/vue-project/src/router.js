import {createRouter,createWebHistory} from "vue-router";
import lineView from "@/views/lineView/index.vue";
import ProjectionView from "@/views/projectionView/index.vue";
import pictureOp from "@/views/pictureOp/index.vue";
const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URl),
    routes:[
        {
            path:"/polygon",
            name:"lineView",
            component:lineView
        },{
            path:"/projection",
            name:"projection",
            component:ProjectionView
        },{
            path:"/picture-operation",
            name:"pictureOp",
            component:pictureOp
        }
    ]
})
export default router;
