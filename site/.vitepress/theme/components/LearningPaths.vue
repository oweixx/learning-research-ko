<script setup>
import { withBase } from 'vitepress'
import catalog from '../../../.generated/catalog.json'
import { tracks } from '../../../data/learning.mjs'
import { useLearningStore } from '../store.js'
import Icon from './Icon.vue'
const { state } = useLearningStore()
const find = (id) => catalog.find((d) => d.id === id)
const completed = (track) =>
  track.ids.filter((id) => state.docs[id]?.read).length
</script>
<template>
  <div class="page-width app-page">
    <header class="page-heading">
      <p class="eyebrow">LEARNING PATHS</p>
      <h1>나에게 맞는 시작점을 찾아보세요.</h1>
      <p>
        모든 글을 순서대로 읽을 필요는 없어요. 지금의 질문과 가까운 경로부터
        시작하세요.
      </p>
      <p class="editor-note">
        한국어판에서 구성한 추천 경로입니다. 읽음 표시는 문서에서 직접 체크할 수
        있습니다.
      </p>
    </header>
    <nav class="path-jump" aria-label="학습 경로 바로가기">
      <a v-for="track in tracks" :key="track.id" :href="'#' + track.id"
        >{{ track.number }} {{ track.title }}</a
      >
    </nav>
    <section
      v-for="track in tracks"
      :id="track.id"
      :key="track.id"
      class="path-panel"
    >
      <div class="path-intro">
        <span class="icon-tile"><Icon :name="track.icon" :size="26" /></span>
        <p class="eyebrow">PATH {{ track.number }}</p>
        <h2>{{ track.title }}</h2>
        <p>{{ track.description }}</p>
        <div class="path-outcome">
          <span>이 경로를 마치면</span><strong>{{ track.outcome }}</strong>
        </div>
        <div class="progress-label">
          <span>{{ completed(track) }} / {{ track.ids.length }}편 읽음</span
          ><span
            >{{
              Math.round((completed(track) / track.ids.length) * 100)
            }}%</span
          >
        </div>
        <progress
          :value="completed(track)"
          :max="track.ids.length"
          :aria-label="track.title + ' 읽기 진도'"
        ></progress
        ><a
          class="button secondary"
          :href="withBase('/notebook.html?template=' + track.template)"
          >이 경로의 실천 양식 <Icon name="pen" :size="16"
        /></a>
      </div>
      <ol class="path-steps">
        <li
          v-for="(id, index) in track.ids"
          :key="id"
          :class="{ completed: state.docs[id]?.read }"
        >
          <span class="step-number"
            ><Icon
              v-if="state.docs[id]?.read"
              name="check"
              :size="17"
            /><template v-else>{{
              String(index + 1).padStart(2, '0')
            }}</template></span
          >
          <div>
            <a :href="withBase(find(id).url + '.html')">{{ find(id).title }}</a>
            <p>{{ find(id).description }}</p>
            <small
              >약 {{ find(id).minutes }}분
              <span v-if="state.docs[id]?.read">· 읽음</span></small
            >
          </div>
          <a
            class="step-open"
            :href="withBase(find(id).url + '.html')"
            :aria-label="find(id).title + ' 읽기'"
            ><Icon name="arrow" :size="20"
          /></a>
        </li>
      </ol>
    </section>
  </div>
</template>
