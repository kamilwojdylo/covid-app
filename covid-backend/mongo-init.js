db.createUser({
  user: "kamilwojdylo",
  pwd: "kamilwojdylo",
  roles: [
    {
      role: "readWrite",
      db: "covid-app",
    },
  ],
});
