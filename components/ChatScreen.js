import { DotsVerticalIcon, MicrophoneIcon, PaperClipIcon, UserCircleIcon } from "@heroicons/react/solid";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db} from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRef, useState } from "react";
import firebase from "firebase";
import Message from "../components/Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import Image from "next/image";

function ChatScreen({ chat, messages }) {
    const endOfMessageRef = useRef(null);
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const router = useRouter();
    const [messagesSnapshot] = useCollection(
        db.collection("chats").doc(router.query.id)
        .collection("messages").orderBy("timestamp", "asc")
    );

    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
    );

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message = {{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                     }}
                />
            ));
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ));
        }
    };

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behaviour: "smooth",
            block:"start",
        });
    }

    const sendMessage = (e) => {
        e.preventDefault();

        // updates last seen
        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }
        );

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email, 
            photoURL: user.photoURL,
        });

        setInput("");
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const recipientEmail = getRecipientEmail(chat.users, user);

    console.log(recipient)

    return (
        <div className="flex-grow h-[100vh]">
            {/* top header bar */}
            <div className="sticky bg-white z-50 top-0 flex p-[11px] h-[80px] items-center border-b-1 shadow-sm">
                {recipient ? (
                    <Image 
                        src={recipient?.photoUrl} 
                        width={60}
                        height={60}
                        className=" rounded-full"
                    />
                ) : ( 
                    <div className="flex h-9 w-9 m-1 mr-2 p-1 bg-gray-300 text-white rounded-full text-4xl justify-evenly ">
                        {recipientEmail[0]}
                    </div>
                )}

                <div className="ml-3 flex-grow">
                    <h3 className="text-lg">{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p className="text-xs text-gray-400">Last active: {""}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />      
                            ) : ("Unavailable")}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-400">Loading Last active...</p>
                    )}
                    
                </div>

                <div className="">
                    <button className="mr-1">
                        <PaperClipIcon className="h-10 text-gray-500 p-2 hover:bg-gray-100 rounded-full"/>
                    </button>
                    <button className="mr-3">
                        <DotsVerticalIcon className="h-10 text-gray-500 p-2 hover:bg-gray-100 rounded-full"/>
                    </button>
                </div>
            </div>

            {/* Message container */}
            <div className="p-5 bg-[#e5ded8] min-h-[90vh] rounded-md mb-10">
                {showMessages()}
                <div className="" ref={endOfMessageRef}/>
            </div>

            <div className="flex items-center p-2 sticky bottom-0 bg-white z-100">
                <EmojiHappyIcon className="h-5" />
                <form className="flex flex-grow">
                    <input className="bg-gray-100 z-100 flex-grow focus:outline-none border-0 rounded-lg p-3 ml-3 mr-3"
                        value={input} onChange ={e => setInput(e.target.value)}
                    />
                    <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send message</button>
                </form>
                
                <MicrophoneIcon className="h-5" />
            </div>
        </div>
    )
}

export default ChatScreen
