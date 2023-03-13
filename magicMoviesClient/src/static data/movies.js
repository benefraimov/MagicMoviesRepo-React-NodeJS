const current = new Date();
const date = `${current.getDate()}/${
  current.getMonth() + 1
}/${current.getFullYear()}`;

const arr = [
  {
    id: 1,
    name: "Under the Dome",
    genres: ["Drama", "Science-Fiction", "Thriller"],
    premiered: "2013-06-24",
    image:
      "https://static.tvmaze.com/uploads/images/medium_portrait/81/202627.jpg",
    subscribers: ["Ben", "Eli", "Shimon"],
  },
  {
    id: 2,
    name: "Person of Interest",
    genres: ["Action", "Crime", "Science-Fiction"],
    premiered: "2011-09-22",
    image:
      "https://static.tvmaze.com/uploads/images/medium_portrait/163/407679.jpg",
    subscribers: ["Ben", "Eli", "Shimon", "Yael"],
  },
  {
    id: 3,
    name: "Bitten",
    genres: ["Drama", "Horror", "Romance"],
    premiered: "2014-01-11",
    image: "https://static.tvmaze.com/uploads/images/medium_portrait/0/15.jpg",
    subscribers: ["Ben", "Eli", "Shimon", "Hava", "Aiv"],
  },
];

export { arr };
