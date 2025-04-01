import { ref,reactive,watch, onMounted } from 'vue';
import { getRepoSearch } from '@/api/repo';
import { dataHandler } from '@/components/RepoItem/datahandle';
import type { RepoItemResData } from '@/components/RepoItem/types';
import { sleep } from '@/utils';
import { Message } from 'vue-devui';
import markdownit from 'markdown-it';
import {getAiChat} from '@/api/home';
import axios, { type AxiosRequestConfig,type ResponseType  } from "axios";
import { concat } from './parse';

const md = markdownit();

const baseURL = (import.meta as any).env.VITE_API_HOST;
interface ChatSession {
    question:string;
    content:string;
    repoList:RepoItemResData[];
}
export const useSearchChat = ()=>{
    const access_token = window.localStorage.getItem("access_token");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access_token}`);
    headers.append("Content-Type", "application/json");
    const chatSession = ref<ChatSession[]>([]);
    const searchKey = ref('');
    const nextQuestion = ref('');
    const params = reactive({keyword:'',answer:''});
    const addChatStream = ()=>{
        const session = reactive<ChatSession>({
            question:params.keyword,
            content:'',
            repoList:[]
        });
        chatSession.value.push(session);
        searchRepo(params.keyword).then(res=>{session.repoList = res.slice(0,10);});//相关的项目
        const onmessage = (e)=>{
            if(e.data){
                let index = 0;
                for(let i=e.data.length;i>0;--i){
                    if(session.content.indexOf(e.data.slice(0,i))){
                        index = i;
                        break;
                    }
                }
                session.content+=e.data.slice(index);
                // console.log('message',e);
            }
        }
        const onerror = (e)=>{
            console.log('error',e);
        }
        console.log('ask',params.keyword);
        const controller = new AbortController();
        getAiChat({...params,onmessage,onerror,controller});
        
        // const onChunk = getLines(getMessages(id => {
        //     console.log('id',id)
        // }, retry => {
            
        // }, onmessage))
        // fetch(`${baseURL}/api/v1/search/ask/chat`,{//流式结果返回
        //     method:'POST',
        //     body:JSON.stringify(params),
        //     headers
        // }).then(res=>{
        //     console.log('start',res);
        //     if(res.status===200){
        //         let buffer;
        //         async function consume(chunk:string,start = 0) {
        //             if(start<chunk.length){
        //                 session.content+=chunk[start];
        //                 const result = md.render(session.content);
        //                 start++;
        //                 await sleep(100);
        //                 await consume(chunk,start);
        //             }
        //         }
        //         async function getBytes(stream:ReadableStream, onChunk:Function) {
        //             const reader = stream.getReader();
        //             let result;
        //             while (!(result = await reader.read()).done) {
        //                 onChunk(result.value);
        //             }
        //         }
        //         const onChunk = (chunkBuf)=>{
        //             // buffer = concat(buffer,chunkBuf);
        //             const utf8decoder = new TextDecoder();
        //             const text = utf8decoder.decode(chunkBuf);
        //             console.warn('chunk',text);
        //             // 处理读取的数据
        //             consume(text);
        //         }
        //         getBytes(res.body,onChunk);
        //     }
        // })
    }
    const loading = ref<boolean>(false);
    const initChat = ()=>{//提问初始化
        params.keyword = searchKey.value;
        addChatStream();
    }
    const searchNext = ()=>{//继续提问
        let last = chatSession.value[chatSession.value.length-1];
        params.answer = last.content;
        params.keyword = nextQuestion.value;
        addChatStream();
    }
    const searchRepo = async (keyword:string) => { // 获取项目查询列表
        loading.value = true;
        const res = await getRepoSearch({
          search: keyword,
          sort: '',
          page: 1,
          per_page: 10
        });
        loading.value = false;
        if (res.data) {
          const { total, content, elapsed_time } = res.data.data;
          return dataHandler(content || []);
        }
        return [];
    };
    onMounted(()=>{

    });
    const copyAns = (content:string)=>{//复制
        navigator.clipboard.writeText(content).then(function () {
            Message({type: 'success',message: '复制成功'});
        }).catch(function () {
            (function (content) {
                document.oncopy = function (e) {
                    e.clipboardData.setData('text', content);
                    e.preventDefault();
                    document.oncopy = null;
                    Message({type: 'success',message: '复制成功'});
                };
            })(content);
            document.execCommand('copy');
        });
    };
    return {
        copyAns,
        initChat,
        searchKey,
        nextQuestion,
        chatSession,
        searchNext
    }
}