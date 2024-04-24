
import { useState } from 'react';
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { ProsConsUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}


export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])


  const handlePost = async (text: string) => {

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    const { content, ok } = await ProsConsUseCase(text)

    if (!ok) {
      setMessages((prev) => [...prev, { text: 'No se pudo realizar la corrección', isGpt: true }]);
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
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las comparaciones de los pros y contras de los datos que me brindas" />

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


      <TextMessageBox
        onSendMessage={handlePost}
        placeholder='Escribe aquí lo que deseas'
        disableCorrections
      />

    </div>
  );
};
