import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Song Logger",
  description: "Log and track your favourite songs",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={outfit.variable}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 relative selection:bg-violet-500/30">
        <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900"></div>
        {children}
      </body>
    </html>
  );
}
