# replacement.js

JS-модуль для подмены заголовков и любого контента на странице сайта (лендинга) по данным из JSON,
 в зависимости от полученного get-параметра (по умолчанию **city**),
с кешированием в localStorage

Формат входных данных (php-коннектор, либо статичный файл)
```
[
  {
    "code":"spb",
    "city":"Санкт-Петербург",
    "in_city":"в Санкт-Петербурге",
    "phone":"+7(812) 123-45-67"
  },
  {
    "code":"msk",
    "city":"Москва",
    "in_city":"в Москве",
    "phone":"+7(499) 987-65-43"
  },
  {
    "code":"nnov",
    "city":"Нижний-Новгород",
    "in_city":"в Нижнем-Новгороде",
    "phone":""
  }
]
```

### Подключение
```
<script src="../replacement.js"></script>
// или
<script src="../replacement.min.js"></script>
```

### Конфигурация
```
var config={
   // URL для загрузки данных автозамен
    url:'data.json',
    // зависимость { get параметр : какое поле является индексом в json объектах }
    dependence: {
        'city' : 'code'
    },
    // Карта селектор JQuery : каким полем из json заменить
    map:{
        '#replacement-header' : 'in_city',
        '.replacement-phone' : 'phone'
    },
    // Пропускать замены для полей json объекта с отсутствующими значениями
    // Если false - будет вырезать содержимое тега с соответствующим селектором
    skip_empty: true
};
```

### Инициализация
```
Replacement.init(config);
```

#MODX
## MIGX TV-переменная
Например **cities**

### Вкладки формы
```
[
  {
    "caption":"Объект",
    "fields": [
      {"field":"code", "caption":"Код города"},
      {"field":"city", "caption":"Город"},
      {"field":"in_city", "caption":"Падеж: в городе"},
      {"field":"phone", "caption":"Контактный телефон"}
    ]
  }
]
```

### Разметка колонок
```
[
  {"header": "Код города", "width": "50", "sortable": "true", "dataIndex": "code"},
  {"header": "Город", "width": "50", "sortable": "true", "dataIndex": "city"},
  {"header": "Падеж: в городе", "width": "50", "sortable": "true", "dataIndex": "in_city"},
  {"header": "Контактный телефон", "width": "50", "sortable": "true", "dataIndex": "phone"}
]
```

