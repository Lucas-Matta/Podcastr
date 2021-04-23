// Consumindo API da forma tradicional SPA
// O SPA carrega pelo Browser as informação, no caso se desligar o JavaScript ele não funciona

//   useEffect(() => {
//    // fetch, esta pegando a API, e o .then esta convertendo para JSON
//    fetch('http://localhost:3333/episodes')
//    .then(response => response.json())
//  }, [])


// Consumindo API de forma tradicional SSR
// O SSR carrega a API pelo lado do servidor, pelo NextJS, porem cara vez que o usuario,
// for entrar ou recarregar a pagina, ele recarrega a API inteira novamente
// sendo desnecessario essa requisição se não tiver conteudo novos.

// Consumindo API de forma tradicional SSG
// O SSG deixa um HTML estatico para o usuario, fazendo atualização de hora em hora

// Esta seria a Tipagem da Função ( TypeScript )
import { GetStaticProps } from 'next';
import Image from 'next/image';
// Utilizado para sistema de rotas do NextJS, para ele não recarregar toda aplicação novamente do 0
import Link from 'next/link';
// parseISO, vai pegar uma data e converter para um Date do JavaScript
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';

import { api } from '../services/api';
import { usePlayer } from '../contexts/PlayerContext';



type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  duration: number,
  durationAsString: string,
  url: string,
  published_at: string,
  publishedAt: string
}

type HomeProps = {
  latesEpisodes: Episode[];
  allEpisodes: Episode[];
}

// Usar a o componente Image do NextJS para otimização da imagem e o Width e Height que vai ser carregado
// Para conseguir usar essa funcionalidade, tem que configurar onde esta hospedado as imagens usadas
// Para isso foi criado na Raiz do projeto o next.config.js
export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latesEpisodes, ...allEpisodes]


  return (
      <div className={styles.homepage}>
          <section className={styles.latesEpisodes}>
              <h2>Ultimos Lançamentos</h2>

              <ul>
                  {latesEpisodes.map((episode, index) => {
                    return(
                          <li key={episode.id}>
                              <Image width={192}
                                    height={192}
                                    objectFit="cover" 
                                    src={episode.thumbnail} 
                                    alt={episode.title} 
                               />

                              <div className={styles.episodeDetails}>
                                  <Link href={`/episodes/${episode.id}`}>
                                       <a>{episode.title}</a>
                                  </Link>
                                  <p>{episode.members}</p>
                                  <span>{episode.publishedAt}</span>
                                  <span>{episode.durationAsString}</span>
                              </div>

                              <button type="button" onClick={() => playList(episodeList, index)}>
                                <img src="/play-green.svg" alt="Tocar Episodio"/>
                              </button>
                          </li>
                    )
                  })}
              </ul>
          </section>

          <section className={styles.allEpisodes}>

              <h2>Todos os Episodios</h2>

              <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Podcast</th>
                      <th>Integrantes</th>
                      <th>Data</th>
                      <th>Duração</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                      {allEpisodes.map((episode, index) => {
                        return(
                          <tr key={episode.id}>
                              <td style={{width: 72}} >
                                <Image
                                  width={120}
                                  height={120}
                                  src={episode.thumbnail}
                                  alt={episode.title}
                                  objectFit={"cover"}
                                />
                              </td>
                              <td>
                                <Link href={`/episodes/${episode.id}`} >
                                  <a>{episode.title}</a>
                                </Link>
                              </td>
                              <td>{episode.members}</td>
                              <td style={{width: 100}} >{episode.publishedAt}</td>
                              <td>{episode.durationAsString}</td>
                              <td>
                                  <button type="button" onClick={
                                    () => playList(episodeList, index + latesEpisodes.length)} >
                                    <img src="/play-green.svg" alt="Tocar episodio" />
                                  </button>
                              </td>
                          </tr>
                        )
                      })}
                  </tbody>
              </table>

          </section>
      </div>
  );
};

// O NextJS entende por essa função, que ele precisa executar a mesma antes de exibir
// o conteudo da pagina para o usuario
// Colocando Tipagem no SSG
export const getStaticProps: GetStaticProps = async () => {
  // Utilizando Axios ( Parecido com o fetch )
  const { data } = await api.get('episodes', {
      params: {
        _limit: 12,
        _sort: 'publishjed_at',
        _order: 'desc'
      }
  })

  

  // NOTA IMPORTANTE!! 
  // SEMPRE FAZER AS FORMATAÇÕES NECESSARIAS ANTES DO RETURN!
  // Const utilizada para fazer as formatação necessarias do objeto Episodes antes de mostrar p/user
  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,

    };
  })

  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latesEpisodes,
      allEpisodes
    },

    // De quanto em quanto tempo a pagina vai atualizar ( SSG Static Server Generation )
    revalidate: 60 * 60 * 8,
  }
}