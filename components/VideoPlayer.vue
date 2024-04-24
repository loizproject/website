<script setup>
import { useDisplay } from "vuetify";
import { useStore } from "~/store";

const props = defineProps(["videoSrc", "videoType", "videoId"]); // all strings

const store = useStore();
const { mdAndUp, lgAndUp } = useDisplay();

const videoModal = ref(true);
const htmlVideoPlayer = ref(null);
const videoStopped = ref(true);
const duration = ref(null);
const currentTime = ref(null);
const playing = ref(false);
const videoMuted = ref(false);

const likeWatchVideo = computed(() => store.likeWatchVideo);

const secs = computed(() => {
  if (duration.value) {
    return `${parseInt(duration.value % 60, 10)}`.padStart(2, "0");
  } else {
    return "00";
  }
});

const mins = computed(() => {
  if (duration.value) {
    return `${parseInt((duration.value / 60) % 60, 10)}`.padStart(2, "0");
  } else {
    return "00";
  }
});

const currentSec = computed(() => {
  if (currentTime.value) {
    return `${parseInt(currentTime.value % 60, 10)}`.padStart(2, "0");
  } else {
    return "00";
  }
});

const currentMin = computed(() => {
  if (currentTime.value) {
    return `${parseInt((currentTime.value / 60) % 60, 10)}`.padStart(2, "0");
  } else {
    return "00";
  }
});

function setVideoDuration() {
  const video = htmlVideoPlayer.value;
  const progressBar = document.getElementById("progress-bar");
  duration.value = video.duration;
  progressBar.max = duration.value;
}

function resetVideo() {
  const video = htmlVideoPlayer.value;
  video.currentTime = 0;
  playing.value = false;
  videoStopped.value = true;
}

function mountVideo() {
  setTimeout(() => {
    const video = htmlVideoPlayer.value;
    duration.value = video.duration ? video.duration : 0;

    setInterval(() => {
      updateCurrentTime(video.currentTime);
    }, 200);
  }, 1);
}

function updateCurrentTime(time) {
  currentTime.value = time;
}

function startVideo() {
  videoStopped.value = false;
  playing.value = true;
  const video = htmlVideoPlayer.value;
  video.play();
}

function toggleVideo() {
  videoStopped.value = false;
  const video = htmlVideoPlayer.value;
  if (video.paused) {
    video.play();
    playing.value = true;
  } else {
    video.pause();
    playing.value = false;
  }
}

function fastForward() {
  const video = htmlVideoPlayer.value;
  video.currentTime += 10;
}

function rewind() {
  const video = htmlVideoPlayer.value;
  video.currentTime -= 10;
}

function seekPart() {
  const video = htmlVideoPlayer.value;
  const progressBar = document.getElementById("progress-bar");
  video.currentTime = progressBar.value;
}

function likeVideo() {
  store.setLikeWatchVideo(likeWatchVideo.value ? false : true);
}

function shareVideo() {
  const url = `${window.location.origin}/#${props.videoId}`;
  if (navigator.share) {
    navigator
      .share({
        title: "Loiztravels video",
        text: "Hi, please check out this video from Loiztravels.",
        url,
      })
      .catch((err) => {
        console.error(`Sharing error: ${err}`);
      });
  } else {
    store.setToast("Browser does not support Web Share", { type: "error" });
  }
}

onMounted(() => {
  mountVideo();
  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 37) {
      // Left arrow key pressed
      rewind();
    } else if (event.keyCode === 39) {
      // Right arrow key pressed
      fastForward();
    }
  });
});

onUnmounted(() => {
  useClearAllIntervals();
});
</script>

<template>
  <v-dialog
    v-model="videoModal"
    width="85%"
    :max-width="lgAndUp ? '850px' : '650px'"
    content-class="loiz-video"
    persistent
  >
    <v-card :id="videoId" class="relative">
      <v-icon class="close-video-icon" color="#ccc" @click="$emit('close')">
        mdi-close
      </v-icon>
      <div v-if="videoStopped" class="video-thumb d-flex align-center justify-center">
        <button @click="startVideo" class="video-thumb__play mx-2">
          <v-icon>mdi-play</v-icon>
        </button>
      </div>
      <video
        v-show="!videoStopped"
        ref="htmlVideoPlayer"
        :muted="videoMuted"
        class="tw-w-full"
        @loadedmetadata="setVideoDuration"
        @ended="resetVideo"
      >
        <source :src="videoSrc" :type="videoType" />
      </video>
      <div class="video-controls">
        <div class="w-100">
          <div class="progress-indicator">
            <input
              type="range"
              name=""
              id="progress-bar"
              max="100"
              min="0"
              class="progress-bar"
              :value="currentTime ? currentTime : 0"
              @input="seekPart"
              @change="seekPart"
            />
          </div>
          <div class="time d-flex align-center justify-space-between px-4 pb-4">
            <span class="duration">{{ currentMin }}:{{ currentSec }}</span>
            <div class="d-flex justify-center">
              <button class="toggle-play" @click="rewind">
                <v-icon>mdi-rewind</v-icon>
              </button>
              <button @click="toggleVideo" class="toggle-play mx-2">
                <v-icon>mdi-{{ playing ? "pause" : "play" }}</v-icon>
              </button>
              <button class="toggle-play" @click="fastForward">
                <v-icon>mdi-fast-forward</v-icon>
              </button>
            </div>
            <span class="duration">{{ mins }}:{{ secs }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex justify-center pt-2 pb-5">
        <button
          @click="likeVideo"
          class="video-actions mx-2 d-flex align-center p-3"
          :class="likeWatchVideo ? 'video-actions--liked' : ''"
        >
          <iconify-icon
            icon="fluent:thumb-like-28-regular"
            class="video-actions__icon"
          ></iconify-icon>
          <span class="ml-2">Like</span>
        </button>
        <button @click="shareVideo" class="video-actions mx-2 d-flex align-center p-3">
          <iconify-icon icon="mdi-light:share" class="video-actions__icon"></iconify-icon>
          <span class="ml-2">Share</span>
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.loiz-video {
  & .close-video-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.2rem;
    color: #fff;
    cursor: pointer;
    z-index: 9;
  }

  & .v-card {
    background-color: #ededed;
  }

  & video {
    font-family: trip, sans-serif;
    font-weight: 600;
  }

  & .duration {
    font-size: 0.8rem;
  }

  .video-thumb {
    background-color: #000;
    height: 55vh;
    color: #fff;
    margin-bottom: 5px;

    &__play {
      border: 1px solid #fff;
      border-radius: 50%;
      padding: 15px;
      color: #fff;
    }

    & .v-icon {
      color: #fff;
    }
  }

  .video-actions {
    background-color: #fff;
    border-radius: 999px;
    padding: 8px 20px;
    min-width: 30px;
    font-size: 0.8rem;
    transition: 0.3s;

    &--liked {
      background-color: #ffc2c2;
      transition: 0.3s;
      color: #e80d0d;
    }

    &__icon {
      font-size: 1.2rem;
    }
  }
}

@media screen and (max-width: 600px) {
  .loiz-video {
    .video-thumb {
      height: 30vh;
    }
  }
}
</style>
