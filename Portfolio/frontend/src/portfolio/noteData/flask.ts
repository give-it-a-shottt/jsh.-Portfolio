import type { StudyNote } from '../notes'

// 백엔드 강의 30개(1~30강, 파이썬 기초 + Flask)를 8개 노트로 합쳤다 — F-012 노트 틀
// 파이썬 코드는 Python 3.13.5 로, Flask 코드는 Flask 3.1.0 의 app.test_client() 로 돌려 확인했다.
// flask_cors · flask_login · pymysql · pymongo 코드와 bash · 브라우저(Vue) 코드는 설치 · 서버가 없어 문법 검사만 했다.
// 예전 노트 30개(be-python-start … be-deploy) 주소는 replaces 로 이 노트들에 이어진다.

export const FLASK_NOTES: StudyNote[] = [
  // ── A. 1 · 2 · 3 · 4강 ──
  {
    slug: 'be-python-basics',
    area: 'Back',
    course: '백엔드',
    lesson: '1 · 2 · 3 · 4강',
    date: '2026.10.04',
    title: '파이썬 기초 — 자료형 · 제어문 · 함수 · 컬렉션',
    summary:
      '숫자 · 문자열 · 리스트를 다루고, 조건문 · 반복문 · 함수로 흐름을 짜고, 튜플 · 딕셔너리 · 집합을 골라 쓸 수 있다.',
    points: [
      'input() 은 항상 문자열 — 계산하려면 int() · float() 로 바꾼다',
      '인덱스는 0부터, [시작:끝] · range(시작, 끝) 은 끝 바로 앞까지',
      '튜플은 못 고치고, 딕셔너리는 키로 찾고, 집합은 중복이 없다',
    ],
    learned: [],
    sections: [
      {
        title: '연산 · 변수 · 입력',
        body: '주피터 노트북은 셀 단위로 코드를 실행한다(Shift + Enter 로 실행, 명령 모드에서 a · b 로 위 · 아래에 셀 추가). 연산자는 + - * / 와 // (몫) · % (나머지) · ** (거듭제곱)이 있고, 값은 int · float · str · bool 타입으로 변수에 담는다. input() 은 무엇을 입력하든 문자열(str)로 돌려주므로 숫자 계산 전에 int() · float() 로 바꾼다.',
        why: "타입이 다르면 같은 + 도 다르게 동작해서, '10' + '20' 은 30 이 아니라 '1020' 이 된다.",
        code: {
          lang: 'python',
          caption: '10 과 20 을 입력했을 때 — 문자열 더하기와 숫자 더하기',
          source: `print(7 / 2, 7 // 2, 7 % 2, 2 ** 10)    # 3.5 3 1 1024

r = 10
pi = 3.1415
print('지름 =', 2 * r)                   # 지름 = 20
print('넓이 =', round(pi * r ** 2, 2))   # 넓이 = 314.15

A = input('A = ? ')                      # 10 입력 → '10'
B = input('B = ? ')                      # 20 입력 → '20'
print(A + B)                             # 1020
print(int(A) + int(B))                   # 30
print(type(A), type(r), type(pi), type(r > 5))
# <class 'str'> <class 'int'> <class 'float'> <class 'bool'>`,
        },
      },
      {
        title: '문자열 — 인덱스 · 슬라이싱 · 포맷',
        body: 'len() 으로 길이를 재고, 인덱스는 앞에서 0부터 · 뒤에서 -1부터 센다. 문자열[시작:끝] 은 끝 번호 바로 앞까지 잘라 오고, count · find · replace · strip · split 같은 함수는 변수.함수() 꼴로 부른다. 값을 끼워 출력할 때는 format() · % 를 쓰고, 지금 코드에서는 f-string(3.6+)을 가장 많이 쓴다.',
        why: '문자열은 고칠 수 없는 값이라 replace · strip 은 원본을 바꾸지 않고 새 문자열을 돌려준다.',
        code: {
          lang: 'python',
          caption: 'find 는 위치(0부터), split() 은 공백으로 나눠 리스트를 만든다',
          source: `s = 'python'
print(len(s), s[0], s[-1], s[1:5])       # 6 p n ytho

t = '  I have a pen  '.strip()            # 양쪽 공백 제거
print(t.split())                          # ['I', 'have', 'a', 'pen']
print(t.count('a'), t.find('pen'))        # 2 9
print(t.replace('pen', 'apple'), '/', t)  # I have a apple / I have a pen

print('I have a {1}, I have an {0}.'.format('pen', 'apple'))
print(format(0.087, '.2f'))               # 0.09
print('I have a %s, %d개' % ('pen', 2))   # %s 문자열 · %d 정수 · %f 실수
fruit = 'apple'
print(f'I have an {fruit}')               # f-string`,
        },
      },
      {
        title: '리스트',
        body: '리스트는 관련 있는 여러 값을 [ ] 안에 쉼표로 모아 하나의 변수로 다루는 구조이고, 값의 타입이 섞여도 된다. append 는 끝에, insert 는 원하는 위치에 넣고, remove 는 값으로, del 은 인덱스로 지운다. sort · reverse 는 리스트 자체의 순서를 바꾼다.',
        why: 'sort() 는 새 리스트를 만들지 않고 그 자리에서 바꾼 뒤 None 을 돌려주므로, 정렬된 복사본이 필요하면 sorted() 를 쓴다.',
        code: {
          lang: 'python',
          caption: 'append · insert · remove · del 을 차례로 거친 모습',
          source: `lang = ['java', 'c', 'c++']
lang.append('golang')         # 끝에 추가
lang.insert(0, 'python')      # 0번 자리에 추가
lang.remove('c')              # 값으로 삭제
del lang[1]                   # 1번 자리 삭제 → 'java'
print(lang)                   # ['python', 'c++', 'golang']

lang.sort()
print(lang)                   # ['c++', 'golang', 'python']
lang.reverse()
print(lang)                   # ['python', 'golang', 'c++']
print(lang.sort())            # None`,
        },
      },
      {
        title: '조건문과 반복문',
        body: 'if · elif · else 는 위에서부터 처음 참인 조건 하나만 실행하고, 블록은 들여쓰기로 구분한다. 조건은 and(모두) · or(하나라도) · not(반대)으로 잇는다. for 는 리스트 · 문자열 · range 에서 값을 하나씩 꺼내 반복하고, while 은 조건이 True 인 동안 반복한다.',
        why: 'elif 는 앞 조건이 거짓일 때만 검사해서, 큰 기준부터 적으면 age >= 13 and age < 19 처럼 범위를 두 번 적지 않아도 된다.',
        code: {
          lang: 'python',
          caption: '15살은 청소년 — 1부터 10까지 더하면 55',
          source: `age = 15
if age >= 19:
    print('성인')
elif age >= 13:
    print('청소년')          # ← 15 는 여기
elif age >= 7:
    print('아동')
else:
    print('유아')

total = 0
for i in range(1, 11):       # 1 ~ 10 (11 은 빠진다)
    total += i
print(total)                 # 55`,
        },
      },
      {
        title: '함수와 튜플',
        body: 'def 로 함수를 만들고 return 으로 결과를 돌려준다. return 만 쓰면 그 자리에서 함수가 끝나서 조건 검사에 자주 쓰고, return a, b 처럼 여러 값을 돌려주면 튜플 하나로 묶여 나온다. 튜플은 ( ) 로 만들며 추가 · 삭제 · 수정이 안 되고, x, y = y, x 로 두 값을 맞바꿀 수 있다.',
        why: '조건에 안 맞는 경우를 먼저 return 으로 끝내 두면, 아래 코드는 정상인 경우만 생각하면 된다.',
        code: {
          lang: 'python',
          caption: 'admin 이면 바로 끝내기, 여러 값 돌려주기, 맞바꾸기',
          source: `def id_check(user_id):
    if user_id == 'admin':
        print('invalid id: admin')
        return                       # 여기서 함수가 끝난다
    print('valid id:', user_id)

def min_max(nums):
    return min(nums), max(nums)      # 여러 값 → 튜플 하나

id_check('admin')                    # invalid id: admin
result = min_max([3, 1, 4])
print(result, type(result))          # (1, 4) <class 'tuple'>
x, y = 1, 2
x, y = y, x                          # 맞바꾸기
print(x, y)                          # 2 1`,
        },
      },
      {
        title: '딕셔너리와 집합',
        body: '딕셔너리는 {키: 값} 으로 저장해 키로 값을 찾는 구조로, JSON 과 모양이 비슷하다. keys() · values() · items() 로 키 · 값 · 쌍을 꺼낸다. 집합은 순서와 중복이 없어서 in 으로 포함 여부를 보고, | · & · - · ^ 로 합집합 · 교집합 · 차집합 · 대칭차집합(한쪽에만 있는 것)을 낸다.',
        why: '딕셔너리는 키로, 집합은 값으로 바로 찾아가서 리스트처럼 앞에서부터 하나씩 비교하지 않는다.',
        code: {
          lang: 'python',
          caption: '없는 키를 [ ] 로 꺼내면 KeyError, get() 은 None',
          source: `d = {'korean': 95, 'math': 100}
d['english'] = 'pass'                  # 추가
del d['math']                          # 삭제
print(d['korean'], d.get('science'))   # 95 None
print(list(d.items()))                 # [('korean', 95), ('english', 'pass')]

A = {1, 2, 3, 3}                       # 중복은 하나만 → {1, 2, 3}
B = {3, 4}
print(A | B, A & B, A - B, A ^ B)      # {1, 2, 3, 4} {3} {1, 2} {1, 2, 4}
A.add(5)                               # 하나 추가
A.update([6, 7])                       # 여러 개 추가
A.remove(1)
print(2 in A, A)                       # True {2, 3, 5, 6, 7}`,
        },
      },
    ],
    pitfalls: [
      "int('3.5') 처럼 정수 모양이 아닌 문자열은 ValueError 가 난다 — 소수는 float() 로 바꾼다",
      'sort() 의 반환값은 None 이다 — lang = lang.sort() 라고 쓰면 리스트를 잃는다',
      '숫자와 문자열이 섞인 리스트는 담을 수는 있어도 sort() 하면 TypeError 가 난다',
      '빈 { } 는 집합이 아니라 빈 딕셔너리다 — 빈 집합은 set() 으로 만든다',
    ],
    replaces: ['be-python-start', 'be-python-string-list', 'be-python-control', 'be-python-func-collections'],
    tags: ['Python', '기초', '자료구조'],
    keywords:
      'python jupyter notebook markdown operator variable type input int float string index slicing format f-string list append sort if elif for while range function return tuple dict set',
  },

  // ── B. 8 · 9 · 10 · 11강 ──
  {
    slug: 'be-python-functions',
    area: 'Back',
    course: '백엔드',
    lesson: '8 · 9 · 10 · 11강',
    date: '2026.10.04',
    title: '일급 함수 · 클로저 · 데코레이터',
    summary:
      '함수를 값처럼 다루는 일급 함수와 클로저를 이해하고, 여러 함수 앞뒤에 같은 기능을 붙이는 데코레이터를 직접 만들 수 있다.',
    points: [
      '중첩 함수 → 일급 함수 → 클로저 → 데코레이터 순서로 쌓인다',
      '@deco 는 func = deco(func) 와 같다',
      '여러 개를 쌓으면 감싸기는 아래 → 위, 호출 때 실행은 위 → 아래',
    ],
    learned: [],
    sections: [
      {
        title: '중첩 함수',
        body: '중첩 함수는 함수 안에서 정의한 또 다른 함수다. 지역 변수처럼 바깥 함수 안에서만 이름이 있어서, 밖에서 부르면 NameError 가 난다. Flask 의 @app.route 같은 데코레이터를 이해하려면 중첩 함수 → 일급 함수 → 클로저 순서로 알아야 한다.',
        why: '바깥에서 쓸 일 없는 보조 함수를 안에 숨겨 두면 다른 이름과 겹치지 않는다.',
        code: {
          lang: 'python',
          caption: '안쪽 함수는 바깥 함수 안에서만 부를 수 있다',
          source: `def outer_func():
    print('call outer_func')
    def inner_func():
        return 'call inner_func'
    print(inner_func())

outer_func()        # call outer_func → call inner_func
inner_func()        # NameError — 밖에서는 이름이 없다`,
        },
      },
      {
        title: '일급(First-class) 함수',
        body: '함수를 변수에 담고, 다른 함수의 인자로 넘기고, 리턴값으로 돌려줄 수 있으면 그 함수를 일급 함수라고 한다. 파이썬은 함수도 객체라 세 가지가 모두 되고, 함수형 프로그래밍에서 온 개념이다. 함수를 만들어 돌려주는 html_creator 같은 함수가 다음 단계인 클로저의 출발점이다.',
        why: '처리 방법(함수)을 값처럼 넘기면 list_square 하나로 제곱 · 세제곱 등 여러 계산을 돌릴 수 있다.',
        code: {
          lang: 'python',
          caption: '1. 변수에 담기 · 2. 인자로 넘기기 · 3. 함수를 만들어 돌려주기',
          source: `def calc_square(digit):
    return digit * digit

func1 = calc_square                          # 1. 변수에 담기
print(func1(4))                              # 16

def list_square(function, digit_list):       # 2. 인자로 넘기기
    return [function(d) for d in digit_list]
print(list_square(calc_square, [1, 2, 3]))   # [1, 4, 9]

def html_creator(tag):                       # 3. 함수를 돌려주기
    def text_wrapper(msg):
        return '<{0}>{1}</{0}>'.format(tag, msg)
    return text_wrapper
h1 = html_creator('h1')
print(h1('제목'))                            # <h1>제목</h1>`,
        },
      },
      {
        title: '클로저(Closure)',
        body: '클로저는 바깥 함수의 변수를 기억한 채로 돌려받은 안쪽 함수다. 바깥 함수 호출이 끝나도, 바깥 함수 이름을 del 로 지워도 안쪽 함수는 기억한 값을 계속 쓴다. 클로저는 객체(클래스)와 비슷한 역할이라, 제공할 기능이 적으면 클로저 · 많으면 클래스가 어울린다.',
        why: 'calc_power(2) · calc_power(3) 처럼 설정값만 다른 함수를 클래스 없이 찍어 낼 수 있다.',
        code: {
          lang: 'python',
          caption: 'n 이 각각 2, 3 으로 남아 있다',
          source: `def calc_power(n):
    def power(digit):
        return digit ** n            # 바깥 함수의 n 을 기억한다
    return power

power2 = calc_power(2)               # calc_power 는 여기서 끝났지만
power3 = calc_power(3)
print(power2(2), power3(2))          # 4 8

funcs = [calc_power(n) for n in range(1, 6)]
print([f(2) for f in funcs])         # [2, 4, 8, 16, 32]

del calc_power
print(power2(5))                     # 25 — 바깥 함수를 지워도 동작`,
        },
      },
      {
        title: '데코레이터 만들기',
        body: '데코레이터는 함수를 받아 앞뒤에 기능을 덧붙인 새 함수(클로저)를 돌려주는 함수다. 함수 위에 @datetime_decorator 를 붙이는 것은 logger_login = datetime_decorator(logger_login) 과 같다. 유효성 검사 같은 코드를 여러 함수에 직접 넣으면 검사 방법이 바뀔 때 모두 고쳐야 하지만, 데코레이터로 빼 두면 한 곳만 고친다.',
        why: '원래 함수는 손대지 않고 공통 기능을 붙였다 뗐다 할 수 있다.',
        code: {
          lang: 'python',
          caption: '원래 함수 앞뒤에 시간 출력이 붙는다',
          source: `import datetime

def datetime_decorator(func):
    def wrapper():
        print('start', datetime.datetime.now())   # 앞에 붙는 기능
        func()                                     # 원래 함수
        print('end  ', datetime.datetime.now())   # 뒤에 붙는 기능
    return wrapper

@datetime_decorator        # = logger_login = datetime_decorator(logger_login)
def logger_login():
    print('David login')

logger_login()`,
        },
      },
      {
        title: '인자가 있는 함수에 붙이기',
        body: '꾸밀 함수가 인자를 받으면 안쪽 함수도 같은 인자를 받아 그대로 넘겨야 하고, 그 사이에서 값을 검사해 원래 함수를 부르지 않고 끝낼 수도 있다. (*args, **kwargs) 로 받으면 인자 개수 · 이름과 상관없이 어떤 함수에도 붙일 수 있다. 클래스 안의 (인스턴스) 메서드에 붙이면 self 도 args 의 첫 값으로 함께 넘어간다.',
        why: '0 으로 나누기 같은 검사를 함수 본문이 아니라 데코레이터 한 곳에 맡긴다.',
        code: {
          lang: 'python',
          caption: 'd2 가 0 이면 divide 를 부르지 않고 안내만 출력',
          source: `def check_zero(function):
    def inner_func(d1, d2):                  # 꾸밀 함수와 같은 파라미터
        if d2 == 0:
            print('cannot be divided with zero')
            return None
        return function(d1, d2)
    return inner_func

@check_zero
def divide(d1, d2):
    return d1 / d2

print(divide(9, 3))     # 3.0
print(divide(9, 0))     # cannot be divided with zero → None`,
        },
      },
      {
        title: '데코레이터 쌓기와 파라미터 데코레이터',
        body: "@ 를 여러 줄 쓰면 정의할 때 아래쪽(함수에 가까운 것)부터 감싸고, 호출하면 가장 바깥인 위쪽 데코레이터의 코드부터 실행된다. @mark('b') 처럼 데코레이터에 값을 넘기려면 중첩을 한 단계 더 만든다 — mark('b') 가 먼저 불려 진짜 데코레이터를 돌려주고, 그것이 함수를 감싼다. Flask 의 @app.route('/hello') 가 이런 파라미터 데코레이터다.",
        why: '태그 · 경로 같은 설정값만 바꿔 같은 데코레이터를 여러 곳에 재사용할 수 있다.',
        code: {
          lang: 'python',
          caption: '감싸기는 i → b, 실행은 b → i — 결과는 <b><i>안녕</i></b>',
          source: `def mark(tag):                               # 값을 받는 바깥 단계
    def decorator(func):
        print('감싸기', tag)
        def wrapper(*args, **kwargs):
            print('실행', tag)
            return f'<{tag}>' + func(*args, **kwargs) + f'</{tag}>'
        return wrapper
    return decorator

@mark('b')                                   # = mark('b')(mark('i')(greet))
@mark('i')
def greet(name):
    return name

print(greet('안녕'))
# 감싸기 i → 감싸기 b → 실행 b → 실행 i → <b><i>안녕</i></b>`,
        },
      },
    ],
    pitfalls: [
      '데코레이터의 바깥 코드는 함수를 정의할 때 한 번 실행된다 — 위 예의 감싸기 출력은 greet 을 부르기 전에 찍힌다',
      '안쪽 함수가 원래 함수의 결과를 return 하지 않으면, 꾸민 함수는 늘 None 을 돌려준다',
      "functools.wraps 없이 감싸면 함수 이름(__name__)이 wrapper 로 바뀐다 — Flask 에서 같은 데코레이터를 두 라우트에 붙이면 endpoint 이름이 겹쳐 AssertionError 가 나니 안쪽 함수에 @wraps(func) 를 붙인다",
      '반복문 안에서 바로 lambda · def 로 만든 클로저는 n 의 값이 아니라 변수를 기억해, 다 만든 뒤 부르면 모두 마지막 n 을 쓴다 — calc_power(n) 처럼 바깥 함수로 감싸면 호출마다 n 이 따로 생긴다',
    ],
    replaces: ['be-first-class', 'be-closure', 'be-decorator-3', 'be-decorator-4'],
    tags: ['Python', '함수', '클로저', '데코레이터'],
    keywords:
      'python first-class function nested function closure decorator wrapper args kwargs validation stacking method parameterized functools wraps',
  },

  // ── C. 26 · 27 · 28강 ──
  {
    slug: 'be-python-class',
    area: 'Back',
    course: '백엔드',
    lesson: '26 · 27 · 28강',
    date: '2026.10.04',
    title: '클래스 — 객체 · 상속 · 클래스 메서드',
    summary:
      '클래스로 속성과 메서드를 묶어 객체를 만들고, 상속 · 재정의로 공통 코드를 나누고, 클래스 변수와 static · class 메서드를 구분해 쓸 수 있다.',
    points: [
      '메서드의 첫 인자 self 에는 객체 자신이 자동으로 들어간다',
      'super().메서드() 는 부모 것, self.메서드() 는 재정의된 내 것',
      'staticmethod 는 self · cls 가 없고, classmethod 의 cls 는 호출한 클래스',
    ],
    learned: [],
    sections: [
      {
        title: '클래스 · 객체 · 속성',
        body: '클래스는 객체를 만드는 틀이고, 이름은 단어 첫 글자를 대문자로 쓰는 CapWords 로 짓는다(내용이 아직 없으면 pass). 속성은 생성자 __init__ 안에서 self.속성 = 값 으로 만들고, 객체를 만들 때 값을 넘긴다. 객체마다 속성 값은 따로 관리되고, dir(객체) 로 가진 속성 · 메서드를 볼 수 있다.',
        why: '관련된 데이터를 한 객체에 묶어 두면 square1.width 처럼 어느 객체의 값인지 바로 보인다.',
        code: {
          lang: 'python',
          caption: 'square1 을 바꿔도 square2 는 그대로',
          source: `class Quadrangle:
    def __init__(self, width, height, color):   # 생성자 — 객체를 만들 때 실행
        self.width = width                       # 인스턴스 속성
        self.height = height
        self.color = color

square1 = Quadrangle(12, 12, 'red')
square2 = Quadrangle(3, 3, 'blue')
square1.height = 5                          # square1 만 바뀐다
print(square1.height, square2.height)       # 5 3
print(type(square1))                        # <class '__main__.Quadrangle'>
print('color' in dir(square1))              # True`,
        },
      },
      {
        title: '메서드와 self',
        body: '메서드는 클래스 안에 정의한 함수이고, 첫 번째 파라미터로는 인자가 필요 없어도 객체 자신이 들어오고, 이름은 관례상 self 로 쓴다. square.get_area() 처럼 부르면 파이썬이 객체 자신을 self 자리에 넣어 Quadrangle.get_area(square) 로 실행한다. 그래서 메서드 안에서는 self.width 처럼 그 객체의 속성에 접근한다.',
        why: '같은 메서드 코드를 여러 객체가 함께 쓰면서도, self 덕분에 각자 자기 값으로 계산한다.',
        code: {
          lang: 'python',
          caption: 'square.get_area() 와 Quadrangle.get_area(square) 는 같은 호출',
          source: `class Quadrangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def get_area(self):
        return self.width * self.height

    def set_area(self, width, height):
        self.width = width
        self.height = height

square = Quadrangle(2, 3)
square.set_area(5, 5)
print(square.get_area())              # 25
print(Quadrangle.get_area(square))    # 25`,
        },
      },
      {
        title: '추상화와 상속',
        body: '여러 클래스에 겹치는 속성 · 메서드를 기본 클래스 하나로 묶는 것이 추상화, 그 기능을 물려받고 다른 부분만 더하거나 바꾸는 것이 상속이다. class 자식(부모): 처럼 괄호에 부모를 적고(부모 = Parent · Super · Base, 자식 = Child · Sub · Derived), 부모가 둘 이상이면 다중 상속이다. issubclass(자식, 부모) 는 상속 관계를, isinstance(객체, 클래스) 는 객체가 그 클래스, 또는 그 클래스를 상속한 자식 클래스로 만들어졌는지를 확인한다.',
        why: '공통 기능은 부모 한 곳만 고치면 모든 자식에 반영된다.',
        code: {
          lang: 'python',
          caption: '자식에 __init__ 이 없으면 부모의 __init__ 을 쓴다',
          source: `class Figure:
    def __init__(self, name, color):
        self.name = name
        self.color = color

class Quadrangle(Figure):                  # Figure 를 물려받는다
    def set_area(self, width, height):
        self.width = width
        self.height = height
    def get_info(self):
        print(self.name, self.color, self.width * self.height)

square = Quadrangle('dave', 'blue')        # __init__ 은 부모 것
square.set_area(5, 5)
square.get_info()                          # dave blue 25
print(issubclass(Quadrangle, Figure), isinstance(square, Figure))   # True True`,
        },
      },
      {
        title: '메서드 재정의와 super()',
        body: '부모에 있는 메서드를 자식에서 같은 이름으로 다시 정의하면(override), 자식 객체에서는 재정의한 메서드가 불린다. 파이썬은 이름만 같으면 매개변수가 달라도 부모 메서드를 가린다. 자식 안에서 super().메서드() 는 부모의 것을, self.메서드() 는 재정의된 자기 것을 부르고, 다른 언어의 this 가 파이썬의 self 다.',
        why: '부모 동작은 그대로 두고 자식에게 필요한 부분만 바꾸면서, 필요하면 super() 로 부모 동작도 이어 쓸 수 있다.',
        code: {
          lang: 'python',
          caption: 'study hard → work hard → study hard',
          source: `class Person:
    def work(self):
        print('work hard')

class Student(Person):
    def work(self):                  # 같은 이름으로 재정의
        print('study hard')
    def parttime(self):
        super().work()               # 부모의 work
    def general(self):
        self.work()                  # 나의 work(재정의된 것)

s = Student()
s.work()                             # study hard
s.parttime()                         # work hard
s.general()                          # study hard`,
        },
      },
      {
        title: '클래스 변수와 인스턴스 변수',
        body: '메서드 밖에 선언한 클래스 변수는 모든 객체가 함께 쓰고 클래스명.변수 로 다룬다. 메서드 안에서 self.변수 로 만든 인스턴스 변수는 객체마다 따로다. __init__ 에서 개수를 올리고 객체가 사라질 때 불리는 __del__ 에서 내리면 살아 있는 객체 수를 셀 수 있다.',
        why: '객체 수처럼 클래스 전체에 하나만 있어야 하는 값은 인스턴스가 아니라 클래스에 둔다.',
        code: {
          lang: 'python',
          caption: 'f2.count 처럼 객체로 읽어도 클래스 변수 값이 나온다',
          source: `class Figure:
    count = 0                          # 클래스 변수 — 모든 객체가 공유

    def __init__(self, width, height):
        self.width = width             # 인스턴스 변수 — 객체마다 따로
        self.height = height
        Figure.count += 1

    def __del__(self):                 # 객체가 사라질 때 실행
        Figure.count -= 1

f1 = Figure(2, 3)
f2 = Figure(4, 5)
print(Figure.count, f2.count)          # 2 2
del f1
print(Figure.count)                    # 1`,
        },
      },
      {
        title: 'static method 와 class method',
        body: '@staticmethod 는 self · cls 를 받지 않는, 논리상 클래스에 넣어 둔 함수라 객체 속성에 접근할 수 없다(클래스 변수는 클래스 이름으로 접근). @classmethod 는 첫 인자 cls 로 호출한 클래스를 받아 cls.클래스변수 를 다룬다. 둘 다 클래스명.메서드() · 객체.메서드() 로 부를 수 있고, 차이는 상속했을 때 드러난다 — 자식에서 부르면 cls 는 자식 클래스라 자식 값만 바뀌지만, static method 안에 Figure.name = name 처럼 클래스 이름을 적으면 자식에서 불러도 부모 값이 바뀐다.',
        why: '자식마다 따로 가져야 하는 값을 다룰 때는 cls 를 받는 classmethod 가 맞다.',
        code: {
          lang: 'python',
          caption: 'Circle.set_name 은 Circle 에만 name 을 만든다 — figure circle',
          source: `class Figure:
    name = 'figure'

    @staticmethod
    def is_square(w, h):               # self · cls 가 없다
        return w == h
    @classmethod
    def set_name(cls, name):           # cls = 호출한 클래스
        cls.name = name

class Circle(Figure):
    pass

print(Figure.is_square(4, 5), Circle().is_square(3, 3))   # False True
Circle.set_name('circle')
print(Figure.name, Circle.name)        # figure circle`,
        },
      },
    ],
    pitfalls: [
      '메서드에 self 를 빠뜨리면 부를 때 TypeError(takes 0 positional arguments but 1 was given)가 난다',
      '자식에서 __init__ 을 다시 정의하면 부모 __init__ 은 자동으로 불리지 않는다 — super().__init__(...) 를 직접 불러야 부모가 만드는 속성이 생긴다',
      'self.count += 1 은 클래스 변수를 바꾸지 않고 그 객체에 같은 이름의 인스턴스 변수를 새로 만든다 — 클래스 변수는 클래스명.count 로 바꾼다',
      'del 은 이름 하나를 지울 뿐이라, 다른 변수가 같은 객체를 가리키고 있으면 __del__ 이 바로 불리지 않는다 — __del__ 이 불리는 시점에 기대는 코드는 피한다',
    ],
    replaces: ['be-class-basics', 'be-inheritance', 'be-class-method'],
    tags: ['Python', '클래스', 'OOP'],
    keywords:
      'python class object self init method attribute dir capwords inheritance abstraction override super isinstance issubclass class variable instance variable del staticmethod classmethod cls',
  },

  // ── D. 5 · 6 · 7 · 12강 ──
  {
    slug: 'be-flask-basics',
    area: 'Back',
    course: '백엔드',
    lesson: '5 · 6 · 7 · 12강',
    date: '2026.10.04',
    title: '풀스택 구조와 Flask 시작 · 라우팅',
    summary:
      '프레임워크와 웹 서비스 구조 속에서 Flask 를 고른 이유를 설명하고, Flask 앱을 띄워 URL 을 함수에 연결하고 주소의 일부를 변수로 받을 수 있다.',
    points: [
      'Flask 는 최소 기능만 주고 필요한 것을 라이브러리로 붙이는 마이크로 프레임워크',
      '라우팅 = URL 을 그 기능을 하는 함수에 연결하기',
      '<int:id> 처럼 타입을 주면 맞지 않는 주소는 404',
    ],
    learned: [],
    sections: [
      {
        title: '프레임워크와 Flask 를 고른 이유',
        body: '프레임워크는 미리 만든 틀(frame)로 일하는(work) 방식이라 원리를 몰라도 빨리 만들 수 있지만, 틀이 주지 않는 일은 하기 어렵다. Spring · Django · Rails 같은 풀스택 프레임워크는 인증 · 세션 · 템플릿 · DB 접근 · 보안 · 캐시를 프레임워크(또는 공식 생태계) 안에서 갖춰 주는 대신 학습 곡선이 크고, Flask 같은 마이크로 프레임워크는 최소 기능만 주고 필요한 것을 라이브러리로 붙인다. 강의는 Flask 로 REST API · CORS · DB 연결 · MVC 같은 기본기를 익혀, 문법이 비슷한 FastAPI 나 다른 언어의 프레임워크로 옮겨 가는 길을 택했다.',
        why: '새 언어와 큰 프레임워크를 한꺼번에 배우면 둘 다 어려워져서, 학습 곡선이 낮은 기술로 시작하고 필요할 때 어려운 기술을 고른다.',
      },
      {
        title: 'Flask 앱과 __name__',
        body: "from flask import Flask 후 app = Flask(__name__) 으로 앱 객체를 만든다. __name__ 은 모듈 이름이 들어가는 변수로, 직접 실행한 파일에서는 '__main__', import 된 파일에서는 그 파일 이름이 된다. Flask 는 이 값으로 앱의 위치를 알아 templates · static 폴더를 찾는다.",
        why: "파이썬은 C · Java 의 main 같은 시작점 없이 위에서부터 실행해서, if __name__ == '__main__': 으로 직접 실행할 때만 돌 코드를 가른다.",
        code: {
          lang: 'python',
          caption: 'python start.py 로 실행 — import 된 mymodule 은 자기 파일 이름을 받는다',
          source: `# mymodule.py
print('mymodule.py 의 __name__:', __name__)

# start.py
import mymodule                                # mymodule.py 의 __name__: mymodule
print('start.py 의 __name__:', __name__)       # start.py 의 __name__: __main__

if __name__ == '__main__':
    print('직접 실행했을 때만 출력')`,
        },
      },
      {
        title: '라우팅과 서버 실행',
        body: "라우팅은 URL 을 그 기능을 하는 함수에 연결하는 것이고, @app.route('/hello') 처럼 데코레이터로 적는다. app.run() 의 host · port · debug 로 개발 서버를 띄우고, Flask 2.2 이상에서는 터미널에서 flask --app 파일이름 run 으로도 띄운다. host 가 127.0.0.1(localhost)이면 내 PC 에서만, 0.0.0.0 이면 모든 네트워크 인터페이스에서 받아, 방화벽이 허용하면 다른 기기(외부 포함)에서도 접속할 수 있다.",
        why: '함수 하나가 URL 하나를 맡아서, 주소만 보고 어떤 코드가 응답하는지 찾을 수 있다.',
        code: {
          lang: 'python',
          caption: 'python hello.py 또는 flask --app hello run --port 8080 --debug → /hello',
          source: `from flask import Flask

app = Flask(__name__)

@app.route('/hello')
def hello():
    return '<h1>Hello Flask!</h1>'

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)`,
        },
      },
      {
        title: '웹 서버와 WAS',
        body: '웹 서비스는 정적 HTML 을 그대로 보여 주던 방식에서 CGI + DB 로 요청마다 HTML 을 만드는 방식, MVC 프레임워크, REST API 를 섞어 여러 서비스를 내는 방식으로 이어져 왔다. 웹 서버는 정적 파일을 그대로 돌려주고, WAS 는 요청에 따라 데이터를 동적으로 만들어 준다. Flask 는 개발용 서버를 기본으로 주지만, 실제 서비스는 웹 서버(Nginx · Apache)를 앞에 두고, 그 뒤에서 WSGI 서버(gunicorn · mod_wsgi 등)가 Flask 앱을 돌린다.',
        why: 'Flask 개발 서버는 편의용이라 운영 서버만큼의 안정성 · 보안 · 성능을 보장하지 않는다(flask run --help 에도 적혀 있다).',
      },
      {
        title: 'URL 의 구성 — URL 과 URI',
        body: 'URI 는 자원을 식별하는 문자열을 모두 가리키는 넓은 말이고, URL 은 그중 자원의 위치(어디서 어떻게 가져올지)로 식별하는 것이다. 쿼리스트링(?id=dave)이 붙어도 여전히 URL 이고, 쿼리는 경로(path)와 별개 구성요소다. 웹은 HTML · URL · HTTP 세 가지로 이뤄진다.',
        why: 'Flask 라우팅은 path 만 보고 함수를 고르고, 쿼리는 request.args 로 따로 읽는다.',
        code: {
          lang: 'python',
          caption: 'scheme · netloc · path · query · fragment 로 나뉜다',
          source: `from urllib.parse import urlsplit, parse_qs

u = urlsplit('http://localhost:8080/input?id=dave&page=2#top')
print(u.scheme)            # http
print(u.netloc)            # localhost:8080
print(u.path)              # /input
print(u.query)             # id=dave&page=2
print(parse_qs(u.query))   # {'id': ['dave'], 'page': ['2']}
print(u.fragment)          # top`,
        },
      },
      {
        title: '주소의 일부를 변수로 — 동적 라우팅',
        body: '<변수명> 으로 경로의 일부를 받아 함수 인자로 쓴다. 타입을 적지 않으면 문자열(슬래시는 못 받음)이고, <int:변수> · <float:변수> 로 타입을 정하면 Flask 가 바꿔서 넘긴다. 타입이 맞지 않는 주소는 함수까지 오지 않고 404 가 된다.',
        why: '/profile/dave 처럼 주소 자체가 입력이 되어, 사용자 · 글마다 라우트를 따로 만들지 않아도 된다.',
        code: {
          lang: 'python',
          caption: '/profile/dave → profile: dave, /first/3 → <h1>8</h1>, /message/abc → 404',
          source: `from flask import Flask
app = Flask(__name__)

@app.route('/profile/<username>')
def get_profile(username):
    return 'profile: ' + username

@app.route('/message/<int:message_id>')
def get_message(message_id):
    return 'message id: %d' % message_id       # int 는 문자열과 + 로 못 붙인다

@app.route('/first/<int:num>')
def add_five(num):
    return f'<h1>{num + 5}</h1>'`,
        },
      },
    ],
    pitfalls: [
      'debug=True(--debug)는 개발할 때만 켠다 — 디버거가 브라우저에서 파이썬 코드를 실행할 수 있게 해 주므로, 외부에 열린 서버에서 켜면 안 된다',
      '<int:...> 는 음수를 받지 않는다 — /message/-1 도 404 다',
      'int 값을 문자열과 + 로 이으면 TypeError — %d · str() · f-string 으로 붙인다',
      '주피터에서 app.run() 을 실행하면 서버가 도는 동안 셀이 끝나지 않는다 — 시험이 끝나면 셀을 멈춘다',
    ],
    replaces: ['be-fullstack-intro', 'be-flask-start', 'be-flask-run', 'be-flask-routing'],
    tags: ['Flask', '라우팅', '웹 구조'],
    keywords:
      'fullstack framework flask fastapi django spring learning curve micro framework __name__ __main__ entry point route app run flask --app debug url uri query path web server was cgi variable converter int float',
  },

  // ── E. 13 · 14 · 15강 ──
  {
    slug: 'be-flask-api',
    area: 'Back',
    course: '백엔드',
    lesson: '13 · 14 · 15강',
    date: '2026.10.04',
    title: 'HTTP와 REST API — jsonify · 요청 파라미터',
    summary:
      'HTTP 요청 · 응답 구조와 REST 설계 방식을 이해하고, Flask 에서 JSON 을 돌려주고 쿼리스트링 · 폼 입력을 받아 처리할 수 있다.',
    points: [
      'REST: 자원은 URI 로, 하려는 일은 HTTP 메서드로 나타낸다',
      'dict 를 return 하면 JSON 응답(Flask 1.1+), jsonify 는 그것을 드러내 적는 방법',
      'request.args 는 메서드와 상관없이 URL 의 쿼리스트링',
    ],
    learned: [],
    sections: [
      {
        title: 'HTTP — 요청과 응답',
        body: 'HTTP 는 클라이언트가 요청(Request)을 보내고 서버가 응답(Response)을 돌려주는 통신 규칙(프로토콜)이다. 요청에는 메서드 · URL · 헤더 · 본문이, 응답에는 상태 코드 · 헤더 · 본문이 담긴다. httpie 로 터미널에서 요청을 보내 보면 이 구조를 그대로 볼 수 있다(강의에서는 윈도우에서 PowerShell 을 권했다).',
        why: '브라우저 화면 없이 API 만 따로 시험할 수 있어서, 화면을 만들기 전에 서버부터 확인한다.',
        code: {
          lang: 'bash',
          caption: '-v 를 붙이면 보낸 요청(메서드 · 헤더)까지 출력한다',
          source: `pip install httpie
http GET http://localhost:8080/json_test
http http://localhost:8080/json_test               # 메서드를 빼면 GET
http -v GET http://localhost:8080/json_test        # 보낸 요청까지
http "http://localhost:8080/login?user_name=dave"  # 쿼리스트링은 따옴표로`,
        },
      },
      {
        title: 'REST — 자원은 URI, 행위는 메서드',
        body: 'REST 는 무상태 · 캐시 가능 · 균일 인터페이스 같은 제약을 정한 아키텍처 스타일이고, 실무에서는 URI 로 자원을 가리키고 HTTP 메서드로 그 자원에 할 일을 나타내는 규칙으로 적용한다 — 생성 POST · 조회 GET · 수정 PUT · 삭제 DELETE. 응답 형식이 아니라 설계 규칙이라 JSON 을 돌려준다고 REST 가 되는 것은 아니고, /posts/3 하나에 메서드만 바꿔 조회 · 수정 · 삭제를 나누는 식으로 짠다. 이렇게 만든 API 가 REST API 이고, 마이크로서비스와 누구나 쓰게 공개한 API 에서 많이 쓴다.',
        why: 'URI 에 /deletePost 같은 동사를 넣지 않아도, 메서드만 보고 무엇을 하는 요청인지 안다.',
        code: {
          lang: 'python',
          caption: '/posts/1 하나에 GET · PUT · DELETE — 없는 글은 404, 지우면 204',
          source: `from flask import Flask, request

app = Flask(__name__)
posts = {1: {'title': '첫 글'}}

@app.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def post_detail(post_id):                      # 자원: 1번 글 → /posts/1
    if post_id not in posts:
        return {'error': 'not found'}, 404
    if request.method == 'PUT':                # 행위: 수정
        posts[post_id] = request.get_json()
    elif request.method == 'DELETE':           # 행위: 삭제
        del posts[post_id]
        return '', 204
    return posts[post_id]                      # GET: 조회`,
        },
      },
      {
        title: 'JSON 응답 — jsonify 와 dict 반환',
        body: 'jsonify() 는 딕셔너리를 JSON 문자열로 바꾸고 Content-Type: application/json 헤더를 붙인 Response 객체를 만든다. Flask 1.1 부터는 dict 를, 2.2 부터는 list 를 그냥 return 해도 같은 JSON 응답이 된다. (본문, 상태 코드) 튜플로 돌려주면 상태 코드도 함께 정한다.',
        why: 'dict · list 를 돌려주면 Flask 가 jsonify 와 같은 처리를 대신 해 주므로, 둘은 같은 응답이고 jsonify 는 그 일을 코드에 드러내 적는 방법이다.',
        code: {
          lang: 'python',
          caption: '세 라우트 모두 Content-Type: application/json',
          source: `from flask import Flask, jsonify

app = Flask(__name__)
app.json.ensure_ascii = False        # 한글을 그대로 (Flask 2.2+)

@app.route('/json_test')
def hello_json():
    return jsonify({'name': '김대리', 'family': 'Byun'})

@app.route('/server_info')
def server_json():
    return {'server_name': '0.0.0.0', 'server_port': 8080}   # dict → JSON (1.1+)

@app.route('/langs')
def langs():
    return ['python', 'go']                                   # list → JSON (2.2+)`,
        },
      },
      {
        title: '쿼리스트링 — request.args',
        body: "URL 뒤 ?키=값&키=값 부분이 쿼리스트링이고(첫 파라미터 앞은 ?, 다음부터는 &), Flask 에서는 request.args.get('키') 로 꺼낸다. 없는 키는 None 이 나오고, get('page', 1, type=int) 처럼 기본값과 형 변환을 함께 줄 수 있다. request.args 는 메서드와 상관없이 URL 의 쿼리스트링만 읽고, POST · PUT 본문은 request.get_json()(JSON)이나 request.form(HTML 폼)으로 읽는다.",
        why: '쿼리스트링은 URL 에 그대로 남으므로 검색어 · 페이지 번호처럼 드러나도 되는 값에 쓴다.',
        code: {
          lang: 'python',
          caption: "/login?user_name=dave&page=3 → {'auth': 'success', 'page': 3}",
          source: `from flask import Flask, request

app = Flask(__name__)

@app.route('/login')
def login():
    username = request.args.get('user_name')       # 없으면 None
    page = request.args.get('page', 1, type=int)   # 기본값과 형 변환
    if username == 'dave':
        return {'auth': 'success', 'page': page}
    return {'auth': 'failed'}`,
        },
      },
      {
        title: 'HTML 폼과 render_template',
        body: "render_template('login.html') 은 앱 옆 templates 폴더에서 HTML 파일을 찾아 응답으로 보낸다. 폼을 method=\"get\" 으로 제출하면 input 의 name 이 쿼리스트링의 키가 되어 /login?user_name=입력값 으로 요청이 간다. CSS · JS 같은 정적 파일은 static 폴더에 두면 /static/… 주소로 열리고(static_url_path 의 기본값이 /static), VS Code 에서는 html:5 + Tab 으로 HTML 뼈대를 만든다.",
        why: '템플릿 · 정적 파일 폴더 위치가 약속돼 있어서, 경로를 따로 설정하지 않아도 파일을 찾는다.',
        code: {
          lang: 'markup',
          caption: "/html_test 에서 render_template('login.html') 로 보내는 폼",
          source: `<!-- templates/login.html -->
<link href="/static/dist/css/bootstrap.min.css" rel="stylesheet" />
<form action="/login" method="get">
  <p>Enter Name:</p>
  <p><input type="text" name="user_name" /></p>
  <p><input type="submit" value="submit" /></p>
</form>
<!-- 제출 → GET /login?user_name=입력값 -->`,
        },
      },
    ],
    pitfalls: [
      "request.args.get(..., type=int) 는 변환에 실패하면 에러 대신 기본값을 준다 — page=abc 도 1 이 된다",
      'methods 를 적지 않은 라우트는 GET(과 자동으로 붙는 HEAD · OPTIONS)만 받아서, POST 로 보내면 405 Method Not Allowed 가 난다',
      'jsonify 는 기본 설정에서 한글을 유니코드 이스케이프로 바꿔 보낸다 — 클라이언트가 읽으면 같은 글자지만, 응답을 눈으로 볼 때 한글이 보이게 하려면 app.json.ensure_ascii = False',
      'GET 쿼리스트링은 주소창 · 서버 로그 · 브라우저 기록에 그대로 남는다 — 비밀번호 같은 값은 POST 본문으로, HTTPS 위에서 보낸다',
    ],
    replaces: ['be-http-rest', 'be-jsonify', 'be-get-params'],
    tags: ['Flask', 'HTTP', 'REST API', 'JSON'],
    keywords:
      'http request response status code rest api crud method get post put delete httpie flask jsonify json content-type ensure_ascii get parameter query string request args get_json form render_template templates static static_url_path vscode',
  },

  // ── F. 16 · 17 · 18 · 19강 ──
  {
    slug: 'be-flask-frontend',
    area: 'Back',
    course: '백엔드',
    lesson: '16 · 17 · 18 · 19강',
    date: '2026.10.04',
    title: '템플릿과 프론트 연결 — Jinja · Vue · axios · CORS',
    summary:
      'Jinja2 템플릿으로 서버에서 HTML 을 만들고, CDN 으로 불러온 Vue · axios 에서 Flask API 를 부르며, 다른 출처 요청에 필요한 CORS 설정을 할 수 있다.',
    points: [
      '{{ 값 }} 은 출력, {% 코드 %} 는 반복 · 조건 — endfor · endif 로 닫는다',
      '다른 출처 응답을 막는 건 브라우저의 같은 출처 정책, CORS 는 서버가 응답 헤더로 그 제한을 풀어 주는 규칙',
      'axios 의 params 는 쿼리스트링, data 는 본문 — Flask 에서는 request.args 와 get_json()',
    ],
    learned: [],
    sections: [
      {
        title: 'Jinja2 — 변수 출력',
        body: "Jinja2 는 HTML 안에 파이썬 비슷한 코드를 넣어, 필요한 부분만 바꾼 최종 HTML 을 만드는 템플릿 엔진이다. {{ 변수 }} 는 값을 출력하고 {% … %} 안에는 반복문 · 조건문을 쓴다. 템플릿에서 쓸 값은 render_template('파일', 이름=값) 으로 함께 넘긴다.",
        why: 'HTML 뼈대는 그대로 두고 사용자 이름 · 목록처럼 바뀌는 부분만 서버에서 채운다.',
        code: {
          lang: 'python',
          caption: '.html 템플릿의 {{ }} 출력은 자동으로 이스케이프된다',
          source: `# templates/variable.html → <h1>Hello {{ name }}</h1>
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/hello/<user>')
def hello_name(user):
    return render_template('variable.html', name=user)   # 템플릿 변수 name

# /hello/dave     → <h1>Hello dave</h1>
# /hello/<i>dave  → <h1>Hello &lt;i&gt;dave</h1>`,
        },
      },
      {
        title: 'Jinja2 — 반복문',
        body: '{% for 값 in 목록 %} 으로 시작해 {% endfor %} 로 닫고, 들여쓰기는 상관없다. 템플릿에서는 len(values) 대신 필터 문법 values | length 를 쓰고, loop.index 는 1부터, loop.index0 은 0부터 센 반복 번호다. range() 는 파이썬과 같다.',
        why: '목록 길이만큼 <li> 를 서버에서 찍어 내므로 HTML 에 항목을 하나하나 적지 않는다.',
        code: {
          lang: 'markup',
          caption: "values=['list1', 'list2', 'list3'] 을 넘겼을 때 — 1. list1 … 모두 3개",
          source: `<ul>
  {% for value in values %}
  <li>{{ loop.index }}. {{ value }}</li>
  {% endfor %}
</ul>
<p>모두 {{ values | length }}개</p>

{% for index in range(values | length) %}
<p>{{ index }} → {{ values[index] }}</p>
{% endfor %}`,
        },
      },
      {
        title: 'Jinja2 — 조건문과 주석',
        body: '{% if %} · {% elif %} · {% else %} 를 쓰고, elif · else 는 필요할 때만 넣지만 {% endif %} 는 꼭 닫는다. {# … #} 로 감싼 부분은 실행도 출력도 되지 않고 여러 줄도 한 번에 감쌀 수 있다. HTML 주석(<!-- -->)은 결과 HTML 에 그대로 남아 브라우저의 소스 보기에 보인다는 점이 다르다.',
        why: '사용자에게 보이면 안 되는 메모는 {# #} 로 남겨야 응답에 실리지 않는다.',
        code: {
          lang: 'markup',
          caption: 'data=27 이면 if 블록 중에서는 "25보다 큽니다." 만 남는다',
          source: `{% if data >= 30 %}
<h3>30보다 큽니다.</h3>
{% elif data > 25 %}
<h3>25보다 큽니다.</h3>
{% else %}
<h3>{{ data }}</h3>
{% endif %}

{# 이 부분은 결과 HTML 에 남지 않는다
   여러 줄도 한 번에 감쌀 수 있다 #}
<!-- HTML 주석은 소스 보기에 그대로 보인다 -->`,
        },
      },
      {
        title: 'CDN 으로 Vue · axios 불러오기',
        body: 'CDN 은 사용자와 가까운 캐시 서버에 파일을 복사해 두고 거기서 응답해, 멀리 있는 사용자에게도 빠르게 주는 기술이다. 그래서 Vue · axios 같은 JS 파일을 내 서버에 두지 않고 CDN 주소의 <script> 로 연결하면 페이지를 열 때 함께 내려받는다. Vue 를 적용할 부분을 <div id="app"> 으로 감싸고 v-on:click 으로 버튼에 메서드를 연결해 axios 로 Flask API 를 부른다(강의는 Vue 2 의 new Vue, 아래는 지금 기본인 Vue 3 의 createApp).',
        why: '빌드 도구 없이 HTML 파일 하나로 화면과 API 호출을 시험해 볼 수 있다.',
        code: {
          lang: 'markup',
          caption: '버튼을 누르면 GET /test?email=… — Flask 가 다른 포트면 CORS 설정 전에는 응답을 읽지 못한다',
          source: `<div id="app">
  <button class="btn btn-secondary" v-on:click="axiosTest">GET TEST</button>
</div>
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js"></script>
<script>
  Vue.createApp({
    methods: {
      axiosTest() {
        axios.get('http://localhost:8082/test', { params: { email: 'test@test.com' } })
          .then((response) => console.log(response.data))   // 응답 JSON
          .catch((error) => console.log(error));
      },
    },
  }).mount('#app');
</script>`,
        },
      },
      {
        title: '같은 출처 정책과 CORS',
        body: '브라우저는 <img> · <link> 로는 다른 출처 파일도 불러오지만, 스크립트(axios · fetch)로 보낸 요청의 응답은 같은 출처일 때만 읽게 한다 — 출처는 프로토콜 · 호스트 · 포트가 모두 같아야 같다. CORS 는 서버가 응답 헤더 Access-Control-Allow-Origin 으로 "이 출처는 읽어도 된다"고 알려 이 제한을 푸는 규칙이고, flask_cors 의 CORS(app) 가 이 헤더를 붙여 준다. 단순한 GET 요청은 서버까지 가서 처리된 뒤 브라우저가 응답 읽기만 막고, JSON 본문 · Authorization 헤더 · PUT/DELETE 처럼 preflight 가 필요한 요청은 먼저 OPTIONS 로 허락을 묻고 허락을 못 받으면 본 요청을 보내지 않는다.',
        why: 'CORS 에러는 서버 코드가 아니라 응답 헤더 문제라, 서버 로그에는 요청이 200 으로 찍혀 있을 수도 있다.',
        code: {
          lang: 'python',
          caption: 'HTML 을 연 주소와 API 주소의 포트만 달라도 다른 출처다',
          source: `# pip install flask-cors
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)                                         # 모든 출처 허용 — 개발용
# CORS(app, origins=['http://localhost:5173'])    # 운영은 허용할 출처만`,
        },
      },
      {
        title: '메서드별로 데이터 주고받기',
        body: "methods=[…] 에 받을 메서드를 적고 request.method 로 나눈다. axios 의 params 는 URL 쿼리스트링으로, data(또는 axios.post(url, 객체) 의 두 번째 인자)는 요청 본문 JSON 으로 가므로 Flask 에서는 각각 request.args · request.get_json() 으로 읽고, 서버가 돌려준 JSON 은 axios 의 response.data 에 들어 있다. 조회 GET · 생성 POST · 수정 PUT · 삭제 DELETE 처럼 기능에 맞는 메서드를 쓰는 것을 RESTful 하다고 한다.",
        why: '어디에 실어 보냈는지(URL 이냐 본문이냐)가 읽는 곳을 정하지, 메서드 이름이 정하는 게 아니다.',
        code: {
          lang: 'python',
          caption: "POST /test?email=q + 본문 {'email': 'p'} → query 는 q, body 는 p",
          source: `from flask import Flask, request

app = Flask(__name__)

@app.route('/test', methods=['GET', 'POST', 'PUT', 'DELETE'])
def test():
    query = request.args.get('email')             # URL ?email=… — 어떤 메서드든
    body = request.get_json(silent=True) or {}    # 본문 JSON — 보통 POST · PUT
    return {'method': request.method, 'query': query, 'body': body.get('email')}

# axios.get(url, { params: { email } })  → query 로
# axios.post(url, { email })             → body 로`,
        },
      },
    ],
    pitfalls: [
      'CORS(app) 는 모든 출처를 허용한다 — 운영에서는 origins 에 허용할 프론트 주소만 적는다',
      '{{ }} 출력에 |safe 를 붙이면 이스케이프 없이 그대로 나간다 — 사용자 입력에는 쓰지 않는다',
      'POST 본문은 주소창에 안 보일 뿐 개발자 도구 · 네트워크 탭에서는 그대로 보인다 — 전송 중에 엿보는 것을 막는 건 HTTPS 다',
      '다른 사이트 HTML 을 requests 로 받아 그대로 돌려주면 상대 경로로 적힌 이미지 · JS 는 404 다 — 브라우저가 그 파일을 내 서버에서 찾기 때문이다',
    ],
    replaces: ['be-jinja-loop', 'be-jinja-if', 'be-cdn-vue-axios', 'be-cors'],
    tags: ['Flask', 'Jinja2', 'Vue', 'CORS'],
    keywords:
      'jinja2 template variable for loop loop.index length filter if elif endif comment render_template autoescape cdn vue createapp axios bootstrap api call cors same origin policy preflight options access-control-allow-origin flask_cors http method params data restful',
  },

  // ── G. 20 · 21 · 22 · 23강 ──
  {
    slug: 'be-flask-structure',
    area: 'Back',
    course: '백엔드',
    lesson: '20 · 21 · 22 · 23강',
    date: '2026.10.04',
    title: 'Flask 구조 — 에러 · 로깅 · 요청 훅 · MVC · 블루프린트',
    summary:
      '상태 코드별 에러 응답과 파일 로그를 남기고, 모든 요청 앞뒤에 공통 코드를 끼우고, 기획한 서비스를 MVC 폴더와 Blueprint 로 나눠 짤 수 있다.',
    points: [
      '(본문, 상태 코드) 로 돌려줘야 에러 페이지도 제 상태 코드로 나간다',
      'RotatingFileHandler 는 .1 · .2 로 밀어내며 backupCount 개까지만 남긴다',
      'Blueprint 로 라우트를 파일별로 나누고 url_prefix 로 묶는다',
    ],
    learned: [],
    sections: [
      {
        title: 'errorhandler 와 상태 코드',
        body: '@app.errorhandler(404) 처럼 상태 코드마다 실행할 함수를 정하면, 그 오류가 날 때 기본 에러 페이지 대신 이 함수의 응답이 나간다. return 의 두 번째 값으로 상태 코드를 주지 않으면 화면은 같아도 200(성공)으로 나간다. 자주 보는 코드는 400 잘못된 요청 · 403 권한 없음 · 404 없음 · 500 서버 내부 오류다.',
        why: '브라우저 · 검색엔진 · 모니터링 도구는 화면이 아니라 상태 코드로 성공과 실패를 판단한다.',
        code: {
          lang: 'python',
          caption: '없는 주소로 요청하면 404 와 함께 이 HTML',
          source: `from flask import Flask

app = Flask(__name__)

@app.errorhandler(404)
def page_not_found(error):
    return '<h1>404 Error</h1>', 404      # 두 번째 값이 상태 코드

# return '<h1>404 Error</h1>' 만 쓰면 같은 화면이 200 으로 나간다`,
        },
      },
      {
        title: 'logging — 로그 레벨',
        body: '서버는 계속 돌아가므로 문제가 생기면 기록(로그)을 보고 원인을 찾고, 사용자 접속 · 해킹 시도를 확인할 때도 쓴다. 레벨은 DEBUG < INFO < WARNING < ERROR < CRITICAL 순으로 심각하고, 설정한 레벨 이상만 기록된다. 개발 단계보다 서비스를 운영할 때 제대로 갖춘다.',
        why: '레벨을 나눠 두면 코드는 그대로 두고 설정만 바꿔 기록할 양을 조절할 수 있다.',
        code: {
          lang: 'python',
          caption: 'test.log 에는 ERROR · CRITICAL 두 줄만 남는다',
          source: `import logging

logging.basicConfig(filename='test.log', level=logging.ERROR,
                    format='%(asctime)s %(levelname)s %(message)s')
logging.debug('debug')          # 기록 안 됨
logging.warning('warning')      # 기록 안 됨
logging.error('error')          # 기록됨
logging.critical('critical')    # 기록됨`,
        },
      },
      {
        title: 'RotatingFileHandler 로 Flask 로그 남기기',
        body: '핸들러는 로그를 어디로 보낼지 정한다 — FileHandler 는 파일, SysLogHandler 는 유닉스 syslog, NTEventLogHandler 는 윈도우 이벤트 로그로 보낸다. RotatingFileHandler 는 파일이 maxBytes 에 닿으면 지금 파일을 .1 로, 있던 .1 을 .2 로 밀어내고 새 파일에 이어 쓰며, backupCount 를 넘는 가장 오래된 파일은 지운다. app.logger.addHandler() 로 등록해야 app.logger 기록이 그 파일로 간다.',
        why: '로그가 디스크를 가득 채우면 서버 전체가 이상해질 수 있어서, 용량 상한이 있는 회전 방식을 쓴다.',
        code: {
          lang: 'python',
          caption: '404 를 300번 보내면 dave_server.log 와 .1 ~ .10 만 남는다',
          source: `import logging
from logging.handlers import RotatingFileHandler
from flask import Flask

app = Flask(__name__)
file_handler = RotatingFileHandler('dave_server.log', maxBytes=2000,
                                   backupCount=10, encoding='utf-8')
file_handler.setLevel(logging.WARNING)
app.logger.addHandler(file_handler)      # 등록해야 app.logger 기록이 파일로 간다

@app.errorhandler(404)
def page_not_found(error):
    app.logger.error(error)              # 404 Not Found: The requested URL ...
    return '<h1>404 Error</h1>', 404`,
        },
      },
      {
        title: 'before_request · after_request',
        body: '@app.before_request 함수는 요청마다 라우트 함수보다 먼저 실행되고 인자를 받지 않으며, 여기서 응답을 return 하면 라우트 함수는 건너뛴다. @app.after_request 함수는 응답을 보내기 직전에 response 를 받아 고친 뒤 반드시 response 를 돌려줘야 한다. 첫 요청 때만 실행하던 @app.before_first_request 는 Flask 2.3 에서 없어져서, 전역 변수로 첫 요청인지 확인하거나 공식 권장대로 앱을 만들 때 바로 실행한다.',
        why: '로그인 확인 · 접속 기록 · 응답 헤더 추가 · 처리 시간 기록처럼 모든 요청에 필요한 일을 라우트마다 적지 않는다.',
        code: {
          lang: 'python',
          caption: '두 번 요청하면 "첫 요청" 은 한 번만, 응답마다 X-Served-By 헤더',
          source: `from flask import Flask, request
app = Flask(__name__)
initialized = False

@app.before_request
def before_request():
    global initialized
    if not initialized:                          # 첫 요청 때 한 번만
        print('flask 실행 후 첫 요청')
        initialized = True
    print('요청마다 먼저:', request.path)

@app.after_request
def after_request(response):
    response.headers['X-Served-By'] = 'flask'    # 응답 헤더 추가
    return response                              # 꼭 돌려준다`,
        },
      },
      {
        title: 'MVP 기획과 MVC 패턴',
        body: 'MVP(Minimum Viable Product)는 최소 기능만 만들어 내놓고 고객 반응을 보며 고쳐 가는 방식으로, 강의는 블로그를 A/B 테스트로 열었다 — 같은 주소로 들어와도 제목만 다른 A · B 페이지를 반반 보여 주고, 이메일 구독을 받아 구독자에게는 같은 페이지를 고정하고, 접속 IP · 시간을 로그로 남겨 어느 제목이 구독을 더 모으는지 본다. MVC 는 코드를 Model(데이터 · DB) · View(화면) · Controller(둘을 잇는 제어 코드)로 나누는 구조다. 다만 기능 하나가 여러 파일로 쪼개져 오히려 읽고 고치기 어려울 때도 있어서, 강의는 기존 코드가 MVC 면 따르고 아니면 참고만 하라고 했다(Simple is Best).',
        why: '처음부터 다 만들기보다 가장 작은 기능으로 고객 반응을 먼저 확인하는 것이 적은 인력 · 짧은 기간에 맞다.',
      },
      {
        title: '폴더 나누기와 Blueprint',
        body: "블로그 프로젝트는 시작 파일 blog_abtest.py 아래 blog_view(V, 라우팅) · blog_control(C, 사용자 · 세션 처리) · db_model(M, MySQL · MongoDB 연결) · templates · static 폴더로 나눴고, 순수 REST API 서버라면 View 없이 C(API)와 M(DB)만 있으면 된다. Blueprint 는 라우트를 여러 파일에 나눠 적게 해 주는 기능으로, Blueprint(이름, __name__) 으로 만들고 register_blueprint(…, url_prefix='/blog') 로 앱에 등록하면 그 경로가 앞에 붙는다. 재사용성은 늘 생각하되, 대형 프로그램에나 필요한 복잡한 구조까지 만들 필요는 없다.",
        why: '기능 단위로 파일이 나뉘어서, 기능을 더하거나 뺄 때 Blueprint 하나만 등록하거나 빼면 된다.',
        code: {
          lang: 'python',
          caption: '/blog/blog1 → TEST BLUEPRINT, url_for 에서는 blog.blog',
          source: `# blog_view/blog.py
from flask import Blueprint

blog_ab = Blueprint('blog', __name__)            # Blueprint(이름, __name__)

@blog_ab.route('/blog1')
def blog():
    return 'TEST BLUEPRINT'

# blog_abtest.py (시작 파일)
from flask import Flask
from blog_view import blog

app = Flask(__name__)
app.register_blueprint(blog.blog_ab, url_prefix='/blog')`,
        },
      },
    ],
    pitfalls: [
      "after_request 에서 response 를 return 하지 않으면 응답 자리에 None 이 들어가 요청이 에러(TypeError)로 끝난다",
      'logging.basicConfig 는 루트 로거에 핸들러가 이미 있으면 아무 일도 하지 않는다 — 주피터에서 설정을 바꿔 다시 실행할 때는 force=True(3.8+)',
      'RotatingFileHandler 의 maxBytes 나 backupCount 가 0 이면 회전하지 않고 한 파일에 계속 쓴다',
      "Blueprint 안의 라우트를 url_for 로 만들 때는 '블루프린트이름.함수이름'(blog.blog)을 쓴다",
    ],
    replaces: ['be-error-logging', 'be-request-hooks', 'be-mvp-mvc', 'be-blueprint'],
    tags: ['Flask', '로깅', '구조', 'Blueprint'],
    keywords:
      'flask errorhandler status code 400 403 404 500 logging level basicconfig handler rotatingfilehandler maxbytes backupcount before_request after_request before_first_request hook middleware mvp mvc ab test blog planning 기획 blueprint project structure url_prefix register_blueprint',
  },

  // ── H. 24 · 25 · 29 · 30강 ──
  {
    slug: 'be-flask-data-deploy',
    area: 'Back',
    course: '백엔드',
    lesson: '24 · 25 · 29 · 30강',
    date: '2026.10.04',
    title: 'Flask와 DB · 로그인 · 배포',
    summary:
      'Flask 에서 MySQL 과 MongoDB 에 데이터를 저장하고, flask_login 으로 로그인 세션을 다루고, 만든 서비스를 ngrok 과 AWS 로 외부에 공개하는 흐름을 설명할 수 있다.',
    points: [
      '규격이 정해진 데이터는 MySQL, 형식이 자주 바뀌는 로그는 MongoDB',
      'login_user 가 세션 쿠키에 id 를 넣고, user_loader 가 요청마다 User 로 되살린다',
      '개발 중 공개는 ngrok, 실제 서비스는 클라우드 서버 + 웹 서버 · WSGI 서버(요즘은 Docker 컨테이너로 묶어 배포)',
    ],
    learned: [],
    sections: [
      {
        title: 'MySQL 연결 — pymysql',
        body: '구독 이메일처럼 규격이 정해지고 안정성이 중요한 데이터는 MySQL, 형식이 자주 바뀌고 양이 많으며 일부 유실돼도 큰 문제 없는 로그 · 크롤링 데이터는 MongoDB, 성능을 위한 메모리 DB 로는 Redis 를 쓴다. 강의는 ORM(SQLAlchemy) 대신 SQL 에 먼저 익숙해지려고 pymysql 을 썼고, 순서는 connect → cursor → execute → (조회면 fetch, 변경이면 commit) → close 다. Flask 코드에서 바로 시험하면 오래 걸리니, 주피터에서 충분히 시험한 뒤 최종 코드만 옮긴다.',
        why: '%s 자리표시에 값을 튜플로 넘기면 pymysql 이 값을 이스케이프해 SQL 인젝션을 막는다.',
        code: {
          lang: 'python',
          caption: "접속 정보는 환경변수에서 — 강의의 passwd · db · 'utf8' 은 password · database · 'utf8mb4' 로",
          source: `import os
import pymysql

db_conn = pymysql.connect(
    host='localhost', port=3306,
    user=os.environ['DB_USER'], password=os.environ['DB_PASSWORD'],
    database='blog_db', charset='utf8mb4')
cursor = db_conn.cursor()

sql = 'INSERT INTO user_info (USER_EMAIL, BLOG_ID) VALUES (%s, %s)'
cursor.execute(sql, ('test@test.com', 'A'))
db_conn.commit()                       # INSERT · UPDATE · DELETE 는 commit

cursor.execute('SELECT * FROM user_info')
print(cursor.fetchall())               # 행마다 튜플
db_conn.close()`,
        },
      },
      {
        title: 'MongoDB 연결 — pymongo',
        body: '스키마(테이블 구조)를 미리 정하지 않아도 되는 MongoDB 는 형식이 수시로 바뀌는 접속 로그를 담기 좋다. MongoClient 로 연결한 뒤 client.DB이름.콜렉션이름 으로 콜렉션(테이블 같은 것)을 꺼내고, insert_one · find_one · find · delete_one 으로 다루며, 문서마다 _id(ObjectId)가 자동으로 붙는다. 연결은 여러 이유로 끊길 수 있어서 가벼운 명령으로 살아 있는지 확인하는데, 강의의 ismaster 대신 지금은 ping 을 쓴다.',
        why: '끊긴 연결로 작업하다 에러가 나기 전에, 짧은 명령으로 먼저 확인하면 원인을 바로 안다.',
        code: {
          lang: 'python',
          caption: '블로그 로그는 session_ip · user_email · page · access_time 을 담은 문서 하나',
          source: `import pymongo

client = pymongo.MongoClient('mongodb://localhost:27017', serverSelectionTimeoutMS=2000)
client.admin.command('ping')                     # 살아 있는지 확인
blog_ab = client.blog_session_db.blog_ab         # DB → 콜렉션

blog_ab.insert_one({'emailid': 'test@gmail.com'})
print(blog_ab.find_one({'emailid': 'test@gmail.com'}))   # _id 가 붙어 있다
for log in blog_ab.find():
    print(log)
blog_ab.delete_one({'emailid': 'test@gmail.com'})`,
        },
      },
      {
        title: 'flask_login — 로그인 세션 흐름',
        body: 'flask_login 은 로그인한 사용자를 요청마다 구분해 주는 라이브러리다. login_user(user) 가 사용자 id 를 Flask 세션에 넣으면 서버는 응답의 Set-Cookie 로 서명된 세션 쿠키를 보내고, 브라우저는 이후 같은 서버에 요청할 때마다 그 쿠키를 자동으로 보낸다. 다음 요청에서 user_loader 가 쿠키 속 id 로 User 를 다시 불러 current_user 에 넣고, @login_required 가 붙은 라우트는 로그인한 사용자만 통과시키며, logout_user() 는 세션에서 id 를 지운다.',
        why: 'HTTP 는 요청끼리 서로를 기억하지 않아서, 쿠키로 누가 보낸 요청인지를 매번 실어 보낸다.',
        code: {
          lang: 'python',
          caption: "session_protection = 'strong' 이면 IP · user agent 로 만든 값이 바뀔 때, 영구 세션이 아니면 세션(과 remember 쿠키)을 지운다",
          source: `import os
from flask import Flask, jsonify, make_response, request
from flask_login import LoginManager
app = Flask(__name__)
app.secret_key = os.environ['SECRET_KEY']      # 세션 쿠키 서명 키
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = 'strong'

@login_manager.user_loader
def load_user(user_id):                        # 쿠키 속 id → User 객체
    return User.get(user_id)

@login_manager.unauthorized_handler
def unauthorized():                            # 로그인 없이 @login_required 접근
    return make_response(jsonify(success=False), 401)`,
        },
      },
      {
        title: 'User 클래스와 로그인 라우트',
        body: 'User 클래스는 UserMixin 을 상속해 is_authenticated · is_active · is_anonymous · get_id() 를 기본으로 받고, 필요할 때만 재정의한다. 사용자를 구분하는 id 속성이 꼭 있어야 하고, DB 조회 · 생성은 객체 없이 부르도록 @staticmethod 로 만든다 — get(user_id) · find(user_email) · create(user_email, blog_id). 로그인 라우트는 create 로 사용자를 얻어 login_user 에 넘기고, 이후 current_user.id · current_user.is_authenticated 로 사용자를 확인한다.',
        why: 'User.get() · User.create() 처럼 클래스명.함수 꼴이면 코드만 봐도 어느 기능인지 보인다.',
        code: {
          lang: 'python',
          caption: 'create 는 없으면 INSERT 후, 있으면 기존 사용자를 User 로 돌려준다',
          source: `from flask_login import UserMixin, login_user, current_user

class User(UserMixin):                       # is_authenticated · get_id() 등을 물려받는다
    def __init__(self, user_id, user_email, blog_id):
        self.id = user_id                    # flask_login 이 쓰는 id — 꼭 있어야 한다
        self.user_email = user_email
        self.blog_id = blog_id
    @staticmethod
    def create(user_email, blog_id):
        ...                                  # SELECT → 없으면 INSERT → User 객체

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login_user(User.create(data['user_email'], data['blog_id']))   # 세션에 id
    return {'user_email': current_user.user_email}`,
        },
      },
      {
        title: 'Control 클래스 — A/B 페이지 고르기',
        body: 'BlogSession 은 MVC 의 Control 로, 클래스 변수 blog_page(A · B 페이지 이름)와 session_count 를 두고 staticmethod 로 기능을 묶었다. get_blog_page() 는 session_count 를 0 · 1 로 번갈아 바꿔 A 와 B 페이지를 번갈아 돌려주고, 구독자처럼 보던 페이지가 정해져 있으면 그 페이지로 고정한다. save_session_info() 는 접속 IP · 이메일 · 페이지 · 시간을 MongoDB 에 문서 하나로 저장한다.',
        why: '비슷한 기능을 클래스 하나에 모으면 BlogSession.get_blog_page() 처럼 이름만 보고 역할을 알고, 고칠 곳도 한 곳이다.',
        code: {
          lang: 'python',
          caption: '값 없이 네 번 부르면 A · B · A · B, 구독자(B)는 B 고정',
          source: `class BlogSession:
    blog_page = {'A': 'blog_A.html', 'B': 'blog_B.html'}
    session_count = 0                        # 클래스 변수 — 한 프로세스 안의 요청이 함께 쓴다(워커가 여럿이면 따로)

    @staticmethod
    def get_blog_page(blog_id=None):
        if blog_id is not None:              # 구독자는 보던 페이지로 고정
            return BlogSession.blog_page[blog_id]
        if BlogSession.session_count == 0:   # 0 → A, 1 → B 를 번갈아
            BlogSession.session_count = 1
            return BlogSession.blog_page['A']
        BlogSession.session_count = 0
        return BlogSession.blog_page['B']

print([BlogSession.get_blog_page() for _ in range(4)])   # A B A B
print(BlogSession.get_blog_page('B'))                    # blog_B.html`,
        },
      },
      {
        title: '배포 — ngrok 과 AWS',
        body: '배포는 내 서비스를 다른 사람도 접속할 수 있게 서버에 올리는 것이고, 가장 흔한 형태는 클라우드(AWS) + 리눅스 서버 + Docker 다. 개발 중에는 ngrok 이 내 PC 의 포트를 외부 주소로 열어 주고(가입 후 authtoken 등록), 강의의 AWS 배포는 EC2(Ubuntu)를 만들어 pem 키로 ssh 접속하고 Elastic IP 로 고정 주소를 붙인 뒤 FileZilla 로 파일을 올렸다. Flask 는 Apache 에 mod_wsgi 를 붙여 연결하는데, runserver.wsgi 에서 앱을 application 이라는 이름으로 불러오고, 포트는 Apache 설정(ports.conf)과 AWS 보안 그룹 양쪽에서 열어야 한다.',
        why: 'Flask 개발 서버는 운영용이 아니라서, 외부 요청을 받는 일은 Apache 같은 웹 서버와 WSGI 연결에 맡긴다.',
        code: {
          lang: 'bash',
          caption: 'ngrok 은 개발 중 잠깐 공개, EC2 는 ssh 로 들어가 Apache + mod_wsgi 를 설치',
          source: `# 개발 중 잠깐 외부 공개 (ngrok 가입 후 authtoken 등록)
ngrok http 8080

# EC2(Ubuntu) 접속 — 키 파일은 나만 읽게
chmod 400 my-key.pem
ssh -i my-key.pem ubuntu@$EC2_IP        # EC2_IP = Elastic IP

# Apache + mod_wsgi
sudo apt-get update -y
sudo apt-get install -y apache2 apache2-dev
pip install mod_wsgi
mod_wsgi-express module-config          # 출력된 LoadModule 줄을 Apache 설정에 붙인다
sudo systemctl restart apache2`,
        },
      },
    ],
    pitfalls: [
      'app.secret_key = os.urandom(24) 처럼 실행할 때마다 새로 만들면 서버를 다시 켤 때마다 모든 로그인이 풀리고, 프로세스가 여럿이면 서로의 쿠키를 읽지 못한다 — 고정된 값을 환경변수로 넣는다',
      'Flask 세션 쿠키는 서명만 되고 암호화는 안 된다 — base64 를 풀면 내용이 보이니 비밀값을 넣지 않는다',
      "MySQL 의 utf8 은 3바이트(utf8mb3)라 이모지를 담지 못한다 — charset='utf8mb4' 를 쓴다",
      'MongoClient 를 만드는 것만으로는 서버 연결을 확인하지 않는다 — 첫 명령에서야 연결 에러가 나니 ping 으로 먼저 확인한다',
    ],
    replaces: ['be-flask-mysql', 'be-flask-mongodb', 'be-flask-login', 'be-deploy'],
    tags: ['Flask', 'MySQL', 'MongoDB', '로그인', '배포'],
    keywords:
      'flask mysql pymysql cursor commit fetchall sql injection utf8mb4 sqlalchemy redis mongodb pymongo nosql log ping ismaster flask_login login session cookie set-cookie current_user usermixin login_required user_loader secret_key session_protection ab test control class deploy aws ec2 ngrok apache mod_wsgi wsgi elastic ip security group docker 배포',
  },
]
