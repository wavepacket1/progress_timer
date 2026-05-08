'use client'
import React,{ useState,useCallback} from 'react';
import StudyTimer from './StudyTimer';
import BreakTimer from './BreakTimer';
import styles from './TimerController.module.css';


const TimerController: React.FC = () => {
    const [studyTime,setStudyTime] = useState(0);
    const [ratio,setRatio] = useState(2);
    const [isBreakTimerRunning,setBreakTimerRunning]=useState(false);
    const [isMuted,setIsMuted] = useState(false);
    const [isBreakAlert,setIsBreakAlert] = useState(false);

    const handleStudyTimeUpdate = useCallback((time: number) => {
        setStudyTime(time);
    }, []);

    const handleStop = () => {
        setBreakTimerRunning(!isBreakTimerRunning);
    };

    const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) =>{
        const newRatio = Number(e.target.value);
        setRatio(newRatio);
    };

    return (
        <div className={styles.container}>
            <div className={styles.timerSection}>
                <StudyTimer onTimeUpdate={handleStudyTimeUpdate} onStop={handleStop}/>
            </div>
            <div className={styles.timerSection}>
                <span className={styles.brand}>Progress Timer</span>
                <span className={styles.bar_sep} aria-hidden="true" />
                <label className={`${styles.label} ${styles.compact_label}`}>Ratio(Break/Study):</label>
                <select className={styles.select} value={ratio} onChange={handleChange}>
                    <option value={1}>1/1</option>
                    <option value={2}>1/2</option>
                    <option value={3}>1/3</option>
                    <option value={4}>1/4</option>
                    <option value={5}>1/5</option>
                </select>
                <button
                    className={`${styles.mute_btn} ${isMuted ? styles.muted : ''}`}
                    onClick={() => setIsMuted(m => !m)}
                >
                    {isMuted ? 'MUTED' : 'SOUND'}
                </button>
            </div>
            <div className={`${styles.timerSection} ${isBreakAlert ? styles.alert_active : ''}`}>
                <BreakTimer
                    studyTime={studyTime}
                    ratio={ratio}
                    break_timer_running={isBreakTimerRunning}
                    isMuted={isMuted}
                    onStop={handleStop}
                    onAlert={setIsBreakAlert}
                />
            </div>
        </div>
    );
};

export default TimerController;
