import { useState, useEffect } from "react";
import Message from "./Message";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Fab from "@mui/material/Fab";
import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon"; 
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import SearchIcon from "@mui/icons-material/Search";
import '../estilosBotones.css';

/* eslint-disable react/prop-types */

// VARIABLES GLOBALES
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

function ChatWindow({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const miId = sessionStorage.getItem("userId"); 
  console.log(miId);

  //Al seleccionar un chat cargo los mensajes
  const fetchMessages = (chatId, esGrupo) => {
    const options = {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    };

    let url;
    if (esGrupo) {
      url = `${supabaseUrl}/rest/v1/Mensajes?select=idMensaje,idEmisor,contenido,fecha&idChat=eq.${chatId}&order=fecha.asc`;
    } else {
      url = `${supabaseUrl}/rest/v1/Mensajes?select=idMensaje,idEmisor,contenido,fecha&idChat=eq.${chatId}&order=fecha.asc`;
    }
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const formattedMessages = data.map((msg) => ({
            id: msg.idMensaje,
            text: msg.contenido,
            sender: msg.idEmisor === miId ? "You" : "Other",
            senderName: msg.idEmisor?.nombres, 
            avatar: msg.idEmisor?.avatar,
            date: msg.fecha,
          }));
          setMessages(formattedMessages);
        }
      })
      .catch((error) => console.error("Error fetch:", error));
  };
  
  //Enviar un mensaje
  const handleSendMessage = () => {
  if (newMessage.trim()) {
    const messageData = {
      idChat: selectedChat.id,
      idEmisor: miId,
      contenido: newMessage.trim(),
      fecha: new Date(),
    };

    if (selectedChat.id) { 
      const ultimoMensajeActualizado = {
        contenido: newMessage.trim(),
        fecha: new Date(),
      };

      const options = {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(ultimoMensajeActualizado),
      };

      fetch(`${supabaseUrl}/rest/v1/Chats?id=eq.${selectedChat.id}`, options)
        .then((response) => {
          if (response.ok) {
            console.log("Mensaje actualizado correctamente");
            setNewMessage(""); 
            fetchMessages(selectedChat.id, selectedChat.esGrupo);
          } else {
            console.error("Error al actualizar el mensaje:", response.statusText);
          }
        })
        .catch((error) => console.error("Error al actualizar el mensaje:", error));

      const options2 = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(messageData),
      };

      fetch(`${supabaseUrl}/rest/v1/Mensajes`, options2)
        .then((response) => {
          if (response.ok) {
            setNewMessage(""); 
            fetchMessages(selectedChat.id, selectedChat.esGrupo); 
          } else {
            console.error("Error al enviar el mensaje:", response.statusText);
          }
        })
        .catch((error) => console.error("Error al enviar el mensaje:", error));
    }
  }
};

  

  useEffect(() => {
    if (selectedChat?.id) {
      fetchMessages(selectedChat.id, selectedChat.esGrupo);
    }
  }, [selectedChat]);

  if (!selectedChat) {
    return <div className="chat-window">Select a chat to start messaging</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        {selectedChat.esGrupo ? (
          selectedChat.avatarGrupo ? (
            <Avatar src={selectedChat.avatarGrupo} alt={selectedChat.nombreGrupo} />
          ) : (
            <Avatar>{selectedChat.nombreGrupo.charAt(0).toUpperCase()}</Avatar>
          )
        ) : (

          selectedChat.user.avatar ? (
            <Avatar src={selectedChat.user.avatar} alt={selectedChat.user.nombre} />
          ) : (
            <Avatar>{selectedChat.user.nombre.charAt(0).toUpperCase()}</Avatar>
            
          )
          
        )}
        
        <h3>{selectedChat.esGrupo ? selectedChat.nombreGrupo : selectedChat.user.nombre}</h3>

        <div className="header-buttons">
          <Fab variant="extended" className="custom-fab" onClick={() => console.log("Videollamada")}>
            <VideocamIcon sx={{ color: "#005000" }} />
          </Fab>

          <Fab variant="extended" className="custom-fab" onClick={() => console.log("Llamada")}>
            <CallIcon sx={{ color: "#005000" }} />
          </Fab>

          <Fab variant="extended" className="custom-fab" onClick={() => console.log("Buscar")}>
            <SearchIcon sx={{ color: "#005000" }} />
          </Fab>
          
          <Fab variant="extended" className="custom-fab" onClick={() => console.log("Opciones")}>
            <MoreVertIcon sx={{ color: "#005000" }} />
          </Fab>
        </div>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <Message
            key={message.id}
            text={message.text}
            sender={message.sender}
            fecha={message.date}
            avatar={message.avatar} 
            senderName={message.senderName} 
            isGroup={selectedChat.esGrupo} 
          />
        ))}
      </div>
      <div className="input">
        <div className="input-box">
          <Fab variant="extended" className="custom-fab" onClick={() => console.log("Abrir emojis")}>
            <InsertEmoticonIcon sx={{ color: "#005000" }} />
          </Fab>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <Fab variant="extended" className="custom-fab">
            <AttachFileIcon sx={{ color: "#005000" }} />
          </Fab>
          <Fab variant="extended" className="custom-fab" onClick={() => console.log("Abrir cámara")}>
            <CameraAltIcon sx={{ color: "#005000" }} />
          </Fab>
        </div>
        <div className="input-box2">
          <Fab variant="extended" className="custom-fab" onClick={handleSendMessage}>
            <SendIcon sx={{ color: "#005000" }} />
            Enviar
          </Fab>
        </div>
      </div>
    </div>
  );
}


export default ChatWindow;
