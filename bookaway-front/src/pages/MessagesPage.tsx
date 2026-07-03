import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Send, Home, MessageSquare, Loader2, XCircle } from "lucide-react";
import api from "../api/axios";
import useAuthStore from "../context/AuthStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useConversations } from "../hooks/apiHooks";
import type { Conversation, ChatMessage } from "../types";
import { useTranslation } from "react-i18next";
import { fr, enUS } from "date-fns/locale";

export function MessagesPage() {
    const { data: conversationsData, isLoading } = useConversations();
    const currentUser = useAuthStore((state) => state.user);
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language.startsWith("fr") ? fr : enUS;

    const [searchParams, setSearchParams] = useSearchParams();
    const paramId = searchParams.get("conversation_id");

    const [conversations, setConversations] = useState<Conversation[]>([]);

    const activeChatId = (() => {
        if (paramId) {
            const parsed = parseInt(paramId, 10);
            if (!isNaN(parsed)) return parsed;
        }
        return conversations[0]?.id || null;
    })();

    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationsData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setConversations(
                conversationsData.map(conv =>
                    conv.id === activeChatId ? { ...conv, unread_count: 0 } : conv
                )
            );
        }
    }, [conversationsData, activeChatId]);

    // Trouver la conversation actuellement sélectionnée
    const activeConversation = conversations.find(c => c.id === activeChatId);

    // Déterminer qui est l'interlocuteur (l'autre personne)
    const getInterlocutor = (conv: Conversation) => {
        return String(currentUser?.id) === String(conv.user_id) ? conv.owner : conv.user;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();

        if (!activeChatId) return;

        api.post(`/conversations/${activeChatId}/read`).catch(err =>
            console.error("Erreur marquage lu", err)
        );
    }, [activeChatId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChatId || !currentUser) return;

        try {
            const res = await api.post(`/conversations/${activeChatId}/messages`, {
                content: newMessage,
            });

            const createdMessage: ChatMessage = res.data;

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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">{t("chat-page.loading")}</p>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
            <div className="h-[calc(100vh-140px)] min-h-[500px] flex overflow-hidden">

                <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-gray-50/50">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            {t("chat-page.title")}
                        </h1>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-sm text-gray-500">
                                {t("chat-page.no-discussions")}
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const interlocutor = getInterlocutor(conv);
                                const lastMsg = conv.messages[conv.messages.length - 1];
                                const isActive = conv.id === activeChatId;
                                const propImage = conv.property?.images?.[0]?.url || "https://loremflickr.com/100/100/house";

                                return (
                                    <Button
                                        key={conv.id}
                                        variant="flat"
                                        onClick={() => {
                                            setSearchParams({ conversation_id: String(conv.id) });
                                            setConversations(prev =>
                                                prev.map(c =>
                                                    c.id === conv.id ? { ...c, unread_count: 0 } : c
                                                )
                                            );
                                        }}
                                        className={`w-full p-4 text-left flex gap-3 transition-colors rounded-none justify-start items-start enabled:hover:scale-100 enabled:hover:shadow-none enabled:active:scale-100 ${isActive ? "bg-blue-50/70 border-l-4 border-blue-600 text-gray-900" : "bg-white hover:bg-gray-50"
                                            }`}
                                    >
                                        <img
                                            src={propImage}
                                            alt={conv.property?.title}
                                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 space-y-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-semibold truncate text-sm ${
                                                    conv.booking?.status === "cancelled" ? "text-red-600 line-through" : "text-gray-900"
                                                }`}>
                                                    {interlocutor.name}
                                                </span>
                                                {lastMsg && (
                                                    <span className="text-xs text-gray-400 shrink-0">
                                                       {formatDistanceToNow(parseISO(lastMsg.created_at), { addSuffix: false, locale: currentLocale })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs font-medium truncate flex items-center gap-1 ${
                                                conv.booking?.status === "cancelled" ? "text-red-500 line-through" : "text-indigo-600"
                                            }`}>
                                                <Home className="w-3 h-3 shrink-0" /> {conv.property?.title}
                                            </p>
                                            <p className={`text-sm truncate ${
                                                conv.booking?.status === "cancelled" ? "text-red-400/80 italic" : "text-gray-500"
                                            }`}>
                                               {lastMsg ? lastMsg.content : t("chat-page.start-discussion")}
                                            </p>
                                        </div>
                                    </Button>
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
                                    <div aria-hidden="true" className="rounded-full size-8 mx-auto" style={{ backgroundImage: `url("https://api.dicebear.com/10.x/thumbs/svg?seed=${activeConversation?.id}")` }}></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">
                                            {getInterlocutor(activeConversation).name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {t("chat-page.subject")} {activeConversation.property?.title}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {activeConversation.booking?.status === "cancelled" && (
                                <div className="bg-red-50 border-b border-red-200 p-4 flex items-start gap-3">
                                    <div className="p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-sm text-red-800">
                                        <p className="font-bold">{t("chat-page.booking-cancelled")}</p>
                                        <p className="mt-1 text-red-700 leading-relaxed">
                                            {t("chat-page.cancelled-description")}
                                            {activeConversation.booking.cancellation_reason && (
                                                <span className="block mt-1 text-red-600 italic">
                                                    {t("chat-page.cancellation-reason")} "{activeConversation.booking.cancellation_reason}"
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}

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
                                                    {formatDistanceToNow(parseISO(msg.created_at), { addSuffix: true, locale: currentLocale })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder={t("chat-page.placeholder-input")}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="submit"
                                        className="p-3 rounded-xl shrink-0"
                                    >
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/20 p-8">
                            <MessageSquare className="w-16 h-16 text-gray-200 mb-2" />
                            <p className="font-medium">{t("chat-page.select-discussion")}</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}