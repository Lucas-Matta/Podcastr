// Document vai ficar por volta da aplicação tambem igual o App, porem
// ele seria chamado apenas uma vez, não importa quantas paginas vc navegue

import Document, { Html, Head, Main, NextScript } from 'next/document';

// Main, seria onde vai ficar a aplicação
// NextScript, seria os Script's que o NextJS precisa colocar na aplicação
export default class MyDocument extends Document {
    render(){
        return(
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
                    <link rel="shortcut icon" href="/favicon.png" type="image/png" />
                    <title>Podcastr</title>
                </Head>
                <body>

                </body>
                <Main />
                <NextScript />
            </Html>
        );
    };
};