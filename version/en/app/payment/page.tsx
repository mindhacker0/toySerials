"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import message from 'antd/es/message';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from '@/hooks/i18nContext';
import { getUserTeam } from '@/lib/reducer/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getProduct, ProductCatalog, getRelateCustomer, upgradePreview, upgradeSubscription, CustomData, PayType, Interval } from '@/utils/api/pricing';
import { CheckoutOpenOptions, Environments, Paddle, initializePaddle } from "@paddle/paddle-js";
import { selectSubscription, selectTeam, setCurDiscount, setCurPlan, setCurPrice, setCurProduct, setCurcustomer, setQuantity, setServType, setSubscribePlan, setWorkSpaceId, updateSubscribePlan } from '@/lib/reducer/subscribeSlice';
import ConfirmPlan from '@/app/payment/components/ConfirmPlan';
import { reportSubscription } from '@/utils/ga4tools';
const Payment:React.FC = ()=>{
    const t = useTranslations("payment");
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();
    const userInfo = useAppSelector((state)=>state.user.userInfo);
    const quantity = useAppSelector(state=>state.subscribe.quantity);
    const workSpaceId = useAppSelector(state=>state.subscribe.workSpaceId);
    const {subscribePlan,curProduct,curPrice,curCustomer,curDiscount} = useAppSelector(selectSubscription);
    const servType = useAppSelector((state)=>state.subscribe.servType);
    const curPlan = useAppSelector(state=>state.subscribe.curPlan);
    const [checkoutStep,setCheckoutStep] = useState<number>(0);
    const [curCustomData,setCurCustomData] = useState<CustomData>();
    const paddleRef = useRef<Paddle|null>(null);
    const paddleContainerRef = useRef<HTMLDivElement|null>(null);
    const handleTeamCreate = ()=>{//添加团队后更新列表
       if(userInfo) dispatch(getUserTeam(userInfo.uid));
    }
    useEffect(()=>{//初始化
        const type = searchParams.get("type")||"person";
        const pack = searchParams.get("pack")||"month";
        const upgrade = searchParams.get("upgrade") === "true";//个人升级团队
        const teamId = searchParams.get("teamId");//默认选中团队
        if(pack == "day"||pack == "month"||pack == "year") dispatch(setCurPlan(Interval[pack]));
        if(teamId!==null && !isNaN(Number(teamId))) dispatch(selectTeam(Number(teamId)));
        let payType:PayType;
        switch(true){//业务类型
            case upgrade:payType = PayType.upTeam;break;
            case type==="person":payType = PayType.subPer;break;
            case type==="team":payType = PayType.subTeam;break;
            default: payType = PayType.upTeam;break;
        }
        if(userInfo?.workspace?.workspaceRole === 2) payType = PayType.upTeam;
        dispatch(setServType(payType));
        (async ()=>{
            if(userInfo?.uid){
                await initPaddle();
                const productRes = await getProduct({catalog:type as ProductCatalog});
                if(productRes.data?.data){
                    const product = productRes.data.data.find(v=>v.prices.length);
                    if(product) dispatch(setCurProduct(product));
                }
                const customerRes = await getRelateCustomer({relateId:userInfo.uid});
                if(customerRes.data) dispatch(setCurcustomer(customerRes.data.data[0]));
                dispatch(setWorkSpaceId(userInfo.workspace_id));
                if(type === "team"||payType === PayType.upTeam){
                    //团队类型获取团队信息
                    dispatch(getUserTeam(userInfo.uid));
                }else{
                    dispatch(setQuantity(1));
                }
            }
        })()
    },[userInfo,dispatch]);
    useEffect(()=>{
       if(userInfo && curProduct){
        const percentOff = {person:[47,60],team:[50,60]};
        const priceOrigin = {person:[19,228],team:[24,288]};
        curProduct.prices.forEach((price)=>{
            if(price.cycleInterval === curPlan){
                const {discounts,unitPrice} = price;
                //const percent = discounts.length?Number(discounts[0].amount):0;
                const originPrice = priceOrigin[curProduct.catalog][curPlan === Interval.month?0:1];
                const percent = percentOff[curProduct.catalog][curPlan === Interval.month?0:1];
                dispatch(setSubscribePlan({
                    name:userInfo.nickname,
                    UID:userInfo.uid,
                    priceOrg:originPrice,
                    pricedct:Number(unitPrice)/100,//   Number(unitPrice)*(100 - percent)/10000,
                    savePercent:percent,
                    discharge:0,
                    balance:0,
                    total:Number(unitPrice)*quantity/100
                }));
               dispatch(setCurDiscount(discounts));
               dispatch(setCurPrice(price));
            }
        });
       }
    },[userInfo,curProduct,curPlan,quantity]);
    useEffect(()=>{
        if(curPrice && userInfo?.workspace?.subscription?.productCatalog === ProductCatalog.person && quantity>0){//个人升级团队计算抵扣
            const subscription = userInfo.workspace.subscription;
            upgradePreview({                
                items:[{priceId:curPrice.paddleId,quantity:quantity}],
                id:subscription.uid
            }).then(res=>{
                const previewRes = res.data;
                if(previewRes){
                    const {discharge,balance,totalPaid,nextPayDate,updatePaid} = previewRes.data;
                    dispatch(updateSubscribePlan({discharge,balance,total:totalPaid,nextPayDate}));
                }
            });
        }
    },[curPrice,quantity,userInfo]);
    useEffect(()=>{
        if(userInfo && workSpaceId){
            setCurCustomData({
                "userId":userInfo.uid,
                "workspaceId":workSpaceId,
                "serviceType":servType
            });
        }
    },[userInfo,workSpaceId,servType]);
    const initPaddle = async ()=>{
        const paddle = await initializePaddle({
            token:process.env.NEXT_PUBLIC_PADDLE_TOKEN as string,
            pwCustomer:{},
            checkout: {
                settings: {
                    displayMode: "inline",
                    theme: "light",
                    locale: "en",
                    frameTarget:"checkout-container",
                    frameInitialHeight: 450,
                    frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;"
                }
            },
            environment:process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
            eventCallback: function(data) {
                if(data.name === "checkout.customer.created"||data.name === "checkout.customer.updated"){
                    setCheckoutStep(1);
                }
                if(data.name === "checkout.completed"){
                    if(curCustomData) reportSubscription({customData:curCustomData,plan:curPlan,service:servType});
                    setTimeout(()=>handleBack(),3000);//返回
                }
            }
        });
        // console.log(paddle);
        if(paddle) paddleRef.current = paddle;
    };
    useEffect(()=>{
        if(paddleContainerRef.current && curCustomData?.userId && curCustomData?.workspaceId){
            const discountId:any = (curDiscount && curDiscount.length)?curDiscount[0].paddleId:null;
            if(curPrice && paddleRef.current && (servType === PayType.subPer||servType === PayType.subTeam)){//个人团队订阅
                const checkoutPara:CheckoutOpenOptions = {
                    items:[{priceId:curPrice.paddleId,quantity:quantity}],
                    discountId
                };
                if(curCustomer) checkoutPara.customer = {id:curCustomer.paddleId};
                checkoutPara.customData = curCustomData;
                paddleRef.current.Checkout.open(checkoutPara);
            }
        }
    },[paddleContainerRef,curDiscount,curPrice,paddleRef,servType,quantity,curCustomer,curCustomData]);
    const handleUpgrade = async ()=>{
        const subscription = userInfo?.workspace.subscription;
        if(curPrice && subscription && curCustomData && quantity>0)
        upgradeSubscription({                
            items:[{priceId:curPrice.paddleId,quantity:quantity}],
            customData:curCustomData,
            id:subscription.uid
        }).then(res=>{
            if(res.data){
                message.success({
                    key: "checkout-upgrade-tip",
                    className: "tip-message",
                    icon:<img  src={"/icons/success.png"} />,
                    content: "upgrade success！"
                });
                setTimeout(()=>handleBack(),3000);//返回
            }
        });
    };
    const handleBack = ()=>{
        const redirect = searchParams.get("redirect");
        if(redirect){
           window.location.href = redirect;
        }else{
            router.back();
        }
    }
    return (
    <div>
        <div className="bg-[#fff] flex justify-center" style={{width:"100%"}}>
            <div className="flex items-center justify-between w-[1352px] h-[64px] relative">
                <div className="relative z-10">
                    <Link href={'/'} className="flex items-center justify-center">
                        <Image src="/images/logo.svg" height={36} width={30} alt=''/>
                        <Image className='ml-[10px]' src="/images/bank.svg" height={24} width={88} alt='' priority/>
                    </Link>
                </div>
                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                    <div className="flex items-center gap-5">
                        <div className="cursor-pointer transition-transform hover:translate-y-[-2px]" onClick={handleBack}><Image src={"/images/back.svg"} width={32} height={32} alt=""/></div>
                        <div className="text-[#2B2B2B] text-[26px] font-[700] text-center leading-8"><span>{t(`title.${servType}`)}</span></div>
                    </div>
                </div>
            </div>
        </div>
        <main className="bg-[#F5F5F7] overflow-auto xsprial-theme" style={{height:"calc(100vh - 64px)"}}>
            <div className={classNames("mx-auto pt-5",servType === PayType.upTeam?"w-[760px]":"w-[1000px]")}>
                <div className={classNames("rounded-2xl bg-[#fff] py-[32px]",servType === PayType.upTeam?"px-[80px]":"px-[40px] ")} style={{boxShadow:"0px 4px 12px 0px rgba(153, 153, 153, 0.20)"}}>
                    <div className="text-[#565656] text-sm text-center font-[700]"><span>{t(`payRemind.${servType}`)}</span></div>
                    {servType !== PayType.upTeam && <div className="mt-8 gap-10 text-base flex item-center justify-center text-[#C2C2C2]">
                        {(t("payStepName")||[]).map((v:string,index:number)=><div key={v} className={classNames("flex items-center gap-2 font-[700] border-b-2",checkoutStep === index?"text-[#9737FF] border-[#9737FF]":"border-transparent")}>
                            <div className={classNames("w-4 h-4 text-[12px] border rounded-full flex items-center justify-center",checkoutStep === index?"border-[#9737FF]":"border-[#C2C2C2] ")}>{index+1}</div>
                            <span>{v}</span>
                        </div>)}
                    </div>}
                    <div className="flex mt-8">
                        <div className={classNames(servType===PayType.upTeam?"w-full":"w-6/12")}>
                            <ConfirmPlan catalog={servType===PayType.subPer?ProductCatalog.person:ProductCatalog.team} onTeamCreate={handleTeamCreate}/>
                            {
                                servType === PayType.upTeam && <div className="mt-10 w-full h-[48px] flex items-center justify-center bg-[#2B2B2B] rounded cursor-pointer" onClick={handleUpgrade}>
                                    <div className="text-[#fff] text-xl flex items-center justify-center gap-3">
                                        <span>{t(`btn.upTeam`)}</span>
                                    </div>
                                </div>
                            }
                        </div>
                        {(servType === PayType.subPer || servType === PayType.subTeam) && 
                        <>
                            <div className="bg-[#DEDEDE] w-[1px] mx-[40px]"></div> 
                            <div ref={paddleContainerRef} className="w-6/12">
                                <div className="checkout-container"></div>
                            </div>
                        </>
                        }
                    </div>
                    <div className="mt-8 text-center">
                        <div className="text-sm text-[#565656] leading-6">
                            <span>By placing an order, you agree to our <Link href={"/services?type=terms"} className="text-[#9737FF] underline">Terms of Service</Link> and <Link href={"/services?type=privacy"} className="text-[#9737FF] underline">Privacy Policy</Link>.</span>
                        </div>
                        <div className="text-sm text-[#565656] leading-6">
                            <span>If you have any questions, please contact <Link href={"mailto:support@xspiral.com"} className="text-[#9737FF]">support@xspiral.com</Link>.</span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-[#C2C2C2]  text-center"><span>{t("termsTip")}</span></div>
            </div>
            
        </main>
    </div>
    )
}

export default Payment;