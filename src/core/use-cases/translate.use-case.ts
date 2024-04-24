import { TranslateResponse } from "../../interfaces/translate.response";




export const translateUseCase = async (prompt: string, lang: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, lang })
        });

        if (!resp.ok) throw new Error(' No se pudo realizar la correcion')
        const data = await resp.json() as TranslateResponse;
        return {
            ok: true,
            ...data
        }
    } catch (error) {
        return {
            ok: false,
            content: 'No se puede realizar la correccion'
        }
    }


}