// Demo data for chats - Customer Care Version
export const demoChats = [
  {
    id: 1,
    name: "John Doe",
    avatar: null,
    lastMessage: "Customer: I haven't received my order yet.",
    time: "10:45 AM",
    unread: 2,
    status: "online",
    messages: [
      {
        id: 1,
        sender: "other",
        text: "Hello, I haven't received my order yet. When can I expect delivery?",
        time: "10:30 AM",
        status: "read",
      },
      {
        id: 2,
        sender: "me",
        text: "Hi John, we're sorry to hear that. Could you please provide your order number so we can look into this for you?",
        time: "10:32 AM",
        status: "read",
      },
      {
        id: 3,
        sender: "other",
        text: "Order #48291. It was supposed to arrive by Friday.",
        time: "10:33 AM",
        status: "read",
      },
      {
        id: 4,
        sender: "me",
        text: "Thanks for providing the order number. We'll check the shipping status and get back to you shortly.",
        time: "10:35 AM",
        status: "read",
      },
      {
        id: 5,
        sender: "other",
        text: "Alright, looking forward to hearing from you.",
        time: "10:40 AM",
        status: "delivered",
      },
    ],
    chatHistory: [
      {
        role: "user",
        parts: [
          {
            text: "Hello, I haven't received my order yet. When can I expect delivery?",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hi John, we're sorry to hear that. Could you please provide your order number so we can look into this for you?",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Order #48291. It was supposed to arrive by Friday." }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Thanks for providing the order number. We'll check the shipping status and get back to you shortly.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Alright, looking forward to hearing from you." }],
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    avatar: null,
    lastMessage: "Customer: Can I return the item after 60 days?",
    time: "Yesterday",
    unread: 0,
    status: "online",
    messages: [
      {
        id: 1,
        sender: "other",
        text: "Hi, I'm past the 30-day return window. Can I still return the item?",
        time: "2:15 PM",
        status: "read",
      },
      {
        id: 2,
        sender: "me",
        text: "Hi Sarah, our standard return policy is 30 days from delivery date. However, exceptions may apply depending on the product type.",
        time: "2:20 PM",
        status: "read",
      },
      {
        id: 3,
        sender: "other",
        text: "Can I return it after 60 days instead?",
        time: "2:25 PM",
        status: "read",
      },
    ],
    chatHistory: [
      {
        role: "user",
        parts: [
          {
            text: "Hi, I'm past the 30-day return window. Can I still return the item?",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hi Sarah, our standard return policy is 30 days from delivery date. However, exceptions may apply depending on the product type.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Can I return it after 60 days instead?" }],
      },
    ],
  },
  {
    id: 3,
    name: "Support Group",
    avatar: null,
    lastMessage: "Customer: How do I cancel my subscription?",
    time: "Yesterday",
    unread: 5,
    status: "group",
    participants: ["Agent Alex", "Agent Maria", "You", "Customer Support"],
    messages: [
      {
        id: 1,
        sender: "Customer",
        text: "I want to cancel my monthly subscription. How can I do that?",
        time: "11:30 AM",
        status: "read",
      },
      {
        id: 2,
        sender: "Agent Maria",
        text: "To cancel your subscription, go to your account settings > billing > manage subscription > cancel plan.",
        time: "11:35 AM",
        status: "read",
      },
      {
        id: 3,
        sender: "me",
        text: "If you need help with the steps, we can guide you through the process.",
        time: "11:40 AM",
        status: "read",
      },
      {
        id: 4,
        sender: "Customer",
        text: "I tried but couldn’t find the option.",
        time: "11:45 AM",
        status: "delivered",
      },
    ],
    chatHistory: [
      {
        role: "user",
        parts: [
          {
            text: "I want to cancel my monthly subscription. How can I do that?",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "To cancel your subscription, go to your account settings > billing > manage subscription > cancel plan.",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "If you need help with the steps, we can guide you through the process.",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "I tried but couldn’t find the option." }],
      },
    ],
  },
  {
    id: 4,
    name: "Maria Johnson",
    avatar: null,
    lastMessage: "Customer: Is there a restocking fee for returns?",
    time: "Sunday",
    unread: 0,
    status: "offline",
    messages: [
      {
        id: 1,
        sender: "other",
        text: "Do you charge a restocking fee for returned items?",
        time: "3:00 PM",
        status: "read",
      },
      {
        id: 2,
        sender: "me",
        text: "Hi Maria, some items may incur a small restocking fee depending on the category. This will be shown at checkout or in your return confirmation email.",
        time: "3:05 PM",
        status: "read",
      },
      {
        id: 3,
        sender: "other",
        text: "Thank you for clarifying!",
        time: "3:30 PM",
        status: "read",
      },
    ],
    chatHistory: [
      {
        role: "user",
        parts: [{ text: "Do you charge a restocking fee for returned items?" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hi Maria, some items may incur a small restocking fee depending on the category. This will be shown at checkout or in your return confirmation email.",
          },
        ],
      },
      { role: "user", parts: [{ text: "Thank you for clarifying!" }] },
    ],
  },
];
