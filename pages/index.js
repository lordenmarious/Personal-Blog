import Calculator from '../components/Calculator';
import '../styles/Calculator.css';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="calculator-container">
        <h2 className="text-2xl font-bold mb-4">Hesap Makinesi</h2>
        <Calculator />
      </div>
    </main>
  );
} 