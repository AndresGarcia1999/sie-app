import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLogout } from "store/userSlice";

const sections = [
  { title: "Inicio", url: "/" },
  { title: "Estudiantes", url: "/students" },
  { title: "Clases", url: "/classes" },
  { title: "Profes", url: "/tutors" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("Inicio");

  const onLogout = () => {
    // Elimina los datos de usuario de Redux
    dispatch(setLogout());
  };

  useEffect(() => {
    const section = pathname.split("/")[1];
    setCurrentSection(section);
  }, [pathname]);

  return (
    <>
      <nav className="flex items-center justify-between h-12 px-4 bg-blue-400">
        <div>
          <span className="sm:hidden">
            <i
              className="text-2xl text-white fas fa-bars"
              onClick={() => setIsOpen(!isOpen)}
            ></i>
          </span>

          <div className="hidden space-x-4 text-white sm:flex">
            <img src="SIE_logo.svg" alt="logo" height={32} width={32} />
            {sections.map((section) => (
              <Link
                key={section.title}
                className={`px-2 py-1 rounded ${
                  section.url === `/${currentSection}`
                    ? " bg-gray-200 bg-opacity-40"
                    : ""
                }`}
                href={section.url}
              >
                {section.title}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/">
          <img
            className="sm:hidden"
            src="SIE_logo.svg"
            alt="logo"
            height={32}
            width={32}
            color="white"
          />
        </Link>

        <div className="cursor-pointer" onClick={onLogout}>
          <i className="text-2xl text-white hover:text-red-600 fas fa-sign-out-alt "></i>
        </div>
      </nav>
      <aside
        className={` top-0 flex w-screen left-0 bg-gray-600 bg-opacity-40 fixed h-full  ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`z-30 w-3/5 h-full overflow-auto transition-all duration-300 ease-in-out transform bg-white ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col ">
            <div className="flex items-center p-2 space-x-2">
              <img src="SIE_logo.svg" alt="logo" height={32} width={32} />
              <p className="text-xl font-bold">SIE App</p>
            </div>
            {sections.map((section) => (
              <Link
                key={section.title}
                className={`px-4 py-2 ${
                  section.url === `/${currentSection}`
                    ? "font-semibold bg-blue-400 text-white "
                    : "text-black"
                }`}
                href={section.url}
              >
                {section.title}
              </Link>
            ))}
          </div>
        </div>
        <div onClick={() => setIsOpen(false)} className="w-2/5 h-full "></div>
      </aside>
    </>
  );
};

export default Navbar;
