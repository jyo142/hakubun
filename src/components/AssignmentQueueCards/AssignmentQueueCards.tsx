import { useEffect } from "react";
import { useAssignmentQueueStore } from "../../stores/useAssignmentQueueStore";
import { AssignmentQueueItem } from "../../types/AssignmentQueueTypes";
import { AssignmentQueueCard } from "./AssignmentQueueCard";
import { AssignmentCardContainer } from "./AssignmentQueueCardsStyled";
import LoadingDots from "../LoadingDots";
import { FixedCenterContainer } from "../../styles/BaseStyledComponents";
import { useAssignmentQueue } from "./AssignmentQueueCards.hooks";

type Props = {
  submitItems: (reviewData: AssignmentQueueItem[]) => void;
};

function AssignmentQueueCards({ submitItems }: Props) {
  const { handleNextCard, handleRetryCard } = useAssignmentQueue();
  const assignmentQueue = useAssignmentQueueStore.use.assignmentQueue();
  let currQueueIndex = useAssignmentQueueStore.use.currQueueIndex();

  useEffect(() => {
    if (
      currQueueIndex === assignmentQueue.length &&
      assignmentQueue.length !== 0
    ) {
      submitItems(assignmentQueue);
    }
  }, [assignmentQueue[currQueueIndex]]);

  return (
    <>
      {assignmentQueue.length === 0 ||
      currQueueIndex === assignmentQueue.length ? (
        <FixedCenterContainer>
          <LoadingDots />
        </FixedCenterContainer>
      ) : (
        <AssignmentCardContainer>
          <AssignmentQueueCard
            currentReviewItem={assignmentQueue[currQueueIndex]}
            handleNextCard={handleNextCard}
            handleRetryCard={handleRetryCard}
          />
        </AssignmentCardContainer>
      )}
    </>
  );
}

export default AssignmentQueueCards;
