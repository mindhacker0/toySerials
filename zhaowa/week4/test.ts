interface A{
    c:string;
    d:string;
}
interface B{
    c:number;
    e:boolean;
}
type AB = A & B;
let ab:AB = {
    //c:... 报错never无论什么都是错误
    d:"class",
    e:false,
}