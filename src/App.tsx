import "./App.css";
import CSSuperVisor from "./pages/CSSuperVisor/CSSupervisor";
import { Container } from "./components/ui/container";
import { CustomerContextMenuProvider } from "./components/CustomContextMenu/MyContextMenu";

function App() {
  return (
    <CustomerContextMenuProvider>
      <Container>
        <CSSuperVisor />
      </Container>
    </CustomerContextMenuProvider>
  );
}

export default App;
