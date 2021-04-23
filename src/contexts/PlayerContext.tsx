// O Arquivo dessa pagina vai ser feito para ter interação com os outros componentes
// das outras pagina da aplicação

import { createContext, useState, ReactNode, useContext } from 'react';


type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex;
    // Informção do Play/Pause
    isPlaying: boolean;
    isLooping: boolean;
    isShuffLing: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    toggleLooping: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number ) => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;

};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode; 
}

// Children, para conseguir passar elementos dentro do <PlayerContextProvider>
// PlayerContextProviderProps = Tipagem (TypeScript)
export function PlayerContextProvider( { children }: PlayerContextProviderProps){
 // Colocar em volta dos componentes que precisam ter acesso ao component PlayerContext
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffLing, setShuffLing] = useState(false);
  
    // Função para dar Play
    // Episode = TypeScript
    function play(episode: Episode){
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
    }
    
    // Passando a Lista de episodio, e o numero que esta tocando ( index )
    // setIsPlaying(true), para não começar pausado
    function playList(list: Episode[], index: number){
      setEpisodeList(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
    }

    // Troca o botão de Pause/Play
    function togglePlay() {
      setIsPlaying(!isPlaying)
    }

    function toggleLooping() {
      setIsLooping(!isLooping)
    }

    function toggleShuffle() {
      setShuffLing(!isShuffLing)
    }

    // Função para caso o audio ser tocado, trocar o botão de play/pause automaticamente
    function setPlayingState(state: boolean){
      setIsPlaying(state);
    }

    // Função para limpar o player
    function clearPlayerState(){
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext =  isShuffLing || (currentEpisodeIndex + 1) < episodeList.length

    // Função para tocar o proximo podcast
    function playNext(){
      if(isShuffLing){
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
        setCurrentEpisodeIndex(nextRandomEpisodeIndex)
      } else if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
    }

    // Função para voltar para o episode anterior
    function playPrevious(){
      if(hasPrevious){
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
      
    }
  
    return(
      <PlayerContext.Provider value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        playNext,
        playPrevious,
        togglePlay,
        toggleShuffle,
        toggleLooping,
        setPlayingState,
        hasNext,
        hasPrevious,
        isLooping,
        isPlaying,
        isShuffLing,
        clearPlayerState,
        }}>
        {children}
      </PlayerContext.Provider>
    )
}
// Constante para usar o useContext
export const usePlayer = () => {
  return useContext(PlayerContext);
}