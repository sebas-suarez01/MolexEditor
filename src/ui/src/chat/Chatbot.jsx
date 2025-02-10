import { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const URL_CHAT = 'http://127.0.0.1:8000'

function Chatbot({temperatureValue}) {
  const [chatId, setChatId] = useState(0);
  const [messagesToSend, setMessagesToSend] = useState([{role: "system", content: "Usted es el redactor de una empresa tecnológica. Tu nombre es Alejandro. Está revisando un documento para comprobar si cumple con la guía de estilo de la empresa." }]);
  const [messages, setMessages] = useImmer([]);
  const [newMessage, setNewMessage] = useState("");

  const isLoading = messages.length && messages[messages.length - 1].loading;

  useEffect(()=>{
    async function fetchAPI() {
      let data = await fetch(URL_CHAT + "/chat",{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({
          "request_messages":messagesToSend,
          "temperature":temperatureValue.current
        })
                })
              .then(response => response.json())
              .then(data => data['response']);
  
      setMessagesToSend([...messagesToSend,
      { role: "assistant", content: data },
      ]);
  
      setMessages(draft => {
        draft[draft.length - 1].content += data;
      });
  
      setMessages(draft => {
        draft[draft.length - 1].loading = false;
      });
    }
    if(chatId == 1){
      fetchAPI()
    }
    setChatId(0)
  }, [chatId])

  async function submitNewMessage() {
      const trimmedMessage = newMessage.trim();
      if (!trimmedMessage || isLoading) return;

      setMessages(draft => [...draft,
        { role: "user", content: trimmedMessage },
        { role: "assistant", content: "", sources: [], loading: true }
      ]);

      setMessagesToSend([...messagesToSend,
        { role: "user", content: trimmedMessage },
      ])
      setNewMessage("")
      
      setChatId(1)
  }

  return (
    <div className='relative grow flex flex-col gap-6 p-5'>
      <header className='sticky top-0 shrink-0 z-20'>
        <div className='flex flex-col h-full w-full gap-1 pt-4 pb-2'>
          <h1 className='font-urbanist text-[1.65rem] font-semibold'>Chat</h1>
        </div>
      </header>
      {messages.length === 0 && (
        <div className='mt-3 font-urbanist text-primary-blue text-xl font-light space-y-2'>
          <p>👋 Welcome!</p>
          <p>I'm MoLex, your writing assistant</p>
        </div>
      )}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
      />
      <ChatInput
        newMessage={newMessage}
        isLoading={isLoading}
        setNewMessage={setNewMessage}
        submitNewMessage={submitNewMessage}
      />
    </div>
  );
}

export default Chatbot;