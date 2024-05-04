import {useEffect, useState} from 'react';
import {GptMessage, MyMessage, TypingLoader, TextMessageBox} from '../../components';
import {createThreadUseCase, PostQuestionUseCase} from "../../../core/use-cases";

interface Message {
    text: string;
    isGpt: boolean;
    info?: any;
}


export const AssistantPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState<string>();
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const threadId = localStorage.getItem('threadId');
        if (threadId) {
            setThreadId(threadId)
            console.log('if')
        } else {
            console.log('else')
            createThreadUseCase().then(id => {
                setThreadId(id);
                localStorage.setItem('threadId', id)
            })
        }
    }, [])
    useEffect(() => {
        if (threadId) {
            setMessages((prev) => [
                ...prev,
                {
                    text: `Numero de thread ${threadId}`,
                    isGpt: true
                }
            ])
        }
    }, [threadId])


    const handlePost = async (text: string) => {

        if (!threadId) return
        setIsLoading(true);
        setMessages((prev) => [...prev, {text: text, isGpt: false}]);

        //TODO: UseCase
        const replies = await PostQuestionUseCase(threadId, text)
        setIsLoading(false);

        // Todo: Añadir el mensaje de isGPT en true
        for (const reply of replies) {
            for (const message of reply.content) {
                setMessages((prev) => [
                    ...prev,
                    {
                        text: message,
                        isGpt: (reply.role === 'assistant'),
                        info: reply
                    }]);
            }
        }


    }


    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">
                    {/* Bienvenida */}
                    <GptMessage text="Buen dia soy sam, en que puedo ayudarte?"/>

                    {
                        messages.map((message, index) => (
                            message.isGpt
                                ? (
                                    <GptMessage key={index} text={message.text}/>
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
};
