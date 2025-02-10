import { data } from "autoprefixer";

const URL_CHAT = 'http://127.0.0.1:8000'

async function createChat(messages, setMessages) {
    console.log("Create chat")
    setMessages(draft => [...draft,
        {role: "system", content: "Usted es el redactor de una empresa tecnologica. Tu nombre es Alejandro. Esta revisando un documento para comprobar si cumple con la guia de estilo de la empresa."},
      ]);
    
      const res = await fetch(URL_CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({
            "model": "llama-3.2-1b-instruct",
            "messages": messages,
            "max_tokens": -1,
            "stream": false
        })
    });

    const data = await res.json();

    console.log("Chat created")
    if (!res.ok) {
        return Promise.reject({ status: res.status, data });
    }

    console.log(data)
    return data;
}

async function sendChatMessage(messages, message) {

    const res = await fetch(URL_CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({
            "model": "llama-3.2-1b-instruct",
            "messages": messages,
            "max_tokens": -1,
            "stream": false
        })
    });
    if (!res.ok) {
        return Promise.reject({ status: res.status, data: await res.json() });
    }
    data = await res.json()
    return data['choices'][0]['message']['content'];
}

export default {
  createChat, sendChatMessage
};