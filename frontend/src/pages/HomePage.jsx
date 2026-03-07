import { useChatStore } from "../store/useChatStore";
//  this is page
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  console.log("hey");
  
  

  return (
    <div className="h-screen bg-base-200 pt-16">

      <div className="flex justify-center px-2 sm:px-4 h-full">

        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)] overflow-hidden">

          <div className="flex h-full">

            {/* Sidebar */}
            <div
              className={`${
                selectedUser ? "hidden md:flex" : "flex"
              } w-full md:w-72`}
            >
              <Sidebar />
            </div>

            {/* Chat */}
            <div
              className={`flex-1 ${
                !selectedUser ? "hidden md:flex" : "flex"
              }`}
            >
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HomePage;