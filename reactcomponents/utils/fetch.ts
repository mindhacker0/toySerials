import { refreshToken } from ".";

export interface RequsetConfig {
    headers?:Record<string, string>|Headers;
}
let refreshing = false; // 是否正在刷新token
let requeue:Array<Function> = []; // 刷新队列
const handleRefresh = (url:string,config:RequestInit,resolve:(value: Response | PromiseLike<Response>) => void) => {//处理登录未授权
    requeue.push((reconfig:Partial<RequestInit>)=>resolve(Fetch.request(url,Object.assign(config,reconfig))));
    if(refreshing) return; // 如果正在刷新token，直接加入队列
    refreshing = true;
    refreshToken().then(res=>{
        const accessToken = res.data.accessToken;
        localStorage.setItem("accessToken",accessToken);
        refreshing = false;
        console.log('requeue:', requeue);
        while(requeue.length > 0) {
            const fn = requeue.shift();
            if(fn) fn({headers:{Authorization: `Bearer ${accessToken}`}});
        }
    }).finally(()=>{refreshing = false;})
}
const getAccessToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ? `Bearer ${accessToken}` : '';
}
export default class Fetch{
    constructor(){}
    static request(url:string,config:RequestInit):Promise<Response>{
        return new Promise((reslove,reject)=>{
            fetch(url,config).then(res=> {
                if(res.status === 401){
                    return handleRefresh(url,config,reslove);
                }
                if(res.status === 403){//token都失效了
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("userId");
                    if(location.pathname!=="/login") location.href = '/login'; // 重定向到登录页面
                    return reject(new Error('login expired!'));
                }
                return reslove(res);
            }).catch(err=>{
                reject(err);
            });
        });
    }
    static post(url:string,data:BodyInit,config?:RequsetConfig):Promise<Response>{
        const fetchConfig:RequestInit = {
            method:'POST',
            body:data,
            headers: {
                'Authorization': getAccessToken(),
                'Content-Type': 'application/json',
                ...config?.headers
            },
            credentials: 'include'
        }
        return Fetch.request(url,fetchConfig);
    }
    static put(url:string,data:BodyInit,config?:RequsetConfig):Promise<Response>{
        const fetchConfig:RequestInit = {
            method:'PUT',
            body:data,
            headers: {
                'Authorization': getAccessToken(),
                'Content-Type': 'application/json',
                ...config?.headers
            },
            credentials: 'include'
        }
        return Fetch.request(url,fetchConfig);
    }
    static get(url:string,param:Record<keyof any,any>={},config?:RequsetConfig):Promise<Response>{
        let query = '';
        for(let item of Object.entries(param)){
           query += query === ""?'?':"&";
           query += `${item[0]}=${encodeURIComponent(item[1])}`;
        }
        const fetchConfig:RequestInit = {
            headers: {
                'Authorization': getAccessToken(),
                'Content-Type': 'application/json',
                ...config?.headers
            },
            credentials: 'include'
        };
        return Fetch.request(url+query,fetchConfig);
    }
    static delete(url:string, config?:RequsetConfig):Promise<Response>{
        const fetchConfig:RequestInit = {
            method: 'DELETE',
            headers: {
                'Authorization': getAccessToken(),
                'Content-Type': 'application/json',
                ...config?.headers
            },
            credentials: 'include'
        };
        return Fetch.request(url,fetchConfig);
    }
}