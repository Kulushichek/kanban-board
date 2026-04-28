# Kanban Board Task Tracker

## Стек технологий

**Клиентская часть (Frontend):**
* React 18 / Vite
* Redux Toolkit (управление состоянием)
* Tailwind CSS (стилизация)
* @hello-pangea/dnd (Drag-and-Drop)

**Серверная часть (Backend):**
* Python 3.9+ / FastAPI
* SQLAlchemy (ORM) + Alembic (миграции базы данных)
* Pydantic (валидация данных)
* PostgreSQL (база данных)

---

## Требования для установки

Убедитесь, что на вашей машине установлены:
* [Node.js](https://nodejs.org/) (версия 18 или выше)
* [Python](https://www.python.org/) (версия 3.9 или выше)
* PostgreSQL (с созданной пустой базой данных для проекта)

---

## Развертывание на локальной машине

Для развертывания проекта локально выполните следующие шаги.

Сначала клонируйте репозиторий:
```bash
git clone https://github.com/Kulushichek/kanban-board.git
```

---

### 1. Запуск серверной части (Backend)

Откройте терминал и перейдите в корневую директорию
```bash
cd kanban-board
```

Перейдите в директорию бэкенда:
```bash
cd backend
```

Создайте виртуальное окружение и установите зависимости:

```bash
python -m venv venv
```

**Для Windows**: 
```bash
venv\Scripts\activate
```

**Для Linux**: 
```bash
source venv/bin/activate
```

```bash
pip install -r requirements.txt
```
Настройте переменные окружения:
В директории backend создайте файл .env на основе шаблона example.env. 
Обязательно заполните параметр DATABASE_URL данными для подключения к вашей локальной базе PostgreSQL, а также укажите параметр DEBUG.


Выполните миграции базы данных для создания необходимых таблиц:
```bash
alembic upgrade head
```

Запустите сервер:
```bash
python run.py
```

---

### 2. Запуск клиентской части (Frontend)

Откройте новую вкладку терминала и перейдите в корневую директорию:

```bash
cd kanban-board
```

Перейдите в директорию фронтенда:

```bash
cd frontend
```

Установите все необходимые зависимости из package.json:
```bash
npm install
```

Запустите проект в режиме разработки:
```bash
npm run dev
```