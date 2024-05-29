"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "components/layout/Navbar";

export const AuthProvider = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      {isLoggedIn && <Navbar />}
      <div className="px-2 py-2 md:px-4 lg:px-6 xl:px-10 md:py-4">
        {children}
      </div>
    </>
  );
};
