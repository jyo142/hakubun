import {
  LessonsPresentationOrder,
  ReviewsPresentationOrder,
  SubscriptionType,
} from "../../../types/UserTypes";

export const mockUserLvl1 = {
  object: "user",
  url: "https://api.wanikani.com/v2/user",
  data_updated_at: new Date("2018-04-06T14:26:53.022245Z"),
  data: {
    id: "5a6a5234-a392-4a87-8f3f-33342afe8a42",
    username: "test_user_lvl_1",
    level: 1,
    profile_url: "https://www.wanikani.com/users/test_user_lvl_1",
    started_at: new Date("2012-05-11T00:52:18.958466Z"),
    current_vacation_started_at: null,
    subscription: {
      active: true,
      type: "recurring" as SubscriptionType,
      max_level_granted: 60,
      period_ends_at: new Date("2018-12-11T13:32:19.485748Z"),
    },
    preferences: {
      default_voice_actor_id: 1,
      extra_study_autoplay_audio: false,
      lessons_autoplay_audio: false,
      lessons_batch_size: 10,
      lessons_presentation_order:
        "ascending_level_then_subject" as LessonsPresentationOrder,
      reviews_autoplay_audio: false,
      reviews_display_srs_indicator: true,
      reviews_presentation_order: "shuffled" as ReviewsPresentationOrder,
    },
  },
};

export const mockUserLvl5 = {
  object: "user",
  url: "https://api.wanikani.com/v2/user",
  data_updated_at: new Date("2018-04-06T14:26:53.022245Z"),
  data: {
    id: "5a6a5234-a392-4a87-8f3f-33342afe8a42",
    username: "test_user_lvl_5",
    level: 5,
    profile_url: "https://www.wanikani.com/users/test_user_lvl_5",
    started_at: new Date("2012-05-11T00:52:18.958466Z"),
    current_vacation_started_at: null,
    subscription: {
      active: true,
      type: "recurring" as SubscriptionType,
      max_level_granted: 60,
      period_ends_at: new Date("2018-12-11T13:32:19.485748Z"),
    },
    preferences: {
      default_voice_actor_id: 1,
      extra_study_autoplay_audio: false,
      lessons_autoplay_audio: false,
      lessons_batch_size: 10,
      lessons_presentation_order:
        "ascending_level_then_subject" as LessonsPresentationOrder,
      reviews_autoplay_audio: false,
      reviews_display_srs_indicator: true,
      reviews_presentation_order: "shuffled" as ReviewsPresentationOrder,
    },
  },
};
