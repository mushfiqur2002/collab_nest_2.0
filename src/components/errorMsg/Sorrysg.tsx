import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Sorrysg() {
    return (
        <div className='flex flex-center flex-col'>
            <DotLottieReact
                src="https://lottie.host/38bc1051-ff4a-43de-90b7-fb2ce55bd034/DZyRVQgDlQ.lottie"
                loop
                autoplay
            />
            <p className='text-xl text-center'>We are not currently offering this service for <br></br><span className='uppercase font-bold text-primary-500'>job seekers</span></p>
            <br></br>
            <h1 className='capitalize text-2xl'>comming soon...!</h1>
        </div>
    )
}