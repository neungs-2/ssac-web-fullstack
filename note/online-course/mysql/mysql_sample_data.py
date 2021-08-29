import random
import pymysql

family_names = list("김이박최강고윤엄한배성백전황서천방지마피")
first_names = list("건성현욱정민현주희진영래주동혜도모영진선재현호시우인성마무병별솔하라")
alphas = list('abcdefghijklmnopqrstuvwxyz' * 3)
nums = list("01234565789" * 4)

addrs = ['서울', '대전', '대구', '전주', '부산', '청주', '영동', '평창']

m30 = [4, 6, 9, 11]
years = list(range(70, 99))
monthes = list(range(1, 14))
days = list(range(1, 32))
days30 = list(range(1, 31))
days28 = list(range(1, 29))


def number_random(n=4):
    return "".join(random.sample(nums, n))


def alphabet_random(n=5):
    return "".join(random.sample(alphas, n))


def make_birth():
    y = random.choice(years)
    m = random.choice(monthes)
    d = random.choice(days)

    if m in m30 and d > 30:
        d = random.choice(days30)
    elif m == 2 and d > 28:
        d = random.choice(days28)

    return "{}{:02d}{:02d}".format(y, m, d)


def make_data():
    sung = random.choice(family_names)
    name = "".join(random.sample(first_names, 2))

    tel = "010-{}-{}".format(number_random(), number_random())
    email = "{}@gmail.com".format(alphabet_random(random.randrange(3, 9)))
    addr = random.choice(addrs)
    return (sung + name, tel, email, make_birth(), addr)


data = []
for i in range(0, 1000):
    data.append(make_data())

conn = pymysql.connect(
    host='localhost',
    user='dooo',
    password='dooo!',
    port=3306,
    db='dooodb',
    charset='utf8')

with conn:
    cur = conn.cursor()
    sql = "insert into Student(name, tel, email, birth, addr) values(%s,%s,%s,%s,%s)"
    cur.executemany(sql, data)
    print("AffecedRowCount is", cur.rowcount)  # 몇개 적용했는지 출력

    conn.commit()
