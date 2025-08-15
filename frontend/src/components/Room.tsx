import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Send, Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Message {
  message: string;
  name: string;
}

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [nameSet, setNameSet] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { message: "Welcome to the chat room! 👋", name: "System" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!roomId)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 bg-gray-900">
        Invalid room
      </div>
    );

  useEffect(() => {
    const ws = new WebSocket("http://localhost:5050");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", payload: { roomId } }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data.payload]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket connection closed");

    setSocket(ws);
    return () => ws.close();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!socket || !message.trim() || !nameSet) return;
    socket.send(
      JSON.stringify({
        type: "chat",
        payload: { message: message.trim(), name: name.trim() || "Anonymous" },
      })
    );
    setMessage("");
  }

  function handleSetName() {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setNameSet(true);
    toast.success(`Welcome, ${name}!`);
  }

  const shareRoom = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Room link copied!");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  function leaveRoom() {
    navigate("/");
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur-md border-b border-gray-700">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={leaveRoom}
              className="p-2 rounded-lg hover:bg-gray-700 transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">Room: {roomId}</h1>
              <p className="text-sm text-gray-400">
                Chatting as{" "}
                <span className="text-gray-200">
                  {nameSet ? name : "Anonymous"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={shareRoom}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button
              onClick={leaveRoom}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" /> Leave
            </button>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex transition-all duration-300 ease-out ${
              msg.name === name
                ? "justify-end"
                : msg.name === "System"
                ? "justify-center"
                : "justify-start"
            }`}
          >
            {msg.name === "System" ? (
              <div className="px-4 py-1 rounded-full text-sm bg-gray-800/60 border border-gray-700 text-gray-300 shadow-sm flex items-center gap-1">
                {msg.message}
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </div>
            ) : (
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                  msg.name === name
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 rounded-bl-none"
                }`}
              >
                <div className="text-xs mb-1 font-medium opacity-75">
                  {msg.name}
                </div>
                <p className="break-words">{msg.message}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* INPUT SECTION */}
      <footer className="border-t border-gray-700 bg-gray-800/90 backdrop-blur-md p-4 space-y-3">
        {!nameSet && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetName()}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
            />
            <button
              onClick={handleSetName}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition"
            >
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline">Set Name</span>
            </button>
          </div>
        )}

        {nameSet && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}

export default Room;
