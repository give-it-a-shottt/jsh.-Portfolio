# T-012 테스트가 로컬 `.env`의 실제 키를 읽어 유미를 한 번 부름

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과]
무엇이 문제였나: "키가 없으면 저장본으로 간다"를 확인하는 테스트를 새로 썼는데, 테스트가 실패했어요. 키를 안 넣었는데도 실제 유미 데이터(`live`)가 나왔어요. 테스트가 내 컴퓨터의 `.env`에 있는 진짜 키를 읽은 거예요. 그 바람에 하루 70요청 중 1번을 썼어요.
어떻게 해결했나: 테스트에서 키를 빈 값으로 못 박았어요. 이제 테스트는 어떤 컴퓨터에서 돌려도 실제 유미를 부르지 않아요.

## 개발자 상세

### 증상 (2026-11-01, F-010 리뷰 뒤 수정)
```
tests/test_picks.py::test_real_mode_without_key_uses_the_snapshot
    assert picks.json()["source"] == "snapshot"
E   AssertionError: assert 'live' == 'snapshot'
```

### 원인
- [config.py](../../Portfolio/backend/maestro/app/core/config.py)의 `Settings`는 `env_file=".env"`라서, 테스트에서 `Settings(yumi_mode="real")`처럼 일부만 주면 나머지(`yumi_api_key`)는 `.env`에서 채워요.
- 이 테스트는 실제 클라이언트를 쓰려고 mock 바꿔 끼우기(`dependency_overrides[get_yumi_client]`)를 뺐어요. 그래서 `.env`의 진짜 키로 real 클라이언트가 만들어져 실제 유미에 요청이 나갔어요.
- CI처럼 `.env`가 없는 곳에서는 통과했을 테스트라, 내 컴퓨터에서만 드러났어요.

### 해결
- 키를 직접 빈 값으로 줘요: `Settings(yumi_mode="real", yumi_api_key="")`.
- real 모드를 흉내 내는 다른 테스트는 가짜 키(`"test-key"`)와 가짜 유미 클라이언트(`LiveYumi` · `BrokenYumi` 등)를 함께 써요.

### 재발 방지
- 테스트에서 `Settings(...)`를 만들 때는 키 같은 외부 연결 값을 꼭 직접 넣어요(`.env`에 기대지 않기).
- 실제 클라이언트가 만들어질 수 있는 테스트는 mock 바꿔 끼우기를 빼기 전에 "키가 비어 있나"부터 확인해요.

### 배운 것
- 설정 파일을 자동으로 읽는 편리함이 테스트에서는 숨은 입력이 돼요. 테스트가 컴퓨터마다 다르게 돌면 이런 입력부터 의심해요.

### 관련
[F-010](../features/F-010-maestro-renewal/feature.md) · [D-002](../decisions/D-002-mock-real-client.md)

최종 수정: 2026-11-01
