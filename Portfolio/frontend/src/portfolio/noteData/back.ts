import type { StudyNote } from "../notes";

// Back 공부 노트 — 노션 학습노트 > 학습 폴더 > 백엔드 · MySQL · MongoDB, AI와 학습(서버 쪽), 알고리즘. 구버전·개발 환경 노트는 싣지 않는다
export const BACK_NOTES: StudyNote[] = [
  // ── AI와 학습 (미니 인프런 · Nightly 풀스택) ──
  // 15회차부터 F-012 노트 틀(개념 · 왜 · 코드). 코드는 미니 인프런 main.py 와 맞춰 보고, Pydantic 조각은 프로젝트 가상환경에서 돌려 확인
  // 17회차 해시 · JWT 위조 · 만료 조각과 16회차 FOR UPDATE SQL · FRONTEND_ORIGINS 조각은 프로젝트 가상환경에서 돌려 확인
  {
    slug: "be-jwt-login",
    area: "Back",
    course: "미니 인프런",
    lesson: "17회차",
    date: "2026.11.08",
    title: "JWT 로그인 — 서명 · 비밀번호 해시 · Bearer 토큰",
    summary:
      "비밀번호를 해시로 저장하고, 서버가 서명한 JWT 로 요청마다 누가 보냈는지 확인해 남의 포인트로 신청하는 것을 막을 수 있다.",
    points: [
      "JWT 는 암호화가 아니라 서명 — 내용은 누구나 읽지만, 비밀키 없이는 고친 내용에 맞는 서명을 못 만든다",
      "비밀번호는 소금 + 60만 번 반복한 PBKDF2 해시만 저장한다",
      "user_id 는 body 가 아니라 Depends 로 검증한 토큰에서 꺼낸다",
    ],
    learned: [],
    sections: [
      {
        title: "인증 — 서버는 누가 보냈는지 모른다",
        body: "HTTP 요청은 하나하나가 따로라서, 서버는 요청만 보고 보낸 사람을 알 수 없다. 그래서 로그인할 때 이메일 · 비밀번호를 한 번 확인하고 \"N번 유저\" 라고 적은 토큰을 준 뒤, 그다음부터는 요청마다 토큰을 보여 주게 한다. 고정 테스트 유저(TEST_USER_ID = 1)를 없애고 /me 와 /enrollments 가 토큰에서 꺼낸 유저를 쓰게 바꿨다.",
        why: "토큰이 없으면 누가 접속해도 같은 유저의 포인트가 빠지고, 남의 포인트로 신청하는 것도 막을 수 없다.",
      },
      {
        title: "JWT — 서명이 위조를 잡는다",
        body: "JWT 는 헤더.내용.서명 세 덩어리다. 내용에 누구인지(sub)와 언제까지인지(exp)를 적고, 서버 비밀키로 HS256 서명을 만든다. 내용은 base64url 이라 누구나 풀어 읽지만, 공격자가 내용만 고치면 옛 서명이 그대로 붙어 오고 서버가 고친 내용 + 비밀키로 다시 계산한 서명과 달라 거부된다. 비밀키는 토큰에 들어가지 않고 서버 환경변수에만 있다.",
        why: "토큰은 사용자 손에 있어서 누구나 고칠 수 있다 — 아이디만 넣은 토큰이면 3 을 1 로 바꿔 남의 계정을 쓸 수 있다.",
        code: {
          lang: "python",
          caption: "PyJWT 로 직접 돌려 본 결과 — 내용은 읽히고, 고치면 서명 에러, 만료되면 만료 에러",
          source: `token = jwt.encode({"sub": "3", "exp": now + timedelta(hours=1)}, SECRET, algorithm="HS256")
header, body, sig = token.split(".")
json.loads(base64.urlsafe_b64decode(body + "=" * (-len(body) % 4)))
# {'sub': '3', 'exp': 1794214198}   ← 서명이 있어도 내용은 누구나 읽는다

forged = f"{header}.{fake_body}.{sig}"          # 내용만 {"sub": "1"} 로 바꾸고 서명은 그대로
jwt.decode(forged, SECRET, algorithms=["HS256"])
# InvalidSignatureError

jwt.decode(expired_token, SECRET, algorithms=["HS256"])
# ExpiredSignatureError                          ← exp 도 decode 가 함께 검사한다`,
        },
      },
      {
        title: "비밀번호 해시 — 원문은 저장하지 않는다",
        body: "가입할 때 유저마다 다른 무작위 소금(16바이트)을 섞어 PBKDF2-SHA256 을 60만 번 반복한 값만 저장한다. 로그인할 때는 저장된 소금 · 반복 횟수로 입력 비밀번호를 같은 방법으로 다시 섞어 비교하고, 비교는 hmac.compare_digest 로 해서 걸린 시간으로 힌트가 새지 않게 한다. 표준 라이브러리 hashlib 만 써서 패키지를 늘리지 않았다.",
        why: "비밀번호는 되돌릴 필요가 없으니 암호화가 아니라 해시가 맞다 — DB 가 통째로 털려도 원문을 알아내기 어렵다.",
        code: {
          lang: "python",
          caption: "미니 인프런 main.py — 같은 비밀번호도 소금 때문에 매번 다른 해시가 나온다",
          source: `PBKDF2_ITERATIONS = 600_000

def hash_password(password: str) -> str:
    salt = os.urandom(16)                                   # 유저마다 다른 소금
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256\${PBKDF2_ITERATIONS}\${salt.hex()}\${digest.hex()}"

def verify_password(password: str, stored: str) -> bool:
    _, iterations, salt_hex, digest_hex = stored.split("$")
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(),
                                 bytes.fromhex(salt_hex), int(iterations))   # 같은 방법으로 다시 섞기
    return hmac.compare_digest(digest.hex(), digest_hex)

hash_password("pass1234") == hash_password("pass1234")   # False
verify_password("wrong", stored)                          # False`,
        },
      },
      {
        title: "Authorization: Bearer 와 Depends",
        body: "브라우저는 Authorization: Bearer 토큰 헤더로 토큰을 보낸다. FastAPI 의 HTTPBearer 가 헤더에서 토큰을 꺼내고(없으면 401), get_current_user_id 가 서명 · 만료를 검사해 sub 를 숫자로 돌려준다. CurrentUserId 라는 이름을 붙여 두면 엔드포인트는 user_id: CurrentUserId 만 적으면 된다.",
        why: "검사를 한 곳에 모아 두면 엔드포인트마다 복붙하다 한 곳을 빠뜨려 그 API 만 뚫리는 일이 없다.",
        code: {
          lang: "python",
          caption: "미니 인프런 main.py — user_id 는 요청 body 가 아니라 검증된 토큰에서 온다",
          source: `bearer = HTTPBearer()   # "Authorization: Bearer <토큰>" 에서 토큰 꺼내기, 없으면 401

def get_current_user_id(
    cred: Annotated[HTTPAuthorizationCredentials, Depends(bearer)],
) -> int:
    try:
        payload = jwt.decode(cred.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])  # 서명 + exp
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다. 다시 로그인해 주세요",
                            headers={"WWW-Authenticate": "Bearer"})
    return int(payload["sub"])

CurrentUserId = Annotated[int, Depends(get_current_user_id)]

@app.post("/enrollments", response_model=EnrollOut, status_code=201)
def enroll(body: EnrollIn, user_id: CurrentUserId):
    ...`,
        },
      },
      {
        title: "로그인 응답과 비밀키 관리",
        body: "/login 은 없는 이메일과 틀린 비밀번호를 같은 문구의 401 로 답해 가입 여부가 새지 않게 한다. 비밀키 JWT_SECRET 은 secrets.token_urlsafe(32) 로 만들어 로컬은 .env, 배포는 Render 환경변수에 두고, 값이 없으면 서버가 RuntimeError 로 아예 켜지지 않게 했다. 그래서 배포는 Render 에 키 넣기 → push 순서를 지킨다.",
        why: "약한 기본 키로 몰래 돌아가는 서버가 켜지지 않는 서버보다 더 위험하다.",
        code: {
          lang: "python",
          caption: "미니 인프런 main.py — 이메일 없음 · 비밀번호 틀림을 구분하지 않는다",
          source: `@app.post("/login", response_model=TokenOut)
def login(body: LoginIn):
    with Session(engine) as session:
        user = session.scalars(select(User).where(User.email == body.email)).first()
    if user is None or user.password_hash is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다")
    return TokenOut(access_token=create_access_token(user.id))`,
        },
      },
      {
        title: "토큰 보관 — localStorage 와 그 대가",
        body: "로그인 성공하면 토큰을 localStorage 에 넣고, 요청마다 꺼내 Authorization 헤더에 붙인다. /me 가 401 이면 만료 · 위조된 토큰이라 버린다. localStorage 는 브라우저에만 있어서 getServerSideProps(서버)에서는 쓸 수 없고, 그래서 내 포인트는 SSR 이 아니라 브라우저에서 useQuery 로 받는다.",
        why: "구현이 가장 단순하고 헤더로 보내는 흐름이 보이지만, 페이지에 악성 스크립트(XSS)가 들어오면 토큰을 읽어 갈 수 있다 — 실서비스는 HttpOnly 쿠키를 검토한다.",
        code: {
          lang: "typescript",
          caption: "미니 인프런 frontend/lib/api.ts",
          source: `function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: \`Bearer \${token}\` } : {};
}

export async function fetchMe(): Promise<Me | null> {
  if (!getToken()) return null;                       // 로그인 안 함
  const res = await fetch(\`\${API_BASE_URL}/me\`, { headers: authHeaders() });
  if (res.status === 401) {
    clearToken();                                     // 만료 · 위조된 토큰은 버린다
    return null;
  }
  if (!res.ok) throw await readError(res, "내 정보 실패");
  return res.json();
}`,
        },
      },
    ],
    pitfalls: [
      "JWT 내용에는 비밀번호 · 개인정보를 넣지 않는다 — base64url 은 인코딩일 뿐 누구나 풀어 읽는다",
      "jwt.decode 에는 algorithms=[\"HS256\"] 처럼 허용할 알고리즘을 꼭 정한다",
      "HS256 비밀키가 32바이트보다 짧으면 PyJWT 가 InsecureKeyLengthWarning 을 낸다 — secrets.token_urlsafe(32) 로 만든다",
      "PyJWT 는 sub 를 문자열로 요구한다 — str(user_id) 로 넣고 꺼낼 때 int() 로 바꾼다",
      "비밀키를 바꾸면 이미 발급한 토큰이 전부 무효가 되어 모두 다시 로그인해야 한다",
      "인증(누구인가)과 인가(무엇을 해도 되는가)는 다르다 — 401 은 누군지 모름, 403 은 알지만 권한 없음",
    ],
    tags: ["백엔드", "FastAPI", "JWT", "인증"],
    keywords:
      "jwt json web token hs256 signature sign encode decode pyjwt invalidsignatureerror expiredsignatureerror exp sub base64url bearer authorization header httpbearer depends annotated pbkdf2 hashlib salt compare_digest password hash localstorage xss httponly cookie 401 403 인증 인가 서명 위조 비밀키 미니 인프런 로그인",
  },
  {
    slug: "be-env-enroll-deploy",
    area: "Back",
    course: "미니 인프런",
    lesson: "16회차",
    date: "2026.11.08",
    title: "환경변수 · 수강신청 트랜잭션 · 배포 — 상태는 제약으로, 순서는 잠금으로",
    summary:
      "장소마다 다른 값과 비밀값을 환경변수로 빼고, 트랜잭션 · DB 제약 · 행 잠금으로 수강신청을 지키고, 프론트 · 백엔드 · DB 를 각각 다른 곳에 배포할 수 있다.",
    points: [
      "환경변수는 이름은 같게, 값은 장소에 맞게 — 배포 서버에서 localhost 는 DB 가 없는 자기 자신",
      "DB 제약(UNIQUE · CHECK)은 있을 수 없는 상태를, 행 잠금(FOR UPDATE)은 동시에 읽고 쓰는 순서를 막는다",
      "CORS 는 브라우저만 검사해서, SSR 은 되는데 버튼만 막힐 수 있다",
    ],
    learned: [],
    sections: [
      {
        title: "환경변수 — 이름은 같게, 값은 장소에 맞게",
        body: "코드에는 os.getenv(\"DATABASE_URL\") 처럼 이름만 쓰고, 실제 값은 로컬은 .env(load_dotenv 로 등록), 배포는 Render 설정 화면에 둔다. 순서는 .env 에 적기 → load_dotenv() 로 등록 → os.getenv() 로 꺼내기 → create_engine() 으로 연결이다. 실제 값은 .gitignore 로 빼고, 필요한 이름만 적은 견본 .env.example 을 올린다.",
        why: "비밀번호가 코드에 있으면 GitHub 를 보는 모두에게 열쇠를 주는 셈이고, 커밋에 한 번 올라가면 지워도 기록에 남는다. 내 컴퓨터와 배포 서버는 DB 주소도 다르다.",
        code: {
          lang: "python",
          caption: "미니 인프런 main.py — 값이 없으면 서버가 켜지지 않게",
          source: `load_dotenv()                                   # .env 파일을 읽어 환경변수로 등록
DATABASE_URL = os.getenv("DATABASE_URL")        # 환경변수에서 값 꺼내기
if DATABASE_URL is None:
    raise RuntimeError("DATABASE_URL 환경변수가 없습니다 (.env 또는 배포 설정 화면 확인)")
# Neon 은 postgresql:// 로 주는데, 그러면 SQLAlchemy 가 설치 안 된 psycopg2 를 찾는다
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)   # Neon 은 쉬면 연결을 끊는다`,
        },
      },
      {
        title: "DB 제약 — 있을 수 없는 상태를 DB 가 거부한다",
        body: "UNIQUE (user_id, course_id) 는 같은 강의 두 번 신청을, CHECK (points >= 0) 은 음수 포인트를, REFERENCES(외래키)는 없는 유저 · 강의를 가리키는 신청을 막는다. 파이썬에서 \"이미 신청했나 SELECT → 없으면 INSERT\" 로 막으면 두 요청이 그 틈에 함께 들어와 둘 다 INSERT 한다. threading.Lock 은 한 프로세스 안에서만 통해 서버가 여러 개면 못 막는다.",
        why: "모든 서버 · 프로세스가 같이 보는 곳은 DB 하나라서, DB 가 마지막 문지기가 된다.",
        code: {
          lang: "sql",
          caption: "미니 인프런 schema.sql — 고장 실험에서 같은 신청 두 번 · 음수 포인트가 DB 에서 거부됐다",
          source: `CREATE TABLE IF NOT EXISTS users (
    id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name   VARCHAR(20) NOT NULL,
    points INTEGER     NOT NULL DEFAULT 0 CHECK (points >= 0)   -- 음수 금지
);
CREATE TABLE IF NOT EXISTS enrollments (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    INTEGER     NOT NULL REFERENCES users(id),        -- 있는 유저만
    course_id  INTEGER     NOT NULL REFERENCES courses(id),      -- 있는 강의만
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, course_id)                                  -- 같은 강의 두 번 금지
);
-- 같은 신청 두 번: duplicate key value violates unique constraint "enrollments_user_id_course_id_key"
-- 포인트를 음수로: violates check constraint "users_points_check"`,
        },
      },
      {
        title: "트랜잭션 — 차감과 기록을 한 묶음으로",
        body: "with Session(engine) as session, session.begin(): 블록 안에서 강의 조회 → 유저 조회 → 포인트 확인 → 차감 + 신청 추가를 한다. 블록이 정상으로 끝나면 COMMIT, 중간에 HTTPException 같은 예외가 나면 앞에서 바꾼 포인트까지 자동 ROLLBACK 된다. session.flush() 로 SQL 을 COMMIT 전에 바로 보내 UNIQUE 위반을 그 자리에서 잡아 409 로 바꾼다.",
        why: "묶지 않으면 포인트만 빠지고 신청 기록은 없는 \"돈만 날린\" 상태가 생길 수 있다.",
        code: {
          lang: "python",
          caption: "미니 인프런 main.py — 404 · 400 · 409 가 나면 차감도 함께 취소된다",
          source: `with Session(engine) as session, session.begin():      # 정상 종료 COMMIT / 예외 ROLLBACK
    course = session.get(Course, body.course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="강의를 찾을 수 없습니다")

    user = session.get(User, user_id, with_for_update=True)   # 행 잠금 (아래 칸)
    if user.points < course.price:
        raise HTTPException(status_code=400, detail="포인트가 부족합니다")

    user.points -= course.price                         # 1) 차감
    enrollment = Enrollment(user_id=user.id, course_id=course.id)
    session.add(enrollment)                             # 2) 기록
    try:
        session.flush()                                 # UNIQUE 위반을 여기서 잡는다
    except IntegrityError:
        raise HTTPException(status_code=409, detail="이미 신청한 강의입니다")`,
        },
      },
      {
        title: "갱신 손실과 행 잠금(FOR UPDATE)",
        body: "35,000P 유저가 33,000원 · 3,000원 강의를 동시에 신청하면, 두 요청이 같은 35,000 을 읽고 각자 빼서 덮어써 둘 다 성공하고 32,000P 가 남았다. 결과가 음수가 아니라 CHECK 도, 강의가 달라 UNIQUE 도 못 잡는다. 유저 행을 SELECT ... FOR UPDATE 로 읽으면 뒤 요청은 앞 트랜잭션이 끝날 때까지 기다렸다가 2,000P 를 읽고 400 이 된다(201 + 400, 최종 2,000P).",
        why: "트랜잭션은 \"한 묶음\" 을 보장할 뿐, 다른 트랜잭션이 같은 행을 동시에 읽는 것까지 막지는 않는다 — 제약은 상태를, 잠금은 순서를 지킨다.",
        code: {
          lang: "sql",
          caption: "with_for_update=True 가 만드는 SQL (PostgreSQL 방언으로 컴파일해 확인)",
          source: `SELECT users.id, users.points
FROM users
WHERE users.id = %(id_1)s::INTEGER FOR UPDATE`,
        },
      },
      {
        title: "TanStack Query — 쓰기와 다시 읽기는 따로",
        body: "useQuery({ queryKey: [\"me\"] }) 가 /me 를 불러 포인트를 캐시에 둔다. 수강신청 버튼은 useMutation 으로 POST /enrollments 를 보내기만 하고, 화면 숫자를 바꾸는 건 invalidateQueries({ queryKey: [\"me\"] }) 다. 이 캐시를 낡았다고 표시해야 /me 를 다시 불러 새 포인트를 그린다.",
        why: "이 줄을 빼면 신청은 201 인데 화면 포인트는 옛 숫자 그대로 남는다.",
        code: {
          lang: "typescript",
          caption: "미니 인프런 frontend/lib/hooks.ts — 성공이든 실패든 서버의 진짜 포인트로 다시 그린다",
          source: `const mutation = useMutation({
  mutationFn: () => enroll(course.id),
  onSuccess: () => setToast(TOAST_BY_STATUS[201]),
  onError: (error) => { /* 400 · 401 · 409 마다 다른 토스트 */ },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
});`,
        },
      },
      {
        title: "배포 구조와 CORS",
        body: "프론트는 Vercel, 백엔드는 Render, DB 는 Neon 에 따로 두고 인터넷 주소로 서로 찾는다. Render 는 uvicorn main:app --host 0.0.0.0 --port $PORT 로 띄운다(기본 127.0.0.1 이면 자기 자신만 접속 가능). 배포 직후 목록 · 상세(SSR)는 됐는데 버튼만 실패했다 — SSR 은 Vercel 서버가 부르는 요청이라 CORS 검사가 없고, 버튼은 브라우저가 다른 출처로 보내는 요청이라 preflight 에서 막혔다. FRONTEND_ORIGINS 에 Vercel 주소를 쉼표로 추가해 해결했다.",
        why: "\"이 주소는 어느 컴퓨터를 가리키나?\" 를 먼저 물으면 localhost · CORS · 0.0.0.0 문제가 한 번에 풀린다.",
        code: {
          lang: "python",
          caption: "미니 인프런 main.py — 쉼표로 여러 주소를 허용 (값을 바꿔 가며 돌려 확인)",
          source: `app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
# 값 없음 → ['http://localhost:3000']
# "http://localhost:3000,https://mini-inflearn.vercel.app" → 두 주소 모두 허용`,
        },
      },
    ],
    pitfalls: [
      "Render 에 내 .env 의 값을 그대로 복사하면 localhost 가 들어가 접속 에러가 난다 — 같은 건 이름뿐이다",
      "NEXT_PUBLIC_ 값은 빌드할 때 브라우저 JS 에 글자로 박힌다 — 비밀번호를 넣으면 개발자 도구에 보이고, 값을 바꾸면 Redeploy 해야 반영된다",
      "CORS Origin 은 글자가 정확히 같아야 한다 — 끝에 / 를 붙이면 계속 막힌다",
      "비밀값이 새었다고 의심되면 지우는 게 아니라 바꾼다 — 이미 본 사람은 옛 값을 알고 있다",
      "Render 무료 플랜은 15분 동안 요청이 없으면 잠들어 첫 요청이 30~50초 걸린다 — 에러가 아니다",
      "Windows 에서 --reload 가 재시작 도중 멈추면 옛 코드가 계속 응답한다 — 고쳤는데 그대로면 SQL 로그에 FOR UPDATE 가 찍혔는지부터 본다",
    ],
    tags: ["백엔드", "트랜잭션", "동시성", "배포"],
    keywords:
      "environment variable dotenv os.getenv .env.example next_public transaction commit rollback session.begin flush integrityerror unique check foreign key constraint race condition lost update select for update with_for_update row lock tanstack query usemutation invalidatequeries cors preflight ssr vercel render neon deploy 0.0.0.0 psycopg pool_pre_ping 환경변수 트랜잭션 갱신 손실 행 잠금 경쟁 상태 멱등성 배포 수강신청 미니 인프런",
  },
  {
    slug: "be-orm-two-filters",
    area: "Back",
    course: "미니 인프런",
    lesson: "15회차",
    date: "2026.11.06",
    title: "목록 API ORM 통일 — Course · CourseOut 거름망 두 겹",
    summary:
      "SQLAlchemy 모델과 Pydantic 응답 모델이 각각 언제 무엇을 거르는지 구분하고, SELECT * API 를 없애 새 컬럼이 밖으로 새지 않게 할 수 있다.",
    points: [
      "Course 는 DB 에서 꺼낼 컬럼, CourseOut 은 밖으로 내보낼 칸",
      "response_model 은 모자라면 에러, 남으면 조용히 버린다",
      "순서는 SQL 실행 → return → CourseOut 검사",
    ],
    learned: [],
    sections: [
      {
        title: "Course 와 CourseOut — 거름망 두 겹",
        body: "Course(SQLAlchemy, Base 상속)는 DB 테이블과 짝을 이뤄 select(Course) 가 SELECT 할 컬럼을 정한다. CourseOut(Pydantic, BaseModel 상속)은 response_model 로 쓰여 응답 JSON 에 나갈 칸을 정한다. 생김새는 비슷해도 일하는 시점과 상대가 다르다.",
        why: "꺼내는 것과 보여 주는 것이 다를 수 있다 — 강사 연락처를 Course 로 꺼내 계산에 쓰되 CourseOut 에서 빼면 밖으로 나가지 않는다.",
        code: {
          lang: "python",
          caption: "미니 인프런 main.py — 모델 두 개와 목록 API",
          source: `class Course(Base):                  # 1차 거름망: DB 에서 꺼낼 컬럼 — DB 테이블과 반드시 일치
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    instructor: Mapped[str]
    price: Mapped[int]

class CourseOut(BaseModel):          # 2차 거름망: 밖으로 내보낼 칸
    id: int
    title: str
    instructor: str
    price: int

@app.get("/orm/courses", response_model=list[CourseOut])
def get_courses_orm():
    with Session(engine) as session:
        courses = session.scalars(select(Course)).all()   # ① Course 가 SQL 을 만든다
    return courses                                        # ② 돌려준 뒤 ③ CourseOut 검사`,
        },
      },
      {
        title: "response_model 의 두 규칙",
        body: "response_model 은 \"이 칸들은 꼭 있어야 하고, 이 칸들만 내보낸다\"는 명단이다. 돌려준 값에 명단의 칸이 빠지면 ResponseValidationError(500)로 내보내기를 거부하고, 명단에 없는 칸이 더 있으면 에러 없이 그 칸만 버린다.",
        why: "약속한 모양은 지키고, 약속하지 않은 정보는 새지 않게 한다.",
        code: {
          lang: "python",
          caption: "같은 명단에 칸이 남을 때와 모자랄 때",
          source: `from pydantic import BaseModel, ValidationError

class CourseOut(BaseModel):
    id: int
    title: str
    instructor: str
    price: int

# 칸이 남으면 — level 만 조용히 버려진다
print(CourseOut.model_validate({"id": 1, "title": "파이썬", "instructor": "클로드", "price": 33000, "level": "입문"}).model_dump())
# {'id': 1, 'title': '파이썬', 'instructor': '클로드', 'price': 33000}

# 칸이 모자라면 — 에러
try:
    CourseOut.model_validate({"id": 1, "title": "파이썬", "price": 33000})
except ValidationError as e:
    print(e.errors()[0]["type"], e.errors()[0]["loc"])   # missing ('instructor',)`,
        },
      },
      {
        title: "실행 순서 — SQL → return → 출구 검수",
        body: "GET /orm/courses 가 오면 select(Course) 가 SQL 을 만들어 DB 에 보내고(Course 가 일함), 결과를 return 한 뒤에야 FastAPI 가 CourseOut 명단으로 검사하고 JSON 으로 바꾼다(CourseOut 이 일함). response_model 검사는 SQL 을 보내기 전 확인이 아니라, 꺼내 온 값에 대한 출구 검수다.",
        why: "에러가 어느 단계에서 났는지 알면 원인이 바로 좁혀진다 — DB 가 준 None 이 응답 검사에 걸렸던 일(미니 인프런 트러블슈팅 기록)이 이 순서의 증거다.",
        code: {
          lang: "sql",
          caption: "echo=True 로 본 /orm/courses 의 SQL — 네 컬럼은 Course 클래스의 네 줄에서 나왔다",
          source: `SELECT courses.id, courses.title, courses.instructor, courses.price FROM courses`,
        },
      },
      {
        title: "UndefinedColumn 과 traceback 읽기",
        body: "Course 에만 level: Mapped[str] 을 넣고 DB 에는 그 컬럼이 없으면, SELECT 에 courses.level 이 들어가 DB 가 거부하고 500 이 난다. 출구 검수(CourseOut)까지 가 보지도 못한다. 긴 traceback 에서는 내 파일(main.py) 줄과 맨 아래 에러 줄만 보면 되고, sqlalchemy.exc.ProgrammingError 안쪽의 psycopg.errors.UndefinedColumn 이 진짜 원인이다.",
        why: "Course 는 DB 와 반드시 맞아야 하는 1차 거름망이다 — 이 어긋남을 사람 대신 막아 주는 도구가 마이그레이션(Alembic)이다.",
        code: {
          lang: "bash",
          caption: "고장 실험 — Course 에만 level 을 넣고 호출",
          source: `curl -i http://localhost:8000/orm/courses
# HTTP/1.1 500 Internal Server Error   ← 본문은 JSON 이 아니라 글자 Internal Server Error
# uvicorn 로그:
#   psycopg.errors.UndefinedColumn: column courses.level does not exist
#   [SQL: SELECT courses.id, courses.title, courses.instructor, courses.price, courses.level FROM courses]`,
        },
      },
      {
        title: "SELECT * API 를 지운 이유",
        body: "SELECT * + dict(row) 는 테이블의 모든 컬럼을 확인 없이 내보낸다. 나중에 instructor_phone 같은 컬럼을 추가하면 코드를 한 줄도 안 바꿔도 그 값이 공개 API 로 나가 누구나 curl 로 받아 간다. 그래서 목록도 /orm/courses 로 통일하고, 프론트 한 군데에서만 쓰던 /courses 는 지웠다.",
        why: "목록과 상세가 서로 다른 버전의 API 를 쓰면, 컬럼을 추가했을 때 두 화면의 결과가 달라진다.",
        code: {
          lang: "bash",
          caption: "지운 라우트는 FastAPI 가 모르는 주소라 404",
          source: `curl -i http://localhost:8000/courses
# HTTP/1.1 404 Not Found … {"detail":"Not Found"}`,
        },
      },
    ],
    pitfalls: [
      "Course 와 CourseOut 은 칸 이름이 같아도 역할이 다르다 — 상속이 Base 면 DB 쪽, BaseModel 이면 응답 쪽",
      "DB 에 ALTER TABLE 로 컬럼만 추가하면 ORM API 는 SELECT 하지 않아 그대로지만, SELECT * API 는 바로 새 컬럼을 내보낸다",
      "처리되지 않은 파이썬 에러의 500 본문은 JSON 이 아닌 글자라, 프론트에서 res.ok 확인 없이 res.json() 하면 SyntaxError 가 난다",
      "라우트를 지울 때 그 라우트만 쓰던 import(text)도 함께 지운다",
    ],
    tags: ["백엔드", "FastAPI", "SQLAlchemy", "Pydantic"],
    keywords:
      "fastapi sqlalchemy pydantic response_model basemodel declarativebase select orm select * dict(row) responsevalidationerror undefinedcolumn programmingerror traceback alembic migration curl echo 미니 인프런 거름망",
  },
  {
    slug: "be-path-param-404",
    area: "Back",
    course: "미니 인프런",
    lesson: "10회차",
    date: "2026.11.02",
    title: "강의 상세 API — 경로 파라미터 · 422 · 404",
    summary:
      "하나를 가리킬 때는 /courses/{id}, 목록에 거는 조건은 ? 로 쓴다. 경로 파라미터는 타입 표시로 입구에서 검사되고, DB 가 None 을 주면 return 전에 404 로 거른다.",
    points: [
      "999번이 없으면 /courses/999 는 404, ?id=999 는 200 과 빈 목록 — 주소가 가리키는 자원이 다르다",
      "abc 는 int 로 못 바꿔 422 — 서버 로그에 SQL 줄이 없어서 DB 까지 안 간 걸 확인했다",
      "404 처리를 빼면 None 이 응답 명단 검사까지 가서 500 이 났다",
    ],
    learned: [
      {
        title: "주소와 입구 검사",
        items: [
          "경로는 무엇을 가리키나, 쿼리는 목록에 거는 조건(필터 · 정렬 · 검색)",
          "주소 속 값은 원래 글자다 — course_id: int 표시를 보고 FastAPI 가 정수로 바꾸고, 못 바꾸면 함수를 실행하지 않는다",
          "Path(gt=0) 를 주면 0 이하도 입구에서 422 — int 만으로는 0, -5 가 DB 까지 간다",
          "고정 주소(/courses/popular)는 동적 주소({course_id})보다 위에 둔다 — 아래 있으면 popular 가 course_id 로 잡혀 422",
        ],
      },
      {
        title: "조회와 응답",
        items: [
          "session.get(Course, id) 는 기본 키로 하나만 찾고, 없으면 None — 실제 SQL 은 WHERE courses.id = %(pk_1)s",
          "값은 SQL 문장에 붙이지 않고 따로 보낸다(바인딩) — 이어 붙이면 입력이 명령으로 실행되는 SQL 인젝션",
          "없을 때 return {\"detail\": ...} 은 200 으로 나가 프론트가 성공으로 착각한다 → raise HTTPException(404)",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "\"파라미터로 정확히 요청하니까\" ?id=3 을 골랐다 → 둘 다 3 을 정확히 전달한다. 차이는 주소가 가리키는 것",
          "\"?id=3 이면 데이터가 전부 넘어온다\"고 섞어 말했다 → 주소 모양과 DB 에서 가져오는 양은 별개, 양은 WHERE 가 정한다",
          "빈칸에 id = 3 을 넣었다 → 고정 숫자면 /courses/5 도 항상 3번. 요청마다 바뀌는 course_id 를 넣어야 한다",
          "TS-007 원인을 \"DB 가 찾다가 실패\"라고 적었다 → DB 는 0개를 에러 없이 돌려줬고, 에러는 응답 단계에서 났다",
        ],
      },
    ],
    tags: ["백엔드", "FastAPI", "REST", "에러 처리"],
    keywords:
      "fastapi path parameter query parameter rest 404 422 httpexception session.get sqlalchemy sql injection binding prepared statement route order path gt responsevalidationerror model_attributes_type 미니 인프런",
  },
  {
    slug: "be-pydantic-response-model",
    area: "Back",
    course: "미니 인프런",
    lesson: "9회차",
    date: "2026.11.01",
    title: "Pydantic 응답 모델 — 내보낼 칸은 명단으로",
    summary:
      "FastAPI 는 return 된 객체의 칸을 전부 JSON 으로 바꾼다. 그래서 response_model 로 \"이것만 보내라\" 명단을 붙인다. 명단에 없는 칸은 조용히 빠지고, 명단의 필수 칸이 없으면 응답 전에 에러가 난다.",
    points: [
      "자동 변환에 맡기면 클래스에 강사 전화번호가 추가될 때 에러 없이 응답에 실려 나간다",
      "빼라 목록은 깜빡하면 새고, 이것만 보내라 목록은 깜빡해도 안 나간다 — 실수했을 때 안전한 쪽이 화이트리스트",
      "level: str 은 필수라 500, str | None = None 이어야 null 로 채운다",
    ],
    learned: [
      {
        title: "누가 무엇을 바꾸나",
        items: [
          "Postgres 는 행을 보내고, SQLAlchemy 는 행을 객체로, FastAPI 는 return 뒤에서 객체를 JSON 으로",
          "응답 명단은 테이블과 관계가 없어서 Base 가 아니라 BaseModel 을 물려받고, Mapped 없이 그냥 타입을 적는다",
          "반환 타입 힌트(-> list[CourseOut])로도 명단이 붙는다 — 둘 다 적으면 response_model 이 우선",
        ],
      },
      {
        title: "명단 설계",
        items: [
          "str | None 은 값의 종류, = None 은 칸이 없을 때의 기본값 — 기본값이 없으면 여전히 필수",
          "입력 명단(CourseCreate)과 출력 명단(CourseOut)은 따로 — 입력도 허용한 칸만 받아야 바꾸면 안 되는 칸을 지킨다",
          "connect_timeout 을 주면 DB 가 꺼졌을 때 응답 없이 멈추는 대신 빨리 에러가 난다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "\"PostgreSQL 이 JSON 으로 보내 줬다\"고 답했다 → echo 로그의 SQL 은 평범한 SELECT 였다",
          "화이트리스트가 나은 이유를 비용으로 들었다 → 핵심은 안전, 비용 차이는 거의 없다",
          "\"명단에 없는 값이면 에러\"라고 설명했다 → 명단에 없는 칸은 조용히 빠지고, 에러는 명단의 필수 칸이 객체에 없을 때",
          "API 가 응답 없이 멈췄다(TS-005) → Docker 엔진 자체가 꺼져 있었다. 에러 없이 멈추면 DB 부터 확인한다",
        ],
      },
    ],
    tags: ["백엔드", "FastAPI", "Pydantic", "보안"],
    keywords:
      "fastapi pydantic response_model basemodel dto schema whitelist blacklist jsonable_encoder responsevalidationerror optional default none from_attributes model_validate mass assignment connect_timeout docker 미니 인프런",
  },
  {
    slug: "be-transaction-rollback",
    area: "Back",
    course: "Nightly 풀스택",
    lesson: "M4",
    date: "2026.10.27",
    title: "구독 결제 — 트랜잭션 · 롤백 · 영수증 검증 · 낙관적 업데이트",
    summary:
      "결제 한 건(주문 + 구독)을 하나의 트랜잭션으로 묶었다. Repository 는 flush 까지만 하고, Service 가 끝에서 commit 을 한 번 한다. 결제사 영수증 검증은 느린 외부 호출이라 트랜잭션 밖에서 먼저 한다.",
    points: [
      "Repository 에서 commit 하게 바꿨더니 주문 1 · 구독 0 이 남았고, 재시도는 UNIQUE 에 막혀 409 만 받았다 (돈만 빠진 고객)",
      "금액은 프론트 말이 아니라 결제사 응답과 서버 가격표만 믿는다 — 요청에서 금액을 아예 받지 않는다",
      "돈이 걸린 결제는 서버가 확정한 뒤 invalidateQueries, 틀려도 피해가 작은 토글만 낙관적 업데이트",
    ],
    learned: [
      {
        title: "트랜잭션",
        items: [
          "flush 는 SQL 을 보내 id 는 받지만 확정이 아니라 롤백으로 취소된다 — 구독에 order_id 가 필요해서 쓴다",
          "롤백은 마지막 커밋 이후만 지운다 — 이미 커밋한 건 안 돌아온다",
          "Read Committed(PostgreSQL 기본)라 커밋 전 구독은 다른 요청에 안 보인다 — 롤백된 구독으로 무제한을 주는 일이 없다",
          "시퀀스 번호는 롤백돼도 반납되지 않는다 — 실험 후 첫 정상 주문 id 가 2였다",
        ],
      },
      {
        title: "외부 호출과 프론트",
        items: [
          "영수증 검증을 트랜잭션 안에 넣으면 기다리는 동안 DB 커넥션을 붙잡고, 결제사 승인은 DB 롤백으로 안 돌아와 얻는 것도 없다",
          "낙관적 업데이트는 onMutate(스냅샷 + 먼저 바꾸기) → onError(되돌리기) → onSettled(재조회) — 실패하면 스위치가 왔다 갔다 하는 게 정상",
          "결제사는 승인했는데 커밋이 실패하면 → 결제 취소(보상 트랜잭션), PENDING 주문 먼저 저장, 웹훅으로 최종 맞춤",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "Repository commit 실험 결과를 주문 2 · 구독 1 로 셌다 → raise 가 나면 아래 줄은 실행되지 않아 주문 1 · 구독 0",
          "async with db.begin() 이 \"A transaction is already begun\" → get_current_user 의 SELECT 로 이미 autobegin 됐다. try / commit / except / rollback 으로",
          "\"트랜잭션 밖\"이 되려면 검증 전에 조회용 트랜잭션을 commit 으로 닫아야 했다",
          "rollback 뒤 user.id 에 접근하자 MissingGreenlet → 롤백이 객체를 만료시켜서, 필요한 값은 롤백 전에 꺼내 둔다",
        ],
      },
    ],
    tags: ["백엔드", "트랜잭션", "결제", "TanStack Query"],
    keywords:
      "transaction acid atomicity commit rollback flush autobegin isolation level read committed dirty read receipt verification payment gateway idempotency unique integrityerror optimistic update usemutation invalidatequeries onmutate onerror onsettled saga compensation sqlalchemy nightly m4",
  },
  {
    slug: "be-sqlalchemy-orm",
    area: "Back",
    course: "미니 인프런",
    lesson: "8회차",
    date: "2026.10.27",
    title: "SQLAlchemy ORM 전환 — 클래스와 테이블 짝짓기",
    summary:
      "ORM 은 파이썬 클래스와 DB 테이블을 짝지어 SQL 로 번역해 주는 통역사다. 클래스 속성 오타는 DB 에 가기 전에 잡히지만, 클래스와 테이블이 어긋난 것은 DB 에 가서야 드러난다.",
    points: [
      "문자열 SQL 의 오타는 API 를 부를 때 Postgres 가 처음 알아챈다 — Course.titel 은 에디터와 파이썬이 먼저 잡는다",
      "echo=True 로 보니 ORM 도 결국 SQL 을 보낸다 — 컬럼 이름의 출처는 DB 가 아니라 내가 적은 클래스",
      "클래스에만 있는 level 컬럼은 서버는 잘 켜지고 호출할 때 UndefinedColumn 이 났다",
    ],
    learned: [
      {
        title: "ORM",
        items: [
          "select(Course) → ORM 이 SQL 로 번역 → 드라이버가 Postgres 로 → 돌아온 행을 Course 객체로",
          "Base 를 상속한 클래스만 SQLAlchemy 가 테이블로 알아본다 — 파이썬은 위에서 아래로 읽으니 Base 가 먼저",
          "where · order_by 도 파이썬으로 쓰고, 값은 자리표시자로 들어가 SQL 인젝션을 막는다",
        ],
      },
      {
        title: "클래스는 테이블의 복사본이 아니다",
        items: [
          "Mapped[str] 은 NOT NULL 이라는 약속 — 실제 테이블과 제약이 달라도 조회만 할 때는 드러나지 않는다",
          "create_all 은 없는 테이블만 만들고 있는 테이블은 고쳐 주지 않는다 — 함께 바꾸는 건 Alembic 의 일",
          "어긋나면 어느 쪽이 기준인지부터 정한다 — 잘못 들어간 컬럼이면 클래스에서, 정말 필요하면 테이블에",
          "ORM 에러는 맨 아래 [SQL: ...] 줄부터 — 무엇을 보냈고 왜 거절당했는지 한 번에 보인다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "없는 테이블을 조회하면 [] 가 올 줄 알았다 → [] 는 테이블은 있고 행이 0개일 때, 없는 테이블은 에러",
          "Relational 을 \"객체의 관계\"로, ORM 결과를 dict 로 알았다 → 관계형 DB 의 그 Relational, 결과는 Course 객체",
          "level 에러를 테이블 이름 오타로 읽었다 → 없다는 건 courses 가 아니라 level 컬럼",
          "uvicorn: command not found → 설치는 돼 있었고 가상환경이 활성화되지 않아 PATH 에 없었다",
        ],
      },
    ],
    tags: ["백엔드", "SQLAlchemy", "ORM", "PostgreSQL"],
    keywords:
      "sqlalchemy orm declarativebase mapped mapped_column session select scalars echo undefinedcolumn attributeerror create_all alembic migration not null uvicorn command not found venv activate 미니 인프런",
  },
  {
    slug: "be-sse-redis-ratelimit",
    area: "Back",
    course: "Nightly 풀스택",
    lesson: "M3",
    date: "2026.10.26",
    title: "AI 코칭 스트리밍 — SSE · Redis Rate Limiting · 워커",
    summary:
      "AI 를 부르기 전에 모든 워커가 같이 보는 Redis 에서 INCR + EXPIRE 로 1분 3회를 세어 넘으면 429 로 끊고, 통과하면 async 제너레이터의 yield 와 StreamingResponse(SSE) 로 글자를 만들어지는 대로 흘려보낸다.",
    points: [
      "파이썬 dict 로 세면 안 되는 이유는 속도가 아니라 공유 — 워커는 메모리를 나누지 않는 별개 프로세스다",
      "검문은 AI 호출 전, StreamingResponse 를 만들기 전 — 스트리밍이 시작되면 200 이 이미 나가 상태 코드를 못 바꾼다",
      "INCR 과 EXPIRE 를 따로 보내면 그 사이 장애로 TTL 없는 키가 남아 영구 차단된다 → 파이프라인 + EXPIRE NX",
    ],
    learned: [
      {
        title: "비동기와 워커",
        items: [
          "async def 안의 time.sleep · requests 는 이벤트 루프를 얼려 그 워커의 다른 요청까지 멈춘다 (실습: 세 유저 0.9초 → 0.9 · 1.8 · 2.7초)",
          "FastAPI 는 def 엔드포인트를 스레드 풀에서 돌려 루프를 지킨다",
          "워커는 코어 수에서 시작 — 워커마다 커넥션 풀이 따로라 DB 연결 수가 곱해진다",
        ],
      },
      {
        title: "바로잡은 것",
        items: [
          '"동기로 짜면 다른 유저는 접속조차 못 한다" 는 FastAPI 에선 반만 맞다 — def 는 스레드 풀에서 돈다',
          "프론트에서 read() 조각마다 바로 나누면 이벤트가 중간에 잘려 글자가 사라진다 → 빈 줄(이벤트 끝) 기준으로 버퍼에 모은다",
          "글자 수는 토큰 수가 아니다 — 실서비스는 AI 응답의 usage 값을 기록한다",
          "첫 글자까지의 시간은 TTFB 가 아니라 TTFT",
        ],
      },
      {
        title: "설계",
        items: [
          "SSE 는 서버 → 브라우저 단방향이라 AI 답변에 맞고, JWT 헤더와 POST 가 필요해 EventSource 대신 fetch + ReadableStream",
          "고정 윈도우는 경계에서 몰아 쓰면 한도의 2배까지 통과한다 — 정확도가 돈과 직결되면 슬라이딩 윈도우 · 토큰 버킷",
          "스트리밍 내내 DB 세션을 붙잡으니 마지막 사용량 기록은 새 세션으로 짧게 쓴다",
        ],
      },
    ],
    tags: ["백엔드", "Redis", "SSE", "비동기"],
    keywords:
      "sse server sent events streaming streamingresponse redis rate limiting incr expire 429 async await event loop worker uvicorn gunicorn fastapi nightly m3 ttft token bucket",
  },
  {
    slug: "be-fastapi-postgres",
    area: "Back",
    course: "미니 인프런",
    lesson: "7회차",
    date: "2026.10.23",
    title: "FastAPI 와 Postgres 연결 — 접속 주소 · 커넥션 풀 · commit",
    summary:
      "밖에서 DB 에 붙으려면 사용자 · 비밀번호 · 주소 · 포트 · DB 이름과 드라이버가 필요하다. engine 은 연결 보관함(풀)을 두고 돌려 쓰고, commit 없이 with 가 끝나면 SQLAlchemy 가 ROLLBACK 을 보낸다.",
    points: [
      '주소는 "그 이름표를 알아듣는 쪽이 누구냐" 로 고른다 — 노트북의 uvicorn 은 localhost:5433, 같은 compose 의 컨테이너는 db:5432',
      "INSERT 가 에러 없이 사라졌다 — 로그 끝의 ROLLBACK 을 보고 commit 누락을 찾았다",
      "engine 은 서버를 켤 때 한 번 — 요청마다 만들면 연결 비용을 계속 치른다",
    ],
    learned: [
      {
        title: "역할 나누기",
        items: [
          "SQLAlchemy 는 파이썬 → SQL 번역가, psycopg 는 DB 와 실제로 연결을 맺는 드라이버",
          "DB 행은 튜플이라 이름표가 없다 → mappings() 로 열 이름을 붙여 JSON 으로 돌려준다",
          "psql 은 문장마다 자동 commit, SQLAlchemy connect() 는 트랜잭션을 자동으로 열고 확정은 내가 한다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          '"Docker 안에 있으니 db 를 쓴다" 고 생각했다 → 컨테이너 밖 uvicorn 은 db 라는 이름을 모른다',
          "인사말 로그가 첫 요청에만 찍힌 걸 echo 탓으로 봤다 → 풀에서 이미 연결된 통로를 다시 빌려 쓴 것이었다",
          "GENERATED ALWAYS 인 id 에 값을 직접 넣어 INSERT 가 실패했다 → id 는 DB 에 맡긴다",
          "ROLLBACK 해도 identity 번호는 돌아오지 않아 id 에 빈 번호가 생긴다 — id 는 순번이 아니라 이름표",
        ],
      },
      {
        title: "다음에 쓸 것",
        items: [
          "engine.begin() — 끝까지 성공하면 자동 COMMIT, 예외가 나면 ROLLBACK",
          "값은 f-string 이 아니라 :id 파라미터로 넘긴다 — SQL 인젝션 방지",
          "접속 URL 은 코드가 아니라 환경변수(DATABASE_URL)로 뺀다",
        ],
      },
    ],
    tags: ["백엔드", "FastAPI", "PostgreSQL", "SQLAlchemy"],
    keywords:
      "fastapi postgres postgresql sqlalchemy psycopg engine connection pool commit rollback transaction docker compose localhost mini inflearn 미니 인프런 identity mappings",
  },
  {
    slug: "be-webhook-hmac",
    area: "Back",
    course: "Nightly 풀스택",
    lesson: "M2",
    date: "2026.10.22",
    title: "웹훅 받기 — HMAC 서명과 멱등성 키",
    summary:
      "외부 서버가 먼저 보내는 웹훅은 원본 바이트와 비밀키로 서명을 다시 계산해 위조를 401로 막고, 같은 이벤트가 다시 와도 한 번만 저장한 뒤 200을 돌려줘 재시도를 멈춘다.",
    points: [
      "서명은 받은 원본 바이트로 계산한다 — 다시 직렬화하면 공백 · 키 순서가 바뀌어 정상 요청도 거절된다",
      "중복 방어 2단: 멱등성 키를 먼저 조회(흔한 재전송을 싸게) + DB UNIQUE 위반(IntegrityError)으로 동시 요청까지",
      "중복에도 500이 아니라 200 — 보내는 쪽은 상태 코드만 보고 재시도를 정한다",
    ],
    learned: [
      {
        title: "용어",
        items: [
          "웹훅: 일이 끝나면 외부 서버가 먼저 보내는 HTTP 요청 (폴링의 반대)",
          "HMAC-SHA256: 본문 + 비밀키로 만든 서명. 암호화가 아니라 진짜인지 확인하는 일방향 계산",
          '최소 한 번 전달: 200을 못 받으면 다시 보낸다 → 받는 쪽이 "정확히 한 번 반영"을 만든다',
        ],
      },
      {
        title: "설계",
        items: [
          "비교는 == 대신 hmac.compare_digest — 타이밍 공격을 막는다",
          "서명 검증은 core/security.py 에 두고 라우터에 Depends 로 붙인다 (횡단 관심사)",
          '"같은 수면은 한 번만 반영"은 비즈니스 규칙(service), UNIQUE 컬럼은 그 수단(DB)',
        ],
      },
      {
        title: "트러블슈팅",
        items: [
          "시뮬레이터 요청이 전부 404 — DB가 비어서가 아니라 main.py 에 라우터를 등록하지 않아서였다",
          '가짜 서명조차 401이 아니라 404인 걸 보고 "주소 자체를 모른다"로 범위를 좁혔다',
        ],
      },
    ],
    tags: ["백엔드", "웹훅", "보안", "멱등성"],
    keywords:
      "webhook hmac sha256 signature idempotency key integrityerror unique fastapi retry at-least-once",
  },
  {
    slug: "be-auth-jwt",
    area: "Back",
    course: "Nightly 풀스택",
    lesson: "M1",
    date: "2026.10.21",
    title: "로그인과 권한 — Bcrypt · JWT · 401과 403",
    summary:
      '비밀번호는 Bcrypt 로 되돌릴 수 없게 저장하고, 로그인하면 짧은 Access(15분)와 긴 Refresh(7일) 토큰을 준다. 문지기는 "누구냐(401)"와 "자격 있냐(403)"를 나눠 검사한다.',
    points: [
      "인증 실패는 401, 로그인은 됐지만 권한이 없으면 403 — 프론트가 로그인 창으로 보낼지 안내만 할지가 갈린다",
      "JWT 는 암호화가 아니라 서명 — payload 는 누구나 열어 볼 수 있다",
      "type 검사를 빼면 7일짜리 refresh 토큰이 access 처럼 통과한다 (고장 실험으로 401 → 200 확인)",
    ],
    learned: [
      {
        title: "비밀번호",
        items: [
          "Bcrypt 는 단방향이라 원래 비밀번호를 알려줄 수 없고 재설정만 가능하다",
          "checkpw 는 저장된 해시 안의 salt 를 꺼내 같은 salt 로 다시 계산해 비교한다",
          "72바이트 제한 — 한글 24자면 이미 72바이트, bcrypt 5.0 은 잘라내지 않고 ValueError",
        ],
      },
      {
        title: "의존성 주입",
        items: [
          "Depends(get_current_user) 는 함수를 넘길 뿐, 요청이 올 때 FastAPI 가 실행해 결과를 꽂아 준다",
          "안쪽부터 실행된다: 토큰 꺼내기 → 사용자 확인 → 관리자 확인 → 엔드포인트",
          "중간에 401 · 403 이 나면 그 위는 실행되지 않는다",
        ],
      },
      {
        title: "토큰",
        items: [
          "JWT 는 규격(재질), Access · Refresh 는 그 재질로 만든 용도",
          "자주 오가는 Access 는 짧게 — 털려도 피해가 작다",
          "RTR: refresh 를 쓸 때마다 새 것으로 바꾸고 헌 것은 폐기한다",
        ],
      },
    ],
    tags: ["백엔드", "인증", "JWT", "보안"],
    keywords:
      "auth authentication authorization bcrypt jwt access refresh token 401 403 depends dependency injection rtr argon2",
  },
  {
    slug: "be-sql-courses-table",
    area: "Back",
    course: "미니 인프런",
    lesson: "6회차",
    date: "2026.10.21",
    title: "SQL 로 courses 테이블 만들기 — 기본 키 · 제약 조건 · 정렬",
    summary:
      "행 하나는 겹치지도 바뀌지도 않는 기본 키로 집고, 개수가 정해지지 않은 목록은 칸을 늘리지 말고 테이블을 나눈다. 제약 조건은 기존 데이터까지 포함한 약속이다.",
    points: [
      "id 는 DB 가 발급(GENERATED ALWAYS AS IDENTITY) — 사람이 적으면 실수와 동시 입력 충돌이 생긴다",
      '가격은 "55,000원" 글자가 아니라 55000 숫자로 — 계산도 정렬도 숫자여야 맞다',
      "NULL 행이 남아 있으면 NOT NULL 을 걸 수 없다 → 먼저 정리하고 건다",
    ],
    learned: [
      {
        title: "설계",
        items: [
          "강의명 + 강사명도 겹칠 수 있고 바뀔 수 있어 기본 키가 못 된다",
          "목차처럼 여러 개인 값은 lessons 테이블로 나누고 course_id 외래 키로 잇는다 (제1정규형)",
        ],
      },
      {
        title: "psql 에서 막힌 것",
        items: [
          "; 없이 엔터를 치면 실행되지 않고 프롬프트가 postgres-# 로 바뀐다",
          "따옴표 안에서 엔터를 쳐 이름 앞에 줄바꿈이 저장됐다 — length() 로 숨은 글자를 찾았다",
          "WHERE instructor = ... 로 고치면 엉뚱한 행이 바뀐다 → 고칠 땐 id 로 집는다",
        ],
      },
      {
        title: "정렬",
        items: [
          "ORDER BY 가 없으면 순서는 보장되지 않는다 (UPDATE 후 1, 3, 2 로 나옴)",
          "ORDER BY 기본은 오름차순, 큰 값부터는 DESC",
        ],
      },
    ],
    tags: ["백엔드", "SQL", "PostgreSQL", "DB 설계"],
    keywords:
      "sql create table primary key identity not null constraint order by desc postgresql psql varchar normalization",
  },
  {
    slug: "be-docker-postgres",
    area: "Back",
    course: "미니 인프런",
    lesson: "5회차",
    date: "2026.10.20",
    title: "Docker 로 PostgreSQL 띄우기 — 이미지 · 컨테이너 · 볼륨",
    summary:
      "이미지는 읽기 전용 레시피, 컨테이너는 언제든 버려도 되는 실행본이다. 지워져도 남아야 하는 DB 데이터는 컨테이너 밖 볼륨에 두고, 포트 매핑으로 내 컴퓨터에서 접속한다.",
    points: [
      "down 은 볼륨을 남기고 down -v 는 데이터까지 지운다 — 테이블을 만들어 두 경우를 직접 확인했다",
      '"5433:5432" 는 호스트:컨테이너 — 이미 깔린 PostgreSQL 과 겹치지 않게 호스트 쪽을 바꿨다',
      'SELECT 1; 은 데이터 조회가 아니라 "DB 살아 있니?" 생존 확인',
    ],
    learned: [
      {
        title: "개념",
        items: [
          "컨테이너는 VM 이 아니다 — 호스트 커널을 같이 쓰고 프로세스만 격리한다",
          "컨테이너 하나에 역할 하나 — FastAPI 와 DB 는 따로 두고 연결한다",
          "공식 postgres 이미지는 볼륨을 안 적어도 익명 볼륨을 만든다 → 이름 붙은 볼륨을 선언해야 다시 꽂을 수 있다",
        ],
      },
      {
        title: "트러블슈팅",
        items: [
          'service "db" refers to undefined volume — 서비스에서 쓴 볼륨 이름과 선언한 이름이 달랐다',
          '에러는 "어디서 + 무엇이 + 왜" — service "db" 는 위치일 뿐 원인은 그 뒤에 있다',
          "psql 은 DB 가 아니라 DB 서버에 접속하는 클라이언트",
        ],
      },
    ],
    tags: ["백엔드", "Docker", "PostgreSQL", "인프라"],
    keywords:
      "docker compose postgres image container volume port mapping psql select 1 healthcheck pg_isready",
  },
  {
    slug: "be-layered-user-api",
    area: "Back",
    course: "Nightly 풀스택",
    lesson: "S0-7",
    date: "2026.10.19",
    title: "3계층 회원 API와 pytest — Router · Service · Repository",
    summary:
      "회원가입 API 를 Router(받기) → Service(규칙) → Repository(DB) 로 나누고, 오가는 데이터는 DTO(Pydantic)로 통제했다. 그래서 비밀번호는 응답에서 빠지고, 가짜 저장소로 Service 만 따로 테스트한다.",
    points: [
      "response_model 은 거름망 — 빼면 hashed_password 까지 그대로 응답에 나간다",
      "Service 는 DB 를 직접 만지지 않고 self.user_repo.create(...) 에 맡긴다 (의존성 주입)",
      "계층을 나누면 FakeRepo 를 원래 자리에 끼워 DB 없이 Service 를 테스트할 수 있다",
    ],
    learned: [
      {
        title: "ORM · 세션 · 비동기",
        items: [
          "User(...) 는 메모리에 객체를 찍을 뿐 DB 에 저장하지 않는다",
          "AsyncSession 은 스키마를 만드는 게 아니라 DB 와 대화하는 통로 (쿼리 · 추적 · 트랜잭션)",
          "비동기는 응답이 오면 멈추는 게 아니라, 기다리는 동안 await 에서 양보하는 것",
        ],
      },
      {
        title: "Pydantic",
        items: [
          "요청 DTO(UserCreate)와 응답 DTO(UserResponse)를 따로 둔다",
          'Field(..., min_length=2) 의 ... 는 "기본값 없음 = 필수"',
          "async def 안의 time.sleep 같은 동기 코드는 서버 전체를 멈춘다",
        ],
      },
    ],
    tags: ["백엔드", "FastAPI", "아키텍처", "테스트"],
    keywords:
      "layered architecture router service repository dto pydantic pytest fake repository asyncsession dependency injection response_model",
  },
  {
    slug: "be-why-database",
    area: "Back",
    course: "미니 인프런",
    lesson: "4회차",
    date: "2026.10.19",
    title: "데이터베이스가 필요한 이유 — 휘발성과 동시성",
    summary:
      "변수는 메모리라 서버가 꺼지면 사라지고, 읽기와 쓰기 사이의 틈에 동시 요청이 끼어들면 앞사람 결과를 덮어쓴다. 막는 건 속도가 아니라 구조다.",
    points: [
      "갱신 손실: 자리 1개를 둘이 동시에 읽고 둘 다 0을 저장한다 — 에러 없이 조용히 틀린다",
      "직접 300번 돌려 보니 Lock 없이 2명 성공이 약 20%, 빈 파일을 읽은 에러가 218번",
      "서버 안의 Lock 은 프로세스 하나에서만 통한다 → 줄 세우기는 DB 한 곳에서",
    ],
    learned: [
      {
        title: "휘발성",
        items: [
          "RAM 은 전원이 꺼지면 지워지고, 디스크(파일 · DB)는 남는다",
          "DB 도 메모리 버퍼를 쓰지만 커밋할 때 WAL 로그를 디스크에 먼저 써서 복구된다 (내구성)",
        ],
      },
      {
        title: "동시성",
        items: [
          "멱등성은 같은 요청의 반복, 동시성은 서로 다른 요청의 끼어들기",
          "트랜잭션만 열면 막히는 게 아니다 — READ COMMITTED 에서 SELECT 후 계산한 값을 UPDATE 하면 같은 버그",
          "막는 법: 원자적 조건부 UPDATE · SELECT … FOR UPDATE · 유니크 제약",
        ],
      },
      {
        title: "바로잡은 것",
        items: [
          '처음엔 "대부분 1명만 성공"이라고 적었다가, 직접 300번 실행해 보고 고쳤다',
          '"테스트에서 안 터졌다"는 안전하다는 증거가 아니다',
        ],
      },
    ],
    tags: ["백엔드", "DB", "동시성", "트랜잭션"],
    keywords:
      "database db concurrency lost update transaction lock 갱신 손실 멱등성 postgresql",
  },
  {
    slug: "be-nightly-setup",
    area: "Back",
    course: "Nightly 풀스택",
    lesson: "S0-1~6",
    date: "2026.10.18",
    title: "빈 폴더에서 DB 연결까지 — 모노레포 · CORS · Alembic",
    summary:
      "빈 폴더에서 FastAPI 와 Next.js 를 띄워 CORS 로 잇고, Docker Postgres + 비동기 SQLAlchemy + Alembic 으로 첫 users 테이블까지 만들었다. 코드는 가상환경, 인프라는 컨테이너, DB 구조는 마이그레이션으로 관리한다.",
    points: [
      "CORS 차단은 서버가 아니라 브라우저가 한다 — curl 로 부르면 200 이 정상으로 온다",
      "Alembic 은 DB 용 Git — alembic_version 테이블에 현재 버전을 기록하고 upgrade head 로 맞춘다",
      "세션을 닫지 않으면 커넥션 풀(10 + 20)이 바닥나 서버는 살아 있는데 DB API 가 전부 멈춘다 → async with",
    ],
    learned: [
      {
        title: "환경",
        items: [
          "가상환경은 패키지만, 컨테이너는 리눅스 환경까지 격리한다",
          ".gitignore 에 .venv · node_modules — 설계도(lock 파일)만 올리고 각자 설치한다",
          "/health 는 DB 없이 가볍게 — 켜져 있지만 응답 못 하는 서버를 찾는 용도",
        ],
      },
      {
        title: "DB",
        items: [
          "async def 에서는 asyncpg + create_async_engine — DB 를 기다리는 동안 다른 요청을 처리한다",
          "커넥션 풀은 미리 악수해 둔 연결을 돌려 쓰는 것",
        ],
      },
    ],
    tags: ["백엔드", "FastAPI", "PostgreSQL", "Alembic"],
    keywords:
      "monorepo fastapi nextjs cors alembic migration sqlalchemy async asyncpg connection pool docker postgres health check uv",
  },
  {
    slug: "be-routing-json",
    area: "Back",
    course: "미니 인프런",
    lesson: "2회차",
    date: "2026.10.16",
    title: "라우팅과 JSON 응답 — @app.get 데코레이터",
    summary:
      '서버는 요청의 메서드 + 경로로 실행할 함수를 찾고(라우팅), FastAPI 는 @app.get("/courses") 이름표로 그 연결을 만든다. 목록은 [ {}, {}, {} ], 하나는 { } 로 돌려준다.',
    points: [
      "요청 받기 → 함수 찾기 → 데이터 준비 → JSON 응답, 일치하는 함수가 없으면 404",
      "라우팅은 가장 비슷한 함수를 고르지 않는다 — 데코레이터가 없으면 아무 함수도 실행되지 않는다",
      '바깥 [ ] 는 "이 셋은 한 묶음"이라는 포장지 — 프론트에서 map 을 쓰려면 꼭 필요하다',
    ],
    learned: [
      {
        title: "요청과 응답의 규칙",
        items: [
          "데코레이터는 소문자 — @app.get · @app.post (대문자 GET 은 AttributeError)",
          "딕셔너리 키는 따옴표로 감싼다 — 따옴표 없는 id 는 파이썬 내장 함수 id 를 가리킨다",
          "메서드 · 경로는 요청에, 상태 코드 · 본문은 응답에 담긴다",
        ],
      },
      {
        title: "더 알아둔 것",
        items: [
          "/docs 에서 등록된 경로를 보고 프론트 없이 요청을 보내 본다",
          '경로 파라미터(/courses/2)는 "무엇을", 쿼리 파라미터(?page=2)는 "어떻게 볼지"',
        ],
      },
    ],
    tags: ["백엔드", "FastAPI", "라우팅", "JSON"],
    keywords:
      "routing decorator fastapi app.get json array object 404 path parameter query parameter docs",
  },
  {
    slug: "be-http-basics",
    area: "Back",
    course: "미니 인프런",
    lesson: "1회차",
    date: "2026.10.15",
    title: "HTTP 요청과 응답 — 메서드 · 경로 · 상태 코드",
    summary:
      "브라우저와 서버는 HTTP 라는 약속으로 대화한다. 요청은 메서드(무슨 동작)와 경로(어떤 자원), 응답은 상태 코드(결과 도장) · 헤더(설명서) · 본문(JSON)으로 이뤄진다.",
    points: [
      "읽기만 하면 GET, 새 기록을 남기면 POST — 수강신청을 GET 으로 만들면 새로고침만으로 중복 신청될 수 있다",
      "2xx 성공 · 4xx 요청한 쪽 잘못 · 5xx 서버 잘못 — 프로그램은 문장보다 숫자로 판단한다",
      "curl -i 로 직접 보니 하나는 { }, 목록은 [ {..}, {..} ]",
    ],
    learned: [
      {
        title: "404 의 한계",
        items: [
          "/postss(경로 오타)와 /posts/99999(데이터 없음)가 둘 다 404 · {} — 404 만으로는 구분되지 않는다",
          "경로 철자 → 정상 경로 → 해당 번호 순서로 확인한다",
        ],
      },
      {
        title: "요청의 구성",
        items: [
          "요청은 메서드 + 경로(path) — 쿼리 파라미터는 경로 안의 일부다",
        ],
      },
    ],
    tags: ["백엔드", "HTTP", "네트워크"],
    keywords:
      "http request response method get post status code 404 500 header body json curl",
  },
  // ── 알고리즘 (프로그래머스 코테 풀이) — 문제 풀이 대신 무엇을 떠올려야 풀리는지와 막힌 곳을 정리 ──
  // 14번부터 F-012 노트 틀(개념 · 왜 · 코드). 코드는 개념 확인용 조각만 싣고 풀이 전문은 싣지 않는다(Python 3 에서 돌려 확인)
  {
    slug: "algo-phone-book",
    area: "Back",
    course: "알고리즘",
    lesson: "14번",
    date: "2026.11.06",
    title: "전화번호 목록 — 정렬 후 이웃 비교 · 접두어",
    summary:
      "문자열을 사전순으로 정렬하면 접두어 관계가 반드시 이웃에서 드러난다는 성질로, 모든 쌍을 보지 않고 O(N log N) 에 접두어를 찾을 수 있다.",
    points: [
      "사전순 정렬 후에는 옆자리끼리 N-1번만 비교하면 된다",
      "접두어 검사는 startswith — in 은 중간에 있어도 참",
      "해시셋 풀이는 번호마다 앞부분을 set 에서 O(1) 로 찾는다",
    ],
    learned: [],
    sections: [
      {
        title: "문자열 사전순 정렬",
        body: '문자열은 길이가 아니라 첫 글자부터 한 글자씩 비교해 순서를 정하고, 한쪽이 먼저 끝나면 짧은 쪽이 앞이다. 그래서 숫자로는 119 가 12 보다 크지만 문자열로는 "119" < "12" 다. 같은 앞부분으로 시작하는 문자열끼리는 정렬하면 한 덩어리로 붙는다.',
        why: 'int 로 바꿔 정렬하면 접두어가 같은 번호가 흩어지고, "0123" 의 앞자리 0 도 사라진다.',
        code: {
          lang: "python",
          caption: "사전순이면 접두어 관계인 번호가 이웃이 된다",
          source: `book = ["119", "97674223", "1195524421"]
print(sorted(book))           # ['119', '1195524421', '97674223'] ← 접두어 관계가 이웃
print(sorted(book, key=int))  # ['119', '97674223', '1195524421'] ← 숫자순이면 흩어진다
print("119" < "12")           # True
print(int("0123"))            # 123 ← 앞자리 0 이 사라진다`,
        },
      },
      {
        title: "정렬 후 이웃 비교 — 왜 옆자리만 봐도 되나",
        body: "사전순으로 정렬했을 때 A 가 C 의 접두어라면, A 와 C 사이에 끼는 문자열 B 는 전부 A 로 시작한다. 그래서 A–B 이웃 비교에서 이미 접두어가 잡힌다. 이 성질은 예외 없이 성립하므로 이웃 N-1번 비교로 빠짐없이 찾는다.",
        why: "N 이 100만이면 모든 쌍 비교는 약 5,000억 번이라 시간 초과, 정렬 + 이웃 비교는 O(N log N) 이다(번호 길이 L ≤ 20 을 상수로 볼 때, 엄밀히는 O(L · N log N)).",
        code: {
          lang: "python",
          caption: '"12" 와 "1234" 는 직접 비교하지 않아도 첫 쌍에서 잡힌다',
          source: `pb = sorted(["1234", "12", "120"])
print(pb)                                             # ['12', '120', '1234']
print([b.startswith(a) for a, b in zip(pb, pb[1:])])  # [True, False]`,
        },
      },
      {
        title: "접두어 검사 — startswith 와 슬라이싱",
        body: "접두어는 \"맨 앞이 같은가\"라서 뒤.startswith(앞) 으로 묻는다. 뒤 번호를 앞 번호 길이만큼 잘라 비교(뒤[:len(앞)] == 앞)해도 같다. 슬라이싱은 범위를 넘어도 에러 없이 있는 데까지만 잘라서, 뒤 번호가 더 짧아도 길이 검사가 필요 없다.",
        why: 'in 은 어디든 들어 있으면 참이라 "1" in "21" 이 True — 접두어가 아닌데 걸린다.',
        code: {
          lang: "python",
          caption: "포함과 맨 앞, 슬라이싱과 인덱싱",
          source: `print("1234".startswith("23"), "23" in "1234")  # False True
s = "12"
print(repr(s[0:3]), repr(s[5:9]))  # '12' '' ← 슬라이싱은 범위 밖이어도 에러가 없다
s[2]                               # IndexError: string index out of range ← 인덱싱은 에러`,
        },
      },
      {
        title: "조기 반환과 return 위치",
        body: '"하나라도 있으면 False" 는 찾는 즉시 return 으로 끝내도 되지만, "하나도 없으면 True" 는 반복을 끝까지 돈 뒤 반복문 밖에서만 말할 수 있다. any() 에 제너레이터 식을 넘기면 처음 참을 만나는 순간 나머지를 계산하지 않아서 같은 조기 종료를 한 줄로 쓴다.',
        why: 'return True 를 반복문 안 else 에 두면 첫 쌍만 보고 끝나 ["1", "23", "234"] 에서 오답(True)이 나온다.',
      },
      {
        title: "해시셋 풀이와 트라이",
        body: "모든 번호를 set 에 넣고, 번호마다 앞부분(1글자 … 자기 길이-1글자)이 set 에 있는지 O(1) 로 찾으면 정렬 없이 O(N · L²) 에 풀린다. 번호가 계속 추가 · 삭제되거나 자동완성처럼 앞부분 검색이 많으면, 글자 하나를 한 칸으로 저장하는 트라이(O(N · L))가 맞다.",
        why: "목록이 한 번에 주어지면 정렬 한 번이면 되지만, 하나씩 계속 들어오면 매번 다시 정렬해야 해서 불리하다.",
      },
    ],
    pitfalls: [
      "for i in len(pb) - 1 은 정수라 TypeError('int' object is not iterable) — 횟수는 range() 로 감싼다",
      "슬라이싱 길이에 len(pb)(번호 개수)를 쓰면 접두어를 놓친다 — 앞 번호 하나의 길이 len(pb[i]) 만큼 자른다",
      "해시셋 풀이에서 range(1, len(num) + 1) 까지 돌리면 자기 자신이 set 에 있어 어떤 입력이든 False",
      "sort() 는 넘겨받은 리스트 자체를 바꾼다 — 호출한 쪽 순서를 지켜야 하면 sorted()",
    ],
    tags: ["알고리즘", "해시", "정렬", "Python"],
    keywords:
      "algorithm phone book prefix startswith lexicographic sort hash set trie slicing indexerror early return any zip sorted 전화번호 목록 접두어 사전순 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-lru-cache",
    area: "Back",
    course: "알고리즘",
    lesson: "12번",
    date: "2026.10.26",
    title: "LRU 캐시 — [1차] 캐시",
    summary:
      "캐시 바구니를 직접 유지하며 최근에 쓴 것은 한쪽, 가장 오래 안 쓴 것은 반대쪽 끝에 둔다. Hit 이면 빼서 최근 쪽에 다시 넣고, Miss 인데 꽉 찼으면 가장 오래된 것을 버린다.",
    points: [
      "LRU 는 들어온 순서가 아니라 마지막으로 쓴 시점이 기준 — Hit 때 갱신을 빼면 FIFO 가 된다",
      "deque 풀이는 in · remove 가 캐시 크기만큼 돌아 O(N × C) — C ≤ 30 이라 충분하다",
      "C 가 크면 OrderedDict(해시 + 이중 연결 리스트)로 조회 · 이동 · 삭제를 모두 O(1)",
    ],
    learned: [
      {
        title: "OrderedDict",
        items: [
          "move_to_end(key) 로 최근으로, popitem(last=False) 로 가장 오래된 것을 꺼낸다",
          "dict 도 3.7부터 넣은 순서를 기억하지만, 키를 앞뒤로 옮기는 연산은 없다",
          "deque(maxlen=C) 는 꽉 차면 반대쪽이 자동으로 밀려나고, 0 이면 아무것도 담기지 않는다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          '직전 C개 요청을 슬라이싱으로 보려 했다 → 캐시는 "최근에 쓴 서로 다른 C개" 라 [1, 2, 2, 2, 1] 에서 틀린다',
          "set 으로 정리하려 했다 → 순서가 없어 누가 가장 오래됐는지 알 수 없다",
          '꽉 찬 조건을 < 로 썼다 → 숫자를 넣어 읽으면 "아직 자리 있다" 는 뜻이라 >=',
          '"O(N) + O(N) = O(N)" 이라고 설명했다 → 반복 안의 비용은 더하지 않고 곱해서 O(N × C)',
        ],
      },
      {
        title: "실무로 옮기면",
        items: [
          "functools.lru_cache, Redis allkeys-lru 는 용량 기준으로 밀어낸다",
          "TanStack Query gcTime, Redis EXPIRE 는 시간 기준(TTL) — 다른 교체 정책이다",
        ],
      },
    ],
    tags: ["알고리즘", "캐시", "Python"],
    keywords:
      "algorithm lru cache deque ordereddict kakao 카카오 캐시 hit miss ttl eviction 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-delivery-box",
    area: "Back",
    course: "알고리즘",
    lesson: "11번",
    date: "2026.10.22",
    title: "스택 시뮬레이션 — 택배상자",
    summary:
      '메인 벨트의 상자를 일단 보조 벨트(스택)에 넣고, 맨 위가 지금 실을 상자인 동안 while 로 연속해서 꺼낸다. idx 는 "지금 찾는 순서" 이자 "실은 개수" 라 그대로 답이 된다.',
    points: [
      "for 안의 while 이어도 O(N) — 상자마다 push 1번, pop 최대 1번이라 전체 2N 이하",
      "실을 상자가 이미 나왔는데(order[idx] <= box) 맨 위가 아니면 밑에 깔린 것 → 거기서 끝",
      "바로 실을 수 있는 상자도 일단 넣으면 분기 없이 한 경로로 처리된다",
    ],
    learned: [
      {
        title: "판단 기준",
        items: [
          '중첩 반복은 "바깥 한 번마다" 가 아니라 "전체 통틀어" 몇 번 도는지로 센다',
          "스택 하나로 만들 수 있는 순서는 312 패턴이 없는 순열뿐이다 (길이 1~7 전부 실행해 확인)",
          "보류했다가 연쇄 처리하는 흐름은 같아도, 아무 번호나 꺼내야 하면 스택이 아니라 dict 나 힙",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          'order[idx] <= box 를 "order 가 크다" 로 반대로 읽었다 → 변수 뜻을 말로 먼저 바꾼다',
          "조기 종료를 append 앞에 두면 [1, 2, 3] 이 0 — 꺼낼 수 있는 걸 다 꺼낸 뒤에 판단한다",
          '"for 는 한 번만 돈다" 는 바깥만 설명한 것 — 핵심은 push · pop 총횟수였다',
        ],
      },
    ],
    tags: ["알고리즘", "스택", "Python"],
    keywords:
      "algorithm stack simulation 택배상자 amortized 분할 상환 stack sortable permutation 312 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-rotate-brackets",
    area: "Back",
    course: "알고리즘",
    lesson: "10번",
    date: "2026.10.20",
    title: "스택 · for–else — 괄호 회전하기",
    summary:
      '회전은 s[i:] + s[:i], 짝 검증은 스택이다. 닫는 괄호를 키로 둔 dict 로 "닫는 괄호인가 · 내 짝인가" 를 O(1) 에 보고, 빈 스택에서 실패한 경우를 성공으로 세지 않도록 완주했을 때만 센다.',
    points: [
      "개수만 세면 ([)] 처럼 순서가 엇갈린 경우를 못 잡는다 → 가장 최근에 열린 것을 기억하는 스택",
      '"빈 스택" 은 성공의 증거가 아니다 — 빈 스택에서 break 해도 스택은 비어 있다 → for–else',
      'stack 은 회전마다 새로, pair · count 는 루프 밖 — "반복마다 새로 시작하나, 계속 쌓이나"',
    ],
    learned: [
      {
        title: "문법",
        items: [
          "for–else 의 else 는 break 없이 끝났을 때만 실행된다",
          "and 는 앞이 거짓이면 뒤를 안 본다 — stack and stack[-1] 순서가 IndexError 를 막는다",
          "검증을 함수로 분리하면 return False 로 바로 나와 for–else 가 필요 없다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          'ch == "(" or "[" 는 항상 참 — 1번 문제의 실수가 다시 나왔다. 여러 값 비교는 in',
          "s[:i] + s[i:] 는 원래 문자열 그대로 → 앞을 떼어 뒤로 붙인다",
          '반례로 든 "][]" 는 홀수 길이라 버그를 재현하지 못했다 → 짝수 반례 "[](){}" 에서 3 대신 6',
        ],
      },
      {
        title: "실무로 옮기면",
        items: [
          "에디터 괄호 검사는 True/False 가 아니라 오류 위치가 필요하다 — 스택에 (괄호, 인덱스) 를 넣는다",
        ],
      },
    ],
    tags: ["알고리즘", "스택", "Python"],
    keywords:
      "algorithm stack bracket rotation for else 괄호 회전하기 dict short circuit 단축 평가 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-feature-deploy",
    area: "Back",
    course: "알고리즘",
    lesson: "9번",
    date: "2026.10.19",
    title: "완료 시점 계산 — 기능개발",
    summary:
      "하루씩 시뮬레이션하지 않고 기능마다 남은 일수를 올림 나눗셈으로 먼저 구한다. 앞에서부터 기준일 이하인 기능은 같은 배포로 묶고, 더 오래 걸리는 기능을 만나면 확정 → 기준 갱신 → 1부터 다시 센다.",
    points: [
      "같은 날 끝난 기능도 함께 배포된다 — < 가 아니라 <=",
      "큰 값을 만났을 때 세 줄 세트: append(확정) → max_day 갱신 → count = 1",
      "정수 올림 -(-a // b) 는 실수 나눗셈을 거치지 않아 부동소수점 오차가 없다",
    ],
    learned: [
      {
        title: "다른 풀이",
        items: [
          "deque 로 맨 앞을 꺼내고 기준 이하인 것을 while 로 함께 꺼내면 마지막 묶음 처리가 필요 없다",
          "결과 리스트의 마지막 칸을 진행 중인 묶음으로 쓰면 루프 밖 append 가 사라진다",
          "zip 은 길이가 다르면 짧은 쪽에서 조용히 멈춘다 — 3.10+ 은 strict=True",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "기준보다 큰 값을 만나도 count += 1 을 해 두 배포가 한 덩어리가 됐다",
          "루프가 끝난 뒤 마지막 묶음 append 를 빠뜨렸다",
          '설명할 때 "기준보다 작은 값" 이라고 해 경계(<=)가 틀렸다',
        ],
      },
    ],
    tags: ["알고리즘", "큐", "Python"],
    keywords:
      "algorithm queue deque ceil 기능개발 배포 완료 시점 zip 올림 나눗셈 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-rollcake",
    area: "Back",
    course: "알고리즘",
    lesson: "8번",
    date: "2026.10.18",
    title: "경계 이동 · 증분 갱신 — 롤케이크 자르기",
    summary:
      "칼을 한 칸씩 옮기며 왼쪽 set 에는 넣기만, 오른쪽 Counter 에서는 빼다가 0이 되면 종류에서 지운다. 매번 전체를 다시 세지 않으니 100만 개도 O(N) 이다.",
    points: [
      "넣기만 하는 쪽은 set, 빼기도 하는 쪽은 개수를 아는 Counter",
      "Counter 는 값이 0이어도 키가 남아 len 에 잡힌다 → del 하거나 종류 수 변수를 따로 둔다",
      "왼쪽 종류는 늘기만, 오른쪽은 줄기만 — 왼쪽이 커지면 바로 끝낼 수 있다",
    ],
    learned: [
      {
        title: "다른 풀이",
        items: [
          "앞에서 한 번, 뒤에서 한 번 종류 수 배열을 미리 만들고 경계마다 비교 — 빼는 연산이 없어 실수가 적다",
          "단조성이 있으면 같아지는 구간은 한 덩어리 → 이분 탐색 후보",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "큐를 먼저 떠올렸지만 큐는 종류 수를 바로 알려주지 않는다",
          "왼쪽 dict, 오른쪽 set 으로 반대로 짝지었다 → 빼는 쪽에 set 을 쓰면 하나만 빠져도 종류가 통째로 사라진다",
        ],
      },
      {
        title: "실무로 옮기면",
        items: [
          "접속 · 종료 이벤트마다 접속자 수를 갱신하는 실시간 집계 — 전체를 다시 세지 않는다",
        ],
      },
    ],
    tags: ["알고리즘", "해시", "Python"],
    keywords:
      "algorithm counter set incremental prefix suffix 롤케이크 자르기 경계 이동 증분 갱신 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-sliding-window-discount",
    area: "Back",
    course: "알고리즘",
    lesson: "7번",
    date: "2026.10.18",
    title: "고정 길이 슬라이딩 윈도우 — 할인 행사",
    summary:
      "시작일마다 10일 치를 잘라 Counter 로 세고 목표 dict 와 == 로 통째 비교한다. 길이 N 에서 길이 K 구간은 N − K + 1 개라 range 끝값에 +1 이 필요하다.",
    points: [
      "range 가 세는 건 날짜가 아니라 시작일의 개수 — 10일 치를 자르는 건 슬라이싱의 몫",
      "연산 어림은 (반복 횟수) × (한 번에 하는 일) — 10만 × 10 = 100만",
      "창을 한 칸 밀 때 들어오는 1개는 더하고 나가는 1개는 빼면 창이 커져도 O(N)",
    ],
    learned: [
      {
        title: "Counter",
        items: [
          "없는 키를 조회하면 KeyError 대신 0",
          "dict 와 == 로 키 · 값이 모두 같은지 한 번에 비교한다",
          "dict(zip(want, number)) 로 두 리스트를 짝지은 dict",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "10만 × 10만을 백만으로 계산했다 → 실제 100억. 지수로 적어서 곱한다",
          "enumerate 가 1부터 센다고 착각해 수량이 한 칸 밀렸다",
          "range(len - 10) 이면 길이 10 입력에서 한 번도 검사하지 않는다 → N − K + 1",
          "비교 자리에 = 를 써서 목표 dict 를 덮어썼다",
        ],
      },
    ],
    tags: ["알고리즘", "슬라이딩 윈도우", "해시"],
    keywords:
      "algorithm sliding window counter dict 할인 행사 off by one range 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-monotonic-stack",
    area: "Back",
    course: "알고리즘",
    lesson: "6번",
    date: "2026.10.15",
    title: "단조 스택 — 뒤에 있는 큰 수 찾기",
    summary:
      '스택을 "나보다 큰 수를 기다리는 인덱스 대기실" 로 쓴다. 새 수가 맨 위보다 크면 while 로 꺼내며 그 자리에 답을 적고, 각 인덱스는 한 번 들어가고 한 번 나오므로 100만 개도 O(N) 이다.',
    points: [
      "값이 아니라 인덱스를 넣는다 — 답을 원래 자리에 적어야 해서",
      "for 안의 while 이어도 O(N) — 원소마다 push 1번, pop 최대 1번",
      "같은 값은 더 큰 수가 아니다 — 앞에서 돌면 <, 뒤에서 돌면 <=",
    ],
    learned: [
      {
        title: "변형",
        items: [
          "뒤에 있는 작은 수는 부등호만 바꿔 단조 증가 스택",
          '"몇 칸 뒤" 를 물으면 answer[prev] = i - prev',
          "구간 길이 k 의 최댓값은 단조 덱으로 O(N) — 최근 5분 최대 응답 시간 같은 집계",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          'while 조건 부등호를 반대로 봤다 → "지금 온 숫자가 더 클 때 꺼낸다" 를 말로 먼저 쓴다',
          "함정 고르기에서 pop(0) 을 골랐지만 진짜 함정은 동점에 <= 를 쓰는 것이었다 ([3, 3, 5])",
        ],
      },
    ],
    tags: ["알고리즘", "스택", "Python"],
    keywords:
      "algorithm monotonic stack next greater element 뒤에 있는 큰 수 단조 스택 deque sliding window amortized 분할 상환 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-heap-hotel",
    area: "Back",
    course: "알고리즘",
    lesson: "5번",
    date: "2026.10.15",
    title: "최소 힙 — 호텔 대실",
    summary:
      "최소 객실 수는 동시에 겹치는 예약 수의 최댓값이다. 시작 시각으로 정렬하고, 사용 중인 방의 비는 시각을 최소 힙에 두어 가장 빨리 비는 방 하나만 확인한다.",
    points: [
      '청소 10분은 끝 시각에 미리 더해 비교를 "시작 >= 비는 시각" 하나로 만든다',
      "같은 답을 그리디 · 스위핑 · 힙 세 방법으로 풀고 무작위 입력으로 결과를 맞춰 봤다",
      "k번째 방을 여는 순간 예약 k개가 동시에 겹친다 — 그래서 그리디가 최적이다",
    ],
    learned: [
      {
        title: "방법 비교",
        items: [
          "방별로 채우기 O(N²), 시작 순간마다 겹침 세기 O(N²), 최소 힙 O(N log N)",
          "힙은 삽입 · 삭제가 O(log N), 정렬된 리스트는 삽입이 O(N)",
          "heapreplace 는 반드시 rooms[0] <= start 를 확인한 뒤에 — 안 그러면 쓰는 방을 빼 버린다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "첫 예약의 끝과만 비교했다 → 넣을 때마다 기준을 갱신 (예제는 통과, 무작위 3만 개 중 1만 2천여 개 오답)",
          '구간끼리 겹치는지로 세서 과대 계산했다 → 각 예약의 "시작 순간" 에 쓰는 방 수로 센다',
          "< 를 써서 청소가 끝나는 그 분에 방을 못 줬다 → <=",
        ],
      },
      {
        title: "실무로 옮기면",
        items: [
          "회의실 · 좌석 예약에서 필요한 방 수, 커넥션 풀 크기 산정",
          "메모리 할당기가 반납된 블록을 재사용할지 새로 할당할지 판단하는 구조와 같다",
        ],
      },
    ],
    tags: ["알고리즘", "힙", "그리디"],
    keywords:
      "algorithm heap heapq priority queue greedy sweeping 호텔 대실 회의실 meeting rooms interval 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-bfs-gamemap-network",
    area: "Back",
    course: "알고리즘",
    lesson: "4번",
    date: "2026.10.15",
    title: "BFS · DFS — 게임 맵 최단거리 · 네트워크",
    summary:
      "이동 비용이 모두 같고 최단거리를 물으면 BFS 다. 가까운 곳부터 한 겹씩 퍼지므로 처음 도착한 거리가 곧 최단이고, 연결 묶음 개수는 탐색을 새로 시작한 횟수다.",
    points: [
      "꺼내는 위치 하나가 방식을 바꾼다 — popleft 면 BFS, pop 이면 DFS",
      "방문 표시는 큐에 넣는 순간 — 꺼낼 때 찍으면 같은 칸이 중복으로 들어간다 (빈 맵에서 약 2배)",
      '"손으로 풀 때 무엇을 기억했나" 가 곧 자료구조 선택이다',
    ],
    learned: [
      {
        title: "패턴",
        items: [
          "상하좌우는 방향 배열 + for 하나, 범위 체크는 0 <= nr < n 한 곳에서",
          "네트워크는 미방문 컴퓨터에서 탐색을 새로 시작할 때 +1",
          "재귀 DFS 는 파이썬 재귀 한도(기본 1000)를 조심한다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "최단거리를 DFS 로 구해 반례에서 9 대신 11 — 먼 길이 먼저 도장을 찍었다",
          "방문 표시 없이 탐색해 같은 칸을 오가며 끝나지 않았다",
          "대칭이라 cur+1 부터만 봤더니 연결 0–2, 1–2 에서 묶음이 2로 나왔다 → 이웃은 항상 전체를 본다",
        ],
      },
      {
        title: "실무로 옮기면",
        items: [
          "지도 · 게임 UI 최단 경로. 이동 비용이 다르면 다익스트라",
          "친구 그룹 · 서비스 의존성 묶음. 연결이 계속 추가되면 Union-Find",
        ],
      },
    ],
    tags: ["알고리즘", "BFS", "그래프"],
    keywords:
      "algorithm bfs dfs graph 게임 맵 최단거리 네트워크 visited 연결 요소 union find dijkstra 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-queue-truck-process",
    area: "Back",
    course: "알고리즘",
    lesson: "3번",
    date: "2026.10.15",
    title: "큐 — 다리를 지나는 트럭 · 프로세스",
    summary:
      "들어온 순서대로 처리하면 큐(deque)다. 한 초 안의 순서(시간 → 내리기 → 올리기)를 정하고, 꺼냈다 다시 넣어도 누구인지 알 수 있게 (우선순위, 원래 위치) 로 묶는다.",
    points: [
      "list.pop(0) 은 O(N), deque.popleft() 는 O(1)",
      "다리 무게는 매번 sum() 대신 변수로 더하고 빼서 숨은 반복을 없앤다",
      "트럭을 못 올리는 구간은 다음 하차 시각으로 시간을 점프해 최악 약 1억 번 → O(N)",
    ],
    learned: [
      {
        title: "시간 초과 어림",
        items: [
          "제약의 최대 N 으로 반복 횟수를 곱하고, 파이썬은 1초에 약 1천만 번으로 잡는다",
          "max · sum · in · pop(0) · index 도 한 줄짜리 반복으로 센다",
          "N 이 ~1,000 이면 2중 반복, ~10만이면 반복 1개 + 정렬까지",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "나갈 시간 비교 방향을 반대로 써 트럭이 일찍 빠졌다 → 나갈 시간 == 지금",
          "올리기를 먼저 해서 같은 초의 빈자리를 못 썼다 → 내리기 먼저",
          '"남은 것의 max 와 다르면 뒤로" 는 [3, 1] 에서 무한루프 → "남은 max 가 더 크면"',
        ],
      },
      {
        title: "실무로 옮기면",
        items: [
          "토스트 알림 대기열, 작업 큐",
          "우선순위 작업은 매번 max 대신 힙(heapq)으로 O(log N)",
        ],
      },
    ],
    tags: ["알고리즘", "큐", "Python"],
    keywords:
      "algorithm queue deque fifo 다리를 지나는 트럭 프로세스 우선순위 시간 초과 시간복잡도 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-stack-brackets-tasks",
    area: "Back",
    course: "알고리즘",
    lesson: "2번",
    date: "2026.10.15",
    title: "스택 — 올바른 괄호 · 과제 진행하기",
    summary:
      "가장 최근 것부터 처리해야 하면 스택이다. 괄호는 맨 위가 ( 이고 지금이 ) 일 때만 짝을 지우고, 멈춘 과제는 [이름, 남은 시간] 으로 쌓았다가 빈 시간 동안 while 로 최근 것부터 이어서 한다.",
    points: [
      '짝 조건은 "다르면" 이 아니라 "맨 위 ( 그리고 지금 )" — 방향을 봐야 ")(" 를 잡는다',
      "괄호가 한 종류면 숫자 하나로 충분하고, 중간에 음수가 되면 바로 실패",
      "빈 시간에 멈춘 과제를 여러 개 끝낼 수 있어서 if 가 아니라 while",
    ],
    learned: [
      {
        title: "정렬과 시각",
        items: [
          '"hh:mm" 은 분으로 바꿔 계산하고 시작 시각 기준으로 정렬한다',
          "sorted(key=x[1]) 은 NameError — key 에는 값이 아니라 함수(lambda x: x[1])를 넘긴다",
          "sorted() 는 새 리스트, .sort() 는 원본을 바꾸고 None 을 돌려준다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          "작업시간으로 정렬했다 → 과제는 시작 시각에 시작하므로 기준은 start",
          "스택에 남은 시간만 넣어 꺼냈을 때 이름이 없었다 → [이름, 남은 시간]",
          "빈 시간에 하나만 꺼내 [c, b, d, a] 가 나왔다 → while 로 반복해 [c, b, a, d]",
        ],
      },
      {
        title: "실무로 옮기면",
        items: [
          "에디터 · 린터의 태그 짝 검사, Undo 히스토리",
          "선점형 작업 스케줄러 — 재시작돼도 이어가려면 진행 상태를 DB 나 Redis 에 저장한다",
        ],
      },
    ],
    tags: ["알고리즘", "스택", "Python"],
    keywords:
      "algorithm stack lifo 올바른 괄호 과제 진행하기 sorted lambda 코테 코딩테스트 프로그래머스",
  },
  {
    slug: "algo-hash-openchat-report",
    area: "Back",
    course: "알고리즘",
    lesson: "1번",
    date: "2026.10.15",
    title: "해시 — 오픈채팅방 · 신고 결과 받기",
    summary:
      "키로 값을 바로 찾는 dict 와 중복을 알아서 지우는 set 으로 기록을 집계한다. 마지막 상태가 과거 출력에도 반영되면 끝까지 한 번 훑어 상태를 확정한 뒤, 두 번째 순회로 출력을 만든다.",
    points: [
      "리스트 탐색은 O(N), dict 조회는 평균 O(1) — 조회가 반복될수록 차이가 커진다",
      '"나중 닉네임이 예전 메시지에도 반영" → 1번째 순회로 확정, 2번째 순회로 출력',
      '"같은 신고는 한 번만" → 피신고자별 신고자 set',
    ],
    learned: [
      {
        title: "자료구조",
        items: [
          "빈 set 은 set(), {} 는 빈 dict",
          "없는 키에 add 하면 KeyError → 미리 초기화하거나 defaultdict(set)",
          "이름 → 위치 dict 를 만들어 두면 매번 index() 로 찾는 숨은 반복이 사라진다",
        ],
      },
      {
        title: "막힌 것 · 바로잡은 것",
        items: [
          'x == "Enter" or "Change" 는 항상 참 — 비어 있지 않은 문자열이 True 라서. x in ("Enter", "Change") 로 쓴다',
          "reported[b] = a 는 덮어쓰기라 마지막 신고자만 남았다 → set 에 add",
          "한 번 순회하며 바로 메시지를 만들면 이후 닉네임 변경을 알 수 없다",
        ],
      },
      {
        title: "실무로 옮기면",
        items: [
          "채팅 메시지에는 닉네임이 아니라 user_id 를 저장하고, 그릴 때 최신 닉네임을 붙인다",
          "중복 신고는 DB 에서 (신고자, 피신고자) UNIQUE 로 막는다",
        ],
      },
    ],
    tags: ["알고리즘", "해시", "Python"],
    keywords:
      "algorithm hash dict set defaultdict 오픈채팅방 신고 결과 받기 kakao 카카오 중복 제거 코테 코딩테스트 프로그래머스",
  },
  // ── FastAPI (2026.08.18부터 하루 한 편 — 노션 00~15 = 1~16일차, 날짜는 사용자가 알려 준 대로) ──
  {
    slug: 'be-fastapi-intro',
    area: 'Back',
    course: 'FastAPI',
    lesson: '1일차',
    date: '2026.08.18',
    title: 'FastAPI 시작 — 프레임워크 · ASGI · Uvicorn · 자동 문서',
    summary: 'FastAPI 는 Starlette(웹 처리) + Pydantic(검증) 위에 만든 API 프레임워크다. 타입 힌트를 읽어 검증과 문서(/docs)를 자동으로 만들고, 실제 실행은 ASGI 서버 Uvicorn 이 맡는다.',
    points: [
      '책임이 나뉜다 — Uvicorn 은 포트를 열고 요청을 받고, FastAPI 는 URL 과 함수를 잇고, Pydantic 은 값을 검사한다',
      '라이브러리는 내가 불러 쓰고, 프레임워크는 내 함수를 불러 준다(제어의 역전)',
      'Swagger UI(/docs)와 ReDoc(/redoc)은 같은 /openapi.json 을 다르게 그린 화면일 뿐이다',
    ],
    learned: [
      {
        title: '웹서비스와 프레임워크',
        items: [
          '정적 웹 → 동적 웹 → MVC → API 중심으로 발전했다. React + FastAPI 는 서버가 JSON 만 주는 4세대 구조',
          '마이크로 프레임워크는 라우팅 · 요청 · 응답만 두고 DB · 인증은 필요할 때 붙인다 — 마이크로서비스(MSA)와는 다른 말',
          'Node.js 는 프레임워크가 아니라 자바스크립트 실행 환경이다. 웹 프레임워크는 Express · NestJS',
        ],
      },
      {
        title: 'ASGI 와 Uvicorn',
        items: [
          'ASGI 는 서버와 앱이 대화하는 규격, Uvicorn 은 그 규격을 따르는 서버 — 콘센트 규격과 멀티탭 관계',
          'uvicorn main:app 의 app 은 파일 안 FastAPI() 객체의 변수 이름이다. 이름이 다르면 "Attribute app not found"',
          'WSGI(Flask · Django)는 동기 전용, ASGI 는 async 와 웹소켓까지 지원한다',
        ],
      },
      {
        title: '실행과 배포',
        items: [
          '요즘은 pip install "fastapi[standard]" 로 uvicorn · CLI 를 한 번에 받고 fastapi dev(개발) · fastapi run(배포)으로 띄운다',
          '--reload 는 개발 전용, 배포는 워커 여러 개로 돌린다. 127.0.0.1 은 내 컴퓨터만, 0.0.0.0 은 외부 접속까지 받는다',
          '프론트는 /openapi.json 으로 TypeScript 타입을 자동 생성할 수 있다 — 타입 힌트 = 문서 = 계약서',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'ASGI', 'Uvicorn', 'Swagger'],
    keywords: 'fastapi starlette pydantic asgi wsgi uvicorn swagger redoc openapi docs framework library ioc 제어의 역전 microframework flask django fastapi dev run reload 0.0.0.0 127.0.0.1 uv',
  },
  {
    slug: 'be-fastapi-routing',
    area: 'Back',
    course: 'FastAPI',
    lesson: '2일차',
    date: '2026.08.19',
    title: '라우팅 — 경로 매개변수 · 쿼리 매개변수 · 기본값 · 경로 순서',
    summary: '라우팅은 "이 메서드 + 이 URL 이면 이 함수"라는 연결표다. 경로 매개변수는 무엇을 가리킬지, 쿼리 매개변수는 어떻게 보여 줄지를 정한다.',
    points: [
      '함수 인자 이름이 경로의 {이름}과 같으면 경로 매개변수, 경로에 없는 단순 타입이면 쿼리 매개변수다',
      '타입 힌트가 없으면 URL 값은 문자열 그대로 들어온다 — /items/5 는 "5"',
      '라우트는 쓴 순서대로 비교한다 — 고정 경로(/users/me)를 변수 경로(/users/{id})보다 위에 둔다',
    ],
    learned: [
      {
        title: '경로와 쿼리',
        items: [
          '상품 5번처럼 자원 자체는 경로(/items/5), 페이지 · 정렬 · 필터처럼 보여 주는 방식은 쿼리(?skip=0&limit=10)',
          '경로 매개변수는 항상 필수, 쿼리는 기본값을 주면 선택이 된다',
          '소유 관계는 중첩 경로로 드러낸다(/users/7/items) — 2단계 정도까지만',
        ],
      },
      {
        title: '페이지네이션',
        items: [
          '3페이지(페이지당 10개)는 skip = (3 - 1) × 10 = 20, limit = 10 — DB 로는 OFFSET 20 LIMIT 10',
          'OFFSET 이 커질수록 느려져서 무한 스크롤은 "마지막으로 본 id 다음부터" 커서 방식을 쓴다',
          'Annotated[int, Query(ge=1, le=100)] 처럼 범위를 걸어 limit=100000 같은 요청을 입구에서 막는다',
        ],
      },
      {
        title: 'URL 설계',
        items: [
          'URL 에는 명사(복수형), 동사는 HTTP 메서드가 맡는다 — /getItems 대신 GET /items',
          '같은 URL 이라도 메서드가 다르면 다른 라우트다',
          '/items 를 /items/ 로 등록하면 끝 슬래시 없는 요청은 307 로 옮겨진다 — 프론트 fetch 에서 헷갈리는 지점',
          '라우트가 많아지면 APIRouter(prefix="/items")로 파일을 나누고 main 에서 include_router 로 합친다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', '라우팅', 'REST', '페이지네이션'],
    keywords: 'fastapi routing path parameter query parameter skip limit pagination offset cursor route order users me annotated query path ge le apirouter include_router prefix rest 307 redirect trailing slash',
  },
  {
    slug: 'be-fastapi-type-hints',
    area: 'Back',
    course: 'FastAPI',
    lesson: '3일차',
    date: '2026.08.20',
    title: '타입 힌트 — 자동 변환 · 검증 · Query · 컨테이너 타입 · Optional',
    summary: 'FastAPI 에서 타입 힌트는 장식이 아니라 명령이다. item_id: int 한 줄이 변환("5" → 5) · 검증("fun" → 422) · 문서화를 한꺼번에 한다.',
    points: [
      '파이썬은 타입 힌트를 무시한다 — FastAPI 가 함수 서명을 읽어 두었다가 Pydantic 으로 변환 · 검증한 뒤 함수를 부른다',
      '단순 타입은 쿼리, list · dict · 모델은 본문(body)이 기본 — 쿼리로 리스트를 받으려면 Query()를 붙인다',
      'str | None 은 "None 도 된다"일 뿐 선택이 아니다. 선택으로 만드는 건 기본값(= None)',
    ],
    learned: [
      {
        title: '변환과 검증',
        items: [
          '검증은 함수에 들어가기 전에 일어나서, 잘못된 값은 내 함수까지 오지 않고 422 로 돌아간다',
          'Pydantic 기본은 바꿀 수 있으면 바꿔 준다 — "123" → 123 은 통과, "fun" · "1.5" 는 422. 막고 싶으면 strict 모드',
          'bool 은 true · 1 · yes · on 을 True, false · 0 · no · off 를 False 로 받는다',
        ],
      },
      {
        title: '어디서 꺼내나',
        items: [
          'Query() 없이 q: list[int] = [] 로 쓰면 에러 없이 본문에서 찾아서 ?q=1&q=2 를 보내도 빈 리스트 — 조용한 함정',
          'Annotated[list[int], Query()] = [] 로 쓰면 같은 이름 쿼리 여러 개를 [1, 2, 3] 으로 모아 준다',
          '422 응답의 loc 는 어디서(path · query · body) 어떤 값이, msg 는 왜, input 은 실제로 보낸 값',
        ],
      },
      {
        title: '요즘 표기',
        items: [
          'Python 3.9+ 는 List · Dict 대신 list[int] · dict[str, int], 3.10+ 는 Union · Optional 대신 int | str · str | None',
          'dict[str, int] 본문은 필드 이름을 검사하지 못한다 — 실무에서는 Pydantic 모델로 양식을 정한다',
          '실행 전 타입 검사는 mypy · pyright 같은 도구가 맡는다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', '타입 힌트', 'Pydantic', '422'],
    keywords: 'fastapi type hint annotation int str bool list dict optional union none default query annotated 422 unprocessable loc msg input lax strict pydantic mypy pyright __annotations__',
  },
  {
    slug: 'be-fastapi-http-methods',
    area: 'Back',
    course: 'FastAPI',
    lesson: '4일차',
    date: '2026.08.21',
    title: 'HTTP 메서드 — GET · POST · PUT · PATCH · DELETE · 상태 코드 · 멱등성',
    summary: 'URL 은 명사(무엇을), HTTP 메서드는 동사(어떻게)다. 같은 /items/1 이라도 GET 은 읽기, PUT 은 통째 바꾸기, DELETE 는 지우기이고, 결과는 상태 코드로 알린다.',
    points: [
      '멱등 — 같은 요청을 여러 번 보내도 서버 상태가 같다. PUT · DELETE 는 멱등, POST 는 아니다',
      '401 은 누구인지 모름(인증 안 됨), 403 은 누군지 알지만 권한 없음',
      '생성은 201, 삭제는 본문 없는 204 — 4xx 는 클라이언트 잘못, 5xx 는 서버 잘못',
    ],
    learned: [
      {
        title: '메서드',
        items: [
          'PUT 은 전체 교체, PATCH 는 보낸 필드만 수정 — 닉네임만 바꾸면 PATCH',
          'GET 은 서버를 바꾸지 않는 안전한 메서드라 본문을 넣지 않고, 조건은 쿼리로 보낸다',
          '로그아웃 · 주문 취소처럼 CRUD 에 안 맞는 행동은 POST(/orders/1/cancel). 상태를 바꾸는 일을 GET 으로 만들지 않는다',
        ],
      },
      {
        title: '멱등성',
        items: [
          '엘리베이터 5층 버튼은 여러 번 눌러도 5층(멱등), 자판기 구매는 누를 때마다 하나씩(멱등 아님)',
          '응답을 못 받아 다시 보낼 때 POST 는 주문이 두 번 생길 수 있다 — 결제는 Idempotency-Key 헤더로 중복을 막는다',
          'DELETE 를 두 번 하면 두 번째는 404 여도 "없는 상태"는 같아서 멱등이다 — 기준은 응답 코드가 아니라 서버 상태',
        ],
      },
      {
        title: '상태 코드',
        items: [
          '405 는 경로는 있는데 그 메서드는 안 받음, 409 는 이미 있는 이메일 같은 충돌, 429 는 요청 횟수 초과',
          '307 · 308 은 메서드를 유지한 채 이동 — FastAPI 의 끝 슬래시 이동이 307',
          'curl 의 -d 는 기본이 form 형식이라 JSON 을 보낼 때는 Content-Type: application/json 헤더가 필요하다(없으면 422)',
        ],
      },
      {
        title: '요청 모델 나누기',
        items: [
          '생성용 모델은 필드 필수, 수정용 모델은 필드 전부 선택(None 기본값)으로 따로 만든다',
          'PATCH 는 model_dump(exclude_unset=True) 로 실제로 보낸 필드만 반영한다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'HTTP', 'REST', '멱등성'],
    keywords: 'fastapi http method get post put patch delete crud status code 200 201 204 301 302 307 308 400 401 403 404 405 409 422 429 500 503 idempotent idempotency key safe curl content-type exclude_unset',
  },
  {
    slug: 'be-fastapi-pydantic',
    area: 'Back',
    course: 'FastAPI',
    lesson: '5일차',
    date: '2026.08.22',
    title: 'Pydantic — BaseModel · 검증 · 직렬화 · Field 제약 · 중첩 모델 · v2 문법',
    summary: 'Pydantic 모델은 데이터의 주문서 양식이다. 필드 이름 · 타입 · 제약을 적어 두면 들어올 때 검증과 역직렬화, 나갈 때 직렬화가 자동으로 된다.',
    points: [
      '역직렬화는 JSON 글자 → 파이썬 객체, 직렬화는 객체 → JSON — Pydantic 은 역직렬화하면서 검증도 한다',
      '모델에 없는 필드는 에러 없이 조용히 버려진다. 막으려면 ConfigDict(extra="forbid")',
      '공통 필드는 Base 에 두고 UserCreate(+ password) · UserRead(+ id)로 나눠 비밀번호가 응답으로 새지 않게 한다',
    ],
    learned: [
      {
        title: 'Field 제약',
        items: [
          'min_length · max_length(길이), gt · ge · lt · le(범위), pattern(정규식), description(문서 설명)을 필드에 붙인다',
          'Field(...) 의 ... 는 기본값 없음 = 필수',
          'alias 를 주면 클라이언트는 별칭으로만 보내야 한다 — 파이썬 이름으로 보내면 무시되고 기본값이 들어간다. 둘 다 받으려면 populate_by_name=True',
        ],
      },
      {
        title: '중첩 모델과 Union',
        items: [
          'Image 모델을 따로 두고 image: Image 로 포함하면 상품 · 게시글 · 프로필이 같은 규칙을 재사용한다',
          '중첩 필드의 에러 위치는 ["body", "image", "url"] 처럼 끝까지 알려 준다. URL 형식 검사는 HttpUrl',
          'v2 의 int | str 은 들어온 값과 정확히 같은 타입을 먼저 고른다 — "1" 은 문자열 그대로',
        ],
      },
      {
        title: 'v1 → v2 문법',
        items: [
          '.dict() → model_dump(), .json() → model_dump_json(), parse_obj → model_validate',
          'orm_mode = True → ConfigDict(from_attributes=True), @validator → @field_validator',
          'bool = None 처럼 타입과 기본값이 어긋나면 bool | None = None 으로 쓴다',
        ],
      },
      {
        title: '타입으로 안 되는 규칙',
        items: [
          '@field_validator 는 한 필드를 고치거나 검사하고(앞뒤 공백 제거), @model_validator(mode="after") 는 두 필드를 비교한다(비밀번호 확인)',
          'DB 를 봐야 하는 규칙(중복 이메일)은 Field 로 못 하고 서비스 로직에서 막는다',
          '.env 의 DB 주소 · 비밀 키는 pydantic-settings 의 BaseSettings 로 타입 검사까지 하며 읽는다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'Pydantic', '직렬화', '검증'],
    keywords: 'pydantic basemodel field validation serialization deserialization model_dump model_dump_json model_validate min_length max_length gt ge lt le pattern alias populate_by_name extra forbid nested model httpurl union smart mode field_validator model_validator configdict from_attributes orm_mode pydantic-settings basesettings',
  },
  {
    slug: 'be-fastapi-response-model',
    area: 'Back',
    course: 'FastAPI',
    lesson: '6일차',
    date: '2026.08.23',
    title: '응답 모델 — response_model · 필터링 · Union · List · 반환 타입',
    summary: '요청 모델이 들어오는 문의 검수원이라면 응답 모델은 나가는 문의 검수원이다. 함수가 무엇을 반환하든 모델에 적힌 필드만 내보내고, 모양이 틀리면 서버 에러로 막는다.',
    points: [
      '응답 모델은 허용 목록이다 — DB 에 새 민감 필드가 생겨도 모델에 없으면 자동으로 막힌다',
      '요청 검증 실패는 422(클라이언트 잘못), 응답 검증 실패는 500(서버가 약속을 어김)',
      'response_model 과 반환 타입(-> Item)을 둘 다 쓰면 response_model 이 우선한다',
    ],
    learned: [
      {
        title: '필터링',
        items: [
          '함수가 dis_price 같은 내부 필드가 든 dict 를 돌려줘도 response_model=Item 이면 Item 필드만 나간다',
          'response_model 을 지우면 UserIn 의 password 가 응답에 그대로 노출된다',
          '함수 안에서 del 로 지우는 건 금지 목록 방식이라 새 필드가 생기면 샌다',
        ],
      },
      {
        title: '응답 모델 종류',
        items: [
          '하나 조회는 Item, 목록은 list[Item], 상황마다 다르면 Cat | Dog',
          'Cat · Dog 가 둘 다 name 하나뿐이면 클라이언트가 구분 못 한다 — type: Literal["cat"] 같은 구분 필드를 넣는다',
          'FastAPI 0.89 부터 -> Item 반환 타입만 적어도 똑같이 걸러 준다',
        ],
      },
      {
        title: '실무 패턴',
        items: [
          'UserBase(공통) → UserCreate(+ password) · UserRead(+ id) 상속으로 중복을 줄인다',
          'response_model_exclude_unset · exclude_none 으로 빈 값을 뺄 수 있지만, 필드가 있다 없다 하면 프론트가 다루기 어렵다',
          '목록은 { items, total, has_next } 봉투 모델로 주면 나중에 페이지 정보를 붙이기 쉽다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'Pydantic', '응답 모델', '보안'],
    keywords: 'fastapi response_model return type annotation filter allowlist userin userout usercreate userread inheritance union literal discriminator list 500 responsevalidationerror exclude_unset exclude_none envelope total has_next',
  },
  {
    slug: 'be-fastapi-response-class',
    area: 'Back',
    course: 'FastAPI',
    lesson: '7일차',
    date: '2026.08.24',
    title: '응답 클래스 — JSON · HTML · PlainText · Redirect · Streaming · File',
    summary: '응답 모델은 내용물의 양식, 응답 클래스는 포장 방식이다. 같은 데이터를 JSON · HTML · 글자 · 리다이렉트 중 무엇에 담을지 정하고, 거기에 맞는 Content-Type 과 상태 코드가 붙는다.',
    points: [
      '브라우저는 Content-Type 을 보고 동작한다 — HTML 문자열을 기본(JSON)으로 보내면 따옴표 붙은 글자가 찍힌다',
      'RedirectResponse 기본은 307(메서드 유지) — 폼 POST 뒤 목록 GET 으로 보낼 때는 303',
      'Response 객체를 직접 반환하면 response_model 필터링을 건너뛴다 — 민감한 데이터가 그대로 나갈 수 있다',
    ],
    learned: [
      {
        title: '응답 클래스',
        items: [
          'JSONResponse 가 기본이라 response_class=JSONResponse 는 써도 안 써도 같다',
          'HTMLResponse(text/html)는 템플릿 · 관리자 화면, PlainTextResponse(text/plain)는 헬스 체크 "ok"',
          'FileResponse 는 다운로드, 사용자가 보낸 파일 이름을 경로에 그대로 넣으면 ../ 경로 조작 공격을 받는다',
        ],
      },
      {
        title: '리다이렉트',
        items: [
          '본문 대신 Location 헤더에 새 주소를 담는다 — curl 은 -L 을 줘야 따라간다',
          '301 · 308 은 영구, 302 · 307 은 임시. 307 · 308 은 메서드를 유지하고 303 은 항상 GET 으로 바꾼다',
          'React 같은 SPA 는 fetch 가 리다이렉트를 조용히 따라가서 화면 이동은 프론트 라우터가 맡는다',
        ],
      },
      {
        title: '스트리밍',
        items: [
          'StreamingResponse 는 만들어지는 대로 조금씩 보낸다 — AI 답변이 한 글자씩 나타나는 원리',
          '브라우저 실시간 수신은 text/event-stream(SSE) 형식을 쓴다',
          '상태 코드만 바꿀 거면 Response 직접 반환보다 데코레이터 status_code=201 이 깔끔하다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'HTTP', '리다이렉트', '스트리밍'],
    keywords: 'fastapi response class jsonresponse htmlresponse plaintextresponse redirectresponse streamingresponse fileresponse content-type mime location header 301 302 303 307 308 sse text/event-stream path traversal default_response_class',
  },
  {
    slug: 'be-fastapi-request',
    area: 'Back',
    course: 'FastAPI',
    lesson: '8일차',
    date: '2026.08.25',
    title: '리퀘스트 — HTTP 요청 구조 · Query 옵션 · Body · alias · Header · Cookie',
    summary: 'HTTP 요청은 Method · URL(경로 + 쿼리) · Headers · Body 네 칸이다. FastAPI 에서는 Path · Query · Header · Cookie · Body 로 어느 칸에서 꺼낼지 지정하고, 같은 자리에 길이 · 범위 · 패턴 규칙을 붙인다.',
    points: [
      'HTTP 는 이전 요청을 기억하지 않는다(stateless) — 로그인 상태는 매 요청마다 쿠키나 토큰으로 다시 보낸다',
      '비밀번호는 쿼리가 아니라 본문으로, 토큰은 Authorization 헤더로 — 쿼리는 브라우저 기록과 서버 로그에 남는다',
      '본문 인자가 하나면 JSON 전체가 그 인자, 둘 이상이면 JSON 을 인자 이름으로 나눠 보낸다',
    ],
    learned: [
      {
        title: 'Query 옵션',
        items: [
          'min_length · max_length · ge · le · pattern · alias · deprecated · description · examples 를 붙인다',
          'alias 를 주면 URL 에서는 별칭만 통한다 — ?search= 로 보내야 하고 원래 이름은 무시된다',
          '기본값은 검증하지 않는다 — 기본값도 규칙에 맞게 정한다',
          'regex → pattern, example → examples 로 바뀌었다(예전 이름은 deprecated 경고)',
        ],
      },
      {
        title: '값의 위치 규칙',
        items: [
          '경로의 {이름}이면 Path, 단순 타입이면 Query, 모델 · dict 면 Body, Header() · Cookie() 면 헤더 · 쿠키',
          'user_agent: str = Header() 는 밑줄을 하이픈으로 바꿔 User-Agent 를 찾는다(대소문자 무시)',
          'Request 객체는 IP · 전체 헤더가 필요할 때만 — 검증과 문서화가 빠진다',
        ],
      },
      {
        title: 'Annotated 를 쓰는 이유',
        items: [
          'q: str = Query(None) 은 기본값 자리에 Query 를 넣어서, FastAPI 밖에서 부르면 기본값이 Query 객체가 된다',
          'Annotated[str | None, Query(max_length=50)] = None 은 타입 자리에 규칙, 기본값 자리에 진짜 기본값',
          '폼 · 파일 업로드는 JSON 이 아니라 Form() · UploadFile 로 받는다(python-multipart 필요)',
          'FastAPI 0.115 부터 쿼리 조건이 많으면 Pydantic 모델 하나로 묶어 받을 수 있다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'HTTP', '요청', 'Annotated'],
    keywords: 'fastapi request http method url path query header body cookie stateless authorization bearer user-agent alias deprecated pattern regex examples body embed multiple body annotated form file uploadfile python-multipart request client host query model',
  },
  {
    slug: 'be-fastapi-exceptions',
    area: 'Back',
    course: 'FastAPI',
    lesson: '9일차',
    date: '2026.08.26',
    title: '예외 처리 — HTTPException · 커스텀 예외 · 전역 핸들러 · 에러 응답 규격',
    summary: '예외 처리는 실패도 응답의 일부로 설계하는 것이다. 파이썬 예외를 그대로 두면 500(서버 고장)이 되고, HTTPException 으로 바꾸면 알맞은 상태 코드와 이유(detail)를 알려 줄 수 있다.',
    points: [
      'HTTPException 은 return 이 아니라 raise — return 하면 200 에 예외 내용이 본문으로 나가 실패가 성공으로 위장된다',
      '서비스 로직은 ItemNotFound 같은 도메인 예외만 던지고, @app.exception_handler 가 HTTP 응답으로 바꾼다 — 서비스가 HTTP 를 몰라도 된다',
      '422 는 형식 · 타입이 틀린 요청(자동 검증), 400 은 형식은 맞지만 비즈니스 규칙 위반',
    ],
    learned: [
      {
        title: '실패에 맞는 코드',
        items: [
          '없는 id 는 404, 남의 글 수정은 403, 로그인 안 함은 401, 이미 가입된 이메일은 409',
          '실패를 return {"error": ...} 로 주면 200 이라 프론트의 if (!res.ok) 처리가 동작하지 않는다',
          '음수 막기 같은 단순 범위는 try/except 보다 Path(ge=0) 선언 한 줄 — 대신 400 이 아니라 422',
        ],
      },
      {
        title: '예외를 다루는 층',
        items: [
          '예외는 호출한 쪽으로 전파되어 어느 깊이에서 던져도 응답이 된다',
          '레포지토리(DB 예외) → 서비스(도메인 예외) → 라우터(HTTP 응답)로 나누면 DB 를 바꿔도 에러 응답은 그대로',
          'except Exception: 으로 다 잡으면 진짜 버그까지 숨는다 — 예상하는 예외만 골라 잡는다',
        ],
      },
      {
        title: '에러 응답 규격',
        items: [
          '모든 에러를 { code, message } 같은 한 모양으로 내보내면 프론트는 code 하나로 분기하고 message 를 토스트로 띄운다',
          'RequestValidationError 핸들러를 등록하면 422 응답 모양도 팀 규격으로 바꿀 수 있다',
          '표준 규격으로 RFC 9457 Problem Details(type · title · status · detail)도 있다',
          '500 은 사용자에게 원인을 숨기고 서버 로그 · Sentry 로 추적한다 — DB 주소나 코드 구조가 새면 안 된다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', '예외 처리', 'HTTP', '에러 응답'],
    keywords: 'fastapi exception try except httpexception raise return detail headers custom exception domain exception exception_handler requestvalidationerror error response code message rfc 9457 problem details 400 401 403 404 409 422 500 sentry logging layer',
  },
  {
    slug: 'be-fastapi-templates',
    area: 'Back',
    course: 'FastAPI',
    lesson: '10일차',
    date: '2026.08.27',
    title: '템플릿 기초 — Jinja2 · TemplateResponse · 제어문 · 상속 · 자동 이스케이프',
    summary: '템플릿은 빈칸이 있는 HTML 이다. FastAPI 가 데이터(context)를 넘기면 Jinja2 가 {{ 변수 }} · {% if %} · {% for %}를 채워 완성된 HTML 을 만들고, 공통 틀은 base.html 상속으로 한 곳에서 관리한다.',
    points: [
      '{{ }}는 < > 를 글자로 바꿔(자동 이스케이프) 댓글 속 <script> 가 실행되지 않게 막는다',
      '|safe 는 안전하게가 아니라 "검사하지 마" — 보호를 끄는 것이라 사용자 입력에는 절대 쓰지 않는다(XSS)',
      '최신 Starlette 는 TemplateResponse(request, "index.html", {...}) — request 를 첫 인자로',
    ],
    learned: [
      {
        title: 'SSR 과 CSR',
        items: [
          'Jinja2 는 서버가 완성된 HTML 을 보내는 SSR — 첫 화면과 검색 노출에 유리하고, 상호작용은 페이지 단위',
          'React 단독은 브라우저가 JS 로 그리는 CSR, Next.js 는 둘을 섞는다',
          '화면을 프론트가 맡아도 회원가입 인증 메일 본문은 지금도 Jinja2 로 자주 만든다',
        ],
      },
      {
        title: '문법',
        items: [
          '{{ }}는 출력, {% %}는 제어문, {# #}는 주석 — Jinja2 주석은 소스 보기에도 안 남고 HTML 주석은 누구나 본다',
          '{% for %} … {% else %}로 빈 리스트일 때 문구를, loop.index · loop.first · loop.last 로 순서 정보를 쓴다',
          'split(",") 은 빈 문자열이면 [""] 가 되어 빈 항목이 그려진다 — 빈 값을 걸러 넘긴다',
        ],
      },
      {
        title: '상속',
        items: [
          'base.html 에 {% block content %} 빈칸을 두고 자식은 {% extends %} 후 블록만 채운다 — 블록 밖 내용은 무시된다',
          'React 의 Layout 컴포넌트 + children 과 같은 생각이다',
          '데이터 준비는 라우터(파이썬), 배치와 모양은 템플릿 — 템플릿 안에서 DB 를 직접 조회하지 않는다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'Jinja2', 'SSR', 'XSS'],
    keywords: 'fastapi jinja2 jinja2templates templateresponse request context variable filter safe autoescape xss if elif else for loop index extends block base.html inheritance ssr csr htmx comment',
  },
  {
    slug: 'be-fastapi-templates-static',
    area: 'Back',
    course: 'FastAPI',
    lesson: '11일차',
    date: '2026.08.28',
    title: '템플릿 심화 — include · 정적 파일 · mount · url_for · 매크로',
    summary: '화면을 조각(include)으로 나눠 재사용하고, CSS · 이미지 같은 정적 파일은 app.mount("/static", StaticFiles(...))로 폴더째 열어 준다. 주소는 url_for 로 만들어 경로가 바뀌어도 안 깨지게 한다.',
    points: [
      'extends 는 양식지에 본문 채우기, include 는 도장 찍기, macro 는 값만 바꿔 찍는 고무인 — React 의 Layout · 컴포넌트 · props',
      'CSS 링크도 브라우저가 따로 보내는 GET 요청이다 — mount 가 없으면 404 가 나고 스타일이 빠진다',
      'static 폴더는 로그인 없이 누구나 받는다 — .env · DB 파일 · 업로드 파일을 두지 않는다',
    ],
    learned: [
      {
        title: '조각 재사용',
        items: [
          'include 는 현재 변수를 그대로 공유한 채 조각을 끼운다 — 헤더 조각에서도 {{ site_name }}을 쓸 수 있다',
          'macro 는 인자를 받는 조각이라 상품 카드처럼 값만 다른 반복 요소에 쓴다',
          '조각 파일은 _header.html 처럼 앞에 _ 를 붙여 페이지가 아님을 표시한다',
        ],
      },
      {
        title: 'mount 와 url_for',
        items: [
          'mount 는 URL 앞부분을 통째로 다른 앱(StaticFiles)에 넘긴다 — 파일마다 라우트를 만들 수 없으니까',
          'StaticFiles 는 Content-Type 과 캐시용 ETag · Last-Modified 를 붙이고, /static/../ 처럼 폴더 밖으로 나가는 요청은 막는다',
          'url_for(\'static\', path=...) 는 mount 의 name 으로 주소를 만든다 — 경로를 /assets 로 바꿔도 템플릿은 그대로',
        ],
      },
      {
        title: '운영에서는',
        items: [
          '정적 파일은 Nginx · CDN 이 더 빠르고 파이썬 서버는 API 에 집중한다',
          '브라우저 캐시 때문에 CSS 를 고쳐도 예전 화면이 보일 수 있다 — 빌드 도구가 파일 이름에 해시를 붙인다',
          '사용자 업로드는 S3 같은 저장소에 두고 비공개 파일은 Presigned URL 로 잠깐만 연다',
          'React 빌드를 함께 서빙할 때는 API 라우트를 먼저, "/" mount 를 마지막에 둔다(경로 순서 원리)',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'Jinja2', '정적 파일', '캐시'],
    keywords: 'fastapi jinja2 include macro extends staticfiles mount url_for static css image cache etag last-modified path traversal cdn nginx s3 presigned url html=True spa build hash filename',
  },
  {
    slug: 'be-fastapi-sqlalchemy-basics',
    area: 'Back',
    course: 'FastAPI',
    lesson: '12일차',
    date: '2026.08.29',
    title: 'SQLAlchemy 기초 — ORM · Engine · Session · 모델 · Depends(get_db) · 2.0 문법',
    summary: 'ORM 은 테이블을 클래스로, 행을 객체로 다루게 해 준다. SQLAlchemy 는 Engine(연결 통로) → Session(작업 단위) → Model(테이블 설계도) 세 층으로 돌고, FastAPI 는 Depends(get_db)로 요청마다 세션을 열고 닫는다.',
    points: [
      'Engine 은 앱에 하나(연결 풀), Session 은 요청마다 하나 — 마트 계산대와 내 장바구니',
      'add 는 담기, commit 은 확정, refresh 는 DB 가 채운 id 를 다시 읽기 — commit 없이 끝나면 변경은 버려진다',
      'get_db 의 yield 뒤 finally 에서 close — 에러가 나도 연결이 반납되고, 테스트에서는 가짜 DB 로 바꿔 끼운다',
    ],
    learned: [
      {
        title: 'ORM',
        items: [
          '문자열로 SQL 을 조립하면 오타가 늦게 잡히고 SQL 인젝션에 노출된다 — ORM 은 값을 분리해서 보낸다',
          'ORM 을 써도 SQL 은 알아야 한다 — create_engine(echo=True)로 실제 SQL 을 찍어 보며 확인한다',
          'DB 모델(models.py)과 API 스키마(schemas.py)를 나누면 DB 가 바뀌어도 API 계약을 지킨다',
        ],
      },
      {
        title: '세션과 트랜잭션',
        items: [
          'flush 는 SQL 을 보내지만 확정은 안 한다 — commit 은 항상 먼저 flush 한다',
          '중복 username 의 IntegrityError 는 rollback 후 409 로 — 그대로 두면 500',
          '세션을 닫지 않으면 연결 풀이 바닥나 서버가 멈춘 것처럼 된다',
        ],
      },
      {
        title: '1.4 → 2.0 문법',
        items: [
          'Column(Integer) → Mapped[int] = mapped_column(), declarative_base() → class Base(DeclarativeBase)',
          'Mapped[str] 은 자동 NOT NULL, Mapped[str | None] 은 NULL 허용 — 타입으로 NULL 여부를 표현한다',
          'db.query(User) → db.scalars(select(User)), autocommit=True 는 2.0 에서 제거',
          'datetime.utcnow 대신 datetime.now(timezone.utc), DB 객체를 응답 모델로 바꿀 때는 ConfigDict(from_attributes=True)',
        ],
      },
      {
        title: '운영 준비',
        items: [
          'create_all 은 없는 테이블만 만든다 — 컬럼 추가 같은 변경은 Alembic 마이그레이션으로 기록 · 적용한다',
          'database · models · schemas · crud · routers 로 파일을 나누면 누가 무엇을 책임지는지 드러난다',
          'SQLModel 은 SQLAlchemy 모델과 Pydantic 모델을 클래스 하나로 합친 라이브러리',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'SQLAlchemy', 'ORM', '트랜잭션'],
    keywords: 'fastapi sqlalchemy orm engine session sessionmaker sessionlocal model declarativebase mapped mapped_column depends get_db yield finally close add commit flush refresh rollback integrityerror 409 echo connection pool select scalars from_attributes alembic migration create_all sqlmodel lifespan sqlite mysql pymysql postgresql',
  },
  {
    slug: 'be-fastapi-sqlalchemy-crud',
    area: 'Back',
    course: 'FastAPI',
    lesson: '13일차',
    date: '2026.08.30',
    title: 'SQLAlchemy 심화 — 조회 · 검색 · 집계 · 수정 · 삭제 · 관계 · N+1',
    summary: 'CRUD 의 R · U · D 를 완성한다. 조회는 select() + where · order_by · offset/limit, 수정은 객체 속성을 바꾸고 commit, 삭제는 db.delete + commit 이고, 못 찾으면 반드시 404 다.',
    points: [
      '세션은 꺼낸 객체를 기억하고 지켜본다(변경 감지) — 속성만 바꾸고 commit 하면 바뀐 컬럼만 UPDATE 된다',
      'N+1 — 글 목록 1번 + 글마다 작성자 1번씩. selectinload 로 작성자를 한꺼번에 미리 불러오면 2번으로 준다',
      '"찾고 없으면 404"는 get_user_or_404 공통 함수 하나로 — 조회 · 수정 · 삭제가 같은 규칙을 쓴다',
    ],
    learned: [
      {
        title: '조회 문법(2.0)',
        items: [
          'db.query() 는 레거시, select() 는 동기 · 비동기 모두 같은 문법 — db.scalars(select(User).where(...)).all()',
          '기본 키 한 건은 db.get(User, 1), OR 는 or_(A, B), 포함 검색은 contains · ilike',
          'scalars() 는 첫 컬럼(보통 모델)만, execute() 는 행 전체 — 집계처럼 값이 여러 개면 execute',
          '검색어가 있을 때만 stmt = stmt.where(...) 로 조건을 덧붙여 조립한다',
        ],
      },
      {
        title: '집계',
        items: [
          'group_by 는 같은 값끼리 묶어 count · max · min · sum — 중복되는 값(도시 · 카테고리)에 쓴다. unique 컬럼으로 묶으면 항상 1',
          '결과 튜플은 [{"city": c, "count": n} for c, n in rows] 로 dict 로 바꿔 보낸다',
          '/users/stats 같은 고정 경로는 /users/{user_id} 보다 위에 둔다',
        ],
      },
      {
        title: '수정 · 삭제',
        items: [
          '일부 수정은 PATCH + model_dump(exclude_unset=True) 를 setattr 로 — "안 보낸 필드"와 "null 로 보낸 필드"를 구분한다',
          'relationship(cascade="all, delete-orphan") 이면 사용자를 지울 때 글도 함께 지워진다',
          '복구나 감사가 필요하면 진짜 삭제 대신 is_active=False · deleted_at 같은 soft delete',
        ],
      },
      {
        title: '계층과 트랜잭션',
        items: [
          '라우터(HTTP 입출력) → 서비스(비즈니스 규칙) → 레포지토리(select · add · delete)로 나눠 규칙을 API 없이 테스트한다',
          '"주문 생성 + 재고 차감"처럼 함께 성공해야 하는 일은 commit 을 마지막에 한 번만 — with db.begin() 은 예외면 자동 rollback',
          '마지막 재고를 동시에 사는 경쟁은 with_for_update(행 잠금)나 WHERE stock > 0 조건부 UPDATE 로 막는다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'SQLAlchemy', 'N+1', 'CRUD'],
    keywords: 'sqlalchemy select where or_ order_by desc offset limit scalars execute get count func group_by aggregate update setattr exclude_unset patch delete cascade relationship back_populates foreignkey selectinload lazy loading n+1 identity map unit of work soft delete with_for_update repository service',
  },
  {
    slug: 'be-fastapi-async',
    area: 'Back',
    course: 'FastAPI',
    lesson: '14일차',
    date: '2026.08.31',
    title: '비동기 — async · await · 이벤트 루프 · gather · def vs async def · 블로킹 함정',
    summary: '비동기는 기다리는 동안 다른 일을 하는 것이다. await 를 만나면 함수가 자리를 비켜 주고 이벤트 루프가 그동안 다른 요청을 처리한다. 단, async def 안에서 동기 대기 함수를 쓰면 서버 전체가 멈춘다.',
    points: [
      '동기 라이브러리(requests · 동기 Session · time.sleep)는 def, 비동기 라이브러리(httpx.AsyncClient · AsyncSession)는 async def — FastAPI 는 def 를 스레드 풀에서 돌려 준다',
      '동시 요청 5개(각 1초) — async + await asyncio.sleep 은 약 1초, async + time.sleep 은 약 5초, def + time.sleep 은 약 1초',
      '비동기는 동시성(번갈아 처리)이지 병렬성이 아니다 — 무거운 계산은 빨라지지 않고 멀티프로세스나 작업 큐로 보낸다',
    ],
    learned: [
      {
        title: '코루틴과 이벤트 루프',
        items: [
          'async def 를 부르면 바로 실행되지 않고 코루틴 객체가 나온다 — await 하지 않으면 "coroutine was never awaited"',
          'gather(a(), b()) 는 가장 긴 것만큼 걸리고, 결과는 끝난 순서가 아니라 넣은 순서',
          'FastAPI 는 uvicorn 이 이미 루프를 돌리고 있어서 asyncio.run 을 직접 부르지 않는다',
        ],
      },
      {
        title: '실무 패턴',
        items: [
          '외부 API 두 개를 gather 로 동시에 부르면 2초가 1초로 — 여러 AI 에 같은 질문을 보내는 비교 앱이 이 구조',
          '동기 SDK 를 async 안에서 써야 하면 asyncio.to_thread · run_in_threadpool 로 스레드에 보낸다',
          '응답 뒤 가벼운 일은 BackgroundTasks, 무거운 일은 Celery · ARQ 같은 작업 큐',
        ],
      },
      {
        title: '안전장치',
        items: [
          '외부 API 는 httpx.AsyncClient(timeout=10) · asyncio.timeout 으로 항상 상한을 둔다',
          'Python 3.11 의 TaskGroup 은 하나가 실패하면 나머지를 자동으로 취소해 gather 보다 안전하다',
          '서버 여러 프로세스(uvicorn --workers)는 병렬성, 한 프로세스 안의 asyncio 는 동시성',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', '비동기', 'asyncio', '동시성'],
    keywords: 'fastapi async await asyncio event loop coroutine future task gather run sleep blocking time.sleep requests httpx asyncclient def vs async def threadpool to_thread run_in_threadpool concurrency parallelism multiprocessing workers backgroundtasks celery arq timeout taskgroup',
  },
  {
    slug: 'be-fastapi-async-sqlalchemy',
    area: 'Back',
    course: 'FastAPI',
    lesson: '15일차',
    date: '2026.09.01',
    title: '비동기 SQLAlchemy — create_async_engine · AsyncSession · lifespan · expire_on_commit',
    summary: '비동기 SQLAlchemy 는 동기 버전과 구조가 같고 DB 에 다녀오는 지점마다 await 가 붙는다. 바뀌는 건 비동기 드라이버 · create_async_engine · AsyncSession, 그리고 lazy loading 이 안 되니 필요한 데이터는 미리 불러와야 한다.',
    points: [
      'DB 에 실제로 다녀오면 await(commit · execute · get · delete), 세션에 담기만 하면 await 없음(add)',
      'commit 뒤 값이 만료되면 다시 불러오려다 MissingGreenlet 에러 — async_sessionmaker(expire_on_commit=False) 또는 await refresh',
      '서버당 한 번(테이블 생성 · 연결 풀 정리)은 lifespan, 요청마다(세션)는 get_db 의존성',
    ],
    learned: [
      {
        title: '동기 → 비동기',
        items: [
          '드라이버까지 비동기여야 한다 — mysql+aiomysql · postgresql+asyncpg · sqlite+aiosqlite',
          'async with AsyncSessionLocal() as session 은 블록이 끝나면 자동 close',
          'create_all 은 동기 함수라 lifespan 안에서 await conn.run_sync(Base.metadata.create_all) 로 돌린다',
          '@app.on_event("startup") 은 deprecated — lifespan 하나로 시작과 종료를 쓴다',
        ],
      },
      {
        title: '결과 꺼내기',
        items: [
          '집계처럼 값이 여러 개인 행은 result.all() — scalars() 를 쓰면 첫 컬럼만 남고 count 가 사라진다',
          '전체 개수는 select(func.count()).select_from(User) — select 를 FROM 에 넣으려면 .subquery() 가 필요하다',
          'commit 은 라우터에서 명시적으로 — get_db 에서 자동 commit 하면 조회에도 commit 이 나가고 응답 뒤 실패를 놓친다',
        ],
      },
      {
        title: '주의할 점',
        items: [
          '하나의 AsyncSession 으로 gather 처럼 동시에 쿼리하면 에러 — 세션은 한 번에 한 작업',
          '관계는 selectinload 로 미리 — 동기에서는 N+1(느림)이던 문제가 비동기에서는 아예 에러로 드러난다',
          '동기 SQLAlchemy + def 라우터도 스레드 풀 덕분에 충분히 빠르다 — 외부 API · 스트리밍과 함께 쓸 때 비동기가 자연스럽다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', 'SQLAlchemy', '비동기', 'lifespan'],
    keywords: 'sqlalchemy asyncio create_async_engine asyncsession async_sessionmaker expire_on_commit missinggreenlet lazy loading selectinload aiomysql asyncpg aiosqlite lifespan asynccontextmanager run_sync create_all dispose await commit execute scalars result.all func.count subquery on_event startup deprecated',
  },
  {
    slug: 'be-fastapi-auth-basics',
    area: 'Back',
    course: 'FastAPI',
    lesson: '16일차',
    date: '2026.09.02',
    title: '인증 기초 — HTTP Basic · 쿠키 · 세션 · 비밀번호 해시 · JWT',
    summary: 'HTTP 는 직전 요청을 기억하지 못해서, 인증 뒤에는 매 요청마다 "나야"를 증명하는 표(쿠키의 세션 또는 토큰)를 보낸다. FastAPI 는 이 확인을 의존성으로 만들어 보호할 라우터에 끼운다.',
    points: [
      '인코딩(Base64)은 누구나 읽고, 서명(세션 쿠키 · JWT)은 읽혀도 위조를 막고, 암호화는 키 있는 사람만 읽고, 해시는 되돌릴 수 없다',
      'SessionMiddleware 쿠키와 JWT 는 서명일 뿐 암호화가 아니다 — 디코딩하면 {"username": "john"} 이 보여서 민감한 값을 넣지 않는다',
      '인증은 get_current_user(401), 인가는 그 위에 쌓은 require_admin(403) — 의존성을 레고처럼 쌓는다',
    ],
    learned: [
      {
        title: '인증 방식',
        items: [
          'HTTP Basic 은 아이디:비밀번호를 Base64 로 매 요청 헤더에 — HTTPS 없이는 쓰면 안 되고 내부 도구 정도에만',
          '세션은 서버가 상태를 저장해 강제 로그아웃이 쉽고, JWT 는 어느 서버나 서명만 검사해 확장이 쉽지만 만료 전 무효화가 어렵다',
          '비밀번호는 쿼리가 아니라 본문(Form)으로 받는다 — URL 은 로그와 브라우저 기록에 남는다',
        ],
      },
      {
        title: '쿠키',
        items: [
          'HttpOnly 는 자바스크립트가 못 읽어 XSS 를, SameSite 는 CSRF 를 막고, Secure(https_only)는 HTTPS 에서만 보낸다',
          'curl 은 쿠키를 자동으로 안 붙여서 -c 로 저장하고 -b 로 보낸다',
          '서명 쿠키는 크기 제한(약 4KB)이 있고 서버에서 강제 만료가 안 된다 — 진짜 서버 세션은 Redis 에 둔다',
        ],
      },
      {
        title: '비밀번호와 비교',
        items: [
          '비밀번호는 argon2 · bcrypt 처럼 일부러 느리고 소금(salt)이 들어간 해시로 저장한다 — MD5 · SHA-256 은 너무 빨라 대입 공격에 약하다',
          'passlib 은 유지보수가 멈춰 FastAPI 문서는 pwdlib 을 쓴다',
          '일반 == 비교는 응답 시간 차이로 한 글자씩 추측하는 타이밍 공격이 가능해서 secrets.compare_digest 를 쓴다',
          '401 응답에는 WWW-Authenticate 헤더를 붙인다 — Basic 은 이게 있어야 브라우저가 로그인 창을 띄운다',
        ],
      },
      {
        title: '토큰 보관',
        items: [
          'localStorage 는 쓰기 쉽지만 XSS 에 약하고, HttpOnly 쿠키는 XSS 에 강한 대신 CSRF 방어가 필요하다',
          '짧은 액세스 토큰(15~30분) + 긴 리프레시 토큰(HttpOnly 쿠키) 조합으로 무효화 문제를 줄인다',
          '소셜 로그인은 OAuth2 · OIDC, 인증을 Auth0 · Supabase Auth 같은 외부에 맡기고 토큰 검증만 하는 구조도 흔하다',
        ],
      },
    ],
    tags: ['백엔드', 'FastAPI', '인증', 'JWT', '보안'],
    keywords: 'fastapi authentication authorization http basic base64 www-authenticate cookie session sessionmiddleware secret_key signature httponly secure samesite csrf xss jwt pyjwt oauth2passwordbearer bearer token access refresh password hash argon2 bcrypt pwdlib passlib compare_digest timing attack 401 403 require_admin oauth oidc',
  },
  // ── 백엔드 강의 (Flask 30강) ──
  // ── MySQL 10강 → noteData/mysql.ts 의 4개로 합침(F-012) ──
  // ── MongoDB 강의 (9강) ──
];
