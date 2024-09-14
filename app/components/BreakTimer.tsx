import { on } from 'events';
import React,{ useState,useEffect } from 'react';
import AudioManager from './AudioSingleton';
import styles from './BreakTimer.module.css';


interface BreakTimerProps {
    studyTime: number;
    ratio: number;
    break_timer_running: boolean;
    onStop: () => void;
}

const BreakTimer: React.FC<BreakTimerProps> = ({ studyTime,ratio,break_timer_running,onStop}) =>{
    const [initial_break_time,setInitialBreakTime] = useState(0);
    const [break_time,setTime] = useState(0);
    const [isRunning,setIsRunning] = useState(false);
    const [isPlaying,setIsPlaying] = useState(false);
    const [ActiveBackgroundFlag,setActiveBackgroundFlag] = useState(false);
    const audio = AudioManager.getInstance();

    useEffect(() => {
        // 初期化時に break_timer_running の値に応じて isRunning を設定
        if (break_timer_running){
            setIsRunning(true);
        }
    }, [break_timer_running]);

    useEffect(() => {
        const calculatedBreakTime = initial_break_time+Math.floor(studyTime / ratio);
        setTime(calculatedBreakTime); // タイマーの初期値を設定
      }, [studyTime, ratio]); // studyTime または ratio が変更されたときに再計算

    
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if( isRunning ) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            },1000);
        }
        return ()=> clearInterval(timer);
    },[isRunning,break_timer_running]);

    useEffect(() => {
        if (break_time ===0 && isRunning){
            playAlertSound(); // 音を鳴らす
            document.body.style.backgroundColor = '#87CEEB';
        }
    },[break_time]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
        if(isPlaying){
            audio.pause();
            audio.currentTime = 0;
        }
        document.body.style.backgroundColor = '';
        setIsPlaying(false);
        onStop();
        setInitialBreakTime(break_time);
    };

    const playAlertSound = () => {
        audio.play();
        setIsPlaying(true);
      };
      

    // 時間、分、秒を表示する
    const hours = Math.floor(Math.abs(break_time) / 3600);
    const minutes = Math.floor((Math.abs(break_time) % 3600) / 60);
    const seconds = Math.abs(break_time) % 60;

    const formatTime = (num: number) => String(num).padStart(2,'0');
    const formattedTime = `${break_time < 0 ? '-' : ''}${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    return (
        <div>
            <h1 className={styles.break_timer}>Break Timer</h1>
            <p className={styles.break_time}>
                Break Time: {formattedTime}
            </p>
            <button className={`${styles.break_time_button} ${isRunning ? styles.stop_button : '' }` }
                    onClick={handleStartStop}
            >
                {isRunning ? 'Stop' : 'Start'}
            </button>
        </div>
    );
};

export default BreakTimer;