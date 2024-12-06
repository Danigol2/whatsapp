/* eslint-disable react/prop-types */
import Avatar from "@mui/material/Avatar";
function Message({ text, sender, fecha, avatar, senderName, isGroup }) {
  const fechaFormateada = new Date(fecha).getHours() + ":" + new Date(fecha).getMinutes().toString().padStart(2, '0');

  return (
    <div className={`message ${sender === "You" ? "outgoing" : "incoming"}`}>
      <div className="message-container">
        {isGroup && senderName && (
          <div className="sender-info">
            {avatar ? (
              <Avatar src={avatar} alt={senderName} />
            ) : (
              <Avatar>{senderName?.charAt(0).toUpperCase()}</Avatar>
            )}
            <span className="sender-name">{senderName}</span>
          </div>
        )}

        <div className="message-content">
          <p>{text}</p>
          <span className="fecha">{fechaFormateada}</span>
        </div>
      </div>
    </div>
  );
}

export default Message;
