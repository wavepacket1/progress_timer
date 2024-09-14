import React, { useState, useEffect } from 'react';
import styles from './StudyTimer.module.css'; 
interface StudyTimerProps {
  onTimeUpdate: (time: number) => void; // 時間が更新されたときに呼び出されるコールバック
  onStop: () => void; // 新しく追加するコールバック
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onTimeUpdate,onStop }) => {
  const [time, setTime] = useState(0); // 時間（秒単位）
  const [isRunning, setIsRunning] = useState(false); // タイマーの実行状態


  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRunning) {
      timer = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onTimeUpdate(newTime); // 時間が更新されたときにコールバックを呼び出す
          return newTime;
        });
      }, 1000);
    } else {
        clearInterval(timer);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const handleStartStop = () => {
    if(isRunning) {
        onStop();
        setTime(0);
    }
    setIsRunning(prevState => !prevState);
  };

  return (
    <div>
      <h1 className={styles.study_timer}>Study Timer</h1>
      <h2 className={styles.study_time}>Study Time: {formatTime(time)}</h2>
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
