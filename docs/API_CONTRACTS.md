# SmartCart PVM — API Contracts

**Статус:** Placeholder — будет заполнен при реализации backend

---

## Планируемые эндпоинты

### Auth & Profile
- `POST /api/auth/telegram` — авторизация через Telegram
- `GET /api/profile` — получить профиль пользователя
- `PUT /api/profile` — обновить профиль (цели, бюджет, ограничения)
- `PUT /api/profile/sacred-items` — управление «неприкосновенными» товарами
- `PUT /api/profile/indulgence` — управление Planned Indulgence

### Shopping Lists
- `GET /api/lists` — список всех списков покупок
- `GET /api/lists/:id` — конкретный список с товарами
- `POST /api/lists/generate` — сгенерировать новый список
- `PUT /api/lists/:id/items/:itemId` — заменить товар в списке
- `DELETE /api/lists/:id/items/:itemId` — удалить товар из списка
- `PUT /api/lists/:id/items/:itemId/check` — отметить как купленный

### Products & Scoring
- `GET /api/products/:id` — детали товара (нутрифакты, Quality Gate, Value Score)
- `GET /api/products/:id/alternatives` — замены в том же слоте (топ-3)
- `GET /api/products/search?q=...&store=...` — поиск товаров

### Swap System
- `GET /api/swap/weekly` — своп недели
- `POST /api/swap/:id/accept` — принять своп
- `POST /api/swap/:id/reject` — отклонить своп (с причиной)

### Trainer (v2)
- `POST /api/trainer/invite` — сгенерировать invite-link
- `GET /api/trainer/clients` — список клиентов с агрегатами
- `GET /api/trainer/clients/:id/report` — отчёт клиента (если поделился)

### Vision (фото холодильника)
- `POST /api/vision/recognize` — загрузить фото, получить распознанные товары
- `POST /api/vision/confirm` — подтвердить распознанные товары

### Interactions (для Taste Engine)
- `POST /api/interactions` — записать взаимодействие (add, buy, remove, like, dislike)
