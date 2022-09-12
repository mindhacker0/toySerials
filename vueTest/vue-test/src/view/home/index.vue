<template>
    <div>
        <div>
            <div @click="goto(`/dynamic-form`)"><span>动态渲染表单</span></div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
    components:{},
    computed:{
    },
    data() {
        return {
         
        }
    },
    created(){
    },
    mounted() {
        
    },
    methods: {
        goto(path){
            this.$router.push({path});
        }
    },
    watch:{
        
    }
}
</script>

<style scoped>

</style>
