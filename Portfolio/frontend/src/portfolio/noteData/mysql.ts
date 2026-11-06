import type { StudyNote } from '../notes'

// MySQL 강의 10개(1~10강)를 4개 노트로 합쳤다 — F-012 노트 틀
// SQL 코드는 MySQL 8.0.42 에서 돌려 확인했고, 파이썬 코드는 문법 검사와 sqlite3 로 흐름을 확인했다.
// 예전 노트 10개(sql-rdbms … sql-crawling-pipeline) 주소는 replaces 로 이 노트들에 이어진다.

export const MYSQL_NOTES: StudyNote[] = [
  // ── A. 1 · 2 · 4강 ──
  {
    slug: 'sql-basics',
    area: 'Back',
    course: 'MySQL',
    lesson: '1 · 2 · 4강',
    date: '2026.10.04',
    title: 'DB 기초와 테이블 만들기 — RDBMS · DDL · DCL',
    summary:
      '관계형 DB 의 구조를 이해하고, 데이터베이스와 테이블을 만들고 고치고, 계정에 필요한 권한만 줄 수 있다.',
    points: [
      'RDBMS 는 데이터를 테이블(행 · 열)에 담고 키로 잇는다',
      'CREATE · ALTER · DROP 으로 구조를, GRANT 로 권한을 다룬다',
      'MODIFY · CHANGE 는 컬럼 정의 전체를 다시 적는다',
    ],
    learned: [],
    sections: [
      {
        title: '관계형 데이터베이스와 키',
        body: 'DBMS 는 여러 시스템이 함께 쓰는 데이터를 정리해 관리하는 프로그램이고, 관계형 DB(RDBMS)는 데이터를 테이블(2차원 표)에 담는다. 행(row)은 데이터 한 건, 열(column)은 속성이다. 기본키(Primary Key)는 각 행을 구분하는 값이라 NULL 과 중복이 안 되고, 외래키(Foreign Key)는 다른 테이블의 행을 가리킨다.',
        why: '데이터를 한 곳에 모아 키로 이어 두면 중복이 줄고, 여러 시스템이 같은 최신 데이터를 본다.',
        code: {
          lang: 'sql',
          caption: '고객 한 명이 주문 여러 건 — 두 테이블을 키로 잇는다',
          source: `CREATE TABLE customer (
    id INT PRIMARY KEY,          -- 기본키: 행을 구분
    name VARCHAR(20) NOT NULL
);
CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT NOT NULL,    -- 외래키: customer 의 행을 가리킨다
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);`,
        },
      },
      {
        title: '스키마와 SQL 의 갈래',
        body: '스키마는 테이블 구조 · 형식 · 테이블끼리의 관계를 정한 DB 설계도다. 스키마만 있으면 같은 구조의 DB 를 다시 만들 수 있지만 데이터는 없어서 백업과는 다르다. SQL 은 구조를 다루는 DDL(CREATE · ALTER · DROP), 데이터를 다루는 DML(INSERT · SELECT · UPDATE · DELETE), 권한을 다루는 DCL(GRANT)로 나누고, 트랜잭션 명령(COMMIT · ROLLBACK)은 DCL 에 넣거나 TCL 로 따로 나누기도 한다.',
        why: '구조 · 데이터 · 권한을 나눠 보면 명령 하나가 무엇을 바꾸는지 바로 안다.',
        code: {
          lang: 'sql',
          caption: '세 갈래를 한 줄씩',
          source: `CREATE TABLE memo (id INT PRIMARY KEY, body TEXT);   -- DDL: 구조
INSERT INTO memo VALUES (1, '첫 메모');               -- DML: 데이터
GRANT SELECT ON shop.memo TO 'reader'@'localhost';    -- DCL: 권한 (reader 계정과 shop.memo 가 있어야 한다)`,
        },
      },
      {
        title: '데이터베이스와 테이블 만들기',
        body: 'CREATE DATABASE 로 DB 를 만들고 USE 로 고른 다음 그 안에 테이블을 만든다. MySQL 에서 CREATE SCHEMA 는 CREATE DATABASE 와 같은 뜻이다. 컬럼마다 데이터 타입과 옵션을 적고, 기본키는 보통 NOT NULL AUTO_INCREMENT 정수 컬럼에 건다.',
        why: 'USE 로 DB 를 고르지 않고 db.table 처럼 DB 이름도 붙이지 않으면, 어느 DB 에 만들지 몰라 에러(No database selected)가 난다.',
        code: {
          lang: 'sql',
          caption: '고객 테이블을 만들고 구조 확인 — DESC 는 컬럼 · 타입 · NULL 여부 · 키를 보여 준다',
          source: `CREATE DATABASE customer_db;
USE customer_db;

CREATE TABLE customer (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    age TINYINT UNSIGNED,
    email VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);
SHOW TABLES;
DESC customer;`,
        },
      },
      {
        title: '데이터 타입과 컬럼 옵션',
        body: '숫자는 TINYINT · INT · BIGINT · FLOAT · DOUBLE, 문자는 고정 길이 CHAR(n) · 가변 길이 VARCHAR(n) · TEXT, 날짜는 DATE · DATETIME · TIMESTAMP 등을 쓴다. 정수의 UNSIGNED 는 음수를 빼는 대신 양수 쪽을 넓히고(TINYINT -128~127 → 0~255), NOT NULL 은 빈 값을 막고, AUTO_INCREMENT 는 값을 비워 두면 번호를 자동으로 매긴다(테이블당 하나).',
        why: '값에 맞는 타입과 제약을 걸어 두면 잘못된 값이 MySQL 8.0 기본 설정(strict 모드)에서 에러로 막힌다.',
        code: {
          lang: 'sql',
          caption: 'UNSIGNED 범위 밖의 값은 에러로 막힌다',
          source: `CREATE TABLE post (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    level TINYINT UNSIGNED,        -- 0~255
    code CHAR(4),                  -- 항상 4글자
    title VARCHAR(100) NOT NULL,   -- 길이가 들쭉날쭉
    created DATETIME
);
INSERT INTO post (level, code, title) VALUES (255, 'A001', '첫 글');
INSERT INTO post (level, code, title) VALUES (-1, 'A002', '둘째 글');  -- 에러: 범위 밖`,
        },
      },
      {
        title: 'ALTER 로 구조 고치기',
        body: 'ADD COLUMN 으로 컬럼을 더하고 DROP COLUMN 으로 뺀다. MODIFY 는 이름은 두고 컬럼 정의(타입 · NULL 여부 · 기본값 · 위치)를 바꾸고, CHANGE 는 이름까지 바꾼다. 둘 다 새 정의를 통째로 다시 적어야 해서, 빠뜨린 NOT NULL · DEFAULT 는 사라진다. 이름만 바꿀 때는 MySQL 8.0 의 RENAME COLUMN a TO b 를 쓰면 정의를 다시 적지 않아도 된다.',
        why: 'MySQL 은 MODIFY · CHANGE 를 "이 컬럼을 이 정의로 바꿔라"로 받아서 원래 속성을 이어 주지 않는다.',
        code: {
          lang: 'sql',
          caption: 'CHANGE 로 이름만 바꿀 때도 타입 · NOT NULL · DEFAULT 를 다시 적는다',
          source: `ALTER TABLE customer ADD COLUMN phone VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE customer MODIFY COLUMN phone VARCHAR(30) NOT NULL DEFAULT '';
ALTER TABLE customer CHANGE COLUMN phone tel VARCHAR(30) NOT NULL DEFAULT '';
ALTER TABLE customer DROP COLUMN tel;`,
        },
      },
      {
        title: '계정과 권한 — DCL',
        body: "터미널에서는 mysql -u 아이디 -p 로 접속하고, CREATE USER 로 계정을 만든 뒤 GRANT 로 권한을 준다. 계정은 '아이디'@'호스트' 한 쌍이라 'localhost' 는 DB 서버와 같은 컴퓨터에서 접속할 때만, '%' 는 어느 호스트에서든 접속을 허용한다. 권한 대상은 db.table(테이블 하나), db.*(DB 하나), *.*(모든 DB)로 정한다.",
        why: '서비스용 계정에 ALL 대신 필요한 권한만 주면, 계정이 새어 나가도 할 수 있는 일이 그만큼 좁다.',
        code: {
          lang: 'sql',
          caption: '만들기 → 필요한 권한만 → 확인 → 비밀번호 변경 → 삭제',
          source: `CREATE USER 'app'@'localhost' IDENTIFIED BY '비밀번호';
GRANT SELECT, INSERT, UPDATE ON shop.products TO 'app'@'localhost';
SHOW GRANTS FOR 'app'@'localhost';
ALTER USER 'app'@'localhost' IDENTIFIED BY '새 비밀번호';
DROP USER 'app'@'localhost';`,
        },
      },
    ],
    pitfalls: [
      'MODIFY · CHANGE 에서 NOT NULL · DEFAULT 를 빠뜨리면 그 속성이 사라진다 — 바꾸기 전에 DESC 로 지금 정의를 본다',
      'MySQL 8.0 의 GRANT 는 계정을 만들어 주지 않는다 — CREATE USER 를 먼저 한다',
      'GRANT · CREATE USER 같은 계정 관리 문은 서버가 권한 테이블을 바로 다시 읽어 FLUSH PRIVILEGES 가 필요 없다(이미 접속한 세션의 전역 권한은 다시 접속해야 반영). FLUSH 는 권한 테이블을 INSERT · UPDATE · DELETE 로 직접 고쳤을 때만 필요하다',
      "'app'@'localhost' 와 'app'@'%' 는 서로 다른 계정이라 권한도 따로 준다",
    ],
    replaces: ['sql-rdbms', 'sql-ddl', 'sql-dcl'],
    tags: ['MySQL', 'SQL', '스키마', '권한'],
    keywords:
      'rdbms database schema sql ddl dml dcl tcl mysql mariadb create table alter modify change data type primary key unsigned auto_increment grant user privileges',
  },

  // ── B. 3 · 5강 ──
  {
    slug: 'sql-crud-select',
    area: 'Back',
    course: 'MySQL',
    lesson: '3 · 5강',
    date: '2026.10.04',
    title: '데이터 다루기 — CRUD와 SELECT',
    summary:
      'INSERT · SELECT · UPDATE · DELETE 로 데이터를 다루고, 조건 · 집계 · 그룹 · 정렬을 붙여 원하는 숫자를 뽑을 수 있다.',
    points: [
      'CRUD = INSERT · SELECT · UPDATE · DELETE',
      'UPDATE · DELETE 전에는 같은 조건으로 SELECT 먼저',
      '작성 순서: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT',
    ],
    learned: [],
    sections: [
      {
        title: 'INSERT — 넣기',
        body: '모든 컬럼에 넣을 때는 값만 순서대로 적고, 일부만 넣을 때는 컬럼 이름을 함께 적는다. 적지 않은 컬럼은 DEFAULT 값(없으면 NULL)이 들어가고, NOT NULL 인데 DEFAULT 가 없으면 strict 모드(8.0 기본)에서 에러가 난다. AUTO_INCREMENT 컬럼은 다음 번호가 자동으로 채워진다.',
        why: '컬럼 이름을 적어 두면 나중에 테이블에 컬럼이 늘어도(새 컬럼에 기본값이 있거나 NULL 을 허용하면) INSERT 문이 깨지지 않는다.',
        code: {
          lang: 'sql',
          caption: 'id 를 빼면 AUTO_INCREMENT 가 2, 3 을 채운다',
          source: `CREATE TABLE students (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT UNSIGNED,
    grade VARCHAR(10)
);
INSERT INTO students VALUES (1, '홍길동', 15, '9학년');
INSERT INTO students (name, age, grade) VALUES ('김철수', 16, '10학년');
INSERT INTO students (name) VALUES ('박민수');   -- age · grade 는 NULL`,
        },
      },
      {
        title: 'SELECT 와 WHERE — 골라 보기',
        body: 'SELECT 뒤에 볼 컬럼을, WHERE 뒤에 조건을 적는다. 비교는 = · != (<>) · < · > · <= · >= 를, 조건을 묶을 때는 AND(모두 만족)와 OR(하나라도 만족)를 쓴다. AND 가 OR 보다 먼저 묶이므로 둘을 섞을 땐 괄호로 의도를 적는다.',
        why: '괄호가 없으면 A OR B AND C 가 A OR (B AND C) 로 읽혀 생각과 다른 행이 나온다.',
        code: {
          lang: 'sql',
          caption: 'Sakila film — 등급이 PG 나 G 이면서, 개봉 연도가 2006 이나 2007',
          source: `SELECT title, rating, release_year
FROM film
WHERE (rating = 'PG' OR rating = 'G')
  AND (release_year = 2006 OR release_year = 2007);`,
        },
      },
      {
        title: 'LIKE — 부분 일치',
        body: 'LIKE 는 문자열 일부로 찾는다. % 는 0글자 이상 아무 글자, _ 는 정확히 한 글자를 뜻하고, NOT LIKE 는 그 반대다.',
        why: "이름 일부만 알거나 '~로 시작하는' 값을 찾을 때는 = 로 찾을 수 없다.",
        code: {
          lang: 'sql',
          caption: '% 는 0글자 이상, _ 는 딱 한 글자',
          source: `SELECT * FROM students WHERE name LIKE '박%';        -- 박으로 시작
SELECT * FROM students WHERE name LIKE '%철%';       -- 철이 들어감
SELECT * FROM students WHERE name LIKE '___';        -- 정확히 세 글자
SELECT name FROM students WHERE name NOT LIKE '%민%'; -- 민이 없는 사람`,
        },
      },
      {
        title: 'UPDATE · DELETE — 고치고 지우기',
        body: 'UPDATE 는 SET 으로 값을 바꾸고(여러 컬럼은 쉼표로 잇는다), DELETE 는 행을 지운다. 둘 다 WHERE 를 빼면 테이블의 모든 행이 대상이 된다.',
        why: '실행 전에 같은 WHERE 로 SELECT 해 보면 몇 행이 바뀔지 미리 안다.',
        code: {
          lang: 'sql',
          caption: '같은 조건으로 SELECT → UPDATE · DELETE',
          source: `SELECT * FROM students WHERE name = '박민수';   -- 먼저 확인
UPDATE students SET age = 18, grade = '11학년' WHERE name = '박민수';
DELETE FROM students WHERE name = '김철수';`,
        },
      },
      {
        title: '처음 보는 데이터 살피기 — LIMIT · COUNT · DISTINCT · 집계',
        body: 'LIMIT n 은 앞에서 n행만, COUNT(*) 는 행 개수, DISTINCT 는 중복을 뺀 값 종류를 보여 준다. SUM · AVG · MAX · MIN 은 합계 · 평균 · 최댓값 · 최솟값을 낸다. 실습은 MySQL 공식 샘플 DB 인 Sakila(DVD 대여점)로 했다.',
        why: '현업 DB 는 설명이 부족한 경우가 많아서, 데이터를 직접 보며 컬럼 뜻부터 파악한다.',
        code: {
          lang: 'sql',
          caption: 'Sakila — 처음 보는 테이블을 살필 때 쓰는 네 줄',
          source: `SELECT * FROM film LIMIT 1;          -- 컬럼 구조와 값
SELECT COUNT(*) FROM customer;       -- 고객 수
SELECT DISTINCT rating FROM film;    -- 등급 종류
SELECT SUM(amount), AVG(amount), MAX(amount), MIN(amount) FROM payment;`,
        },
      },
      {
        title: 'GROUP BY · ORDER BY · AS',
        body: 'GROUP BY 는 같은 값끼리 묶어 그룹마다 집계를 낸다. ORDER BY 는 결과를 정렬하고(ASC 오름차순이 기본, DESC 내림차순), AS 는 결과 컬럼에 이름을 붙인다.',
        why: 'AS 로 이름을 붙이면 결과가 읽기 쉽고, ORDER BY 에서 그 이름으로 정렬할 수 있다.',
        code: {
          lang: 'sql',
          caption: '130분 이상 영화를 등급별로 세고, 많은 순으로',
          source: `SELECT rating,
       COUNT(*) AS total_films,
       FLOOR(AVG(rental_rate)) AS avg_rate   -- FLOOR: 소수점 버림
FROM film
WHERE length >= 130
GROUP BY rating
ORDER BY total_films DESC;`,
        },
      },
    ],
    pitfalls: [
      'UPDATE · DELETE 에서 WHERE 를 빼면 모든 행이 바뀌거나 지워진다',
      'AND · OR 을 괄호 없이 섞으면 AND 가 먼저 묶인다',
      'GROUP BY 기준에 없는 컬럼을 집계 함수 없이 SELECT 하면, MySQL 8.0 기본 설정(ONLY_FULL_GROUP_BY)에서는 대개 에러가 난다',
      'INSERT 에서 컬럼 이름을 빼면 모든 컬럼의 값을 테이블 순서대로 빠짐없이 적어야 한다',
      'Workbench 는 safe update 모드가 기본이라, 키 컬럼이 아닌 WHERE 로 UPDATE · DELETE 하면 1175 에러가 난다 — WHERE id = … 처럼 기본키로 고르거나 잠깐 모드를 끈다',
    ],
    replaces: ['sql-dml', 'sql-select-advanced'],
    tags: ['MySQL', 'SQL', 'CRUD'],
    keywords:
      'mysql dml crud insert select update delete like where and or sakila limit count distinct sum avg max min group by order by as alias',
  },

  // ── C. 6 · 7 · 8강 ──
  {
    slug: 'sql-relations-index',
    area: 'Back',
    course: 'MySQL',
    lesson: '6 · 7 · 8강',
    date: '2026.10.04',
    title: '관계와 성능 — 외래키 · 집계 · JOIN · 인덱스',
    summary:
      '외래키로 테이블을 묶고, JOIN · 서브쿼리 · HAVING 으로 여러 테이블을 엮어 집계하고, 인덱스를 만들고 확인할 수 있다.',
    points: [
      '외래키는 (기본 설정에서) 부모에 없는 값과 참조 중인 부모 삭제를 막는다',
      'WHERE 는 묶기 전 행을, HAVING 은 묶은 뒤 그룹을 거른다',
      '인덱스는 읽기를 빠르게 하는 대신 쓰기를 조금 느리게 한다',
    ],
    learned: [],
    sections: [
      {
        title: '외래키 — 데이터 무결성',
        body: '외래키는 자식 테이블의 컬럼이 부모 테이블의 키(보통 기본키)를 참조하게 거는 제약이다. ON DELETE 같은 옵션을 따로 주지 않으면, 부모에 없는 값으로 자식에 INSERT 하거나 자식이 참조 중인 부모 행을 DELETE 할 때 에러가 난다. 그래서 넣을 때는 부모 → 자식, 지울 때는 자식 → 부모 순서이고, 현업에서는 제약이 강해 꼭 필요한 곳에만 걸기도 한다.',
        why: '두 테이블의 데이터가 어긋나지 않는 것(무결성)을 애플리케이션이 아니라 DB 가 지켜 준다.',
        code: {
          lang: 'sql',
          caption: 'userTbl 에 없는 userID 는 buyTbl 에 들어가지 않는다',
          source: `CREATE TABLE userTbl (
    userID CHAR(8) NOT NULL PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    addr CHAR(2) NOT NULL,
    mDate DATE
);
CREATE TABLE buyTbl (
    num INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID CHAR(8) NOT NULL,
    prodName CHAR(4) NOT NULL,
    FOREIGN KEY (userID) REFERENCES userTbl(userID)
);
INSERT INTO buyTbl (userID, prodName) VALUES ('nobody', '운동화');  -- 에러`,
        },
      },
      {
        title: 'GROUP BY + HAVING',
        body: 'HAVING 은 COUNT · AVG 같은 집계 결과에 조건을 걸 때 GROUP BY 와 함께 쓴다. WHERE 는 그룹으로 묶기 전에 행을 거르고, HAVING 은 묶은 뒤 그룹을 거른다.',
        why: '집계 값은 묶은 뒤에야 생기므로 WHERE 에 COUNT(*) 를 쓰면 에러가 난다.',
        code: {
          lang: 'sql',
          caption: '베스트 상품 데이터(items) — 네 절을 한 번에',
          source: `SELECT provider, COUNT(*)
FROM items
WHERE provider != ''        -- 1. 판매자 정보가 있는 상품만
GROUP BY provider           -- 2. 판매자별로 묶고
HAVING COUNT(*) > 100       -- 3. 상품이 100개 넘는 판매자만
ORDER BY COUNT(*) DESC;     -- 4. 많은 순으로`,
        },
      },
      {
        title: 'JOIN — 테이블 이어 붙이기',
        body: 'JOIN 은 공통 컬럼으로 두 테이블을 이어 하나의 결과로 만든다. INNER JOIN(그냥 JOIN 과 같다)은 양쪽에 짝이 있는 행만 남기고, LEFT · RIGHT OUTER JOIN 은 한쪽 테이블의 행은 모두 남기고 짝이 없는 쪽 컬럼을 NULL 로 채운다. 테이블 이름 뒤에 짧은 별칭을 붙이면 쓰기 편하다.',
        why: '정보를 여러 테이블에 나눠 저장했으니, 함께 보려면 조회할 때 다시 이어 붙여야 한다.',
        code: {
          lang: 'sql',
          caption: '신발/잡화 베스트에 10개 이상 오른 판매자, 많은 순',
          source: `SELECT i.provider, COUNT(*) AS best_count
FROM ranking r
JOIN items i ON i.item_code = r.item_code
WHERE r.main_category = '신발/잡화'
GROUP BY i.provider
HAVING COUNT(*) >= 10
ORDER BY best_count DESC;`,
        },
      },
      {
        title: 'OUTER JOIN + IS NULL — 한쪽에만 있는 데이터',
        body: 'OUTER JOIN 에서 짝이 없는 행은 상대 테이블 컬럼이 NULL 로 나온다. 그래서 WHERE 상대.키 IS NULL 을 붙이면 한쪽에만 있는 행만 남는다.',
        why: 'NULL 은 = NULL 로 비교하면 참이 되지 않아서 IS NULL 로 걸러야 한다.',
        code: {
          lang: 'sql',
          caption: 'Sakila — 어떤 고객도 쓰지 않는 주소 수',
          source: `SELECT COUNT(*)
FROM customer c
RIGHT OUTER JOIN address a ON a.address_id = c.address_id
WHERE c.customer_id IS NULL;`,
        },
      },
      {
        title: '서브쿼리 — 범위를 먼저 좁히기',
        body: '서브쿼리는 SQL 안에 괄호로 넣은 또 다른 SELECT 다. WHERE ... IN (목록), WHERE 컬럼 > (값 하나), FROM (임시 테이블) 자리에 들어가고, FROM 에 쓸 때 MySQL 은 별칭을 꼭 붙여야 한다. 결과에 여러 테이블의 컬럼이 필요하면 JOIN, 한 테이블 컬럼만 보고 조건만 다른 테이블에 있으면 서브쿼리가 자연스럽다.',
        why: '조건에 쓸 목록을 안쪽에서 먼저 뽑아 두면, 바깥 쿼리는 한 테이블만 보면 된다.',
        code: {
          lang: 'sql',
          caption: '같은 질문을 JOIN 과 IN 서브쿼리로, 그리고 FROM 서브쿼리',
          source: `SELECT i.title FROM items i
JOIN ranking r ON i.item_code = r.item_code
WHERE r.sub_category = '여성신발';

SELECT title FROM items
WHERE item_code IN (
    SELECT item_code FROM ranking WHERE sub_category = '여성신발'
);

SELECT AVG(cnt)   -- 판매자당 평균 상품 수
FROM (SELECT provider, COUNT(*) AS cnt FROM items GROUP BY provider) AS t;`,
        },
      },
      {
        title: '인덱스 — 클러스터형과 보조',
        body: '인덱스는 검색을 빠르게 하는 자료구조(보통 B-tree)다. InnoDB 에서 클러스터형 인덱스는 기본키 순서로 행 데이터 자체를 저장해 테이블당 하나뿐이고, 보조 인덱스는 키 값과 그 행의 기본키 값을 저장하고, 필요한 컬럼이 보조 인덱스에 없으면 그 기본키로 클러스터형 인덱스를 한 번 더 찾는다(다 있으면 커버링 인덱스라 다시 찾지 않는다). 보조 인덱스는 여러 개 만들 수 있고, UNIQUE 제약이나 인덱스가 없는 외래키 컬럼에는 자동으로 생긴다.',
        why: '읽기는 빨라지지만 INSERT · UPDATE · DELETE 때 인덱스도 함께 고쳐야 해서, 무조건 많이 만들지 않는다.',
        code: {
          lang: 'sql',
          caption: "만들기 · 확인 · 지우기 — 기본키가 있으면 Key_name 이 PRIMARY 인 인덱스가 클러스터형",
          source: `CREATE INDEX idx_name ON userTbl (name);          -- 보조 인덱스 추가
ALTER TABLE userTbl ADD INDEX idx_addr (addr);    -- 같은 일, 다른 문법
ALTER TABLE userTbl ADD CONSTRAINT uq_mDate UNIQUE (mDate);  -- 인덱스 자동 생성
SHOW INDEX FROM userTbl;
ALTER TABLE userTbl DROP INDEX idx_addr;`,
        },
      },
    ],
    pitfalls: [
      'JOIN 은 상대 테이블에 짝이 여러 개면 결과 행도 그만큼 늘어난다 — IN 서브쿼리는 바깥 테이블 행이 늘지 않는다',
      'WHERE 컬럼 > (서브쿼리) 처럼 값 하나와 비교하는 서브쿼리가 두 행 이상을 내면 에러가 난다',
      '외래키가 쓰는 인덱스는 대신 쓸 인덱스가 없으면 DROP 이 막힌다(1553) — 외래키를 먼저 지운다',
    ],
    replaces: ['sql-fk-having', 'sql-join-subquery', 'sql-index'],
    tags: ['MySQL', 'JOIN', '인덱스', '외래키'],
    keywords:
      'mysql foreign key integrity group by having join inner outer left right is null subquery in derived table index clustered secondary btree cardinality innodb',
  },

  // ── D. 9 · 10강 ──
  {
    slug: 'sql-python',
    area: 'Back',
    course: 'MySQL',
    lesson: '9 · 10강',
    date: '2026.10.04',
    title: '파이썬으로 MySQL 다루기 — pymysql · 크롤링 저장',
    summary:
      'pymysql 로 파이썬에서 SQL 을 안전하게 실행하고, 크롤링한 데이터를 MySQL 에 저장해 바로 분석할 수 있다.',
    points: [
      '접속 → 커서 → SQL → execute → commit 또는 fetch → close',
      '값은 %s 자리표시 + 튜플로 넘겨 SQL 인젝션을 막는다',
      '수집 → 저장 → SQL 분석이 한 파이프라인으로 이어진다',
    ],
    learned: [],
    sections: [
      {
        title: 'pymysql 기본 흐름 7단계',
        body: 'pip install pymysql 로 설치하고 ① import ② connect() 로 접속 ③ cursor() ④ SQL 문자열 ⑤ execute() ⑥ 데이터를 바꿨으면 commit(), 조회면 fetch ⑦ close() 순서로 쓴다. 커서는 DB 에 SQL 을 보내고 결과를 받아 오는 통로다.',
        why: 'pymysql 은 기본으로 autocommit 이 꺼져 있어서, commit() 을 하지 않으면 INSERT · UPDATE · DELETE 가 저장되지 않는다.',
        code: {
          lang: 'python',
          caption: '접속 정보는 코드에 적지 않고 환경변수에서 읽는다',
          source: `import os
import pymysql

db = pymysql.connect(
    host='localhost',
    port=3306,
    user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD'],
    database='ecommerce',
    charset='utf8mb4',
)
cursor = db.cursor()
cursor.execute('SELECT COUNT(*) FROM product')
print(cursor.fetchone())
db.close()`,
        },
      },
      {
        title: '테이블 만들고 INSERT',
        body: 'CREATE TABLE · INSERT 모두 SQL 문자열을 execute() 로 보낸다. INSERT 는 반복문으로 여러 번 실행하고 마지막에 commit() 을 한 번 해서 확정한다. CREATE TABLE 도 파이썬에서 보낼 수 있지만, 한 번만 만드는 스키마는 보통 Workbench 에서 만들고 반복 작업만 파이썬으로 한다.',
        why: 'MySQL 은 CREATE TABLE 같은 DDL 을 실행할 때 스스로 커밋하지만, INSERT 는 commit() 을 해야 확정된다.',
        code: {
          lang: 'python',
          caption: '상품 10개를 넣고 한 번에 commit',
          source: `cursor.execute('''
    CREATE TABLE product (
        PRODUCT_CODE VARCHAR(20) NOT NULL,
        TITLE VARCHAR(200) NOT NULL,
        ORI_PRICE INT,
        DISCOUNT_PRICE INT,
        PRIMARY KEY (PRODUCT_CODE)
    )
''')

sql = 'INSERT INTO product VALUES (%s, %s, %s, %s)'
for i in range(10):
    cursor.execute(sql, (str(215673141 + i), '여름 원피스', 23000, 6900))
db.commit()`,
        },
      },
      {
        title: 'SELECT 와 fetch 세 가지',
        body: 'SELECT 를 execute() 한 뒤 fetch 로 결과를 꺼낸다. fetchone() 은 다음 한 행(없으면 None), fetchmany(n) 은 다음 n행, fetchall() 은 남은 행 전부를 준다. 기본 커서에서 한 행은 튜플이라 row[0] 처럼 순서로 꺼낸다.',
        why: '결과가 한 행인 조회(COUNT 등)는 fetchone(), 목록 전체가 필요하면 fetchall() 로 받는다.',
        code: {
          lang: 'python',
          caption: '앞에서 꺼낸 행은 다시 나오지 않는다',
          source: `cursor.execute('SELECT PRODUCT_CODE, TITLE FROM product ORDER BY PRODUCT_CODE')
first = cursor.fetchone()      # 첫 행
next3 = cursor.fetchmany(3)    # 다음 3행
rest = cursor.fetchall()       # 남은 6행
for row in rest:
    print(row[0], row[1])`,
        },
      },
      {
        title: '%s 바인딩 — UPDATE · DELETE 와 SQL 인젝션',
        body: '값을 문자열 더하기(+)로 SQL 에 바로 붙이면 사용자 입력이 SQL 명령의 일부로 해석될 수 있다(SQL 인젝션). 그래서 SQL 에는 %s 만 적고 값은 execute() 의 두 번째 인자로 넘긴다. 숫자도 %s 로 적고, 값이 하나면 쉼표를 붙여 튜플로 만든다.',
        why: 'pymysql 이 값을 이스케이프해 값으로만 넣어 주므로, 값 안의 따옴표나 SQL 조각이 명령으로 실행되지 않는다.',
        code: {
          lang: 'python',
          caption: '값은 SQL 문자열이 아니라 execute() 의 두 번째 인자로',
          source: `# 위험: 값을 SQL 에 직접 이어 붙인다
# cursor.execute("DELETE FROM product WHERE PRODUCT_CODE='" + code + "'")

cursor.execute(
    'UPDATE product SET TITLE=%s, ORI_PRICE=%s WHERE PRODUCT_CODE=%s',
    ('린넨 원피스', 33000, '215673141'),
)
cursor.execute('DELETE FROM product WHERE PRODUCT_CODE=%s', ('215673142',))
db.commit()`,
        },
      },
      {
        title: '크롤링한 데이터를 바로 저장',
        body: 'requests 로 페이지를 받고 BeautifulSoup 으로 상품 카드(div.card-body)마다 카테고리와 상품명을 꺼내 바로 INSERT 한다. 10페이지를 모두 돈 뒤 commit() 을 한 번 한다.',
        why: "상품명에 작은따옴표(')가 들어 있으면 문자열 더하기로 만든 SQL 은 깨지지만, %s 바인딩은 그대로 저장한다.",
        code: {
          lang: 'python',
          caption: 'BASE_URL 은 실습 사이트 주소, 2페이지부터는 /page2 · /page3 …',
          source: `sql = 'INSERT INTO teddyproducts (TITLE, CATEGORY) VALUES (%s, %s)'

for page_num in range(1, 11):
    url = BASE_URL if page_num == 1 else f'{BASE_URL}/page{page_num}'
    soup = BeautifulSoup(requests.get(url).content, 'html.parser')
    for item in soup.select('div.card-body'):
        category = item.select_one('h2.card-title').get_text().strip()
        title = item.select_one('h4.card-text').get_text().strip()
        cursor.execute(sql, (title, category))

db.commit()`,
        },
      },
      {
        title: '저장 테이블과 분석 SQL',
        body: '저장할 테이블은 Workbench 에서 먼저 만들고, ID 는 AUTO_INCREMENT 라 파이썬 INSERT 에서 뺐다. 저장이 끝나면 DISTINCT 로 카테고리 종류를, GROUP BY 로 카테고리별 상품 수를 바로 본다. 수집 → 저장 → 분석이 이어지는 가장 기본적인 데이터 파이프라인이다.',
        why: '한 번 DB 에 넣어 두면 다시 크롤링하지 않고도 SQL 로 몇 번이고 다르게 분석할 수 있다.',
        code: {
          lang: 'sql',
          caption: '테이블을 만들고, 크롤링이 끝나면 두 줄로 분석',
          source: `CREATE TABLE teddyproducts (
    ID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    TITLE VARCHAR(200) NOT NULL,
    CATEGORY VARCHAR(20) NOT NULL,
    PRIMARY KEY (ID)
);

SELECT DISTINCT CATEGORY FROM teddyproducts;
SELECT CATEGORY, COUNT(*) FROM teddyproducts GROUP BY CATEGORY;`,
        },
      },
    ],
    pitfalls: [
      'commit() 없이 close() 하면 INSERT · UPDATE · DELETE 가 저장되지 않는다(pymysql 기본 autocommit 꺼짐)',
      "('값') 은 튜플이 아니라 그냥 값이다 — pymysql 은 값 하나를 그냥 넘기는 방식을 없앨 예정(deprecated)이라 ('값',) 처럼 튜플로 넘긴다",
      '숫자 자리도 %s 로 적는다 — pymysql 은 값을 먼저 문자열로 이스케이프해 넣으므로 %d 는 TypeError(ProgrammingError)가 난다',
      'select_one() 은 못 찾으면 None 을 돌려줘서, 바로 .get_text() 를 부르면 AttributeError 가 난다',
    ],
    replaces: ['sql-pymysql', 'sql-crawling-pipeline'],
    tags: ['MySQL', 'Python', '크롤링', '파이프라인'],
    keywords:
      'pymysql cursor execute fetchall fetchone fetchmany commit autocommit sql injection placeholder mysql crawling beautifulsoup requests pipeline',
  },
]
