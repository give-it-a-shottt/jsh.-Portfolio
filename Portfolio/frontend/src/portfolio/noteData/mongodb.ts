import type { StudyNote } from '../notes'

// MongoDB 강의 9개(1~9강)를 3개 노트로 합쳤다 — F-012 노트 틀. 예전 노트 9개 주소는 replaces 로 이어진다
// mongosh 코드는 같은 조건 · 파이프라인을 PyMongo 4.13 으로 MongoDB 8.0.11 에 보내 결과를 확인했고(mongosh 자체는 없어 문법만 확인),
// 파이썬 코드는 PyMongo 4.13 · MongoDB 8.0.11 에서 돌려 확인했다(크롤링 요청만 가짜 HTML 로 대신).
// 예전 노트 9개(mongo-nosql … mongo-crawling) 주소는 replaces 로 이 노트들에 이어진다.

export const MONGODB_NOTES: StudyNote[] = [
  // ── A. 1 · 2 · 3강 ──
  {
    slug: 'mongo-basics',
    area: 'Back',
    course: 'MongoDB',
    lesson: '1 · 2 · 3강',
    date: '2026.10.04',
    title: 'NoSQL과 MongoDB CRUD',
    summary:
      'NoSQL 이 왜 필요한지 이해하고, mongosh 로 문서를 넣고 · 연산자로 골라 보고 · 고치고 지울 수 있다.',
    points: [
      'MongoDB 는 스키마 없는 문서(BSON)를 Collection 에 담는다',
      'find(조건, projection) — 조건은 WHERE, projection 은 고를 필드',
      'updateOne · updateMany 는 $set · $inc 같은 연산자로 바꿀 필드만 고친다',
    ],
    learned: [],
    sections: [
      {
        title: 'NoSQL 과 MongoDB 의 문서',
        body: 'NoSQL(Not only SQL)은 RDBMS 의 한계를 보완하려고 나온 저장소로, 고정된 스키마가 없어 문서마다 필드가 달라도 된다. MongoDB 는 그중 Document 기반이라 JSON 모양의 문서를 BSON(Binary JSON)으로 저장하고, 모든 문서는 고유한 _id(기본은 ObjectId)를 가진다. RDBMS 의 Database → Table → Row 가 MongoDB 에서는 Database → Collection → Document 다.',
        why: '쓰기가 많고 형식이 자주 바뀌는 데이터(SNS · 로그)를 스키마를 고치지 않고 바로 쌓을 수 있다.',
        code: {
          lang: 'javascript',
          caption: '타입이 제각각인 문서 하나 — _id 를 넣지 않으면 ObjectId 가 자동으로 붙는다',
          source: `db.books.insertOne({
  title: "파이썬 첫걸음",                  // String
  rating: 4.5,                            // Double
  soldOut: false,                         // Boolean
  author: { first: "민수", last: "김" },  // Object (임베디드 문서)
  tags: ["프로그래밍", "입문"],            // Array
  createdAt: new Date()                   // Date
})
db.books.findOne({ title: "파이썬 첫걸음" })   // _id: ObjectId("…") 가 함께 나온다`,
        },
      },
      {
        title: '기본 명령과 Capped Collection',
        body: 'mongosh 에서 show dbs · show collections 로 목록을 보고 use 로 DB 를 고른다. 없는 DB 를 use 해도 에러가 나지 않고, 처음 데이터를 넣을 때 DB 와 컬렉션이 생긴다. Capped Collection 은 크기가 고정된 컬렉션이라, 꽉 차면 가장 오래된 문서부터 자동으로 지운다(size 는 최대 바이트, max 는 최대 문서 수).',
        why: '로그처럼 최근 것만 있으면 되는 데이터는, 지우는 코드를 따로 짜지 않아도 크기가 일정하게 유지된다.',
        code: {
          lang: 'javascript',
          caption: '목록 → 선택 → 1MB · 1000건 상한 로그 컬렉션 → 이름 변경 · 삭제',
          source: `show dbs                          // DB 목록
use library                       // DB 선택
show collections                  // 컬렉션 목록
db.createCollection("access_log", { capped: true, size: 1048576, max: 1000 })
db.access_log.isCapped()          // true
db.access_log.renameCollection("old_log")
db.old_log.drop()                 // 컬렉션 삭제
db.dropDatabase()                 // 지금 고른 DB 삭제`,
        },
      },
      {
        title: '삽입과 조회 — insertOne · find · projection',
        body: 'insertOne 은 문서 하나, insertMany 는 배열로 여러 개를 넣고, _id 를 빼면 자동으로 만든다. 조회는 find(조건, projection) 구조라 조건은 SQL 의 WHERE, projection 은 SELECT 뒤 컬럼 목록에 해당하고, findOne 은 맞는 첫 문서 하나만 준다. projection 에서 1 은 포함, 0 은 제외이고, _id 는 기본으로 나오므로 빼려면 _id: 0 을 적는다.',
        why: '필요한 필드만 projection 으로 받으면 주고받는 데이터가 줄고 결과도 읽기 쉽다.',
        code: {
          lang: 'javascript',
          caption: '도서관 회원 데이터 — SQL 과 나란히',
          source: `db.members.insertMany([
  { name: "지훈", age: 28, city: "서울" },
  { name: "서연", age: 34, city: "부산", job: "디자이너" },
  { name: "도윤", age: 19, city: "서울" },
  { name: "하은", age: 41, city: "대구" },
  { name: "우진", age: 52 }                          // city 가 없어도 된다
])
db.members.find()                                   // SELECT * FROM members
db.members.find({ city: "서울" })                   // ... WHERE city = '서울'
db.members.find({}, { name: 1, city: 1, _id: 0 })   // SELECT name, city FROM members
db.members.findOne({ city: "서울" })                // 맞는 첫 문서 하나`,
        },
      },
      {
        title: '비교 · 논리 연산자',
        body: '비교는 $eq(=) · $ne(!=) · $gt(>) · $gte(>=) · $lt(<) · $lte(<=), 목록 비교는 $in(하나라도 같으면) · $nin(어느 것과도 다르면)이다. 같은 필드에 연산자 두 개를 함께 적으면 범위 조건이 된다. 조건을 쉼표로 여러 개 적으면 기본이 AND 라 $and 는 대개 생략할 수 있다(같은 필드나 $or 를 두 번 써야 할 때만 $and 로 감싼다). OR 는 $or 에 조건 배열을 넘긴다.',
        why: '조건도 { 필드: { $연산자: 값 } } 모양의 문서라서, 프로그램에서 객체 · dict 로 조립해 그대로 넘길 수 있다.',
        code: {
          lang: 'javascript',
          caption: '{ $not: { $eq: … } } 는 $ne 와 같은 결과 — 필드가 없는 문서도 함께 나온다',
          source: `db.members.find({ age: { $gt: 30 } })                 // 30 초과
db.members.find({ age: { $gte: 20, $lt: 40 } })       // 20 이상 40 미만
db.members.find({ city: { $in: ["부산", "대구"] } })

// AND — 두 줄은 같은 뜻
db.members.find({ city: "서울", age: { $lt: 30 } })
db.members.find({ $and: [{ city: "서울" }, { age: { $lt: 30 } }] })

// OR — 부산에 살거나 50세 이상
db.members.find({ $or: [{ city: "부산" }, { age: { $gte: 50 } }] })

// NOT — 서울이 아닌 사람 (city 가 없는 우진도 나온다)
db.members.find({ city: { $not: { $eq: "서울" } } })`,
        },
      },
      {
        title: '검색 심화 — 정규식 · 정렬 · 개수 · 배열',
        body: '/진/ 같은 정규식은 SQL 의 LIKE 처럼 부분 일치로 찾고(^ 는 시작, $ 는 끝), sort 는 1 이 오름차순 · -1 이 내림차순이다. 개수는 countDocuments, 값 종류는 distinct, 필드가 있는지는 $exists 로 본다. 배열 필드는 값 하나로 찾으면 그 값을 품은 문서가 나오고, $all 은 모두 포함 · $in 은 하나라도 포함 · $nin 은 하나도 없을 때다.',
        why: '배열을 다른 테이블로 빼지 않고 문서 안에 둔 채로 조건을 걸 수 있다.',
        code: {
          lang: 'javascript',
          caption: '앞의 회원 데이터와 독서 취향(readers) 데이터',
          source: `db.members.find({ name: /진/ })                         // LIKE '%진%'
db.members.find({ name: /^서/ })                        // LIKE '서%'
db.members.find({ city: "서울" }).sort({ age: -1 })     // 나이 많은 순
db.members.countDocuments({ city: { $exists: true } })  // city 가 있는 문서 수 → 4
db.members.distinct("city")                             // 도시 종류

db.readers.insertMany([
  { name: "지훈", favorites: ["소설", "역사", "과학"] },
  { name: "서연", favorites: ["예술", "여행", "소설"] },
  { name: "도윤", favorites: ["만화", "게임"] }
])
db.readers.find({ favorites: { $all: ["소설", "여행"] } })  // 서연
db.readers.find({ favorites: { $in: ["만화", "과학"] } })   // 지훈 · 도윤
db.readers.find({ favorites: { $nin: ["소설"] } })          // 도윤`,
        },
      },
      {
        title: '수정과 삭제',
        body: 'updateOne(조건, 변경, 옵션)은 맞는 첫 문서 하나, updateMany 는 맞는 문서 모두를 고친다. $set 은 값을 바꾸고(필드가 없으면 추가), $inc 는 숫자를 더하고, $unset 은 필드를 지우고, $push · $pull 은 배열에 넣고 뺀다. upsert: true 면 맞는 문서가 없을 때 새로 만들고, 문서를 통째로 바꿀 땐 replaceOne, 지울 땐 deleteOne · deleteMany 를 쓴다.',
        why: '연산자로 바꿀 필드만 적으니, 나머지 필드는 건드리지 않고 그대로 남는다.',
        code: {
          lang: 'javascript',
          caption: '바꾸기 · 더하기 · 필드 지우기 · 배열 넣고 빼기 · upsert · 삭제',
          source: `db.members.updateMany({ age: { $gte: 40 } }, { $set: { grade: "VIP" } })
db.members.updateOne({ name: "도윤" }, { $inc: { age: 1 } })
db.members.updateOne({ name: "서연" }, { $unset: { job: "" } })
db.readers.updateOne({ name: "도윤" }, { $push: { favorites: "요리" } })
db.readers.updateOne({ name: "도윤" }, { $pull: { favorites: "게임" } })
db.members.updateOne(
  { name: "예린" },
  { $set: { age: 23, city: "광주" } },
  { upsert: true }                           // 예린이 없으니 새로 만든다
)
db.members.deleteOne({ name: "우진" })
db.members.deleteMany({ age: { $lt: 20 } })`,
        },
      },
    ],
    pitfalls: [
      'insert() · update() · remove() · count() 는 mongosh 에서 deprecated 다 — insertOne/insertMany · updateOne/updateMany · deleteOne/deleteMany · countDocuments 를 쓴다(removeOne 이라는 메서드는 없다)',
      '$ne · $nin · $not 은 그 필드가 아예 없는 문서도 결과에 넣는다 — 필드가 있는 문서만 원하면 $exists: true 를 함께 건다',
      'updateOne · updateMany 의 두 번째 인자에 $연산자 없이 문서를 넣으면 에러가 난다 — 통째로 바꾸려면 replaceOne 을 쓰고, 이때 _id 말고 기존 필드는 모두 사라진다',
      '서버를 외부에 열 때(mongod.conf 의 bindIp 를 0.0.0.0 으로, 27017 포트 개방) 계정을 만들고 security.authorization: enabled 를 켜지 않으면 누구나 접속할 수 있다',
    ],
    replaces: ['mongo-nosql', 'mongo-crud-find', 'mongo-crud-update'],
    tags: ['MongoDB', 'NoSQL', 'CRUD'],
    keywords:
      'nosql mongodb mongosh document bson collection objectid capped schema-less insertone insertmany find findone projection $gt $in $nin $and $or $not regex sort countdocuments distinct $exists $all update $set $inc $unset $push $pull upsert replaceone delete',
  },

  // ── B. 4 · 5강 ──
  {
    slug: 'mongo-aggregation',
    area: 'Back',
    course: 'MongoDB',
    lesson: '4 · 5강',
    date: '2026.10.04',
    title: 'Aggregation — 모아서 세고 묶기',
    summary:
      'Aggregation 파이프라인으로 문서를 거르고 · 묶고 · 세고 · 가공하고, 다른 컬렉션을 붙이거나 여러 집계를 한 번에 낼 수 있다.',
    points: [
      'aggregate([스테이지, …]) — 앞 스테이지의 결과가 다음 스테이지의 입력',
      '$group 의 _id 가 묶는 기준, 누산기($sum · $avg · $push …)로 집계한다',
      '$lookup 결과는 항상 배열 — SQL 의 LEFT JOIN 과 비슷하다',
    ],
    learned: [],
    sections: [
      {
        title: '파이프라인 — $match · $count',
        body: 'Aggregation 은 find 로는 어려운 그룹 · 집계 · 가공을 하는 문법으로, aggregate 에 스테이지 배열을 넘기면 앞 스테이지의 결과가 다음 스테이지의 입력이 된다(유닉스의 | 파이프와 같다). $match 는 find 조건과 같은 문법으로 문서를 거르고, $count 는 남은 문서 수를 필드 하나로 낸다.',
        why: '샤드 클러스터(여러 서버에 나눠 저장)에서는 파이프라인을 둘로 나눠, $match 같은 앞부분은 각 샤드가 자기 데이터로 먼저 처리하고 나머지는 한 곳에 모아 처리해서 데이터가 많을 때 유리하다.',
        code: {
          lang: 'javascript',
          caption: '책 데이터 5권 — 이 노트의 예시는 모두 이 데이터로',
          source: `db.books.insertMany([
  { title: "파이썬 첫걸음", year: 2021, genres: ["IT", "입문"], pages: 320, rating: 4.5, author: "김민수" },
  { title: "백엔드 여행", year: 2023, genres: ["IT"], pages: 410, rating: 4.2, author: "김민수" },
  { title: "바다의 기억", year: 2021, genres: ["소설"], pages: 280, rating: 3.9, author: "이수아" },
  { title: "우주 산책", year: 2022, genres: ["과학", "교양"], pages: 250, rating: 4.7, author: "박현우" },
  { title: "오래된 골목", year: 2023, genres: ["소설", "역사"], pages: 360, rating: 4.0, author: "이수아" }
])

// 2022년 이후 출간된 책 수 → { recent_books: 3 }
db.books.aggregate([
  { $match: { year: { $gte: 2022 } } },
  { $count: "recent_books" }
])`,
        },
      },
      {
        title: '$group 과 누산기',
        body: '$group 은 _id 에 묶는 기준을 "$year" 처럼 $ 를 붙여 적고, 나머지 필드에 누산기로 집계를 적는다. $sum: 1 은 개수, $sum: "$pages" 는 합계, $avg · $min · $max 는 평균 · 최소 · 최대, $push 는 값을 배열로(중복 포함), $addToSet 은 중복 없이 모은다. _id: null 이면 전체를 한 그룹으로 묶는다.',
        why: '"$year" 처럼 $ 를 붙여야 글자 "year" 가 아니라 그 필드의 값으로 읽힌다.',
        code: {
          lang: 'javascript',
          caption: '연도별로 묶기, 그리고 전체를 하나로 묶기',
          source: `// 연도별 책 수 · 평균 평점 · 제목 목록
db.books.aggregate([
  { $group: {
      _id: "$year",
      count: { $sum: 1 },
      avgRating: { $avg: "$rating" },
      titles: { $push: "$title" }
  } },
  { $sort: { _id: 1 } }
])

// 전체 평균 페이지 → { _id: null, avgPages: 324 }
db.books.aggregate([{ $group: { _id: null, avgPages: { $avg: "$pages" } } }])`,
        },
      },
      {
        title: '$sort · $limit · $skip 과 $first',
        body: '$sort 는 1 이 오름차순 · -1 이 내림차순, $limit 은 앞에서 n개만 남기고, $skip 은 앞에서 n개를 건너뛴다. $skip + $limit 조합이 페이지네이션의 기본이다. $first · $last 는 그룹에 들어온 순서대로 첫 · 마지막 값을 고르므로 앞에 $sort 를 둔다.',
        why: '$first 는 "들어온 순서의 첫 값" 이라, 정렬 없이 쓰면 어떤 값이 나올지 정해지지 않는다.',
        code: {
          lang: 'javascript',
          caption: '1위 · 2페이지 · 그룹별 최고를 정렬로 구한다',
          source: `// 작가별 총 페이지, 많은 순 1명 → 김민수 730
db.books.aggregate([
  { $group: { _id: "$author", totalPages: { $sum: "$pages" } } },
  { $sort: { totalPages: -1 } },
  { $limit: 1 }
])

// 평점 순 2페이지(3 · 4번째)
db.books.aggregate([{ $sort: { rating: -1 } }, { $skip: 2 }, { $limit: 2 }])

// 연도별 평점이 가장 높은 책
db.books.aggregate([
  { $sort: { year: 1, rating: -1 } },
  { $group: { _id: "$year", best: { $first: "$title" } } }
])`,
        },
      },
      {
        title: '$unwind — 배열을 풀어서 세기',
        body: '$unwind 는 배열 필드를 풀어 요소마다 문서를 하나씩 만든다. genres 가 ["소설", "역사"] 인 책은 genres 가 "소설" 인 문서와 "역사" 인 문서 두 개가 되고, 그 뒤 $group 으로 장르별로 센다.',
        why: '장르처럼 한 문서에 값이 여러 개인 필드도, 요소 하나하나를 기준으로 집계할 수 있다.',
        code: {
          lang: 'javascript',
          caption: '장르별 집계 — 마지막 $project 로 _id 를 genre 라는 이름으로 바꾼다',
          source: `// 장르별 책 수와 평균 평점
db.books.aggregate([
  { $unwind: "$genres" },          // ["소설", "역사"] → 문서 2개
  { $group: { _id: "$genres", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
  { $sort: { count: -1 } }
])

// 평균 페이지가 가장 긴 장르 → { avgPages: 365, genre: "IT" }
db.books.aggregate([
  { $unwind: "$genres" },
  { $group: { _id: "$genres", avgPages: { $avg: "$pages" } } },
  { $sort: { avgPages: -1 } },
  { $limit: 1 },
  { $project: { _id: 0, genre: "$_id", avgPages: 1 } }
])`,
        },
      },
      {
        title: '$project — 필드 고르고 만들기',
        body: '$project 는 1 이면 남기고 0 이면 빼며, "$year" 처럼 다른 필드를 넣으면 이름을 바꾼 새 필드가 된다. $concat 으로 문자열을 잇거나 $strLenCP 로 글자 수를 세는 식으로, 계산한 필드도 만들 수 있다. $concat 은 문자열만 이어서 숫자는 $toString 으로 바꿔 넣는다.',
        why: '필요한 필드만 원하는 이름으로 남겨 두면, 결과를 그대로 화면이나 API 응답에 쓸 수 있다.',
        code: {
          lang: 'javascript',
          caption: '이름 바꾸기 · 문자열 잇기 · 글자 수',
          source: `db.books.aggregate([
  { $project: {
      _id: 0,
      title: 1,
      published: "$year",                                         // 이름 바꾸기
      label: { $concat: ["$title", " (", { $toString: "$year" }, ")"] },
      titleLength: { $strLenCP: "$title" }                        // 글자 수
  } }
])
// { title: "파이썬 첫걸음", published: 2021, label: "파이썬 첫걸음 (2021)", titleLength: 7 }`,
        },
      },
      {
        title: '$lookup · $facet — 붙이고, 한 번에 여러 집계',
        body: '$lookup 은 from(붙일 컬렉션) · localField(내 필드) · foreignField(상대 필드) · as(결과를 담을 필드)로 다른 컬렉션의 문서를 붙인다. 결과는 항상 배열이고 짝이 없으면 빈 배열로 남아서 SQL 의 LEFT JOIN 과 비슷하다. $facet 은 같은 입력으로 서로 다른 파이프라인 여러 개를 돌려 결과를 문서 하나에 모은다.',
        why: '$facet 하나로 대시보드에 필요한 여러 집계를 요청 한 번에 받는다.',
        code: {
          lang: 'javascript',
          caption: '책마다 리뷰 수 · 리뷰어, 그리고 연도별 수 + 평점 상위 2권을 한 번에',
          source: `db.reviews.insertMany([
  { book_title: "파이썬 첫걸음", user: "지훈", score: 5 },
  { book_title: "파이썬 첫걸음", user: "도윤", score: 4 },
  { book_title: "우주 산책", user: "서연", score: 5 }
])
db.books.aggregate([
  { $lookup: { from: "reviews", localField: "title", foreignField: "book_title", as: "reviews" } },
  { $project: { _id: 0, title: 1, reviewCount: { $size: "$reviews" }, reviewers: "$reviews.user" } }
])
db.books.aggregate([
  { $facet: {
      byYear: [{ $group: { _id: "$year", count: { $sum: 1 } } }],
      topRated: [{ $sort: { rating: -1 } }, { $limit: 2 }, { $project: { _id: 0, title: 1 } }]
  } }
])`,
        },
      },
    ],
    pitfalls: [
      '배열 필드를 그대로 $group 의 _id 에 넣으면 배열 통째가 기준이 된다 — 요소별로 세려면 먼저 $unwind 한다($addToSet: "$genres" 도 풀지 않으면 배열의 배열이 된다)',
      '$concat 에 숫자 필드를 그대로 넣으면 에러가 난다 — { $toString: "$year" } 로 바꿔 넣는다',
      '같은 필드에 숫자와 빈 문자열("")이 섞여 있으면 $avg 는 숫자가 아닌 값을 건너뛰고, $sort 는 BSON 타입 순서로 정렬한다(오름차순이면 숫자가 문자열보다 앞, 내림차순이면 뒤) — { $match: { rating: { $type: "number" } } } 로 숫자만 남기고 집계한다',
      '조건으로 문서를 거를 땐 $match 가 간단하고 빠르다 — $redact($$KEEP · $$PRUNE)는 중첩 문서를 층마다 남기거나 지울 때 쓴다',
    ],
    replaces: ['mongo-aggregation-1', 'mongo-aggregation-2'],
    tags: ['MongoDB', 'Aggregation', '집계'],
    keywords:
      'mongodb aggregation pipeline $match $count $group $sum $avg $min $max $push $addtoset $first $unwind $sort $limit $skip pagination $project $concat $tostring $lookup join $facet $redact',
  },

  // ── C. 6 · 7 · 8 · 9강 ──
  {
    slug: 'mongo-python',
    area: 'Back',
    course: 'MongoDB',
    lesson: '6 · 7 · 8 · 9강',
    date: '2026.10.04',
    title: '파이썬으로 MongoDB 다루기 — pymongo · 인덱스 · 크롤링 저장',
    summary:
      'pymongo 로 파이썬에서 CRUD 와 집계를 하고, 인덱스와 텍스트 검색을 걸고, 크롤링한 데이터를 스키마 없이 저장해 바로 분석할 수 있다.',
    points: [
      '셸의 insertOne 이 파이썬에선 insert_one — 연산자는 문자열 키로 쓴다',
      '인덱스는 읽기를 빠르게, 쓰기를 느리게 — $text 는 텍스트 인덱스가 있어야 한다',
      'MySQL 과 달리 테이블을 만들지 않고 dict 를 바로 넣는다',
    ],
    learned: [],
    sections: [
      {
        title: 'pymongo 연결과 CRUD',
        body: "pip install pymongo 로 설치하고 MongoClient 로 접속한 뒤 client['DB이름']['컬렉션이름'] 으로 고른다(없으면 처음 데이터를 넣을 때 생긴다). 메서드 이름은 셸의 insertOne → insert_one 처럼 파이썬식 snake_case 이고, $set · $gte 같은 연산자는 dict 의 문자열 키라 따옴표로 감싼다. with 문으로 열면 블록이 끝날 때 연결이 자동으로 닫힌다.",
        why: '결과 객체의 inserted_id · modified_count · deleted_count 로 실제로 몇 건이 바뀌었는지 코드에서 확인한다.',
        code: {
          lang: 'python',
          caption: '접속 주소(계정이 있으면 계정 포함)는 코드에 적지 않고 환경변수에서 읽는다 — 예: mongodb://localhost:27017',
          source: `import os
from pymongo import MongoClient

with MongoClient(os.environ['MONGO_URI']) as client:
    books = client['library']['books']
    r = books.insert_one({'title': '파이썬 첫걸음', 'rating': 4.5})
    print(r.inserted_id)                               # 만들어진 _id
    books.insert_many([{'title': '백엔드 여행', 'rating': 4.2},
                       {'title': '우주 산책', 'rating': 4.7}])
    print(books.find_one({'title': '우주 산책'}))      # dict 또는 None
    r = books.update_one({'title': '백엔드 여행'}, {'$set': {'rating': 4.4}})
    print(r.modified_count)                            # 1
    r = books.delete_many({'rating': {'$lt': 4.0}})
    print(r.deleted_count)                             # 0`,
        },
      },
      {
        title: 'find 옵션 — projection · 정렬 · 개수',
        body: "find(조건, projection) 뒤에 sort · skip · limit 을 이어 붙이고, 여러 기준 정렬은 (필드, 방향) 튜플 리스트로 넘긴다. 정규식은 re.compile 이나 {'$regex': …, '$options': 'i'} 로 쓰고, distinct 는 배열 안 값까지 펼쳐 중복을 뺀다. 개수는 count_documents(조건), 필드가 없는 문서는 {'$exists': False} 로 찾는다.",
        why: 'sort · skip · limit 은 서버가 처리해서, 필요한 문서만 파이썬으로 넘어온다.',
        code: {
          lang: 'python',
          caption: 'Aggregation 노트의 책 데이터 5권으로',
          source: `import re

for b in books.find({'year': 2021}, {'_id': 0, 'title': 1}):
    print(b)                                          # {'title': '파이썬 첫걸음'} …

for b in books.find().sort('rating', -1).skip(2).limit(3):   # 평점 3~5위
    print(b['title'])
books.find().sort([('year', 1), ('rating', -1)])       # 여러 기준

books.find({'title': re.compile('python', re.I)})     # 대소문자 무시
print(books.distinct('genres'))                       # 배열 안 값까지 펼친다
print(books.count_documents({'genres': '소설'}))      # 2
books.find({'translator': {'$exists': False}})        # 번역자 필드가 없는 책`,
        },
      },
      {
        title: 'aggregate — 파이프라인은 리스트로',
        body: "셸과 같은 스테이지를 dict 로 적어 리스트로 넘기면, 결과는 for 로 도는 커서로 온다. 결과가 하나뿐이면 list(…)[0] 으로 꺼내고, $group 뒤에 $match 를 두면 SQL 의 HAVING 처럼 집계 결과로 거른다. 결과가 많을 수 있으면 테스트할 때 {'$limit': 5} 를 붙여 확인한다.",
        why: '$match 를 파이프라인 앞쪽에 두면 뒤 스테이지가 처리할 문서가 줄어 빨라진다(단, HAVING 처럼 $group 결과로 거르는 $match 는 앞으로 옮길 수 없다).',
        code: {
          lang: 'python',
          caption: '장르별 수 · 전체 평균 · 2권 이상 쓴 작가',
          source: `pipeline = [
    {'$unwind': '$genres'},
    {'$group': {'_id': '$genres', 'count': {'$sum': 1}}},
    {'$sort': {'count': -1}},
]
for g in books.aggregate(pipeline):
    print(g['_id'], g['count'])

avg = list(books.aggregate([{'$group': {'_id': None, 'avgPages': {'$avg': '$pages'}}}]))[0]
print(avg['avgPages'])                                # 324.0

authors = books.aggregate([
    {'$group': {'_id': '$author', 'count': {'$sum': 1}}},
    {'$match': {'count': {'$gte': 2}}},               # HAVING count >= 2
])`,
        },
      },
      {
        title: '인덱스 — 만들고 확인하고 지우기',
        body: '인덱스는 필드 값을 정렬된 상태로 따로 유지해, 데이터가 많아도 전체를 훑지 않고 찾게 해 준다. 필드 하나면 단일, 여러 개면 복합 인덱스이고, 배열 필드에 만들면 자동으로 다중키(multikey) 인덱스가 된다(그 밖에 위치용 지리 공간 · 문자열 검색용 텍스트 인덱스가 있다). create_index 는 만든 인덱스 이름을 돌려주고, _id_ 인덱스는 MongoDB 가 자동으로 만들며 지울 수 없다.',
        why: '읽기는 빨라지지만 저장 공간을 쓰고 쓰기마다 인덱스도 고쳐야 해서, 쓰기가 많은 컬렉션엔 꼭 필요한 것만 만든다.',
        code: {
          lang: 'python',
          caption: "셸에서는 db.books.createIndex({ title: 1 }) · getIndexes() · dropIndex('title_1')",
          source: `books.create_index('title')                         # 'title_1'
books.create_index([('author', 1), ('year', -1)])   # 'author_1_year_-1' (복합)
books.create_index('genres')                        # 배열 필드 → 다중키
print(books.index_information())                    # {'_id_': {...}, 'title_1': {...}, ...}
books.drop_index('title_1')                         # 없는 이름이면 에러
books.drop_indexes()                                # _id_ 빼고 전부 삭제`,
        },
      },
      {
        title: '텍스트 인덱스와 $text 검색',
        body: "$text 검색은 텍스트 인덱스가 있어야 동작하고, 텍스트 인덱스는 컬렉션당 하나라 여러 필드를 하나에 묶는다. weights 로 필드마다 가중치를 주면 그 필드에서 맞을 때 점수가 높아진다. {'$meta': 'textScore'} 로 MongoDB 가 계산한 적합도 점수를 받아, 점수 높은 순으로 정렬한다.",
        why: '제목에서 찾은 결과를 요약에서 찾은 결과보다 위에 올리는 식으로, 관련도 순서를 직접 정할 수 있다.',
        code: {
          lang: 'python',
          caption: 'score 는 내가 정한 필드 이름이라 바꿔도 된다',
          source: `books.drop_indexes()
books.create_index([('title', 'text'), ('summary', 'text')],
                   weights={'title': 5, 'summary': 1})

cursor = books.find(
    {'$text': {'$search': '우주'}},
    {'title': 1, 'score': {'$meta': 'textScore'}},   # 점수를 score 필드로
).sort([('score', {'$meta': 'textScore'})]).limit(5)  # 점수 높은 순
for b in cursor:
    print(b['title'], b['score'])`,
        },
      },
      {
        title: '크롤링한 데이터를 저장하고 분석하기',
        body: 'MySQL 은 저장 전에 테이블부터 만들어야 했지만, MongoDB 는 dict 를 바로 넣으면 DB 와 컬렉션까지 생긴다. 한 건씩 insert_one 해도 되지만, 페이지마다 리스트로 모아 insert_many 로 넣으면 더 빠르다. 저장한 뒤에는 distinct · $group · $regex 로 바로 분석한다.',
        why: '형식이 자주 바뀌는 크롤링 데이터는 필드가 늘어도 스키마를 고치지 않고 그대로 쌓는다.',
        code: {
          lang: 'python',
          caption: 'BASE_URL 은 실습 사이트 주소 — 수집 → 저장 → 분석',
          source: `products = client['shop']['products']

for page in range(1, 4):
    soup = BeautifulSoup(requests.get(f'{BASE_URL}?page={page}').content, 'html.parser')
    docs = [{'category': card.select_one('.category').get_text(strip=True),
             'name': card.select_one('.name').get_text(strip=True)}
            for card in soup.select('div.item')]
    if docs:                                       # 빈 리스트면 insert_many 가 에러
        products.insert_many(docs)

print(products.distinct('category'))               # 카테고리 종류
for c in products.aggregate([{'$group': {'_id': '$category', 'count': {'$sum': 1}}}]):
    print(c['_id'], c['count'])                    # 카테고리별 상품 수
products.find({'name': {'$regex': '블랙'}})         # 이름에 '블랙'이 들어간 상품`,
        },
      },
    ],
    pitfalls: [
      'PyMongo 4 에서 insert() · update() · remove() · count() 와 find().count() 가 없어졌다 — insert_one · update_one · delete_one · count_documents 를 쓴다',
      'insert_many 에 빈 리스트를 넘기면 TypeError 가 난다 — 크롤링 결과가 0건인 페이지가 있을 수 있으니 넣기 전에 확인한다',
      "텍스트 인덱스는 공백 · 구두점 기준으로 단어를 나누고 한국어는 어간 추출을 하지 않아서, '파이썬' 으로 찾으면 '파이썬을' 은 잡히지 않는다 — 부분 일치가 필요하면 $regex 를 쓰되, ^ 로 시작하지 않으면 인덱스를 제대로 못 써 느릴 수 있다",
      "sort('score', -1) 로는 점수 순이 되지 않는다 — 점수는 저장된 필드가 아니라 검색할 때 계산되는 값이라 sort 에도 {'$meta': 'textScore'} 를 넣어야 하고, 이 정렬은 항상 높은 순이다",
    ],
    replaces: ['mongo-pymongo-basic', 'mongo-pymongo-advanced', 'mongo-index-text', 'mongo-crawling'],
    tags: ['MongoDB', 'Python', '인덱스', '크롤링'],
    keywords:
      'pymongo python mongoclient insert_one insert_many find_one update_one delete_many sort skip limit regex distinct count_documents aggregate having mongodb index create_index compound multikey text index $text textscore weights crawling beautifulsoup requests',
  },
]
