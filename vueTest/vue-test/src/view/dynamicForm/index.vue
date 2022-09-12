<template>
    <div>
        <a-form layout="inline" :form="form" @submit="handleSubmit">
            <a-form-item v-for="(formItem,index) in bindList" :key="formItem.id" v-bind='formItem.formItemAttrs'>
                <component 
                :is="formItem.type" 
                v-bind='formItem.attrs' 
                v-decorator="formItem.attrs['v-decorator']"
                v-html="formItem.content"
                ></component>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
    components:{},
    computed:{
        hasErrors(){
            return hasErrors(this.form.getFieldsError());
        }
    },
    data() {
        return {
           bindList:[
            {//添加一个输入框
                id:"1",
                type:"a-input",
                attrs:{//输入框的属性
                    'v-decorator':['userName',{rules:[{required:true,message:'Please input your username!'}]}],
                    placeholder:"Username"
                },
                formItemAttrs:{
                    label:"姓名"
                },
                content:""
            },
            {//添加一个时间选择
                id:"2",
                type:"a-date-picker",
                attrs:{//选择框的属性
                    'v-decorator':['times',{rules:[{type:'array',required:true,message:'Please select time!'}]}],
                    "show-time":true,
                    format:"YYYY-MM-DD HH:mm:ss"
                },
                formItemAttrs:{
                    label:"时间"
                },
            },
            {   
                id:"3",
                type:"a-button",
                attrs:{
                    'type':"primary",
                    'html-type':"submit",
                    'v-decorator':[],
                    "v-bind:disabled":this.hasErrors
                },
                formItemAttrs:{},
                content:"登录"
            },
           ],
           form: this.$form.createForm(this, { name: 'horizontal_login' }),
        }
    },
    created(){
    },
    mounted() {
        
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                   console.log('Received values of form: ', values,this.form.getFieldsValue());
                }
            });
        },
       
    },
    watch:{
        
    }
}
</script>

<style scoped>

</style>
