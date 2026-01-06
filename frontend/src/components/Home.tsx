import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, PlusCircle } from "lucide-react";
import { toast } from "sonner";

const Home = () => {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const generateRoomId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  function joinRoom() {
    const roomId = room.trim() ? room.trim() : generateRoomId();
    toast.success("Joining room...");
    navigate(`/room/${roomId}`);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0d0d0d] px-4 text-gray-100">

      {/* 🔥 Product Hunt Badge (TOP) */}
      <div className="mb-6">
        <a
          href="https://www.producthunt.com/products/nexachat?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-nexachat"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1058969&theme=light"
            alt="NexaChat - Real-time rooms. Instant conversations | Product Hunt"
            width="250"
            height="54"
          />
        </a>
      </div>

      {/* Main Card */}
      <div className="bg-[#1a1a1a] p-10 rounded-2xl shadow-lg text-center w-full max-w-md border border-gray-800">
        
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-5 rounded-xl bg-[#2a2a2a] border border-gray-700">
            <MessageSquare className="w-12 h-12 text-pink-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
          Chat Rooms
        </h1>

        <p className="text-gray-400 mb-8 text-base">
          Connect instantly — join or create a room in seconds.
        </p>

        {/* Input Field */}
        <div className="space-y-5">
          <input
            className="w-full px-5 py-3 bg-[#121212] border border-gray-700 rounded-xl
                       text-gray-200 placeholder-gray-500 text-base
                       focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                       outline-none transition-all"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          {/* Join Button */}
          <button
            onClick={joinRoom}
            className="w-full bg-pink-500 text-white font-semibold py-3 px-6 rounded-xl
                       transition duration-300 hover:bg-pink-600 active:scale-[0.98]
                       shadow-md"
          >
            Join Room
          </button>

          {/* Generate Room Button */}
          <button
            onClick={() => {
              const newRoom = generateRoomId();
              setRoom(newRoom);
              toast.success(`Room created: ${newRoom}`, { icon: "🎉" });
            }}
            className="w-full bg-[#121212] font-semibold py-3 px-6 rounded-xl text-base
                       text-pink-400 border border-gray-700
                       transition duration-300 hover:bg-[#1e1e1e] active:scale-[0.98]
                       flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Generate New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
