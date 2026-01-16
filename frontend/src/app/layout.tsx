import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Portal INPREMA",
  description: "Portal interno de servicios para afiliados",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-base-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
