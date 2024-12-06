import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search"; 
const miId = sessionStorage.getItem("userId");
/* eslint-disable react/prop-types */

function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]); 
  const [busqueda, setBusqueda] = useState("");
  const [chatsFiltrados, setChatsfiltrados] = useState([]);
  const [chatsGruposFiltrados, setChatsGruposFiltrados] = useState([]);

  //Filtro los chats con el texto introducido
  useEffect(() => {
    const filtro = busqueda.toLowerCase();
    setChatsfiltrados(
      chats.filter((chat) =>
        chat.user.nombre.toLowerCase().includes(filtro)
      )
    );
    setChatsGruposFiltrados(
      groupChats.filter((chat) =>
        chat.nombreGrupo.toLowerCase().includes(filtro)
      )
    );
  }, [busqueda, chats, groupChats]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "insomnia/10.1.1",
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocXlnbGFudmF1bmJ4Ym1rdm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NzMwMzAsImV4cCI6MjA0NzE0OTAzMH0.qn15UZVxNbxfJrMo8t2TZ8owipTI__eq8KYqXydB0jQ",
      },
    };

    //Fetch para obtener los grupos donde participo
    const gruposUrl = `https://mhqyglanvaunbxbmkvof.supabase.co/rest/v1/MiembrosGrupos?select=idGrupo&idUsuario=eq.${miId}`;
    fetch(gruposUrl, options)
      .then((response) => response.json())
      .then((gruposData) => {
        const idsDeGrupos = gruposData.map((grupo) => grupo.idGrupo);
        const urlGrupos = `https://mhqyglanvaunbxbmkvof.supabase.co/rest/v1/Chats?select=idChat,ultimoMensaje,fechaUltimoMensaje,idUsuario1(id,nombre,avatar),idUsuario2(id,nombre,avatar),esGrupo,idGrupo&esGrupo=eq.true&idGrupo=in.(${idsDeGrupos.join(",")})`;
        fetch(urlGrupos, options)
          .then((response) => response.json())
          .then((chatsData) => {
            console.log("Chats de grupo obtenidos:", chatsData);

            if (chatsData) {
              const filteredChats = chatsData.filter(
                (chat) => chat.esGrupo && idsDeGrupos.includes(chat.idGrupo)
              );

              //Fetch para obtener nombreGrupo y avatarGrupo
              const gruposIds = filteredChats.map((chat) => chat.idGrupo).join(",");
              const urlDetallesGrupos = `https://mhqyglanvaunbxbmkvof.supabase.co/rest/v1/Grupos?select=idGrupo,nombreGrupo,avatarGrupo&idGrupo=in.(${gruposIds})`;

              fetch(urlDetallesGrupos, options)
                .then((response) => response.json())
                .then((detallesGrupos) => {
                  const grupoDetailsMap = detallesGrupos.reduce((acc, grupo) => {
                    acc[grupo.idGrupo] = grupo;
                    return acc;
                  }, {});

                  //Añado nombre y avatar a los chats de grupo
                  const formattedGroupChats = filteredChats.map((chat) => {
                    const grupoDetails = grupoDetailsMap[chat.idGrupo];
                    // Formateo la fecha
                    const fechaFormateada = new Date(chat.fechaUltimoMensaje).getHours() + ":" + new Date(chat.fechaUltimoMensaje).getMinutes().toString().padStart(2, '0');
                    return {
                      id: chat.idChat,
                      lastMessage: chat.ultimoMensaje,
                      fecha: fechaFormateada,
                      user:
                        chat.idUsuario1?.id === miId
                          ? chat.idUsuario2
                          : chat.idUsuario1,
                      esGrupo: true, 
                      nombreGrupo: grupoDetails?.nombreGrupo,
                      avatarGrupo: grupoDetails?.avatarGrupo,
                    };
                  });

                  setGroupChats(formattedGroupChats);
                })
                .catch((error) => {
                  console.error("Error fetching detalles de grupos:", error);
                });
            } else {
              console.error(
                "La respuesta de chats de grupo no es un array:",
                chatsData
              );
            }
          })
          .catch((error) => console.error("Error fetching chats de grupo:", error));

        //Fetch para obtener los chats individuales
        const query ="or=(idUsuario1.eq." + miId + ",idUsuario2.eq." + miId +")";
        const urlChats = `https://mhqyglanvaunbxbmkvof.supabase.co/rest/v1/Chats?select=idChat,ultimoMensaje,fechaUltimoMensaje,idUsuario1(id,nombre,avatar),idUsuario2(id,nombre,avatar)&${query}`;

        fetch(urlChats, options)
          .then((response) => response.json())
          .then((data) => {
            console.log("Chats individuales obtenidos:", data);

            if (data) {
              const formattedChats = data.map((chat) => {
                // Formateo la fecha
                const fechaFormateada = new Date(chat.fechaUltimoMensaje).getHours() + ":" + new Date(chat.fechaUltimoMensaje).getMinutes().toString().padStart(2, '0');
                return{
                  id: chat.idChat,
                  lastMessage: chat.ultimoMensaje,
                  fecha: fechaFormateada,
                  user:
                    chat.idUsuario1.id === miId ? chat.idUsuario2 : chat.idUsuario1,
                  esGrupo: false,
                };
              });

              setChats(formattedChats);
            }
          })
          .catch((error) => console.error("Error fetching chats:", error));
      })
      .catch((error) => console.error("Error fetching grupos:", error));
  }, []);


  return (
    <div className="chat-list">
      <div className="barraBusqueda">
        <SearchIcon className="lupa" />
        <input
          type="text"
          placeholder="Buscar"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="inputBusqueda"
        />
      </div>
      {chatsFiltrados.map((chat) => (
        <div
          key={chat.id}
          className="chat-item"
          onClick={() => onSelectChat(chat)}
        >
          <div className="chat-container">
            {chat.user.avatar ? (
              <Avatar className="avatar" src={chat.user.avatar} alt={chat.user.nombre} />
            ) : (
              <Avatar className="avatar" >{chat.user.nombre.charAt(0).toUpperCase()}</Avatar>
            )}

            <div className="chat-info">
              <h4>{chat.user.nombre}</h4>
              <div className="lastMessage-container">
                <p>{chat.lastMessage}</p>
                <p>{chat.fecha}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      {chatsGruposFiltrados.map((chat) => (
        <div
          key={chat.id}
          className="chat-item"
          onClick={() => onSelectChat(chat)}
        >
          <div className="chat-container">
            {chat.avatarGrupo ? (
              <Avatar className="avatar" src={chat.avatarGrupo} alt={chat.nombreGrupo} />
            ) : (
              <Avatar className="avatar" >{chat.nombreGrupo.charAt(0).toUpperCase()}</Avatar>
            )}
          
            <div className="chat-info">
              <h4>{chat.nombreGrupo}</h4>
              <div className="lastMessage-container">
                <p>{chat.lastMessage}</p>
                <p>{chat.fecha}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
