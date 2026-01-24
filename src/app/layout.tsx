import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/common/StoreProvider";
import AppThemeProvider from "@/components/common/AppThemeProvider";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AuthPersist from "@/components/common/AuthPersist";
import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SUST CSE - Department of Computer Science and Engineering",
  description: "Official website of the Department of CSE, Shahjalal University of Science and Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <StoreProvider>
          <AppThemeProvider>
            <AuthPersist>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  {children}
                </Box>
                <Footer />
              </Box>
              <Toaster position="top-center" reverseOrder={false} />
            </AuthPersist>
          </AppThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
