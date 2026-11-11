import { useEffect, useState } from "react";

interface HomePageProps {
    onFinished: () => void;
}

const introPages = [
    "Durante cuarenta años, tu padre gobernó Astaria.",
    "Bajo su reinado se levantaron ciudades, se abrieron rutas comerciales y los campos dieron cosechas abundantes. Hubo guerras, hambrunas y tiempos difíciles, pero el reino resistió.",
    "Ahora, las campanas de la capital doblan en señal de luto.",
    "Tu padre ha muerto.",
    "Durante nueve días, nobles, sacerdotes y campesinos han acudido a presentar sus respetos. Las banderas ondean a media asta. Las calles permanecen en silencio. Todo Astaria espera.",
    "Hoy, ante la corte reunida, recibes la Corona de las Estrellas, símbolo de la autoridad de los reyes de Astaria desde tiempos inmemoriales.",
    "No eres recordado todavía por grandes victorias.",
    "No has dirigido ejércitos.",
    "No has firmado tratados.",
    "No has gobernado un solo día.",
    "Sin embargo, desde este momento, el destino del reino descansa sobre tus hombros.",
    "Tus decisiones determinarán si Astaria prospera o cae en la ruina.",
    "Los nobles observarán cada uno de tus movimientos.",
    "El pueblo juzgará tus actos.",
    "Tus aliados pondrán a prueba tu palabra.",
    "Y tus enemigos aguardarán el menor signo de debilidad.",
    "Gobernarás todo un reino. Algunas decisiones traerán prosperidad. Otras traerán consecuencias que no descubrirás hasta muchos días después.",
    "Tu reinado aún no ha sido escrito. La pluma está en tus manos.",
    "Larga vida al rey."
]

export function IntroPage({onFinished}: HomePageProps) {
    const [page, setPage] = useState(0);

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                setPage((page) => {
                    if (page < introPages.length - 1) {
                        return page + 1;
                    }
                    onFinished();
                    return page;
                });
            }
        }

        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    return (
        <>
            <p>{introPages[page]}</p>
            <small>Pulsa ESPACIO para continuar</small>
        </>
    );
}
