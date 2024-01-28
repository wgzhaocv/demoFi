import "./App.css";
import CSSuperVisor from "./pages/CSSuperVisor/CSSupervisor";
import { Container } from "./components/ui/container";
import { CustomerReview } from "./pages/CSSuperVisor/CustomerReview";

function App() {
  return (
    <>
      <Container>
        <CSSuperVisor />
      </Container>
      <Container>
        <CustomerReview />
      </Container>
    </>
  );
}

export default App;
