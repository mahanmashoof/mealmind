import { Anton, Lora, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";
import NavHeader from "./NavHeader";
import { ThemeProvider } from "@/lib/theme-context";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const lora = Lora({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${lora.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <NavHeader />
              <div className="flex-1">{children}</div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
