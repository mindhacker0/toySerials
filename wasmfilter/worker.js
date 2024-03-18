console.log(self);
const chunks = [];

self.onmessage = (ev)=>{
    // console.log(ev);
    const {name,payload} = ev.data;
    if(name === "chunk"){
        chunks.push(payload);
    }
    if(name === "done"){
        console.log("in",new Blob(chunks));
    }
};