

export const ProsConsStreamUseCase = async (prompt: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!resp.ok) throw new Error(' No se pudo realizar la correcion')

        const reader = resp.body?.getReader();
        if (!reader) {
            console.log('No se puede generar el reader')
            return null
        }
        /* const decoder = new TextDecoder();
         let text = '';
         while (true) {
             const { value, done } = await reader.read()
             if (done) {
                 break;
             }
             const decodedChunk = decoder.decode(value, { stream: true })
             text += decodedChunk;
 
         }*/
        return reader;

    } catch (error) {
        console.log(error);
        return null;
    }
}