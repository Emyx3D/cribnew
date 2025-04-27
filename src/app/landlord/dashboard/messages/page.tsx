'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageSquare, Search, Archive } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// TODO: Define Message and Conversation types
type Message = {
    id: string;
    senderId: string; // 'landlord' or tenant's ID
    text: string;
    timestamp: Date;
};

type Conversation = {
    id: string;
    tenantId: string;
    tenantName: string;
    tenantAvatarUrl?: string; // Optional avatar
    listingId: string;
    listingTitle: string;
    lastMessage: Message;
    unreadCount: number;
};

// --- Mock API Functions ---
// TODO: Replace with actual API calls

async function fetchConversations(): Promise<Conversation[]> {
    console.log("Fetching conversations...");
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        {
            id: 'conv1', tenantId: 'tenant123', tenantName: 'Prospective Tenant A', listingId: 'landlord_prop1', listingTitle: 'My Spacious 3 Bedroom Apartment',
            lastMessage: { id: 'msg1', senderId: 'tenant123', text: "Hello, is the apartment still available? I'd like to schedule a viewing.", timestamp: new Date(Date.now() - 3600000) },
            unreadCount: 1,
        },
        {
            id: 'conv2', tenantId: 'tenant456', tenantName: 'Tenant B Inquiry', listingId: 'landlord_prop1', listingTitle: 'My Spacious 3 Bedroom Apartment',
            lastMessage: { id: 'msg2', senderId: 'landlord', text: "Yes, it is. When would you like to come?", timestamp: new Date(Date.now() - 86400000 * 2) },
            unreadCount: 0,
        },
         {
            id: 'conv3', tenantId: 'tenant789', tenantName: 'Quick Question C', listingId: 'landlord_prop2', listingTitle: 'My Cozy 2 Bedroom Flat',
            lastMessage: { id: 'msg3', senderId: 'tenant789', text: "Does it have prepaid meter?", timestamp: new Date(Date.now() - 86400000 * 5) },
            unreadCount: 0, // Read example
        },
    ];
}

async function fetchMessages(conversationId: string): Promise<Message[]> {
    console.log(`Fetching messages for conversation ${conversationId}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate different message histories based on conversation ID
    if (conversationId === 'conv1') {
        return [
            { id: 'msg1', senderId: 'tenant123', text: "Hello, is the apartment still available? I'd like to schedule a viewing.", timestamp: new Date(Date.now() - 3600000) },
        ];
    }
    if (conversationId === 'conv2') {
         return [
             { id: 'msgA', senderId: 'tenant456', text: "Good day, please is this still available?", timestamp: new Date(Date.now() - 86400000 * 2 - 600000) },
             { id: 'msgB', senderId: 'tenant456', text: "Can I come inspect tomorrow?", timestamp: new Date(Date.now() - 86400000 * 2 - 300000) },
             { id: 'msg2', senderId: 'landlord', text: "Yes, it is. When would you like to come?", timestamp: new Date(Date.now() - 86400000 * 2) },
        ];
    }
     if (conversationId === 'conv3') {
         return [
             { id: 'msg3', senderId: 'tenant789', text: "Does it have prepaid meter?", timestamp: new Date(Date.now() - 86400000 * 5) },
             { id: 'msg4', senderId: 'landlord', text: "Yes, it does.", timestamp: new Date(Date.now() - 86400000 * 5 + 60000) },
        ];
    }
    return [];
}

async function sendMessage(conversationId: string, text: string): Promise<{ success: boolean; newMessage?: Message, error?: string }> {
    console.log(`Sending message "${text}" to conversation ${conversationId}...`);
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMessage: Message = {
        id: `msg_${Math.random().toString(16).slice(2)}`,
        senderId: 'landlord', // Assume landlord is sending
        text: text,
        timestamp: new Date(),
    };
    return { success: true, newMessage };
}

// --- End Mock API Functions ---


export default function LandlordMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

     // Auth Check
    useEffect(() => {
        try {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            const userRole = sessionStorage.getItem('userRole');
            if (!isLoggedIn || userRole !== 'landlord') {
                router.push('/login');
            }
        } catch (error) {
             router.push('/login');
        }
    }, [router]);

    // Fetch conversations on mount
    useEffect(() => {
        setIsLoadingConversations(true);
        fetchConversations()
            .then(data => {
                setConversations(data);
                setFilteredConversations(data); // Initialize filter list
            })
            .catch(err => console.error("Error fetching conversations:", err))
            .finally(() => setIsLoadingConversations(false));
    }, []);

    // Filter conversations based on search term
     useEffect(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = conversations.filter(conv =>
            conv.tenantName.toLowerCase().includes(lowerSearchTerm) ||
            conv.listingTitle.toLowerCase().includes(lowerSearchTerm)
        );
        setFilteredConversations(filtered);
    }, [searchTerm, conversations]);


    // Fetch messages when a conversation is selected
    useEffect(() => {
        if (selectedConversation) {
            setIsLoadingMessages(true);
            fetchMessages(selectedConversation.id)
                .then(data => {
                    setMessages(data);
                    // TODO: Mark conversation as read (API call and update state)
                    // Mark as read locally for UI update
                     setConversations(prev => prev.map(c => c.id === selectedConversation.id ? {...c, unreadCount: 0} : c));
                })
                .catch(err => console.error("Error fetching messages:", err))
                .finally(() => setIsLoadingMessages(false));
        } else {
            setMessages([]); // Clear messages if no conversation is selected
        }
    }, [selectedConversation]);


    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || isSending) return;

        setIsSending(true);
        const result = await sendMessage(selectedConversation.id, newMessage);

        if (result.success && result.newMessage) {
            setMessages(prev => [...prev, result.newMessage!]);
            setNewMessage('');
             // Update last message in the conversation list
             setConversations(prev => prev.map(c => c.id === selectedConversation.id ? {...c, lastMessage: result.newMessage!} : c));
        } else {
            // Handle error (e.g., show toast)
            console.error("Failed to send message:", result.error);
        }
        setIsSending(false);
        // Scroll to bottom after sending
        // TODO: Implement scroll-to-bottom logic for the message area
    };

    // Helper to get initials for Avatar fallback
     const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }


    return (
        <div className="container mx-auto px-4 py-12 h-[calc(100vh-10rem)] flex flex-col"> {/* Adjust height as needed */}
            <h1 className="text-3xl font-bold mb-6">Messages</h1>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-0"> {/* Flex layout */}

                {/* Conversation List */}
                <Card className="md:col-span-1 lg:col-span-1 flex flex-col min-h-0 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Conversations</CardTitle>
                         <div className="relative mt-2">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by tenant or property..."
                                className="pl-8 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                         </div>
                    </CardHeader>
                    <ScrollArea className="flex-1 min-h-0"> {/* ScrollArea takes remaining space */}
                        <CardContent className="p-0">
                            {isLoadingConversations ? (
                                <div className="p-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
                            ) : filteredConversations.length === 0 ? (
                                <p className="p-6 text-center text-sm text-muted-foreground">No conversations found.</p>
                            ) : (
                                <div className="space-y-1">
                                    {filteredConversations.sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()).map((conv) => (
                                        <button
                                            key={conv.id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={cn(
                                                "flex items-center w-full p-3 text-left hover:bg-muted transition-colors rounded-md",
                                                selectedConversation?.id === conv.id && "bg-muted"
                                            )}
                                        >
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarImage src={conv.tenantAvatarUrl} alt={conv.tenantName} />
                                                <AvatarFallback>{getInitials(conv.tenantName)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center">
                                                     <p className="font-semibold truncate text-sm">{conv.tenantName}</p>
                                                     {conv.unreadCount > 0 && (
                                                        <Badge variant="destructive" className="h-5 px-1.5 text-xs">{conv.unreadCount}</Badge>
                                                     )}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{conv.listingTitle}</p>
                                                <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage.text}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </ScrollArea>
                </Card>

                {/* Message View */}
                <Card className="md:col-span-2 lg:col-span-3 flex flex-col min-h-0 shadow-md"> {/* Flex column */}
                    {selectedConversation ? (
                        <>
                            <CardHeader className="border-b">
                                <CardTitle className="text-lg">{selectedConversation.tenantName}</CardTitle>
                                <CardDescription>Regarding: <Link href={`/listings/${selectedConversation.listingId}`} target="_blank" className="text-primary hover:underline">{selectedConversation.listingTitle}</Link></CardDescription>
                            </CardHeader>

                            <ScrollArea className="flex-1 p-4 space-y-4 min-h-0"> {/* ScrollArea takes remaining space */}
                                {isLoadingMessages ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : messages.length === 0 ? (
                                     <p className="text-center text-sm text-muted-foreground pt-10">No messages in this conversation yet.</p>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex w-full",
                                                msg.senderId === 'landlord' ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[75%] p-3 rounded-lg",
                                                    msg.senderId === 'landlord'
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-foreground"
                                                )}
                                            >
                                                <p className="text-sm">{msg.text}</p>
                                                <p className={cn(
                                                    "text-xs mt-1",
                                                     msg.senderId === 'landlord' ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
                                                    )}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>

                            {/* Message Input */}
                            <CardContent className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <Input
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        disabled={isSending || isLoadingMessages}
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending || isLoadingMessages}>
                                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                     {/* TODO: Add Archive Button? */}
                                     {/* <Button type="button" variant="outline" size="icon" disabled={isSending || isLoadingMessages} title="Archive Conversation">
                                         <Archive className="h-4 w-4" />
                                     </Button> */}
                                </form>
                            </CardContent>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-10">
                            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Select a conversation to view messages.</p>
                        </div>
                    )}
                </Card>

            </div>
        </div>
    );
}
