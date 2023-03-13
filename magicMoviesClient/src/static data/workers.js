const current = new Date();
const date = `${current.getFullYear()}-${((current.getMonth() + 1) < 10) ? `0${current.getMonth() + 1}` : current.getMonth() + 1}-${current.getDate()}`;

const arr = [
  {
    id: 1,
    fullName: "Ben Efraimov",
    isAdmin: true,
    userName: "Ben_E",
    password: "12345",
    createdDate: date,
    permissions: {
      watchSubs: true,
      createSubs: true,
      updateSubs: true,
      deleteSubs: true,
      watchMovies: true,
      createMovies: true,
      updateMovies: true,
      deleteMovies: true,
    },
  },
  {
    id: 2,
    fullName: "Muhamed Shalita",
    isAdmin: false,
    userName: "Muhamed_S",
    password: "12345",
    createdDate: date,
    permissions: {
      watchSubs: true,
      createSubs: false,
      updateSubs: false,
      deleteSubs: true,
      watchMovies: true,
      createMovies: false,
      updateMovies: true,
      deleteMovies: false,
    },
  },
];

export { arr };
