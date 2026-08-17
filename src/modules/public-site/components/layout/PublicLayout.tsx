import "@/src/modules/public-site/styles/premium.css";
import { Footer } from "../footer/Footer";
import { Header } from "../navigation/Header";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="premium-theme min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
