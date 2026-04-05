import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Dashboard — coming soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
