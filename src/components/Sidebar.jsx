import ChatList from "./ChatList";
/* eslint-disable react/prop-types */
function Sidebar({ onSelectChat, isOpen, onClose }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>
          <img src="chat.svg" width={20} /> Chats
        </h2>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <ChatList
        onSelectChat={(chat) => {
          onSelectChat(chat);
          onClose(); // Cerrar el sidebar al seleccionar un chat en pantallas pequeñas
        }}
      />
    </div>
  );
}

export default Sidebar;
