import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';

import Image from 'next/Image';

import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';



export default function Player(){
    // Para conseguir ter acesso ao um elemento Nativo no React, precisamos criar uma referencia
    // HTMLAudioElement --> TypeScript
    const audioRef = useRef <HTMLAudioElement> (null);
    const [progress, setProgress] = useState(0);

    const { episodeList,
            currentEpisodeIndex,
            isPlaying,
            isShuffLing,
            togglePlay,
            toggleLooping,
            toggleShuffle,
            setPlayingState,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            isLooping,
            clearPlayerState
        } = usePlayer();

    const episode = episodeList[currentEpisodeIndex]

    useEffect(() => {
        // current, seria o valor que esta armazenado dentro da referencia criada acima
       if(!audioRef.current){
           return;
       }

       if(audioRef.current){
           audioRef.current.play();
       }else{
           audioRef.current.pause();
       }

    }, [isPlaying])

    // Função utilizada para barra de progresso do audio
    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () =>  {
            setProgress(Math.floor(audioRef.current.currentTime))
        });
    }

    // Função para o usuario arrastar a barra de progresso
    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    // Função para tocar aleatorio
    function handleEpisodeEnded(){
        if(hasNext){
            playNext();
        } else {
            clearPlayerState()
        }
    }

    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando Agora" />
                <strong>Tocando Agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                   <Image width={592}
                          height={592}
                          src={episode.thumbnail}
                          objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                     <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }


            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        )} 
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                            
                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        // Caso o audio ser disparado sem ser clicado, trocar o btn
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        // Utilizado para barra de progresso do audio
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpisodeEnded}
                    />
                )}


                <div className={styles.buttons}>
                    <button type="button"
                            disabled={!episode || episodeList.length == 1}
                            onClick={toggleShuffle}
                            className={isShuffLing ? styles.ativado : ''}
                        >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar Anterior" />
                    </button>

                    <button type="button" 
                            className={styles.playButton} 
                            disabled={!episode}
                            onClick={togglePlay}
                            >
                        { isPlaying
                          ? <img src="/pause.svg" alt="Tocar" />
                          : <img src="/play.svg" alt="Tocar" />
                        }
                    </button>

                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar proxima" />
                    </button>

                    <button type="button"
                            disabled={!episode}
                            onClick={toggleLooping}
                            className={isLooping ? styles.ativado : ''}
                            >
                        <img src="/repeat.svg" alt="repetir" />
                    </button>

                </div>

            </footer>
        </div>
    );
};