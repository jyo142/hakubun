import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence } from "framer-motion";
import { useModalContainer } from "../../hooks/useModalContainer";
import SvgIcon from "../SvgIcon/SvgIcon";
import CloseIcon from "../../images/close.svg?react";
import { Content, Overlay } from "./Modal.styles";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Modal({ open, onOpenChange, children }: Props) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

const ClosePrimitive = styled(DialogPrimitive.Close)`
  background-color: transparent;
  border-radius: 50%;

  &:focus-visible {
    outline: 2px solid var(--focus-color);
    outline-offset: 2px;
  }
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Title = styled(DialogPrimitive.Title)`
  margin: 10px 0;
  font-size: 1.5rem;
`;

const Description = styled(DialogPrimitive.Description)`
  margin: 10px 0 16px 0;
`;

const IconAndTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  word-break: break-word;
`;

const DELAY = 0.3;
type ContentRef = HTMLDivElement;

type ContentProps = {
  modalID: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  icon?: React.ReactNode;
};

export const ModalContent = forwardRef<ContentRef, ContentProps>(
  (
    { modalID, children, title, description, isOpen, icon, ...props },
    forwardedRef
  ) => {
    const { modalContainerRef } = useModalContainer(modalID, isOpen);

    return (
      <>
        <AnimatePresence>
          {isOpen && (
            <>
              <DialogPrimitive.Portal
                forceMount
                container={modalContainerRef.current}
              >
                <DialogPrimitive.Overlay asChild>
                  <Overlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: DELAY } }}
                    exit={{ opacity: 0 }}
                  />
                </DialogPrimitive.Overlay>
                <DialogPrimitive.Content
                  {...props}
                  ref={forwardedRef}
                  forceMount
                  asChild
                >
                  <Content
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <TitleBar>
                      <IconAndTitleContainer>
                        {icon && (
                          <SvgIcon icon={icon} width="1.75em" height="1.75em" />
                        )}
                        <Title>{title}</Title>
                      </IconAndTitleContainer>
                      <ClosePrimitive aria-label="Close">
                        <SvgIcon
                          icon={<CloseIcon />}
                          width="2em"
                          height="2em"
                        />
                      </ClosePrimitive>
                    </TitleBar>
                    {description && <Description>{description}</Description>}
                    {children}
                  </Content>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }
);

Modal.Trigger = DialogPrimitive.Trigger;
Modal.Close = DialogPrimitive.Close;
Modal.Content = ModalContent;

export default Modal;
