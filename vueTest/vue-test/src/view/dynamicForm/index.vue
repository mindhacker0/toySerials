<template>
    <div>
        <a-form-model layout="inline"
                      :form="formData"
                      @submit="handleSubmit">
            <a-form-item v-for="(formItem,index) in bindList"
                         :key="formItem.id"
                         v-bind='formItem.formItemAttrs'>
                <component v-if="formItem.content"
                           :is="formItem.type"
                           v-on="formItem.events"
                           v-bind='formItem.attrs'
                           v-html="formItem.content"></component>
                <component v-else
                           :is="formItem.type"
                           v-on="formItem.events"
                           v-bind='formItem.attrs'></component>
            </a-form-item>
        </a-form-model>
    </div>
</template>

<script>
import Vue from "vue";
const dselect = Vue.component("d-select", {
    props: ["datalist", "value", "placeholder"],
    data() {
        return {
            select: "",
        };
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(val) {
                this.select = val;
            },
        },
    },
    methods: {
        handleChange(val) {
            console.log("handleChange", val);
            this.$emit("change", val);
        },
    },
    template: `<a-select style="width: 120px" v-model="select" @change="handleChange" :placeholder="placeholder">
      <a-select-option v-for="item in datalist" :value="item.value">{{item.label}}</a-select-option>
    </a-select>`,
});
export default {
    components: {},
    computed: {},
    data() {
        return {
            bindList: [],
            formData: {
                name:"aaaaa",
                times:"2022-9-12 11:00:00",
                region:1,
            },
            //form: this.$form.createForm(this, { name: 'horizontal_login' }),
        };
    },
    created() {},
    mounted() {
        this.bindList = [
            {
                //添加一个输入框
                id: "1",
                type: "a-input",
                attrs: {
                    //输入框的属性
                    // 'v-decorator':['userName',{rules:[{required:true,message:'Please input your username!'}]}],
                   value:this.formData.name,
                    placeholder: "Username",
                },
                events: {
                    change: (e) => {
                        this.formData.name = e.target.value;
                    },
                },
                formItemAttrs: {
                    label: "姓名",
                    name: "name",
                },
                content: "",
            },
            {
                //添加一个时间选择
                id: "2",
                type: "a-date-picker",
                attrs: {
                    //选择框的属性
                    // 'v-decorator':['times',{rules:[{type:'array',required:true,message:'Please select time!'}]}],
                    defaultValue:this.formData.times,
                    "show-time": true,
                    type: "date",
                    format: "YYYY-MM-DD HH:mm:ss",
                },
                events: {
                    change: (val)=>{
                        console.log("timechange",val,this.formData);//返回的是MOMENT对象，需要格式化
                        this.formData.times = val?val.format("YYYY-MM-DD HH:mm:ss"):"";
                    },
                },
                formItemAttrs: {
                    label: "时间",
                    name: "times",
                },
            },
            {
                //添加一个下拉
                id: "3",
                type: dselect,
                attrs: {
                    //选择框的属性
                    // 'v-decorator':['times',{rules:[{type:'array',required:true,message:'Please select time!'}]}],
                    value: this.formData.region,
                    placeholder: "please select your zone",
                    datalist: [{ label: "广州", value: 1 },{ label: "北京", value: 2 }],
                },
                events: {
                    change: (val) => {
                        this.formData.region = val;
                    },
                },
                formItemAttrs: {
                    label: "地区",
                    name: "region",
                },
            },
            {
                id: "4",
                type: "a-button",
                attrs: {
                    type: "primary",
                },
                events: {
                    click: (val) => {
                       console.log(this.formData)
                    },
                },
                formItemAttrs: {},
                content: "登录",
            },
        ];
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log(
                        "Received values of form: ",
                        values,
                        this.form.getFieldsValue()
                    );
                }
            });
        },
    },
    watch: {},
};
</script>

<style scoped>
</style>
