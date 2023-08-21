import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import {
  BackButton,
  Close,
  ForwardButton,
  HowItWorksView,
  LinkTwitterView,
  PlayResponsiblyView,
  StepCircle,
} from "@/components";
import Image from "next/image";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";

interface ModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export enum ModalView {
  HowItWorks = "howitworks",
  PlayResponsibly = "playresponsibly",
  LinkTwitter = "linktwitter",
}

const RulesModal: FC<ModalProps> = ({ showModal, setShowModal }) => {
  const [modalView, setModalView] = useState(ModalView.HowItWorks);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => {
    setShowModal(false);
    setModalView(ModalView.HowItWorks);
  });

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
              className="relative w-auto my-6 mx-auto max-w-4xl h-full sm:h-fit"
              ref={wrapperRef}
            >
              <div
                className="relative px-8 sm:px-20 pt-4 pb-12 border-0
                shadow-lg flex flex-col w-full bg-white"
              >
                {/* header */}
                <div className="w-full">
                  <button
                    className="absolute right-6 top-6"
                    onClick={() => {
                      setShowModal(false);
                      setModalView(ModalView.HowItWorks);
                    }}
                  >
                    <Close className="fill-black" />
                  </button>
                </div>
                {/* content body */}
                <HowItWorksView modalView={modalView} />
                <PlayResponsiblyView modalView={modalView} />
                <LinkTwitterView modalView={modalView} />
                {/* footer */}
                <div className="absolute bottom-3 left-12">
                  {Object.values(ModalView).indexOf(modalView) !== 0 && (
                    <BackButton
                      text="Back"
                      handleClick={() =>
                        setModalView(
                          Object.values(ModalView)[
                            Object.values(ModalView).indexOf(modalView) - 1
                          ]
                        )
                      }
                    />
                  )}
                </div>
                <div className="absolute bottom-3 right-0">
                  {Object.values(ModalView).indexOf(modalView) !==
                    Object.values(ModalView).length - 1 && (
                    <ForwardButton
                      text="Next"
                      handleClick={() =>
                        setModalView(
                          Object.values(ModalView)[
                            Object.values(ModalView).indexOf(modalView) + 1
                          ]
                        )
                      }
                    />
                  )}
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <StepCircle
                    filled={modalView === ModalView.HowItWorks}
                    onClick={() => setModalView(ModalView.HowItWorks)}
                  />
                  <StepCircle
                    filled={modalView === ModalView.PlayResponsibly}
                    onClick={() => setModalView(ModalView.PlayResponsibly)}
                  />
                  <StepCircle
                    filled={modalView === ModalView.LinkTwitter}
                    onClick={() => setModalView(ModalView.LinkTwitter)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}
    </>
  );
};

export default RulesModal;
