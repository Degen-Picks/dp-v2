import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Close } from "@/components";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";

interface ModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  width?: string;
}

const InfoModal: FC<ModalProps> = ({
  showModal,
  setShowModal,
  children,
  width,
}) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => {
    setShowModal(false);
  });

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden 
            fixed inset-0 top-4 bottom-4 sm:top-0 sm:bottom-0 z-50 outline-none 
            focus:outline-none mx-4"
          >
            <div
              className={`relative ${
                width ? width : "w-full sm:w-[90%] lg:w-2/3 xl:w-1/2"
              }  
              my-6 mx-auto max-w-[620px] h-fit`}
              ref={wrapperRef}
            >
              <div
                className="relative py-5 border border-white rounded-[30px]
                shadow-lg flex flex-col w-full bg-black"
              >
                {/* header */}
                <div className="w-full">
                  <button
                    className="absolute right-6 top-6"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    <Close />
                  </button>
                </div>
                {/* content body */}
                {children}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}
    </>
  );
};

export default InfoModal;
