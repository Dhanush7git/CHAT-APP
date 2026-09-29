import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  Bell,
  Check,
  ChevronDown,
  Hash,
  Menu,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
  Users,
  X,
} from "lucide-react";

const socket = io("http://localhost:5000");
const clientId = crypto.randomUUID();

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const rooms = [
    { name: "General", detail: "Team conversations", count: 3 },
    { name: "Random", detail: "Off-topic chat", count: 0 },
    { name: "Announcements", detail: "Important updates", count: 0 },
  ];

  const people = [
    { name: "Maya Rodriguez", role: "Online", color: "bg-amber-400" },
    { name: "Jordan Lee", role: "Online", color: "bg-emerald-400" },
    { name: "Sam Williams", role: "Away", color: "bg-violet-400" },
  ];

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((currentMessages) => [...currentMessages, message]);
    });
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("message");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const message = {
        text: messageInput.trim(),
        timestamp: new Date(),
        senderId: clientId,
      };
      socket.emit("message", message);
      setMessageInput("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1500px] overflow-hidden bg-white shadow-2xl shadow-slate-200/70">
        <aside
          className={`fixed inset-y-0 left-0 z-20 flex w-72 flex-col bg-[#111827] text-slate-300 transition-transform duration-300 lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-sm font-bold text-slate-950">C</div>
              <div>
                <p className="text-sm font-semibold tracking-wide text-white">Chatter</p>
                <p className="text-xs text-slate-500">Workspace</p>
              </div>
            </div>
            <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
              <X size={18} />
            </button>
          </div>

          <div className="px-4 pt-6">
            <div className="mb-3 flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              <span>Rooms</span>
              <button className="rounded p-1 hover:bg-white/10 hover:text-white" aria-label="Add room"><Plus size={15} /></button>
            </div>
            <div className="space-y-1">
              {rooms.map((room, index) => (
                <button key={room.name} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${index === 0 ? "bg-cyan-400/15 text-cyan-300" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                  <Hash size={17} className={index === 0 ? "text-cyan-300" : "text-slate-500"} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{room.name}</span>
                    <span className="block truncate text-xs text-slate-500">{room.detail}</span>
                  </span>
                  {room.count > 0 && <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">{room.count}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 px-4">
            <div className="mb-3 flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              <span>People</span>
              <Users size={15} />
            </div>
            <div className="space-y-1">
              {people.map((person) => (
                <div key={person.name} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5">
                  <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${person.color} text-xs font-bold text-slate-900`}>
                    {person.name.split(" ").map((part) => part[0]).join("")}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#111827] ${person.role === "Online" ? "bg-emerald-400" : "bg-amber-400"}`} />
                  </div>
                  <span><span className="block text-sm text-slate-300">{person.name}</span><span className="block text-xs text-slate-500">{person.role}</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-slate-950">YO</div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">You</p><p className="text-xs text-slate-500">Active now</p></div>
              <MoreHorizontal size={18} className="text-slate-500" />
            </div>
          </div>
        </aside>

        {isSidebarOpen && <button className="fixed inset-0 z-10 bg-slate-950/40 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close navigation" />}

        <main className="flex min-h-screen min-w-0 flex-1 flex-col bg-[#f8fafc]">
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar"><Menu size={20} /></button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600"><Hash size={20} /></div>
              <div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-base font-semibold text-slate-900">General</h1><ChevronDown size={16} className="text-slate-400" /></div><p className="truncate text-xs text-slate-500">A place for everything and everyone</p></div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3"><div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{isConnected ? "Connected" : "Connecting..."}</div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Search"><Search size={19} /></button><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Notifications"><Bell size={19} /></button></div>
          </header>

          <section className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
              <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center gap-4"><div className="h-px flex-1 bg-slate-200" /><span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Today</span><div className="h-px flex-1 bg-slate-200" /></div>
                {messages.length === 0 && <div className="flex min-h-[40vh] flex-col items-center justify-center text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500"><Hash size={28} /></div><h2 className="text-lg font-semibold text-slate-800">Welcome to General</h2><p className="mt-1 max-w-sm text-sm text-slate-500">Start a conversation with your team. Messages will appear here in real time.</p></div>}
                <div className="space-y-5">
                  {messages.map((msg, index) => {
                    const isSent = msg.senderId === clientId;
                    return <div key={`${msg.timestamp}-${index}`} className={`flex items-end gap-3 ${isSent ? "justify-end" : "justify-start"}`}>
                      {!isSent && <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-slate-900 sm:flex">TM</div>}
                      <div className={`flex max-w-[82%] flex-col ${isSent ? "items-end" : "items-start"}`}><div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${isSent ? "rounded-br-md bg-cyan-500 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>{msg.text}</div><div className="mt-1 flex items-center gap-1.5 px-1 text-[11px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{isSent && <Check size={13} className="text-cyan-500" />}</div></div>
                    </div>;
                  })}
                </div>
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-8 sm:py-5"><div className="mx-auto max-w-3xl"><div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-50"><button className="hidden rounded-xl p-2 text-slate-400 hover:bg-white hover:text-cyan-500 sm:block" aria-label="Attach file"><Paperclip size={19} /></button><textarea rows="1" className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="Write a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} /><button className="hidden rounded-xl p-2 text-slate-400 hover:bg-white hover:text-cyan-500 sm:block" aria-label="Add emoji"><Smile size={19} /></button><button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-sm shadow-cyan-200 transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40" onClick={sendMessage} disabled={!messageInput.trim()} aria-label="Send message"><Send size={17} /></button></div><p className="mt-2 hidden text-[11px] text-slate-400 sm:block">Press Enter to send · Shift + Enter for a new line</p></div></div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Chat;
