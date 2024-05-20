import Head from "next/head";
import Image from "next/image";
import { auth, provider } from "../firebase";

function Login() {
    //sign in user
    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    };

    return (
        <div className="grid place-items-center h-[100vh] bg-gray-50">
            <Head>
                <title>Loigin</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col p-[100px] items-center bg-white rounded-lg shadow-lg">
                <Image src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                    width="200"
                    height="200"
                    className="object-contain" 
                />
                <button className="text-sm border border-gray-200 rounded-md p-2 mt-10 hover:bg-gray-50 focus:outline-none"
                    onClick={signIn}
                >
                    SIGN IN WITH GOOGLE
                </button>
            </div>
            
        </div>
    )
}

export default Login
