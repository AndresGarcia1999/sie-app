import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "store/userSlice";

const sections = [
  { title: "Inicio", url: "/" },
  { title: "Estudiantes", url: "/students" },
  { title: "Clases", url: "/classes" },
  { title: "Profes", url: "/tutors" },
  { title: "Calculadora", url: "/calculator" },
  { title: "Calendario", url: "/calendar" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("/");
  const { user } = useSelector((state) => state.user);
  const [availableSections, setAvailableSections] = useState(sections);

  const onLogout = () => {
    dispatch(setLogout());
    redirect("/login");
  };

  useEffect(() => {
    const section = pathname === "/" ? "/" : `/${pathname.split("/")[1]}`;
    setCurrentSection(section);
  }, [pathname]);

  useEffect(() => {
    if (!user.is_admin) {
      const filteredSections = sections.filter(
        (section) => section.url !== "/tutors"
      );
      setAvailableSections(filteredSections);
    }
  }, [user]);

  return (
    <>
      <nav className="flex items-center justify-between h-12 px-4 bg-blue-400">
        <div className="flex items-center">
          <span className="sm:hidden">
            <i
              className="text-2xl text-white cursor-pointer fas fa-bars"
              onClick={() => setIsOpen(!isOpen)}
            ></i>
          </span>

          <div className="hidden space-x-4 text-white sm:flex">
            <img src="SIE_logo.svg" alt="logo" height={32} width={32} />
            {availableSections.map((section) => (
              <Link
                key={section.title}
                className={`px-2 py-1 rounded transition-colors ${
                  section.url === currentSection
                    ? "bg-gray-200 bg-opacity-40"
                    : "hover:bg-gray-200 hover:bg-opacity-20"
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
          />
        </Link>

        <div className="cursor-pointer" onClick={onLogout}>
          <i className="text-2xl text-white hover:text-red-600 fas fa-sign-out-alt"></i>
        </div>
      </nav>
      <aside
        className={`fixed top-0 left-0 w-screen h-full bg-gray-600 bg-opacity-40 z-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex w-full h-full">
          <div
            className={`z-30 w-3/5 h-full overflow-auto bg-white  transition-all duration-300 ease-in-out transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col p-4">
              <div className="flex items-center mb-4">
                <img src="SIE_logo.svg" alt="logo" height={32} width={32} />
                <p className="ml-2 text-xl font-bold">SIE App</p>
              </div>
              {availableSections.map((section) => (
                <Link
                  key={section.title}
                  className={`px-4 py-2 rounded transition-colors ${
                    section.url === currentSection
                      ? "font-semibold bg-blue-400 text-white"
                      : "text-black hover:bg-gray-200"
                  }`}
                  href={section.url}
                  onClick={() => setIsOpen(false)}
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="w-2/5 h-full" onClick={() => setIsOpen(false)}></div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
