import { useState, useEffect } from "react";
import {
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonButton,
  IonSpinner,
} from "@ionic/react";

import { useAuth } from "../contexts/AuthContext";
import { useReviews } from "../hooks/useReviews";
import { useLessons } from "../hooks/useLessons";

// !temp
import { ProgressBar } from "../components/ProgressBar";
import Testing from "../components/ImageFallback";
// !temp

import Header from "../components/Header";
import LessonsButton from "../components/LessonsButton";
import ReviewsButton from "../components/ReviewsButton";
import { RadicalContainer } from "../components/RadicalContainer";
import { KanjiContainer } from "../components/KanjiContainer";
import { Footer } from "../components/Footer";

const Home = () => {
  const [homeLoading, setHomeLoading] = useState(false);
  const [level, setLevel] = useState<number | undefined>();
  const [username, setUsername] = useState<string | undefined>("");

  const auth = useAuth();

  // TODO: change so loading displays until everything is loaded (including subjects)
  useEffect(() => {
    setHomeLoading(true);
    setUserDetails();
    setHomeLoading(false);
  }, [auth]);

  const removeAuth = () => {
    (auth as any).removeAuth();
  };

  const setUserDetails = () => {
    let username = auth.auth!.username;
    setUsername(username);

    let level = auth.auth!.level;
    setLevel(level);
  };

  const {
    isLoading: lessonsLoading,
    data: lessonData,
    error: lessonErr,
  } = useLessons(level);

  const {
    isLoading: availReviewsLoading,
    data: availReviewsData,
    error: availReviewsErr,
  } = useReviews(level);

  return (
    <>
      <Header username={username} level={level}></Header>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <LessonsButton numLessons={lessonData?.length}></LessonsButton>
            </IonCol>
            <IonCol>
              <ReviewsButton
                numReviews={availReviewsData?.length}
              ></ReviewsButton>
            </IonCol>
          </IonRow>
          <IonRow>
            {/* <IonCol> */}
            <ProgressBar level={level}></ProgressBar>
            {/* </IonCol> */}
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol>
              <RadicalContainer level={level}></RadicalContainer>
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol>
              <KanjiContainer level={level}></KanjiContainer>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                title="Remove authorization"
                onClick={() => removeAuth()}
              >
                Remove Auth
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        {homeLoading && <IonSpinner name="dots"></IonSpinner>}
      </IonContent>
      <Footer></Footer>
    </>
  );
};

export default Home;
