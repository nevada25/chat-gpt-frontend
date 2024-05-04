import {useState} from "react";
import {GptMessage, MyMessage, TextMessageBox, TypingLoader} from "../../components";
import {ImageGenerationsUseCase} from "../../../core/use-cases";
import {GptMessageImage} from "../../components/chat-bubbles/GptMessageImage.tsx";

interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        imageUrl: string,
        alt: string
    }
}

export const ImageGenerationPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([])


    const handlePost = async (text: string) => {

        setIsLoading(true);
        setMessages((prev) => [...prev, {text: text, isGpt: false}]);

        //TODO: UseCase
        const imageInfo = await ImageGenerationsUseCase(text);

        setIsLoading(false);

        // Todo: Añadir el mensaje de isGPT en true
        if (!imageInfo) {
            return setMessages((prev) => [...prev, {text: 'No se pudo generar la imagen', isGpt: true}])
        }

        setMessages(prevState => [
            ...prevState,
            {
                text: text,
                isGpt: true,
                info: {
                    imageUrl: imageInfo.url,
                    alt: imageInfo.alt
                }
            }
        ])


    }


    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">
                    {/* Bienvenida */}
                    <GptMessage text="¿Que imagen deseas generar hoy?"/>

                    {
                        messages.map((message, index) => (
                            message.isGpt
                                ? (
                                    <GptMessageImage key={index} text={message.text} alt={message.info!.alt}
                                                     imagenUrl={message.info!.imageUrl}/>
                                )
                                : (
                                    <MyMessage key={index} text={message.text}/>
                                )

                        ))
                    }


                    {
                        isLoading && (
                            <div className="col-start-1 col-end-12 fade-in">
                                <TypingLoader/>
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
}