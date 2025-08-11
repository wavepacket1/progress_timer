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
    const [showModal,setShowModal] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null); // 開始時刻
    const [pausedTime, setPausedTime] = useState(0); // 一時停止時の残り時間
    const audio = AudioManager.getInstance();

    const handleReset = () =>{
        setTime(0);
        setInitialBreakTime(0);
        setShowModal(false);
        setStartTime(null);
        setPausedTime(0);
    }

    useEffect(() => {
        // 初期化時に break_timer_running の値に応じて isRunning を設定
        if (break_timer_running){
            setIsRunning(true);
            setStartTime(Date.now());
            setPausedTime(break_time);
        }
    }, [break_timer_running]);

    useEffect(() => {
        const calculatedBreakTime = initial_break_time+Math.floor(studyTime / ratio);
        setTime(calculatedBreakTime); // タイマーの初期値を設定
      }, [studyTime, ratio]); // studyTime または ratio が変更されたときに再計算

    
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if( isRunning && startTime !== null ) {
            timer = setInterval(() => {
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - startTime) / 1000);
                const remainingTime = pausedTime - elapsedSeconds;
                setTime(remainingTime);
            },100); // 100msごとに更新して精度を上げる
        }
        return ()=> clearInterval(timer);
    },[isRunning,startTime,pausedTime]);

    useEffect(() => {
        if (break_time ===0 && isRunning){
            playAlertSound(); // 音を鳴らす
            document.body.style.backgroundColor = '#87CEEB';
        }
    },[break_time]);

    const handleStartStop = () => {
        if (!isRunning) {
            // 開始時
            setStartTime(Date.now());
            setPausedTime(break_time);
        } else {
            // 停止時
            setPausedTime(break_time); // 現在の残り時間を保持
            setStartTime(null);
        }
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
            <div className={styles.buttons_container}>
                <button className={`${styles.break_time_button} ${isRunning ? styles.stop_button : '' }` }
                        onClick={handleStartStop}
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>
                <button className={styles.reset_button} onClick={() => setShowModal(true)}>
                    Reset
                </button>
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <p>リセットしますか？</p>
                        <button className={styles.modal_button} onClick={handleReset}>はい</button>
                        <button className={styles.modal_button} onClick={()=> setShowModal(false)}>いいえ</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BreakTimer;