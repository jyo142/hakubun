import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// TODO: change so not relying on IonIcon
import { IonIcon } from "@ionic/react";
import { useUserAuth } from "../contexts/AuthContext";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";
import AnimatedPage from "../components/AnimatedPage";
import HelpSpan from "../components/HelpSpan";
import FallingText from "../components/FallingText";
import WavesBgImg from "../images/layered-waves-bg.svg";
import {
  FixedCenterContainer,
  MainContent,
} from "../styles/BaseStyledComponents";
import LogoIcon from "../images/logo.svg";
import styled from "styled-components";

const Content = styled(MainContent)`
  padding: 5px 15px;
`;

const TokenInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Input = styled.input`
  max-width: 400px;
  background-color: white;
  color: black;
`;

const SubmitButton = styled(Button)`
  padding: 10px;
  border-radius: 12px;
  font-size: 1rem;
  margin-top: 10px;
`;

const Form = styled.form`
  /* background-color: var(--light-greyish-purple);
  padding: 16px 12px;
  border-radius: 10px; */
`;

const InputContainer = styled.div`
  background-color: var(--light-greyish-purple);
  padding: 16px 12px;
  border-radius: 10px;
`;

const HelpContentParagraph = styled.p`
  margin: 0;
  font-size: 1rem;
`;

// TODO: display error icon
const ErrorTxt = styled.p`
  margin-bottom: 0;
`;

const HeadingAndLogoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  gap: 10px 10px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Logo = styled(IonIcon)`
  width: 60%;
  height: 25vh;
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TokenInput = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const auth = useUserAuth();

  useEffect(() => {
    if (auth) {
      setLoading(false);
    }
  }, [auth.isAuthenticated]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const fd = new FormData(event.target);

    const apiToken = fd.get("api-token");
    if (apiToken === "") {
      // TODO: show a toast
      console.log("Hey, you need to enter a token!");
    }
    if (apiToken) {
      setAuth(apiToken.toString());
    }
  };

  const setAuth = async (token: string) => {
    let success = await auth.login(token);

    if (success) {
      console.log("Successfully logged in!");
      setHasError(false);
      navigate("/", { replace: true });
    } else {
      setHasError(true);
    }

    setIsAuthLoading(false);
  };

  const HelpPopoverContents = (
    <HelpContentParagraph>
      You can find this on your{" "}
      <a
        href="https://www.wanikani.com/settings/personal_access_tokens"
        target="_blank"
      >
        API tokens page
      </a>
      , make sure to allow all permissions
    </HelpContentParagraph>
  );

  return (
    <AnimatedPage bgImage={WavesBgImg}>
      {!loading ? (
        <>
          <Content>
            <HeadingAndLogoContainer>
              <LogoContainer>
                <Logo src={LogoIcon} />
              </LogoContainer>
              <FallingText text="Hakubun" delay={0.5} duration={0.25} />
            </HeadingAndLogoContainer>
            <p>
              A <em>(third-party)</em> Japanese Study App for Wanikani
            </p>
            <Form onSubmit={handleSubmit}>
              <InputContainer>
                <TokenInputLabel>
                  <HelpSpan helpPopoverContents={HelpPopoverContents}>
                    Wanikani API Token
                  </HelpSpan>
                  <Input type="text" name="api-token" data-private />
                </TokenInputLabel>
                {hasError && (
                  <ErrorTxt>
                    Oh no! An error occurred retrieving your info, please make
                    sure your API token is correct
                  </ErrorTxt>
                )}
              </InputContainer>
              <ButtonRow>
                <SubmitButton
                  type="submit"
                  backgroundColor="var(--ion-color-tertiary)"
                  color="black"
                  style={{ fontSize: "1.25rem" }}
                >
                  Let's Study!
                </SubmitButton>
              </ButtonRow>
            </Form>

            {isAuthLoading && (
              <FixedCenterContainer>
                <LoadingDots />
              </FixedCenterContainer>
            )}
          </Content>
        </>
      ) : (
        <FixedCenterContainer>
          <LoadingDots />
        </FixedCenterContainer>
      )}
    </AnimatedPage>
  );
};

export default TokenInput;
