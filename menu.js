/* =========================================================
   ORANGE BAR — ДАНІ САЙТУ
   Тут змінюються меню, ціни, години роботи, контакти і фото.
   Розмітку (index.html) чіпати не потрібно.
   ========================================================= */

window.SITE = {

  /* ---------- Контакти ---------- */
  contacts: {
    address: "вул. Прорізна, 3, Київ",
    metro: "Хрещатик",
    instagram: "https://www.instagram.com/orng.bar/",
    instagramHandle: "@orng.bar",
    linktree: "https://linktr.ee/orng_kyiv",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Orange Bar, Прорізна 3, Київ"),

    /* Номер із публікації про відкриття. Його актуальність НЕ підтверджено,
       тому на сайті він прихований. Коли власник підтвердить номер,
       поставте phoneConfirmed: true — номер з'явиться в контактах. */
    phone: "+380 96 619 3631",
    phoneConfirmed: false
  },

  /* ---------- Години роботи (з публікації; уточнюйте у закладу) ----------
     days: 1 = понеділок ... 7 = неділя */
  hours: [
    { label: "Понеділок – четвер", days: [1, 2, 3, 4], time: "16:00 – 22:00" },
    { label: "П'ятниця – неділя",  days: [5, 6, 7],    time: "15:00 – 22:00" }
  ],

  /* ---------- Меню ----------
     Позиції та ціни взято з публікації про відкриття.
     Щоб змінити ціну — змініть число price (у гривнях).
     Щоб додати позицію — скопіюйте рядок { name: ..., price: ... }. */
  menuNote: "Меню та ціни можуть змінюватися. Уточнюйте актуальність у закладу.",
  menu: [
    {
      id: "snacks",
      title: "Закуски",
      items: [
        { name: "Хамон", price: 160 },
        { name: "Перець фарширований", price: 180 },
        { name: "Попкорн сирний", price: 50 },
        { name: "Мікс горіхів", price: 150 },
        { name: "Оливки каламата", price: 140 }
      ]
    },
    {
      id: "cocktails",
      title: "Коктейлі",
      items: [
        { name: "Pina Colada", price: 340 },
        { name: "Clover Club", price: 370 },
        { name: "Matcha Mojito", price: 290 },
        { name: "Paloma", price: 360 },
        { name: "Bellini", price: 310 },
        { name: "Negroni Lychee", price: 360 },
        { name: "Orng", price: 370 }
      ]
    },
    {
      id: "shots",
      title: "Шоти",
      items: [
        { name: "Jager Cranberry", price: 180 },
        { name: "Red Kamikaze", price: 160 },
        { name: "Mexican B-52", price: 180 },
        { name: "Peach Tea", price: 160 }
      ]
    },
    {
      id: "cider",
      title: "Сидр",
      items: [
        { name: "Яблуко – маракуя", price: 150 },
        { name: "Яблуко – виноград", price: 150 },
        { name: "Юзу – грейпфрут", price: 150 }
      ]
    }
  ],

  /* ---------- Фото ----------
     Покладіть свої фото в папку img/ з такими іменами (jpg, ~1600 px по довшій стороні).
     Поки файлу немає, на сайті показується заглушка з його іменем. */
  photos: {
    hero: { file: "img/hero.jpg", alt: "Інтер'єр Orange Bar" },
    gallery: [
      { file: "img/zala-chorna.jpg", alt: "Чорна зала" },
      { file: "img/zala-bila.jpg",   alt: "Біла зала" },
      { file: "img/kokteil-orng.jpg", alt: "Коктейль Orng" },
      { file: "img/bar.jpg",          alt: "Барна стійка" },
      { file: "img/dj.jpg",           alt: "Місце для діджея" },
      { file: "img/zakusky.jpg",      alt: "Закуски" }
    ]
  }
};
