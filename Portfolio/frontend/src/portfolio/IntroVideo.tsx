import { useEffect, useRef, useState } from 'react'
import introVideo from './assets/intro/intro-qna.mp4'
import './IntroVideo.css'

interface IntroVideoProps {
  /** 건너뛰기를 누르거나 영상이 끝나면 불린다 */
  onDone: () => void
  /** 홈의 '다시 보기'에서 연 경우 — 시작 화면 없이 바로 튼다 */
  autoStart?: boolean
}

/** 누른 동작 안에서 바로 play() 해야 소리가 켜진 채 재생된다. 그래도 막히면 onBlocked 로 알려 직접 누르게 한다 */
function playWithSound(video: HTMLVideoElement, onBlocked: () => void) {
  video.focus()
  video.play().catch(onBlocked)
}

// 첫 방문 인트로 —1분 자기소개 영상. 한 세션에 한 번, 움직임 줄이기 설정이면 아예 띄우지 않는다(PortfolioApp 에서 판단).
// 브라우저는 사용자가 누르기 전에는 소리 나는 영상을 자동 재생하지 않아서, 시작 버튼을 눌러야 튼다.
// 화면 아무 데나 누르는 건 영상 조작(소리·멈춤·탐색)이라, 인트로는 건너뛰기 버튼이나 영상이 끝날 때만 닫힌다.
export default function IntroVideo({ onDone, autoStart = false }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(autoStart)
  const [paused, setPaused] = useState(false)

  const start = () => {
    setStarted(true)
    if (videoRef.current) playWithSound(videoRef.current, () => setPaused(true))
  }

  // 다시 보기는 홈에서 누른 직후라 바로 소리와 함께 틀 수 있다
  useEffect(() => {
    if (autoStart && videoRef.current) playWithSound(videoRef.current, () => setPaused(true))
  }, [autoStart])

  return (
    <div className="ivid">
      <h1 className="sr-only">jsh. 포트폴리오</h1>
      <div className="ivid__stage">
        <video
          ref={videoRef}
          className="ivid__video"
          src={introVideo}
          controls={started}
          playsInline
          preload="auto"
          tabIndex={started ? 0 : -1}
          onPlay={() => setPaused(false)}
          // 끝날 때도 pause 가 먼저 오는데, 그때는 곧 닫히니 건너뛰기를 키우지 않는다
          onPause={(e) => setPaused(!e.currentTarget.ended)}
          onEnded={onDone}
        />
        {!started && (
          <div className="ivid__gate">
            <p className="ivid__logo" lang="en">
              jsh.
            </p>
            <p className="ivid__lead">1분 자기소개 영상으로 시작해 볼까요?</p>
            <div className="ivid__actions">
              <button type="button" className="ivid__play" onClick={start}>
                <span aria-hidden="true">▶</span> 자기소개 영상 보기
              </button>
              <button type="button" className="ivid__skip" onClick={onDone}>
                건너뛰기
              </button>
            </div>
          </div>
        )}
      </div>
      {/* 멈추면 '이제 그만 볼까' 하는 순간이라, 건너뛰기를 크게 띄운다 */}
      {started && (
        <button type="button" className={`ivid__skip ivid__skip--corner ${paused ? 'loud' : ''}`} onClick={onDone}>
          {paused ? '건너뛰고 포트폴리오 보기 →' : '건너뛰기'}
        </button>
      )}
    </div>
  )
}
