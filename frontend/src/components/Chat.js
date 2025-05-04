// Importação dos hooks e bibliotecas necessárias
import { useState } from "react";         // Hook do React para gerenciar estados locais
import axios from "axios";                // Biblioteca para realizar requisições HTTP
import styles from "../styles/chatStyles"; // Importa um objeto de estilos personalizados
import logo from '../assets/furia-logo.png'; // Logo da FURIA usada no cabeçalho

// Componente principal do chat
function Chat() {
  // Estado que armazena o texto digitado pelo usuário
  const [input, setInput] = useState("");

  // Estado que armazena todas as mensagens trocadas (do usuário e do bot)
  const [messages, setMessages] = useState([]);

  // Estado para controlar se o input está focado (para mudar estilo visual, por exemplo)
  const [isFocused, setIsFocused] = useState(false);

  // Função para enviar a mensagem do usuário e buscar a resposta do bot
  const handleSend = async () => {
    // Impede envio de mensagens vazias
    if (!input.trim()) return;

    // Adiciona a mensagem do usuário à lista de mensagens
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    // Limpa o campo de entrada
    setInput("");

    try {
      // Envia a mensagem para o backend e aguarda a resposta
      const response = await axios.post("http://localhost:8000/chat", {
        message: input,
      });

      // Adiciona a resposta do bot à lista de mensagens
      setMessages((prev) => [...prev, { from: "bot", text: response.data.reply }]);
    } catch (error) {
      // Em caso de erro, exibe mensagem de erro no chat
      console.error(error);
      setMessages((prev) => [...prev, { from: "bot", text: "Erro ao conectar com o servidor!" }]);
    }

    // Após uma pequena espera, faz o scroll automático para a última mensagem
    setTimeout(() => {
      const chatBox = document.querySelector("#chat-box");
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
  };

  return (
    <div style={styles.container}>
      {/* Título do chat com a logo da FURIA */}
      <h1 style={styles.title}>
        Chat FURIA
        <img
          src={logo}
          alt="FURIA Logo"
          style={{ height: "24px", marginLeft: "10px", verticalAlign: "center" }}
        />
      </h1>

      {/* Área de exibição do histórico de mensagens */}
      <div id="chat-box" style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.from === "user" ? styles.userMsg : styles.botMsg}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Área de entrada de texto e botão de envio */}
      <div style={styles.inputArea}>
        <input
          style={isFocused ? { ...styles.input, ...styles.inputFocused } : styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)} // Atualiza o estado a cada digitação
          placeholder="Digite sua mensagem..."
          onFocus={() => setIsFocused(true)}         // Altera o estado de foco ao entrar
          onBlur={() => setIsFocused(false)}         // Altera o estado de foco ao sair
          onKeyDown={(e) => {
            if (e.key === "Enter") {                 // Envia a mensagem ao pressionar Enter
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          style={styles.button}
          onClick={handleSend}
          // Efeitos visuais no botão ao passar o mouse
          onMouseEnter={(e) => e.target.style.background = styles.buttonHover.background}
          onMouseLeave={(e) => e.target.style.background = styles.button.background}
        >
          Enviar
        </button>
      </div>

      {/* Rodapé com links para redes sociais da FURIA */}
      <div style={styles.footer}>
        <a
          href="https://www.instagram.com/furiagg/"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
          onMouseEnter={(e) => e.target.style.color = "#e55a00"}
          onMouseLeave={(e) => e.target.style.color = "#ff6600"}
        >
          Instagram
        </a>
        <a
          href="https://www.youtube.com/channel/UCE4elIT7DqDv545IA71feHg"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
          onMouseEnter={(e) => e.target.style.color = "#e55a00"}
          onMouseLeave={(e) => e.target.style.color = "#ff6600"}
        >
          YouTube
        </a>
        <a
          href="https://x.com/FURIA"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
          onMouseEnter={(e) => e.target.style.color = "#e55a00"}
          onMouseLeave={(e) => e.target.style.color = "#ff6600"}
        >
          X (Twitter)
        </a>
      </div>
    </div>
  );
}

export default Chat;
