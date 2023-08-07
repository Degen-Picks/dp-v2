import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ConnectButton, MobileMenu, TwitterLoginButton } from "@/components";
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [winWidth] = useWindowSize();
  const isMobile = winWidth < 640;

  useEffect(() => {
    if (router.isReady) {
      setMounted(true);
    }
  }, [router.isReady]);

  if (!mounted) return null;

  return (
    <>
      <div className="bg-white lg:bg-transparent">
        <div
          className="relative flex justify-center sm:justify-between 
          py-4 max-w-[1600px] mx-auto px-4 sm:px-10"
        >
          <Link href="/">
            <Image
              src="/images/logo_new.png"
              width={isMobile ? 50 : 80}
              height={isMobile ? 50 : 80}
              alt="degen picks logo"
              priority
            />
          </Link>
          <div className="hidden sm:flex items-center gap-4 justify-end">
            <TwitterLoginButton />
            <ConnectButton />
          </div>
          {isMobile && (
            <div
              className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center"
              onClick={() => setOpen(true)}
            >
              <svg
                className="fill-black"
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 1C0 0.447715 0.447715 0 1 0H21C21.5523 0 22 0.447715 22 1C22 1.55228 21.5523 2 21 2H1C0.447715 2 0 1.55228 0 1ZM0 9C0 8.44772 0.447715 8 1 8H21C21.5523 8 22 8.44772 22 9C22 9.55229 21.5523 10 21 10H1C0.447715 10 0 9.55229 0 9ZM0 17C0 16.4477 0.447715 16 1 16H21C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H1C0.447715 18 0 17.5523 0 17Z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      {isMobile && <MobileMenu open={open} setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
