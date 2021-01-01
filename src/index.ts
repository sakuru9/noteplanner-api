import { app } from "./app";
import { initDB } from "./database";

initDB()
  .then(() =>
    app.listen(5151, () => console.log("App is running on port 5151"))
  )
  .catch((e) => console.log("failed to start server", e));
