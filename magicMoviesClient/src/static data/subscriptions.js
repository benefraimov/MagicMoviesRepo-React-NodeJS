const current = new Date();
const date = `${current.getFullYear()}-${
  current.getMonth() + 1
}-${current.getDate()}`;

const arr = [
  {
    id: 1,
    fullName: "Yael Mazor",
    email: "Yael123@gmail.com",
    city: "Or Aqiva",
    createdDate: date,
    movies: [
      {
        id: 1,
        name: "Uder The Dom",
      },
      {
        id: 2,
        name: "Person of Interest",
      },
    ],
  },
  {
    id: 2,
    fullName: "Ben Gida",
    email: "Ben123@gmail.com",
    city: "Hadera",
    createdDate: date,
    movies: [
      {
        id: 2,
        name: "Person of Interest",
      },
    ],
  },
];

export { arr };
