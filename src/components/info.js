// при кожній новій папці в components,
// потрібно змінити в vite.config.ts y plugins

// handlebars({
//   partialDirectory: resolve(__dirname, "src/components"), // !!!
//   helpers: {
//     link: (p) => repoBase + p,
//   },
// });

// на

// handlebars({
//   partialDirectory: [
//     resolve(__dirname, "src/components"),
//     resolve(__dirname, "src/components/newFolder"),
//   ],
//   helpers: {
//     link: (p) => repoBase + p,
//   },
// });

// ??
// hulakTools({ // краще вимкнути, бо підтримує перегляд лише однієї папки
