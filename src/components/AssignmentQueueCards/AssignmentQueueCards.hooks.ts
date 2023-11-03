import {
  calculateSRSLevel,
  checkIfReviewIsComplete,
  isUserAnswerCorrect,
  playAudioForAssignmentQueueItem,
} from "../../services/AssignmentQueueService";
import {
  capitalizeWord,
  getAudioForReading,
  getSrsNameBySrsLvl,
} from "../../services/MiscService";
import useQueueStoreFacade from "../../stores/useQueueStore/useQueueStore.facade";
import useUserSettingsStoreFacade from "../../stores/useUserSettingsStore/useUserSettingsStore.facade";
import useAssignmentQueueStoreFacade from "../../stores/useAssignmentQueueStore/useAssignmentQueueStore.facade";
import { AssignmentQueueItem } from "../../types/AssignmentQueueTypes";

export const useAssignmentQueue = () => {
  const {
    showPopoverMsg,
    correctShowResult,
    correctMoveToNext,
    wrongMoveToNext,
    wrongShowResult,
    isSubmittingAnswer,
    submitChoice,
    retryReview,
  } = useQueueStoreFacade();

  const {
    assignmentQueue,
    updateQueueItem,
    incrementCurrQueueIndex,
    addToAssignmentQueue,
    removeOldQueueItem,
  } = useAssignmentQueueStoreFacade();
  const { pronunciationVoice } = useUserSettingsStoreFacade();

  const displaySRSStatus = (reviewItem: AssignmentQueueItem) => {
    let endingSRS = reviewItem.ending_srs_stage!;

    let hasIncreased = endingSRS > reviewItem.srs_stage;
    let endingSRSName = capitalizeWord(getSrsNameBySrsLvl(endingSRS));

    // TODO: change to use more specific types that display up or down arrows based on correct/incorrect
    let popoverToDisplay = hasIncreased
      ? ({
          message: `Increasing to ${endingSRSName}...`,
          messageType: "correct",
        } as const)
      : ({
          message: `Decreasing to ${endingSRSName}...`,
          messageType: "incorrect",
        } as const);

    showPopoverMsg(popoverToDisplay);
  };

  // TODO: clean up this logic
  const playAudioIfReadingAndAvailable = (
    assignmentQueueItem: AssignmentQueueItem,
    userAnswer: string
  ) => {
    if (
      (assignmentQueueItem.review_type === "reading" &&
        assignmentQueueItem.object === "vocabulary") ||
      (assignmentQueueItem.object === "kana_vocabulary" &&
        assignmentQueueItem.pronunciation_audios !== undefined)
    ) {
      const primaryReadingMap: { [index: string]: string | undefined } = {
        vocabulary: assignmentQueueItem.readings?.find(
          (reading: any) => reading.primary === true
        )?.reading,
        kana_vocabulary: assignmentQueueItem.characters || undefined,
      };

      let primaryReading =
        primaryReadingMap[assignmentQueueItem.object as string];

      let userAnswerReadingOrPrimaryFallback = getAudioForReading(
        assignmentQueueItem.pronunciation_audios!,
        userAnswer,
        pronunciationVoice,
        primaryReading
      );

      playAudioForAssignmentQueueItem(userAnswerReadingOrPrimaryFallback);
    }
  };

  const handleCorrectAnswer = (
    currReviewItem: AssignmentQueueItem,
    setUserAnswer: (value: string) => void,
    moveToNextItem: boolean,
    userAnswer: string
  ) => {
    if (moveToNextItem) {
      correctMoveToNext();

      incrementCurrQueueIndex();
      setUserAnswer("");
    } else {
      correctonFirstSubmit(currReviewItem, userAnswer);
    }
  };

  const handleWrongAnswer = (
    currReviewItem: AssignmentQueueItem,
    setUserAnswer: (value: string) => void,
    moveToNextItem: boolean
  ) => {
    let updatedReviewItem = currReviewItem;

    if (moveToNextItem) {
      addToAssignmentQueue(updatedReviewItem);
      removeOldQueueItem();
      wrongMoveToNext();
      setUserAnswer("");
    } else {
      showPopoverMsg({ message: "INCORRECT", messageType: "incorrect" });
      updatedReviewItem.is_correct_answer = false;
      updatedReviewItem.is_reviewed = false;

      updatedReviewItem.review_type === "reading"
        ? (updatedReviewItem.incorrect_reading_answers += 1)
        : (updatedReviewItem.incorrect_meaning_answers += 1);

      updateQueueItem(updatedReviewItem);
      wrongShowResult();
    }
  };

  const correctonFirstSubmit = (
    currReviewItem: AssignmentQueueItem,
    userAnswer: string
  ) => {
    playAudioIfReadingAndAvailable(currReviewItem, userAnswer);

    let isReviewItemComplete = checkIfReviewIsComplete(
      currReviewItem,
      assignmentQueue
    );

    let updatedReviewItem = currReviewItem;
    showPopoverMsg({ message: "CORRECT", messageType: "correct" });

    if (isReviewItemComplete) {
      updatedReviewItem = calculateSRSLevel(assignmentQueue, updatedReviewItem);

      displaySRSStatus(updatedReviewItem);
    }

    let wasWrongFirstAttempt = updatedReviewItem.is_reviewed;
    if (wasWrongFirstAttempt) {
      // keeping answer as incorrect and is_reviewed as true
      updatedReviewItem.is_reviewed = true;

      updateQueueItem(updatedReviewItem);
    }

    // user got answer correct first try
    else {
      updatedReviewItem.is_correct_answer = true;
      updatedReviewItem.is_reviewed = true;
      updateQueueItem(updatedReviewItem);
    }

    correctShowResult();
  };

  const handleNextCard = (
    currReviewItem: AssignmentQueueItem,
    userAnswer: string,
    setUserAnswer: (value: string) => void
  ) => {
    let isCorrectAnswer = isUserAnswerCorrect(currReviewItem, userAnswer);

    let moveToNextItem = isSubmittingAnswer;
    isCorrectAnswer
      ? handleCorrectAnswer(
          currReviewItem,
          setUserAnswer,
          moveToNextItem,
          userAnswer
        )
      : handleWrongAnswer(currReviewItem, setUserAnswer, moveToNextItem);

    submitChoice();
  };

  const handleRetryCard = (
    currReviewItem: AssignmentQueueItem,
    userAnswer: string,
    setUserAnswer: (value: string) => void
  ) => {
    // if the current answer is correct, we don't wanna mess with the number of incorrect answers (could have been marked wrong previously)
    let isCorrectAnswer = isUserAnswerCorrect(currReviewItem, userAnswer);
    if (isCorrectAnswer) {
      setUserAnswer("");
      retryReview();
      return;
    }

    let updatedReviewItem = currReviewItem;
    updatedReviewItem.is_correct_answer = null;
    updatedReviewItem.is_reviewed = false;

    // undoing the increment previously done, but not allowing it to go below 0
    if (updatedReviewItem.review_type === "reading") {
      updatedReviewItem.incorrect_reading_answers > 0
        ? (updatedReviewItem.incorrect_reading_answers -= 1)
        : updatedReviewItem.incorrect_reading_answers;
    } else {
      updatedReviewItem.incorrect_meaning_answers > 0
        ? (updatedReviewItem.incorrect_meaning_answers -= 1)
        : updatedReviewItem.incorrect_meaning_answers;
    }

    updateQueueItem(updatedReviewItem);
    setUserAnswer("");
    retryReview();
  };

  return { handleNextCard, handleRetryCard };
};
