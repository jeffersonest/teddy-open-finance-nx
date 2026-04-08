import { Route, Routes } from 'react-router-dom';

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">
          Teddy Open Finance
        </h1>
        <p className="mt-2 text-slate-600">Clientes MVP</p>
      </div>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
