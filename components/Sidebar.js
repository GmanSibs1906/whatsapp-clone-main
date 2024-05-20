import { UserCircleIcon, DotsVerticalIcon, ChatAltIcon, SearchIcon } from '@heroicons/react/solid';
import * as EmailValidator from "email-validator";
import { auth, db } from '../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import Image from "next/image";

function Sidebar() {
    const [user] = useAuthState(auth);

    // check if chat does not already exist with exact emails 
    const userChatRef= db.collection("chats").where("users", "array-contains", user.email);
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        //Show prompt on onClick
        const input = prompt("Please enter an email for the user you want to chat with");

        //Protect from crushing if there is no input
        if (!input) return null;

        //Check if email is valid then check if chat does not already exist
        
        //1. Check if chat doesnt exist & email is valid. Install packege => email-validator
        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            // If valid (returns boolean) 

            //Add chat to the DB "chats" collection
            db.collection("chats").add({
                //create one one one chat with user and imput email
                users: [user.email, input],
            });
        }
    };

    //check if chat does not already exists
    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find(
            (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
        );

    return (
        <div className="h-[100vh] max-w-[350px] overflow-y-scroll scrollbar-hide ">
            <div className="flex sticky top-0 bg-white z-10 justify-between items-center p-4 h-55 ">
                <Image src={user.photoURL} 
                width={50} height={50} 
                className="rounded-full text-gray-300 hover:cursor-pointer transition duration-150 transform hover:scale-110 "
                    // signOut() is a built in firebase function
                    onClick={() => auth.signOut()}
                />
                <div className="">
                    <button className="focus:outline-none">
                        <ChatAltIcon className="btn"/>
                    </button>

                    <button className="focus:outline-none">
                        <DotsVerticalIcon className="btn"/>
                    </button>
                </div>
            </div>
            
            <div className="pb-5">
                <form className="flex w-full border border-gray-50 items-center rounded-full p-1 mt-0 ">
                    <SearchIcon className="h-5 mr-3 ml-1 text-gray-800"/>
                    <input type="text" placeholder="Search in chats" className="flex flex-grow focus:outline-none"/>
                </form>
            </div>

            <button className=" p-1 w-full border border-gray-50 border-t-1 border-b-1 focus:outline-none hover:bg-gray-100 mb-3 text-sm"
                onClick={createChat}
            >
                START A NEW CHAT
            </button>

            {/* List of chats */}
            {chatsSnapshot?.docs.map(chat => (
                <Chat 
                    key={chat.id}
                    id={chat.id}
                    users={chat.data().users}
                />
            ))}

        </div>
    )
}

export default Sidebar
