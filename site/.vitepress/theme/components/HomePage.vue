<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import catalog from '../../../.generated/catalog.json'
import { categories, tracks } from '../../../data/learning.mjs'
import { useLearningStore } from '../store.js'
import Icon from './Icon.vue'
const { state } = useLearningStore()
const last = computed(() => catalog.find((d) => d.id === state.lastRead))
const readCount = computed(
  () => catalog.filter((d) => state.docs[d.id]?.read).length
)
const lastUrl = computed(() =>
  last.value
    ? withBase(
        last.value.url +
          '.html' +
          (state.docs[last.value.id]?.heading
            ? '#' + encodeURIComponent(state.docs[last.value.id].heading)
            : '')
      )
    : ''
)
</script>
<template>
  <div class="landing">
    <section class="hero page-width">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="tiny-dot"></span> LEARNING RESEARCH · 한국어판
        </p>
        <h1>연구의 다음 단계를,<br /><span>함께 찾아보세요.</span></h1>
        <p class="hero-description">
          논문을 읽는 첫날부터 나의 연구를 세상에 전하는 순간까지.<br
            class="desktop-break"
          />
          핵심 요약과 흐름도, 구체적인 예시를 따라 연구의 원칙을 읽어 보세요.
        </p>
        <div class="hero-actions">
          <a class="button primary" :href="withBase('/paths.html')"
            >나에게 맞는 경로 찾기 <Icon name="arrow" :size="18" /></a
          ><a class="text-link" :href="withBase('/library.html')"
            >자료 둘러보기 <span aria-hidden="true">↗</span></a
          >
        </div>
        <div class="hero-caption">
          <span
            >한국어 자료 <strong>{{ catalog.length }}편</strong></span
          ><span>학습 경로 <strong>5가지</strong></span
          ><span>다시 읽는 <strong>핵심 원칙</strong></span>
        </div>
      </div>
      <div
        class="research-map"
        aria-label="읽기, 질문, 실험, 기록으로 이어지는 연구 과정"
      >
        <div class="map-heading">
          <span>YOUR RESEARCH JOURNEY</span
          ><span class="map-status">한 걸음씩, 깊이 있게</span>
        </div>
        <div class="map-orbit">
          <div class="map-center">
            <Icon name="spark" :size="29" /><strong>나의 연구</strong
            ><small>더 좋은 질문을 향해</small>
          </div>
          <div class="map-node node-read">
            <Icon name="book" /><span>읽고 이해하기</span><small>READ</small>
          </div>
          <div class="map-node node-question">
            <Icon name="compass" /><span>질문 찾기</span><small>QUESTION</small>
          </div>
          <div class="map-node node-test">
            <Icon name="flask" /><span>작게 실험하기</span
            ><small>EXPLORE</small>
          </div>
          <div class="map-node node-write">
            <Icon name="pen" /><span>기록하고 나누기</span><small>SHARE</small>
          </div>
        </div>
        <p class="map-caption">
          배움은 한 번에 완성되지 않아요.<br />읽고 시도하며, 나만의 과정을
          만들어 가세요.
        </p>
      </div>
    </section>
    <div class="page-width">
      <section v-if="last" class="continue-banner">
        <div>
          <span class="eyebrow">다시 오셨군요</span>
          <h2>{{ last.title }}</h2>
          <p>
            {{ readCount }}편을 읽었어요. 마지막으로 읽던 곳에서 이어 가세요.
          </p>
        </div>
        <a class="button primary" :href="lastUrl"
          >이어서 읽기 <Icon name="arrow" :size="18"
        /></a>
      </section>
      <section class="home-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">START WHERE YOU ARE</p>
            <h2>지금, 어떤 단계에 있나요?</h2>
            <p>현재의 고민에 맞춰 읽을 순서를 안내해 드립니다.</p>
          </div>
          <a class="text-link" :href="withBase('/paths.html')"
            >전체 경로 보기 <Icon name="arrow" :size="17"
          /></a>
        </div>
        <div class="home-tracks">
          <a
            v-for="track in tracks.slice(0, 3)"
            :key="track.id"
            class="track-card"
            :href="withBase('/paths.html#' + track.id)"
            ><div class="track-card-top">
              <span class="track-number">{{ track.number }}</span
              ><Icon :name="track.icon" :size="26" />
            </div>
            <h3>{{ track.title }}</h3>
            <p>{{ track.description }}</p>
            <div class="track-card-bottom">
              <span>{{ track.ids.length }}편의 읽기 · 실천 양식</span
              ><Icon name="arrow" :size="19" /></div
          ></a>
        </div>
      </section>
      <section class="home-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">EXPLORE THE LIBRARY</p>
            <h2>필요한 주제부터 읽어도 좋아요.</h2>
          </div>
          <a class="text-link" :href="withBase('/library.html')"
            >자료실 열기 <Icon name="arrow" :size="17"
          /></a>
        </div>
        <div class="topic-grid">
          <a
            v-for="category in categories.filter((c) => c.id !== 'about')"
            :key="category.id"
            :href="withBase('/library.html?topic=' + category.id)"
            class="topic-link"
            ><span class="topic-icon"><Icon :name="category.icon" /></span>
            <div>
              <h3>{{ category.label }}</h3>
              <p>
                {{
                  catalog.filter((d) => d.category === category.id).length
                }}편의 자료
              </p>
            </div>
            <Icon class="topic-arrow" name="arrow" :size="16"
          /></a>
        </div>
      </section>
      <section class="notebook-banner">
        <div class="notebook-illustration" aria-hidden="true">
          <Icon name="pen" :size="38" /><span></span><span></span><span></span>
        </div>
        <div>
          <p class="eyebrow">PRINCIPLES TO RETURN TO</p>
          <h2>필요할 때, 핵심으로 돌아오세요.</h2>
          <p>
            논문 읽기, 문제 선택, 실험과 글쓰기에서 기억할 24가지 원칙.<br />짧게
            되짚고, 맥락이 필요하면 원래 문서로 이어 읽으세요.
          </p>
          <a class="button secondary" :href="withBase('/guide/handbook.html')"
            >연구 원칙 펼쳐 보기 <Icon name="arrow" :size="18"
          /></a>
        </div>
      </section>
      <div class="source-note">
        <Icon name="info" :size="20" />
        <p>
          Sida Peng의 Learning Research를 바탕으로 만든 비공식 한국어 학습
          공간입니다. 번역·요약·접근 제한을 구분하며, 세 줄 요약·도식·비교 예시와
          용어 풀이, 읽기 연결은 한국어판에서 추가했습니다.
          <a :href="withBase('/guide/translation.html')">출처와 번역 범위</a>
        </p>
      </div>
    </div>
  </div>
</template>
