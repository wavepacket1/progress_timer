import React, { useState, useEffect } from 'react';
import styles from './StudyTimer.module.css'; 
interface StudyTimerProps {
  onTimeUpdate: (time: number) => void; // 時間が更新されたときに呼び出されるコールバック
  onStop: () => void; // 新しく追加するコールバック
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onTimeUpdate,onStop }) => {
  const [time, setTime] = useState(0); // 時間（秒単位）
  const [isRunning, setIsRunning] = useState(false); // タイマーの実行状態
  const [startTime, setStartTime] = useState<number | null>(null); // 開始時刻
  const [pausedTime, setPausedTime] = useState(0); // 一時停止時の累積時間


  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRunning && startTime !== null) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000) + pausedTime;
        setTime(elapsedSeconds);
        onTimeUpdate(elapsedSeconds);
      }, 100); // 100msごとに更新して精度を上げる
    } else {
        clearInterval(timer);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, startTime, pausedTime, onTimeUpdate]);

  const handleStartStop = () => {
    if(isRunning) {
        // 停止時
        setPausedTime(0);
        setStartTime(null);
        onStop();
        setTime(0);
    } else {
        // 開始時
        setStartTime(Date.now());
        setPausedTime(time); // 現在の時間を保持（再開時用）
    }
    setIsRunning(prevState => !prevState);
  };

  return (
    <div>
      <h1 className={styles.study_timer}>Study Timer</h1>
      <p className={styles.time_label}>Study Time</p>
      <p className={`${styles.study_time} ${isRunning ? styles.active : ''}`}>{formatTime(time)}</p>
      <button className={`${styles.study_time_button} ${isRunning ? styles.stop_button : ''}`} 
              onClick={handleStartStop}
              >
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

// 時間を「HH:MM:SS」形式にフォーマットする関数
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map(value => String(value).padStart(2, '0'))
    .join(':');
}

export default StudyTimer;
