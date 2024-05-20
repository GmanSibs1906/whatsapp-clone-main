import Image from "next/image";
//import better-react-spinkit for loading gif
import { Circle } from "better-react-spinkit";

function Loading() {
    return (
        <div className="grid place-items-center h-[100vh]">
            <div className="flex flex-col items-center">
                <Image 
                    src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                    width="200"
                    height="200"
                />
                <Circle 
                    color="#3CBC28"
                    size={60}
                    className="mt-10"
                />
            </div>
            
        </div>
    )
}

export default Loading
