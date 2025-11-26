import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Table from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import DrawerComponent from "@/components/ui/drawer-right";
import MessageCard from "../components/messages-card";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";
import { useConversations } from "../useConversations";
import { Conversation } from "@/services/conversations/conversations.api";

export default function ConversationsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const { conversations, loading, totalPages, totalItems } = useConversations(currentPage);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    const handleOpenDrawer = (conversationId: number) => {
        const conversation = conversations.find((conv) => conv.id === conversationId);
        if (conversation) {
            setSelectedConversation(conversation);
            setDrawerOpen(true);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col h-full w-full">
            <Table>
                <thead>
                    <tr className="border-b border-neutral-800">
                        <th className="py-2 text-left px-4">Phone</th>
                        <th className="py-2 text-left px-4">Client</th>
                        <th className="py-2 text-left px-4">Status</th>
                        <th className="py-2 text-left px-4">Feedback</th>
                        <th className="py-2 text-left px-4">Conversation</th>
                        <th className="py-2 text-left px-4">Last Edited</th>
                    </tr>
                </thead>
                <tbody>
                    {conversations.map((conv) => (
                        <tr key={conv.id} className="border-b border-neutral-800 hover:bg-zinc-800 ease-in duration-50">
                            <td className="py-4 px-4">{conv.customer.phone_number}</td>
                            <td className="py-2 px-4">{conv.customer.name}</td>
                            <td className="py-2 px-4">{conv.status || "No status"}</td>
                            <td className="py-2 px-4">{conv.sentiment || "N/A"}</td>
                            <td className="py-2 px-4">
                                <button
                                    onClick={() => handleOpenDrawer(conv.id)}
                                    className="text-zinc-400 hover-delay hover:text-zinc-500 cursor-pointer"
                                >
                                    {conv.chat_contexts.length > 0
                                        ? conv.chat_contexts[conv.chat_contexts.length - 1].message_content.slice(0, 20) + "..."
                                        : "No messages"}
                                </button>
                            </td>
                            <td className="py-2 px-4">{conv.updated_at}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <DrawerComponent isDrawerOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
                {selectedConversation && selectedConversation.chat_contexts.length > 0 ? (
                    selectedConversation.chat_contexts.map((message) => (
                        <MessageCard key={message.id} message={message} />
                    ))
                ) : (
                    <p className="text-gray-400">No messages available.</p>
                )}
            </DrawerComponent>
            <div className="mt-auto">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={10}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}