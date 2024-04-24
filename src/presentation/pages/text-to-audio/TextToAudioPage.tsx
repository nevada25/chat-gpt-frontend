
import { useState } from "react";
import { GptMessage, GptMessageAudio, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components";
import { TextToAudioUseCase, translateUseCase } from "../../../core/use-cases";

const displaimer = `## ¿Que audio quieres generar hoy?
* Todo el audio generado es por AI.
`

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text'
}
interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio'
}

type Message = TextMessage | AudioMessage
const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]
export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])
  const handlePost = async (text: string, selectedVoice: string) => {

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false, type: 'text' }]);

    const { ok, message, audioUrl } = await TextToAudioUseCase(text, selectedVoice)
    if (!ok) {
      setMessages((prev) => [...prev, { text: 'No se pudo realizar la traducción', isGpt: true, type: 'text' }]);
    } else {
      setMessages((prev) => [...prev, {
        text: `${selectedVoice}-${message}`, isGpt: true, type: "audio", audio: audioUrl!
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
          <GptMessage text={displaimer} />

          {
            messages.map((message: Message, index) => (
              message.isGpt
                ? (
                  message.type == 'text' ? <GptMessage key={index} text={message.text} /> :
                    <GptMessageAudio key={index} text={message.text} audio={message!.audio} />
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
        options={voices}
        onSendMessage={handlePost}
        placeholder='Escribe aquí lo que deseas'
        disableCorrections
      />

    </div>
  );
}