import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from "next/router";
import Image from "next/image";

function Chat({ id, users }) {
    
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(users,user))
    );

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    //open chat on click

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user); 

    
    return (
        <div className="flex items-center cursor-pointer p-1 break-words hover:bg-gray-100"
            onClick={enterChat}
        >
            {recipient ? (
                <Image src={recipient?.photoUrl} width={50} height={50}
                    className="rounded-full left-0 mr-2"
                />
            ) : (
                <div className="flex ml-[6px] h-9 w-9 m-1 mr-2 p-1 bg-gray-300 text-white rounded-full text-4xl justify-evenly ">
                    {recipientEmail[0]}
                </div>
            )}
            
            <p className="text-sm">
                {recipientEmail}
            </p>
        </div>
    )
}

export default Chat
