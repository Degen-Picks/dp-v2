import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ConnectButton, TwitterLoginButton } from "@/components";
import Link from "next/link";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setMounted(true);
    }
  }, [router.isReady]);

  if (!mounted) return null;

  return (
    <div className="bg-white lg:bg-transparent">
      <div className="flex justify-between py-4 max-w-[1600px] mx-auto px-4 sm:px-10">
        <Link href="/">
          <Image
            src="/images/logo_new.png"
            width={80}
            height={80}
            alt="degen picks logo"
            priority
          />
        </Link>
        <div className="flex items-center gap-4 justify-end">
          <TwitterLoginButton />
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
