import {useState} from "react";
import {
    GptMessage,
    GptMessageImage,
    GptMessageSelectableImage,
    MyMessage,
    TextMessageBox,
    TypingLoader
} from "../../components";
import {ImageGenerationsUseCase, ImageGenerationsVariationUseCase} from "../../../core/use-cases";

interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        imageUrl: string,
        alt: string
    }
}

export const ImageTunningPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([{
        text: 'Imagen Base',
        isGpt: true,
        info: {
            imageUrl: 'http://localhost:3000/gpt/image-generation/1714591094661.png',
            alt: 'Imagen Base'
        }
    }])

    const [originalImageAndMask, setOriginalImageAndMask] = useState({
        original: undefined as String | undefined,
        mask: undefined as String | undefined
    })

    const handleVariation = async () => {
        setIsLoading(true);
        const resp = await ImageGenerationsVariationUseCase(originalImageAndMask!.original);
        setIsLoading(false)
        if (!resp) return
        setMessages((prev) => [
            ...prev,
            {
                text: 'Variacion',
                isGpt: true,
                info: {
                    imageUrl: resp.url,
                    alt: resp.alt
                }
            }
        ])
    }


    const handlePost = async (text: string) => {

        setIsLoading(true);
        setMessages((prev) => [...prev, {text: text, isGpt: false}]);
        const {original, mask} = originalImageAndMask;

        //TODO: UseCase
        const imageInfo = await ImageGenerationsUseCase(text, original, mask);

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
        <>
            {
                originalImageAndMask.original && (
                    <div className="fixed flex flex-col items-center top-0 right-10 z-10 fade-in">
                        <span>Editando</span>
                        <img className="border rounded-xl w-36 h-36 object-contain"
                             src={originalImageAndMask.mask ?? originalImageAndMask.original}
                             alt="Imagen original"/>
                        <button className="btn-primary mt-2" onClick={handleVariation}>Generar Variación</button>
                    </div>)
            }
            <div className="chat-container">
                <div className="chat-messages">
                    <div className="grid grid-cols-12 gap-y-2">
                        {/* Bienvenida */}
                        <GptMessage text="¿Que imagen deseas generar hoy?"/>

                        {
                            messages.map((message, index) => (
                                message.isGpt
                                    ? (
                                        <GptMessageSelectableImage key={index} text={message.text} alt={message.info!.alt}
                                                                   imagenUrl={message.info!.imageUrl}
                                                                   onImageSelected={(imageUrl) => setOriginalImageAndMask({
                                                                       original: message.info?.imageUrl,
                                                                       mask: imageUrl
                                                                   })}

                                        />
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
        </>
    );
}