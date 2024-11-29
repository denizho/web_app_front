import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";

export default function App(props) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
}
