// O App e um arquivo ( Global ) que vem do NextJS, que fica por volta de todas as nossas paginas
// NextJS tem um sistema de rotas proprio.

// Quando tiver um componente que sempre vai estar em todas as telas da aplicação
// Ele obrigatoriamente tem que estar dentro do App

import '../styles/global.scss';

import Header from '../components/Header';
import Player from '../components/Player';

import Styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';



function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvider>
    <div className={Styles.wrapper}>
        <main>
            <Header />
            <Component {...pageProps} />
        </main>
        <Player />
    </div>
    </PlayerContextProvider>
  )
}

export default MyApp
