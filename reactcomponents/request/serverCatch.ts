//catch error for server
export const serverCatchRequest = async<T>(reqesetCall:()=>Promise<T>)=>{
    const res:{data:T|null,error:unknown} = {data:null,error:null};
    try{   
        const response = await reqesetCall();
        res.data = response;
        return res;
    }catch(e){
        res.error = e;
        return res;
    }
}
