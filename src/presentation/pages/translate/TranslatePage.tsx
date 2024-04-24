import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components";
import { translateUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}
interface Option {
  id: string;
  text: string;
}
const languages: Option[] = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])
  const handlePost = async (message: string, selectedOption: string) => {

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, isGpt: false }]);

    const { content, ok } = await translateUseCase(message, selectedOption)
    if (!ok) {
      setMessages((prev) => [...prev, { text: 'No se pudo realizar la traducción', isGpt: true }]);
    } else {
      setMessages((prev) => [...prev, {
        text: content, isGpt: true
      }]);
    }

    setIsLoading(false);

    // Todo: Añadir el mensaje de isGPT en true
   




  }
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Escribe la palabra a traducir!!" />

          {
            messages.map((message, index) => (
              message.isGpt
                ? (
                  <GptMessage key={index} text={message.text} />
                )
                : (
                  <MyMessage key={index} text={message.text} />
                )

            ))
          }


          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )
          }


        </div>
      </div>


      <TextMessageBoxSelect
        options={languages}
        onSendMessage={handlePost}
        placeholder='Escribe aquí lo que deseas'
        disableCorrections
      />

    </div>
  );
}