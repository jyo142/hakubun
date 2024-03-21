import { useQuery } from "@tanstack/react-query";
import { WaniKaniAPI } from "../api/WaniKaniApi";
import {
  flattenCollectionOfOne,
  flattenData,
} from "../services/MiscService/MiscService";
import { StudyMaterial } from "../types/StudyMaterial";

export const useStudyMaterialsBySubjIDs = (
  subjIDs: number[],
  enabled: boolean = true,
  flattenCollection = true
) => {
  return useQuery({
    queryKey: ["study-materials-by-subj-ids", subjIDs],
    queryFn: () => WaniKaniAPI.getStudyMaterialsBySubjIDs(subjIDs),
    enabled: enabled && subjIDs.length !== 0,
    select: (data) => {
      if (data.data.length === 1 && flattenCollection) {
        return flattenCollectionOfOne(data) as StudyMaterial;
      }
      return flattenData(data);
    },
  });
};
