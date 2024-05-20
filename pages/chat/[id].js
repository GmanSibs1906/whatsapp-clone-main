import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ chat, messages }) {

    const [user] = useAuthState(auth);

    return (
        <div className="flex">
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Sidebar className="" />

            <div className="flex flex-grow h-[100vh] p-0 overflow-y-scroll scrollbar-hide ">
                <ChatScreen chat={chat} messages={messages} />
            </div>
        </div>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id);

    //Prep the messages on the server
    const messagesRes = await ref.collection("messages").orderBy("timestamp", "asc").get();

    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));

    // Prep the chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    };

    // console.log(chat, messages)

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}


