import { LECTURE_TABS, type LectureTab } from './lectures'
import CourseDetailScreen from './screens/CourseDetailScreen'
import CourseListScreen from './screens/CourseListScreen'
import HomeScreen from './screens/HomeScreen'

interface TechlearnAppProps {
  /** '#/techlearn' 뒤의 경로. '/' 는 홈 */
  path: string
  params: URLSearchParams
}

/** 깨진 주소('%' 하나 등)면 decodeURIComponent 가 던지므로, 빈 id 로 바꿔 '강의를 찾을 수 없어요'를 보여 준다 */
function decodeId(raw: string) {
  try {
    return decodeURIComponent(raw)
  } catch {
    return ''
  }
}

function readTab(value: string | null): LectureTab {
  return LECTURE_TABS.some(({ id }) => id === value) ? (value as LectureTab) : 'all'
}

// techlearn 강의 플랫폼 시안 — 홈 → 강의 목록 → 강의 상세 → 수강신청 (목업 데이터)
export default function TechlearnApp({ path, params }: TechlearnAppProps) {
  if (path === '/courses') return <CourseListScreen tab={readTab(params.get('tab'))} query={params.get('q') ?? ''} />
  if (path.startsWith('/course/')) return <CourseDetailScreen id={decodeId(path.slice('/course/'.length))} />
  return <HomeScreen scrollTo={params.get('to')} />
}
