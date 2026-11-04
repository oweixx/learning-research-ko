import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('상단 검색 결과를 확인하고 키보드로 닫을 수 있다', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: '문서 검색', exact: true }).click()
  await page.locator('#localsearch-input').fill('탐색적 실험')
  await expect(page.locator('#localsearch-list')).toContainText('탐색적 실험')
  await page.locator('#localsearch-input').press('Escape')
  await expect(page.locator('#localsearch-input')).not.toBeVisible()
})

test('요약·도식·예시를 읽고 용어와 관련 문서로 이동한다', async ({ page }, testInfo) => {
  await page.goto('guide/reading-papers.html')
  await expect(page.locator('.editorial-summary li')).toHaveCount(3)
  await expect(page.locator('.reading-tools')).not.toHaveAttribute('open', '')
  await expect(page.locator('.personal-records')).not.toHaveAttribute('open', '')
  await expect(page.locator('.editorial-flow li')).toHaveCount(4)
  await expect(page.locator('.editorial-example')).toContainText('가상 예시')
  await expect(page.locator('.editorial-connections')).toContainText('분야 전체의 흐름')
  await page.screenshot({ path: `test-results/editorial-top-${testInfo.project.name}.png` })
  await page.locator('.editorial-flow').screenshot({ path: `test-results/editorial-flow-${testInfo.project.name}.png` })
  await page.locator('.editorial-example').screenshot({ path: `test-results/editorial-example-${testInfo.project.name}.png` })
  await page.locator('.term-definition a').first().click()
  await expect(page).toHaveURL(/glossary\.html#/)
  await expect(page.locator('.vp-doc h1')).toHaveText(/연구 용어를 쉬운 말로/)
  const targetExists = await page.evaluate(() => !!document.getElementById(decodeURIComponent(location.hash.slice(1))))
  expect(targetExists).toBe(true)
  await page.goto('guide/handbook.html')
  await expect(page.locator('.vp-doc h3')).toHaveCount(24)
  await page.locator('.vp-doc a[href*="reading-papers.html#"]').first().click()
  await expect(page).toHaveURL(/reading-papers\.html#/)
  await expect(page.locator('.editorial-summary')).toBeVisible()
  await page.locator('.editorial-connections a[href*="literature-tree"]').click()
  await expect(page).toHaveURL(/literature-tree\.html/)
  await expect(page.locator('.reading-tools')).not.toHaveAttribute('open', '')
  await page.goto('guide/figure-template-access.html')
  await expect(page.locator('.editorial-summary')).toHaveCount(0)
  for (const url of ['guide/handbook.html', 'guide/glossary.html', 'guide/experiment-failures.html']) {
    await page.goto(url)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), url).toBe(true)
  }
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('.reading-tools')).not.toBeVisible()
  await expect(page.locator('.editorial-flow')).toBeVisible()
})

test('홈과 자료실에서 한국어 본문 검색, 필터, 새로고침이 동작한다', async ({
  page
}, testInfo) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    '연구의 다음 단계를,'
  )
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true
  })
  await page.getByRole('link', { name: '자료 둘러보기', exact: false }).click()
  await page.getByLabel('자료 제목과 본문 검색').fill('과적합')
  await expect(page.locator('.document-grid')).toContainText(
    '아이디어를 검증할 탐색적 실험을 설계하는 법'
  )
  await page.getByRole('button', { name: '실험과 개발', exact: true }).click()
  await page.reload()
  await expect(page.getByLabel('자료 제목과 본문 검색')).toHaveValue('과적합')
  await expect(
    page.getByRole('button', { name: '실험과 개발', exact: true })
  ).toHaveAttribute('aria-pressed', 'true')
  await page.getByLabel('자료 제목과 본문 검색').fill('없는단어abcdef123')
  await expect(
    page.getByRole('heading', { name: '아직 찾는 자료가 보이지 않아요.' })
  ).toBeVisible()
  await page.getByRole('button', { name: '검색 조건 초기화' }).click()
  await expect(page.locator('.doc-card')).toHaveCount(80)
  expect(errors).toEqual([])
})

test('읽음, 북마크, 개인 메모와 글자 크기를 저장하고 학습 진도에 반영한다', async ({
  page
}, testInfo) => {
  await page.goto('guide/reading-papers.html')
  await page.locator('.reading-tools > summary').click()
  await page.getByRole('button', { name: '읽음 표시', exact: true }).click()
  await page.getByRole('button', { name: '북마크', exact: true }).click()
  await page.locator('.personal-records > summary').click()
  await page
    .getByLabel('이 문서의 개인 메모')
    .fill('질문을 정리한 뒤 직접 실험해 보자.')
  await page.getByLabel('본문 글자 크기').selectOption('20')
  await page.reload()
  await page.locator('.reading-tools > summary').click()
  await page.locator('.personal-records > summary').click()
  await expect(
    page.getByRole('button', { name: '읽음 표시됨', exact: true })
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('button', { name: '북마크됨', exact: true })
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByLabel('이 문서의 개인 메모')).toHaveValue(
    '질문을 정리한 뒤 직접 실험해 보자.'
  )
  await expect(page.getByLabel('본문 글자 크기')).toHaveValue('20')
  await page.screenshot({
    path: `test-results/reader-${testInfo.project.name}.png`,
    fullPage: true
  })
  await page.goto('paths.html#read')
  await expect(page.locator('#read .progress-label')).toContainText(
    '1 / 5편 읽음'
  )
  await page.goto('bookshelf.html')
  await expect(page.locator('.document-grid')).toContainText(
    '읽고 나서 남는 논문 읽기'
  )
  await page.getByRole('button', { name: '메모한 자료 1' }).click()
  await expect(page.locator('.memo-preview')).toContainText(
    '질문을 정리한 뒤 직접 실험해 보자.'
  )
})

test('연구 노트를 작성하고 Markdown과 전체 백업을 내려받아 새 브라우저에 복원한다', async ({
  page,
  browser,
  baseURL
}) => {
  await page.goto('notebook.html?template=experiment')
  await expect(
    page
      .getByRole('button', { name: '실험 설계', exact: false })
      .filter({ has: page.locator('strong') })
  ).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: '새 노트 만들기' }).click()
  await page
    .getByLabel('노트 제목', { exact: true })
    .fill('작은 데이터로 가설 검증')
  await page
    .getByLabel('검증할 질문과 가설', { exact: false })
    .fill('표본 수를 줄여도 핵심 현상을 재현할 수 있는가?')
  await page
    .getByLabel('성공·실패 판단 기준', { exact: false })
    .fill('동일 시드에서 오차를 비교한다.')
  await page.reload()
  await expect(page.getByLabel('노트 제목', { exact: true })).toHaveValue(
    '작은 데이터로 가설 검증'
  )
  const mdEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Markdown 내려받기' }).click()
  const md = await mdEvent
  const mdText = await readFile(await md.path(), 'utf8')
  expect(mdText).toContain('표본 수를 줄여도 핵심 현상을')
  expect(mdText).toContain('동일 시드에서 오차')
  await page.goto('bookshelf.html#backup')
  const backupEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: '모든 기록 백업' }).click()
  const backup = await backupEvent
  const backupPath = await backup.path()
  const fresh = await browser.newContext({ baseURL })
  const restored = await fresh.newPage()
  await restored.goto('bookshelf.html#backup')
  await restored
    .getByLabel('백업 JSON 파일 선택', { exact: true })
    .setInputFiles(backupPath)
  await expect(restored.locator('.restore-preview')).toContainText(
    '연구 노트 1개'
  )
  await restored.getByRole('button', { name: '병합하여 복원' }).click()
  await restored
    .getByRole('link', { name: '작은 데이터로 가설 검증', exact: false })
    .click()
  await expect(restored.getByLabel('노트 제목', { exact: true })).toHaveValue(
    '작은 데이터로 가설 검증'
  )
  await expect(
    restored.getByLabel('성공·실패 판단 기준', { exact: false })
  ).toHaveValue('동일 시드에서 오차를 비교한다.')
  await fresh.close()
})

test('손상된 백업을 거부하고 저장 실패를 알린다', async ({ page }) => {
  await page.goto('bookshelf.html#backup')
  await page.getByText('백업 내용을 직접 붙여넣기', { exact: true }).click()
  await page.getByLabel('백업 JSON 내용').fill('{broken')
  await page.getByRole('button', { name: '복원 내용 확인' }).click()
  await expect(page.locator('.notice.error')).toContainText(
    'JSON 파일을 읽을 수 없습니다'
  )
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('full', 'QuotaExceededError')
    }
  })
  await page.goto('guide/reading-papers.html')
  await page.locator('.reading-tools > summary').click()
  await page.getByRole('button', { name: '북마크', exact: true }).click()
  await expect(page.locator('.storage-alert')).toContainText(
    '브라우저에 저장하지 못했습니다'
  )
})

test('주요 화면과 긴 문서에 가로 넘침이 없고 테마와 모바일 메뉴가 동작한다', async ({
  page
}, testInfo) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  for (const url of [
    './',
    'paths.html',
    'library.html',
    'notebook.html',
    'bookshelf.html',
    'guide/reading-papers.html',
    'guide/linux-research-environment.html'
  ]) {
    await page.goto(url)
    await expect(page.locator('h1')).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    )
    expect(overflow, url).toBe(false)
  }
  await page.goto('./')
  if (testInfo.project.name === 'mobile') {
    await page.locator('.VPNavBarHamburger').click()
    await expect(page.locator('.VPNavScreen')).toBeVisible()
    await page
      .locator('.VPNavScreen')
      .getByRole('link', { name: '학습 경로', exact: true })
      .click()
    await expect(page.locator('h1')).toContainText('나에게 맞는 시작점')
    await page.locator('.VPNavBarHamburger').click()
    await page.locator('.VPNavScreen .VPSwitchAppearance').click()
    await page.locator('.VPNavBarHamburger').click()
  } else
    await page
      .getByRole('switch', { name: '어두운 화면으로 전환', exact: true })
      .click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.screenshot({
    path: `test-results/dark-${testInfo.project.name}.png`,
    fullPage: true
  })
  expect(errors).toEqual([])
})
