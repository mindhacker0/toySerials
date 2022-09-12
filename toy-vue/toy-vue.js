console.log("toy-vue");
let effects = [];
function effect(fn){
    effects.push(fn);
    fn();
}
// export default class ToyVue{
//     constructor(){

//     }
// }