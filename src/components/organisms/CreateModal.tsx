import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import {
  BackButton,
  Close,
  ForwardButton,
  LinkTwitterView,
  RunYourPoolView,
  StepCircle,
  TermsView,
} from "@/components";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";

interface ModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export enum CreateModalView {
  RunYourPool = "runyourpool",
  Terms = "terms",
  LinkTwitter = "linktwitter",
}

const RulesModal: FC<ModalProps> = ({ showModal, setShowModal }) => {
  const [modalView, setModalView] = useState(CreateModalView.RunYourPool);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => {
    setShowModal(false);
    setModalView(CreateModalView.RunYourPool);
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
              className="relative w-full sm:w-[90%] lg:w-2/3 xl:w-1/2 my-6 mx-auto max-w-2xl h-fit"
              ref={wrapperRef}
            >
              <div
                className="relative px-8 sm:px-20 pt-4 pb-12 border-0
                shadow-lg flex flex-col w-full bg-greyscale1"
              >
                {/* header */}
                <div className="w-full">
                  <button
                    className="absolute right-6 top-6"
                    onClick={() => {
                      setShowModal(false);
                      setModalView(CreateModalView.RunYourPool);
                    }}
                  >
                    <Close className="fill-black" />
                  </button>
                </div>
                {/* content body */}
                <RunYourPoolView modalView={modalView} />
                <TermsView modalView={modalView} />
                <LinkTwitterView modalView={modalView} />
                {/* footer */}
                <div className="absolute bottom-3 left-12">
                  {Object.values(CreateModalView).indexOf(modalView) !== 0 && (
                    <BackButton
                      text="Back"
                      handleClick={() =>
                        setModalView(
                          Object.values(CreateModalView)[
                            Object.values(CreateModalView).indexOf(modalView) -
                              1
                          ]
                        )
                      }
                    />
                  )}
                </div>
                <div className="absolute bottom-3 right-0">
                  {Object.values(CreateModalView).indexOf(modalView) !==
                    Object.values(CreateModalView).length - 1 && (
                    <ForwardButton
                      text="Next"
                      handleClick={() =>
                        setModalView(
                          Object.values(CreateModalView)[
                            Object.values(CreateModalView).indexOf(modalView) +
                              1
                          ]
                        )
                      }
                    />
                  )}
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <StepCircle
                    filled={modalView === CreateModalView.RunYourPool}
                    onClick={() => setModalView(CreateModalView.RunYourPool)}
                  />
                  <StepCircle
                    filled={modalView === CreateModalView.Terms}
                    onClick={() => setModalView(CreateModalView.Terms)}
                  />
                  <StepCircle
                    filled={modalView === CreateModalView.LinkTwitter}
                    onClick={() => setModalView(CreateModalView.LinkTwitter)}
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
