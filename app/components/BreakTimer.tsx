'use client'
import React,{ useState,useEffect,useRef } from 'react';
import AudioManager from './AudioSingleton';
import styles from './BreakTimer.module.css';


interface BreakTimerProps {
    studyTime: number;
    ratio: number;
    break_timer_running: boolean;
    isMuted: boolean;
    onStop: () => void;
    onAlert: (alerting: boolean) => void;
}

const BreakTimer: React.FC<BreakTimerProps> = ({ studyTime,ratio,break_timer_running,isMuted,onStop,onAlert}) =>{
    const [initial_break_time,setInitialBreakTime] = useState(0);
    const [break_time,setTime] = useState(0);
    const [isRunning,setIsRunning] = useState(false);
    const [isPlaying,setIsPlaying] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [pausedTime, setPausedTime] = useState(0);
    const audio = AudioManager.getInstance();
    const alertFiredRef = useRef(false);

    const handleReset = () =>{
        setTime(0);
        setInitialBreakTime(0);
        setShowModal(false);
        setStartTime(null);
        setPausedTime(0);
        alertFiredRef.current = false;
        onAlert(false);
    }

    useEffect(() => {
        if (break_timer_running){
            setIsRunning(true);
            setStartTime(Date.now());
            setPausedTime(break_time);
        }
    }, [break_timer_running]);

    useEffect(() => {
        const calculatedBreakTime = initial_break_time+Math.floor(studyTime / ratio);
        setTime(calculatedBreakTime);
    }, [studyTime, ratio]);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if( isRunning && startTime !== null ) {
            timer = setInterval(() => {
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - startTime) / 1000);
                const remainingTime = pausedTime - elapsedSeconds;
                setTime(remainingTime);
            },100);
        }
        return ()=> clearInterval(timer);
    },[isRunning,startTime,pausedTime]);

    // Alert when break time runs out
    useEffect(() => {
        if (break_time <= 0 && isRunning) {
            if (!alertFiredRef.current) {
                if (!isMuted) {
                    audio.play().catch(() => {});
                    setIsPlaying(true);
                }
                alertFiredRef.current = true;
            }
            onAlert(true);
        }
    }, [break_time, isRunning]);

    // Stop audio immediately when muted mid-play
    useEffect(() => {
        if (isMuted && isPlaying) {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isMuted]);

    // Clear alert state when timer stops
    useEffect(() => {
        if (!isRunning) {
            alertFiredRef.current = false;
            onAlert(false);
        }
    }, [isRunning]);

    const handleStartStop = () => {
        if (!isRunning) {
            setStartTime(Date.now());
            setPausedTime(break_time);
        } else {
            setPausedTime(break_time);
            setStartTime(null);
        }
        setIsRunning(!isRunning);
        if(isPlaying){
            audio.pause();
            audio.currentTime = 0;
        }
        setIsPlaying(false);
        onStop();
        setInitialBreakTime(break_time);
    };

    const hours = Math.floor(Math.abs(break_time) / 3600);
    const minutes = Math.floor((Math.abs(break_time) % 3600) / 60);
    const seconds = Math.abs(break_time) % 60;

    const formatTime = (num: number) => String(num).padStart(2,'0');
    const formattedTime = `${break_time < 0 ? '-' : ''}${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

    const isAlert = isRunning && break_time <= 0;
    const timeClass = `${styles.break_time} ${isRunning && !isAlert ? styles.active : ''} ${isAlert ? styles.alert : ''}`;

    return (
        <div>
            <h1 className={styles.break_timer}>Break Timer</h1>
            <p className={styles.time_label}>Break Time</p>
            <p className={timeClass}>{formattedTime}</p>
            {isAlert && (
                <p className={styles.alert_label}>TIME'S UP</p>
            )}
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
