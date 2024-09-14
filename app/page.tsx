import TimerController from './components/TimerController';
import './globals.css';

export default function Home() {
  return (
    <div>
      <h1 className="large-heading">Progress Timer</h1>
      <TimerController />
    </div>
  );
}
