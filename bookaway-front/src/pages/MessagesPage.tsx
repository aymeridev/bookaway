import { useState, useRef, useEffect } from "react";
import { useLoaderData } from "react-router";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Send, Home, MessageSquare, User } from "lucide-react";
import api from "../api/axios";
import useAuthStore from "../context/AuthStore";

interface ChatMessage {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    created_at: string;
}

interface Conversation {
    id: number;
    user_id: number;
    owner_id: number;
    property_id: number;
    updated_at: string;
    user: { id: number; name: string };
    owner: { id: number; name: string };
    property: { id: number; title: string; images: { url: string }[] };
    messages: ChatMessage[];
    unread_count: number;
}

export function MessagesPage() {
    const initialConversations = useLoaderData() as Conversation[];
    const currentUser = useAuthStore((state) => state.user);

    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [activeChatId, setActiveChatId] = useState<number | null>(
        conversations[0]?.id || null
    );
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Trouver la conversation actuellement sélectionnée
    const activeConversation = conversations.find(c => c.id === activeChatId);

    // Déterminer qui est l'interlocuteur (l'autre personne)
    const getInterlocutor = (conv: Conversation) => {
        return String(currentUser?.id) === String(conv.user_id) ? conv.owner : conv.user;
    };

    // Faire défiler automatiquement le chat vers le bas lors d'un nouveau message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Déclenché dès qu'on change de conversation active
    useEffect(() => {
        scrollToBottom();

        if (!activeChatId) return;

        // 1. Appel API pour mettre à jour la base de données
        api.post(`/conversations/${activeChatId}/read`).catch(err =>
            console.error("Erreur marquage lu", err)
        );

        // 2. Mise à jour de l'état React pour faire disparaître la pastille rouge immédiatement
        setConversations(prev =>
            prev.map(conv =>
                conv.id === activeChatId ? { ...conv, unread_count: 0 } : conv
            )
        );
    }, [activeChatId]);

    // Action d'envoi de message à l'API Laravel
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChatId || !currentUser) return;

        try {
            const res = await api.post(`/conversations/${activeChatId}/messages`, {
                content: newMessage,
            });

            const createdMessage: ChatMessage = res.data;

            // Mettre à jour l'état local instantanément pour éviter les latences de rechargement
            setConversations(prevConversations =>
                prevConversations.map(conv => {
                    if (conv.id === activeChatId) {
                        return {
                            ...conv,
                            messages: [...conv.messages, createdMessage],
                            updated_at: new Date().toISOString()
                        };
                    }
                    return conv;
                }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            );

            setNewMessage("");
        } catch (error) {
            console.error("Impossible d'envoyer le message", error);
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-[calc(100vh-140px)] min-h-[500px] flex overflow-hidden">

                <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-gray-50/50">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            Messages
                        </h1>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-sm text-gray-500">
                                Aucune discussion pour le moment.
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const interlocutor = getInterlocutor(conv);
                                const lastMsg = conv.messages[conv.messages.length - 1];
                                const isActive = conv.id === activeChatId;
                                const propImage = conv.property?.images?.[0]?.url || "https://loremflickr.com/100/100/house";

                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => setActiveChatId(conv.id)}
                                        className={`w-full p-4 text-left flex gap-3 transition-colors ${isActive ? "bg-blue-50/70 border-l-4 border-blue-600" : "bg-white hover:bg-gray-50"
                                            }`}
                                    >
                                        <img
                                            src={propImage}
                                            alt={conv.property?.title}
                                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 space-y-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-900 truncate text-sm">
                                                    {interlocutor.name}
                                                </span>
                                                {lastMsg && (
                                                    <span className="text-xs text-gray-400 shrink-0">
                                                        {formatDistanceToNow(parseISO(lastMsg.created_at), { addSuffix: false, locale: fr })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-indigo-600 font-medium truncate flex items-center gap-1">
                                                <Home className="w-3 h-3 shrink-0" /> {conv.property?.title}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {lastMsg ? lastMsg.content : "Démarrer la discussion..."}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white">
                    {activeConversation ? (
                        <>
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">
                                            {getInterlocutor(activeConversation).name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Sujet : {activeConversation.property?.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                                {activeConversation.messages.map((msg) => {
                                    const isMe = String(msg.sender_id) === String(currentUser?.id);

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${isMe
                                                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none"
                                                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                                                    {formatDistanceToNow(parseISO(msg.created_at), { addSuffix: true, locale: fr })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Écrivez votre message ici..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-inner outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-xl transition-all shadow-sm active:scale-95 shrink-0 inline-flex items-center justify-center"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/20 p-8">
                            <MessageSquare className="w-16 h-16 text-gray-200 mb-2" />
                            <p className="font-medium">Sélectionnez une discussion pour commencer à échanger</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}