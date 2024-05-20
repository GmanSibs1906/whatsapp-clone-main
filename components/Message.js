import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import moment from "moment";

function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth);

    return (
        <div>
            { user === userLoggedIn.email ? (
                <p className=" text-right w-[fit-content] p-2 rounded-md m-2 min-w-[60px] pb-6 relative ml-auto bg-[#dcf8c6] ">
                    {message.message}
                    <span className="text-gray-500 p-2 text-[9px] absolute bottom-0 text-right right-0 ">
                        {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
                    </span>
                </p>
            ) : (
                <p className=" w-[fit-content] p-2 rounded-md m-2 min-w-[60px] pb-6 relative text-left bg-gray-100 ">
                    {message.message}
                    <span className="text-gray-500 p-2 text-[9px] absolute bottom-0 text-right right-0 ">
                        {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
                    </span>
                </p>
            )
             }
            
        </div>
    )
}

export default Message
